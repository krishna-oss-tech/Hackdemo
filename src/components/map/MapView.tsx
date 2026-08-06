import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, useMapEvents, Marker } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, MapPin, Activity, Radio, Compass, ShieldAlert, Sparkles, Navigation, X, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { cityTargets, satelliteLayers, type SatelliteLayerOption } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Map Marker Icon for Click Inspector
const inspectIcon = new L.DivIcon({
  className: 'custom-inspect-marker',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Map Controller for smooth pan & zoom
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Map Click Event Listener for Spot Inspection (Feature 10)
function MapClickListener({ onInspect }: { onInspect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onInspect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

interface MapViewProps {
  onRegionSelect?: () => void;
  isAnalyzing?: boolean;
}

interface SpotTelemetry {
  lat: number;
  lng: number;
  ndvi: number;
  ndwi: number;
  landCover: string;
  elevation: number;
  disasterStatus: string;
}

export default function MapView({ onRegionSelect, isAnalyzing: externalAnalyzing }: MapViewProps) {
  // Active city selection
  const [selectedCity, setSelectedCity] = useState(cityTargets[0]);
  const [activeDateIndex, setActiveDateIndex] = useState(2); // Default 10 Aug
  const timelineDates = ['1 Aug 2026', '5 Aug 2026', '10 Aug 2026', '15 Aug 2026', '20 Aug 2026'];

  // Active satellite tile layer (Feature 3)
  const [activeLayer, setActiveLayer] = useState<SatelliteLayerOption>(satelliteLayers[0]);
  const [sarAutoSwitched, setSarAutoSwitched] = useState<boolean>(false);

  // Overlay Toggles (Feature 4 & 11)
  const [polygonsVisible, setPolygonsVisible] = useState({
    flood: true,
    fire: true,
    cropStress: true,
    healthy: true,
  });

  const [auxiliaryLayers, setAuxiliaryLayers] = useState({
    roads: true,
    rivers: true,
    boundaries: true,
    population: false,
    rainfall: false,
  });

  // Animated Analysis State (Feature 7)
  const [internalAnalyzing, setInternalAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Point Inspection State (Feature 10)
  const [inspectPoint, setInspectPoint] = useState<SpotTelemetry | null>(null);

  const isAnalyzing = externalAnalyzing || internalAnalyzing;

  // Feature 8: Cloud Cover Check & Auto Switch to Sentinel-1 SAR
  useEffect(() => {
    if (selectedCity.cloudCover > 45 && activeLayer.id === 'sentinel2') {
      const sarLayer = satelliteLayers.find(l => l.id === 'sentinel1') || satelliteLayers[1];
      setActiveLayer(sarLayer);
      setSarAutoSwitched(true);
    } else if (selectedCity.cloudCover <= 45 && sarAutoSwitched) {
      setSarAutoSwitched(false);
    }
  }, [selectedCity, activeLayer]);

  // Handle City / AOI Select
  const handleCityChange = (cityId: string) => {
    const city = cityTargets.find(c => c.id === cityId) || cityTargets[0];
    setSelectedCity(city);
    setInspectPoint(null);
    runAnalysisPipeline();
  };

  // Feature 7: Multi-Step Animated Analysis Pipeline
  const runAnalysisPipeline = () => {
    setInternalAnalyzing(true);
    setAnalysisStep(1);

    const steps = [
      { step: 1, delay: 500 },  // Loading Satellite Tiles from GEE
      { step: 2, delay: 1000 }, // Running AI Multi-Spectral Segmentation
      { step: 3, delay: 1500 }, // Computing NDVI
      { step: 4, delay: 2000 }, // Computing NDWI
      { step: 5, delay: 2500 }, // Comparing Temporal Imagery
      { step: 6, delay: 3000 }, // Generating Risk Polygons
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setAnalysisStep(step);
        if (step === 6) {
          setTimeout(() => {
            setInternalAnalyzing(false);
            if (onRegionSelect) onRegionSelect();
          }, 600);
        }
      }, delay);
    });
  };

  // Feature 10: Point Inspector Calculator on Click
  const handleInspectMap = (lat: number, lng: number) => {
    // Generate realistic spot telemetry based on proximity to flood/crop zones
    const isNearWater = Math.abs(lat - 21.16) < 0.05 && Math.abs(lng - 79.10) < 0.05;
    const isNearCrop = Math.abs(lat - 20.74) < 0.08 && Math.abs(lng - 78.60) < 0.08;

    const ndvi = isNearWater ? 0.12 : isNearCrop ? 0.42 : 0.74;
    const ndwi = isNearWater ? 0.68 : isNearCrop ? 0.28 : -0.22;
    const elevation = Math.round(280 + Math.sin(lat * 10) * 45);

    let status = 'Normal Vegetation';
    let landCover = 'Deciduous Agricultural Land';

    if (isNearWater || ndwi > 0.4) {
      status = '🌊 Submerged (Flood Inundation 2.1m)';
      landCover = 'River Basin / Waterlog';
    } else if (isNearCrop || (ndvi > 0.3 && ndvi < 0.5)) {
      status = '🌾 Moderate Crop Moisture Stress';
      landCover = 'Cotton / Soybean Field';
    } else if (ndvi > 0.6) {
      status = '🌿 Healthy Dense Canopy';
      landCover = 'Irrigated Agriculture';
    }

    setInspectPoint({
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
      ndvi,
      ndwi,
      landCover,
      elevation,
      disasterStatus: status
    });
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass-card flex flex-col" style={{ minHeight: '620px' }}>
      
      {/* Top Header Bar: AOI Selector, Layer Switcher, Timeline */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-20 flex flex-wrap items-center justify-between gap-3">
        
        {/* City / AOI Selector */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Select Area of Interest (AOI)</label>
            <select
              value={selectedCity.id}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              {cityTargets.map(c => (
                <option key={c.id} value={c.id}>{c.name}, {c.state} ({c.floodRisk} Risk)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Satellite Layer Switcher Buttons (Feature 3) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {satelliteLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                setActiveLayer(layer);
                setSarAutoSwitched(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeLayer.id === layer.id
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-extrabold'
                  : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {layer.id === 'sentinel1' && <Radio className="w-3.5 h-3.5" />}
              {layer.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Action Button: Manual AI Scan */}
        <button
          onClick={runAnalysisPipeline}
          disabled={isAnalyzing}
          className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5"
        >
          {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isAnalyzing ? 'Processing GEE...' : 'Analyze AOI'}
        </button>
      </div>

      {/* Feature 8: Cloud Cover Auto-Switch Banner Notification */}
      <AnimatePresence>
        {sarAutoSwitched && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-xs font-semibold text-amber-300 flex items-center justify-between z-20"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span>
                <strong>Cloud Cover Alert ({selectedCity.cloudCover}%):</strong> Optical imagery obscured. Automatically switched to <strong>Sentinel-1 SAR Radar</strong> for rain-penetrating flood detection.
              </span>
            </div>
            <button
              onClick={() => setSarAutoSwitched(false)}
              className="text-amber-400 hover:text-amber-200 text-xs font-bold underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Leaflet Map Container */}
      <div className="relative flex-1 w-full h-full min-h-[480px]">
        <MapContainer
          center={selectedCity.coords}
          zoom={selectedCity.zoom}
          style={{ width: '100%', height: '100%', minHeight: '480px' }}
          zoomControl={false}
        >
          {/* Real Satellite Tile Layer (Feature 1, 3, 9) */}
          <TileLayer
            key={activeLayer.id}
            attribution={activeLayer.attribution}
            url={activeLayer.url}
            maxZoom={18}
          />

          <MapController center={selectedCity.coords} zoom={selectedCity.zoom} />
          <MapClickListener onInspect={handleInspectMap} />

          {/* Inspect Marker */}
          {inspectPoint && (
            <Marker position={[inspectPoint.lat, inspectPoint.lng]} icon={inspectIcon}>
              <Popup>
                <div className="p-1 text-xs space-y-1" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-emerald-400 block text-sm font-bold">Spot Telemetry</strong>
                  <div>Lat: {inspectPoint.lat}° | Lng: {inspectPoint.lng}°</div>
                  <div>NDVI: <span className="font-bold">{inspectPoint.ndvi}</span></div>
                  <div>NDWI: <span className="font-bold">{inspectPoint.ndwi}</span></div>
                  <div>Elevation: <span className="font-bold">{inspectPoint.elevation}m</span></div>
                  <div className="text-amber-400 font-semibold">{inspectPoint.disasterStatus}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* AI Detection Colored Polygons (Feature 4) */}
          {polygonsVisible.flood && selectedCity.polygons.flood?.map((poly, i) => (
            <Polygon
              key={`flood-${i}`}
              positions={poly}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.45,
                weight: 2.5,
              }}
            >
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-blue-400 text-sm font-bold">🌊 Flood Inundation Zone</strong>
                  <br />
                  <span>Submerged Area: 4.8 km² | GEE Confidence: 94%</span>
                </div>
              </Popup>
            </Polygon>
          ))}

          {polygonsVisible.fire && selectedCity.polygons.fire?.map((poly, i) => (
            <Polygon
              key={`fire-${i}`}
              positions={poly}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.45,
                weight: 2.5,
              }}
            >
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-rose-400 text-sm font-bold">🔥 Wildfire Burn Scar</strong>
                  <br />
                  <span>Burn Area: 0.6 km² | Thermal Anomaly Detected</span>
                </div>
              </Popup>
            </Polygon>
          ))}

          {polygonsVisible.cropStress && selectedCity.polygons.cropStress?.map((poly, i) => (
            <Polygon
              key={`crop-${i}`}
              positions={poly}
              pathOptions={{
                color: '#eab308',
                fillColor: '#eab308',
                fillOpacity: 0.45,
                weight: 2.5,
              }}
            >
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-amber-400 text-sm font-bold">🌾 Crop Waterlogging Stress</strong>
                  <br />
                  <span>NDVI Anomaly: -0.38 | Cotton/Soybean Canopy</span>
                </div>
              </Popup>
            </Polygon>
          ))}

          {polygonsVisible.healthy && selectedCity.polygons.healthy?.map((poly, i) => (
            <Polygon
              key={`healthy-${i}`}
              positions={poly}
              pathOptions={{
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-emerald-400 text-sm font-bold">🌿 Vigorous Healthy Vegetation</strong>
                  <br />
                  <span>NDVI Index: +0.76 | Optimal Soil Hydration</span>
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        {/* Feature 7: Multi-Step Animated AI Pipeline Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6"
            >
              <div className="max-w-md w-full glass-card p-6 border border-emerald-500/40 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Google Earth Engine AI Pipeline</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Processing multispectral imagery for {selectedCity.name}</p>
                </div>

                {/* Pipeline Step Sequence */}
                <div className="space-y-2 text-left pt-2">
                  {[
                    'Loading Satellite Tiles from GEE...',
                    'Running AI Multi-Spectral Segmentation...',
                    'Computing NDVI (Vegetation Index)...',
                    'Computing NDWI (Water Saturation)...',
                    'Comparing Temporal Image Sets...',
                    'Generating Risk Polygons & Report...'
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        analysisStep > idx + 1
                          ? 'bg-emerald-500 text-slate-950'
                          : analysisStep === idx + 1
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-gray-500'
                      }`}>
                        {analysisStep > idx + 1 ? '✓' : idx + 1}
                      </div>
                      <span className={analysisStep === idx + 1 ? 'text-emerald-400 font-bold' : analysisStep > idx + 1 ? 'text-gray-300' : 'text-gray-600'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature 10: Point Inspector Telemetry Card (When Clicked) */}
        <AnimatePresence>
          {inspectPoint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-4 left-4 z-20 glass-card p-4 max-w-xs border border-emerald-500/40 shadow-2xl space-y-2 bg-slate-900/90 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Point Telemetry Inspection
                </span>
                <button onClick={() => setInspectPoint(null)} className="text-gray-400 hover:text-white text-xs">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[10px]">Latitude</span>
                  <span className="font-bold text-white">{inspectPoint.lat}°</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[10px]">Longitude</span>
                  <span className="font-bold text-white">{inspectPoint.lng}°</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[10px]">NDVI Index</span>
                  <span className={`font-bold ${inspectPoint.ndvi < 0.3 ? 'text-amber-400' : 'text-emerald-400'}`}>{inspectPoint.ndvi}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-gray-400 block text-[10px]">NDWI Water</span>
                  <span className={`font-bold ${inspectPoint.ndwi > 0.4 ? 'text-blue-400' : 'text-gray-300'}`}>{inspectPoint.ndwi}</span>
                </div>
              </div>

              <div className="text-[11px] pt-1 border-t border-slate-800">
                <span className="text-gray-400 block text-[10px]">Land Cover & Elevation</span>
                <span className="font-semibold text-gray-200">{inspectPoint.landCover} • {inspectPoint.elevation}m MSL</span>
              </div>

              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                {inspectPoint.disasterStatus}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature 4 & 11: Polygon Layer Controls Widget */}
        <div className="absolute top-4 right-4 z-20 glass-card p-3 max-w-xs bg-slate-900/80 backdrop-blur-md border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> AI Hazard Overlays
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { key: 'flood' as const, label: 'Flood Inundation', color: '#3b82f6' },
              { key: 'fire' as const, label: 'Wildfire Burn Scar', color: '#ef4444' },
              { key: 'cropStress' as const, label: 'Crop Water Stress', color: '#eab308' },
              { key: 'healthy' as const, label: 'Healthy Canopy', color: '#22c55e' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setPolygonsVisible(p => ({ ...p, [item.key]: !p[item.key] }))}
                className="w-full flex items-center justify-between p-1.5 rounded bg-slate-950/60 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-300 text-[11px] font-medium">{item.label}</span>
                </div>
                {polygonsVisible[item.key] ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-gray-600" />}
              </button>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Auxiliary Layers</span>
            {[
              { key: 'roads' as const, label: '🛣️ Road Network' },
              { key: 'rivers' as const, label: '🌊 River Basins' },
              { key: 'boundaries' as const, label: '🗺️ District Bounds' },
              { key: 'rainfall' as const, label: '🌧️ Live Rainfall Radar' },
            ].map(aux => (
              <button
                key={aux.key}
                onClick={() => setAuxiliaryLayers(a => ({ ...a, [aux.key]: !a[aux.key] }))}
                className="w-full flex items-center justify-between p-1 rounded bg-slate-950/40 hover:bg-slate-800 text-[10px]"
              >
                <span className="text-gray-400 font-medium">{aux.label}</span>
                <span className={`px-1 rounded text-[9px] font-bold ${auxiliaryLayers[aux.key] ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-600'}`}>
                  {auxiliaryLayers[aux.key] ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature 5: Timeline Slider Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>GEE Temporal Timeline</span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md mx-auto">
          {timelineDates.map((date, idx) => (
            <button
              key={date}
              onClick={() => {
                setActiveDateIndex(idx);
                runAnalysisPipeline();
              }}
              className={`flex-1 py-1 px-2 rounded text-[11px] font-bold transition-all ${
                activeDateIndex === idx
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Feature 6: Satellite Metadata Summary Footer */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 font-semibold text-gray-300">
            <Radio className="w-3 h-3 text-emerald-400" /> {activeLayer.name}
          </span>
          <span>Res: <strong>{activeLayer.resolution}</strong></span>
          <span>Cloud: <strong className={selectedCity.cloudCover > 40 ? 'text-amber-400' : 'text-emerald-400'}>{selectedCity.cloudCover}%</strong></span>
          <span>Source: <strong>Google Earth Engine</strong></span>
        </div>
      </div>

    </div>
  );
}
