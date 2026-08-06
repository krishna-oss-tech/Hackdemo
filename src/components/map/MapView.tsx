import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { heatmapLayers } from '../../data/mockData';
import {
  Layers, Maximize, PenTool, Eye, EyeOff,
  Droplets, Flame, Wheat, TreePine,
  MapPin, Loader
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface MapViewProps {
  onRegionSelect?: () => void;
  isAnalyzing?: boolean;
}

export default function MapView({ onRegionSelect, isAnalyzing }: MapViewProps) {
  const [layers, setLayers] = useState({
    flood: true,
    fire: true,
    cropStress: true,
    healthy: true,
  });
  const [showControls, setShowControls] = useState(true);
  const [drawing, setDrawing] = useState(false);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const layerConfig = [
    { key: 'flood' as const, icon: <Droplets className="w-4 h-4" />, label: 'Flood', color: '#3b82f6' },
    { key: 'fire' as const, icon: <Flame className="w-4 h-4" />, label: 'Burn Scar', color: '#ef4444' },
    { key: 'cropStress' as const, icon: <Wheat className="w-4 h-4" />, label: 'Crop Stress', color: '#eab308' },
    { key: 'healthy' as const, icon: <TreePine className="w-4 h-4" />, label: 'Healthy', color: '#22c55e' },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '500px' }}>
      <MapContainer
        center={[21.1458, 79.0882]}
        zoom={10}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={[21.1458, 79.0882]} zoom={10} />

        {/* Heatmap Polygons */}
        {layers.flood && heatmapLayers.flood.polygons.map((polygon, i) => (
          <Polygon
            key={`flood-${i}`}
            positions={polygon as [number, number][]}
            pathOptions={{
              color: heatmapLayers.flood.color,
              fillColor: heatmapLayers.flood.color,
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter', padding: '4px' }}>
                <strong style={{ color: '#3b82f6' }}>🌊 Flood Zone</strong>
                <br />
                <span style={{ fontSize: '12px' }}>Affected: 4.8 km² | Confidence: 92%</span>
              </div>
            </Popup>
          </Polygon>
        ))}

        {layers.fire && heatmapLayers.fire.polygons.map((polygon, i) => (
          <Polygon
            key={`fire-${i}`}
            positions={polygon as [number, number][]}
            pathOptions={{
              color: heatmapLayers.fire.color,
              fillColor: heatmapLayers.fire.color,
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter', padding: '4px' }}>
                <strong style={{ color: '#ef4444' }}>🔥 Burn Scar</strong>
                <br />
                <span style={{ fontSize: '12px' }}>Affected: 0.6 km² | Confidence: 78%</span>
              </div>
            </Popup>
          </Polygon>
        ))}

        {layers.cropStress && heatmapLayers.cropStress.polygons.map((polygon, i) => (
          <Polygon
            key={`crop-${i}`}
            positions={polygon as [number, number][]}
            pathOptions={{
              color: heatmapLayers.cropStress.color,
              fillColor: heatmapLayers.cropStress.color,
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter', padding: '4px' }}>
                <strong style={{ color: '#eab308' }}>🌾 Crop Stress</strong>
                <br />
                <span style={{ fontSize: '12px' }}>Affected: 12 hectares | Confidence: 87%</span>
              </div>
            </Popup>
          </Polygon>
        ))}

        {layers.healthy && heatmapLayers.healthy.polygons.map((polygon, i) => (
          <Polygon
            key={`healthy-${i}`}
            positions={polygon as [number, number][]}
            pathOptions={{
              color: heatmapLayers.healthy.color,
              fillColor: heatmapLayers.healthy.color,
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter', padding: '4px' }}>
                <strong style={{ color: '#22c55e' }}>🌿 Healthy Vegetation</strong>
                <br />
                <span style={{ fontSize: '12px' }}>Area: 340 hectares | Status: Good</span>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      {/* Analyzing overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ border: '3px solid var(--color-primary)', borderTopColor: 'transparent' }}
              >
                <Loader className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
              </motion.div>
              <p className="text-lg font-semibold text-white mb-1">Analyzing Region...</p>
              <p className="text-sm text-gray-400">Processing satellite imagery with AI</p>

              {/* Scan line effect */}
              <motion.div
                animate={{ top: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-10 p-3 rounded-xl"
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <Layers className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Layers</span>
            </div>
            <div className="space-y-2">
              {layerConfig.map((layer) => (
                <button
                  key={layer.key}
                  onClick={() => toggleLayer(layer.key)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: layers[layer.key] ? `${layer.color}15` : 'transparent',
                    color: layers[layer.key] ? layer.color : 'var(--text-tertiary)',
                  }}
                >
                  {layer.icon}
                  <span>{layer.label}</span>
                  {layers[layer.key] ?
                    <Eye className="w-3 h-3 ml-auto" /> :
                    <EyeOff className="w-3 h-3 ml-auto" />
                  }
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map tools */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setDrawing(!drawing);
            if (!drawing && onRegionSelect) {
              setTimeout(onRegionSelect, 500);
            }
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${drawing ? 'animate-pulse-glow' : ''}`}
          style={{
            background: drawing ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${drawing ? 'var(--color-primary)' : 'var(--border-color)'}`,
            color: drawing ? 'var(--color-primary)' : 'var(--text-primary)',
          }}
        >
          <PenTool className="w-4 h-4" />
        </button>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
        }}>
        <MapPin className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Nagpur, Maharashtra — 21.1458°N, 79.0882°E
        </span>
      </div>
    </div>
  );
}
