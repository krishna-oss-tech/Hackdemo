import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap, useMapEvents, Marker, GeoJSON } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, MapPin, Activity, Radio, Compass, ShieldAlert, Sparkles, Navigation, X, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { satelliteLayers, type SatelliteLayerOption } from '../../data/mockData';
import { useAnalysisStore } from '../../stores/analysisStore';
import { apiService, type SpotInspectionResult } from '../../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Map Marker Icon for Click Inspector
const inspectIcon = new L.DivIcon({
  className: 'custom-inspect-marker',
  html: `<div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg"></div>
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

// Map Click Event Listener for Spot Inspection
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

export default function MapView({ onRegionSelect, isAnalyzing: externalAnalyzing }: MapViewProps) {
  const store = useAnalysisStore();
  
  const [activeDateIndex, setActiveDateIndex] = useState(2);
  const timelineDates = ['1 Aug 2026', '5 Aug 2026', '10 Aug 2026', '15 Aug 2026', '20 Aug 2026'];

  // Active satellite tile layer
  const [activeLayer, setActiveLayer] = useState<SatelliteLayerOption>(satelliteLayers[0]);
  const [sarAutoSwitched, setSarAutoSwitched] = useState<boolean>(false);

  // Overlay Toggles
  const [polygonsVisible, setPolygonsVisible] = useState(true);

  const [auxiliaryLayers, setAuxiliaryLayers] = useState({
    roads: true,
    rivers: true,
    boundaries: true,
    population: false,
    rainfall: false,
  });

  // Animated Analysis State
  const [internalAnalyzing, setInternalAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Point Inspection State
  const [inspectPoint, setInspectPoint] = useState<SpotInspectionResult | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  const isAnalyzing = externalAnalyzing || internalAnalyzing || store.isLoading;
  
  // Fake cloud cover logic for demonstration
  const cloudCover = 20;

  // Cloud Cover Check & Auto Switch to Sentinel-1 SAR
  useEffect(() => {
    if (cloudCover > 45 && activeLayer.id === 'sentinel2') {
      const sarLayer = satelliteLayers.find(l => l.id === 'sentinel1') || satelliteLayers[1];
      setActiveLayer(sarLayer);
      setSarAutoSwitched(true);
    } else if (cloudCover <= 45 && sarAutoSwitched) {
      setSarAutoSwitched(false);
    }
  }, [cloudCover, activeLayer]);

  // Point Inspector Calculator on Click
  const handleInspectMap = async (lat: number, lng: number) => {
    setIsInspecting(true);
    setInspectPoint(null);
    try {
      const result = await apiService.spotInspect(lat, lng);
      setInspectPoint(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInspecting(false);
    }
  };
  
  const getDisasterColor = (type: string) => {
    switch (type) {
      case 'flood': return '#3b82f6';
      case 'wildfire': return '#ef4444';
      case 'crop_stress': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass-card flex flex-col" style={{ minHeight: '620px' }}>
      
      {/* Top Header Bar: Map controls */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-20 flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Current AOI</label>
            <div className="text-xs font-bold text-white px-1 py-1">
              {store.locationQuery}
            </div>
          </div>
        </div>

        {/* Satellite Layer Switcher Buttons */}
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
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-extrabold'
                  : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {layer.id === 'sentinel1' && <Radio className="w-3.5 h-3.5" />}
              {layer.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Cloud Cover Auto-Switch Banner Notification */}
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
                <strong>Cloud Cover Alert ({cloudCover}%):</strong> Optical imagery obscured. Automatically switched to <strong>Sentinel-1 SAR Radar</strong>.
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
          center={[store.latitude, store.longitude]}
          zoom={12}
          style={{ width: '100%', height: '100%', minHeight: '480px' }}
          zoomControl={false}
        >
          {/* Real Satellite Tile Layer */}
          <TileLayer
            key={activeLayer.id}
            attribution={activeLayer.attribution}
            url={activeLayer.url}
            maxZoom={18}
          />

          <MapController center={[store.latitude, store.longitude]} zoom={12} />
          <MapClickListener onInspect={handleInspectMap} />

          {/* Inspect Marker */}
          {isInspecting && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] text-cyan-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-cyan-500/30 text-xs font-bold shadow-xl flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 animate-spin" /> Fetching spot telemetry...
            </div>
          )}
          
          {inspectPoint && !isInspecting && (
            <Marker position={[inspectPoint.lat, inspectPoint.lng]} icon={inspectIcon}>
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-cyan-400 block text-sm font-bold">Spot Telemetry</strong>
                  <div>Lat: {inspectPoint.lat}° | Lng: {inspectPoint.lng}°</div>
                  <div>NDVI: <span className="font-bold">{inspectPoint.ndvi}</span></div>
                  <div>NDWI: <span className="font-bold">{inspectPoint.ndwi}</span></div>
                  <div className="text-amber-400 font-semibold">{inspectPoint.disasterStatus}</div>
                  {inspectPoint.source === 'cached_fallback' && (
                    <div className="text-[10px] text-amber-500/80 mt-1 uppercase font-bold">Demo Data</div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* AI Detection Colored Polygons */}
          {polygonsVisible && store.result?.detected_polygon_geojson && (
            <GeoJSON 
              data={store.result.detected_polygon_geojson} 
              pathOptions={{
                color: getDisasterColor(store.result.disaster_type),
                fillColor: getDisasterColor(store.result.disaster_type),
                fillOpacity: 0.45,
                weight: 2.5,
              }}
            >
              <Popup>
                <div className="p-1 text-xs" style={{ fontFamily: 'Inter' }}>
                  <strong className="text-sm font-bold uppercase" style={{ color: getDisasterColor(store.result.disaster_type) }}>
                    Detected {store.result.disaster_type}
                  </strong>
                  <br />
                  <span>Area: {store.result.affected_area_km2} km² | Confidence: {store.result.confidence}%</span>
                </div>
              </Popup>
            </GeoJSON>
          )}
        </MapContainer>

        {/* Multi-Step Animated AI Pipeline Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6"
            >
              <div className="max-w-md w-full glass-card p-6 border border-cyan-500/40 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                  <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Earth Engine AI Pipeline</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Fetching and processing multispectral imagery</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Polygon Layer Controls Widget */}
        <div className="absolute top-4 right-4 z-20 glass-card p-3 max-w-xs bg-slate-900/80 backdrop-blur-md border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> AI Hazard Overlays
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => setPolygonsVisible(!polygonsVisible)}
              className="w-full flex items-center justify-between p-1.5 rounded bg-slate-950/60 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-gray-300 text-[11px] font-medium">Detection Polygon</span>
              </div>
              {polygonsVisible ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-gray-600" />}
            </button>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Auxiliary Layers</span>
            {[
              { key: 'roads' as const, label: '🛣️ Road Network' },
              { key: 'rivers' as const, label: '🌊 River Basins' },
              { key: 'boundaries' as const, label: '🗺️ District Bounds' },
            ].map(aux => (
              <button
                key={aux.key}
                onClick={() => setAuxiliaryLayers(a => ({ ...a, [aux.key]: !a[aux.key] }))}
                className="w-full flex items-center justify-between p-1 rounded bg-slate-950/40 hover:bg-slate-800 text-[10px]"
              >
                <span className="text-gray-400 font-medium">{aux.label}</span>
                <span className={`px-1 rounded text-[9px] font-bold ${auxiliaryLayers[aux.key] ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-600'}`}>
                  {auxiliaryLayers[aux.key] ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Satellite Metadata Summary Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 font-semibold text-gray-300">
            <Radio className="w-3 h-3 text-cyan-400" /> {activeLayer.name}
          </span>
          <span>Res: <strong>{activeLayer.resolution}</strong></span>
          <span>Cloud: <strong className={cloudCover > 40 ? 'text-amber-400' : 'text-cyan-400'}>{cloudCover}%</strong></span>
          <span>Source: <strong>Google Earth Engine API</strong></span>
        </div>
      </div>
    </div>
  );
}
