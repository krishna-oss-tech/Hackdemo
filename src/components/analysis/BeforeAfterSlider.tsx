import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Layers } from 'lucide-react';
import satelliteBefore from '../../assets/satellite_before.png';
import satelliteAfter from '../../assets/satellite_after.png';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [beforeDate, setBeforeDate] = useState('1 Aug 2026');
  const [afterDate, setAfterDate] = useState('10 Aug 2026');
  const [sensorMode, setSensorMode] = useState<'sentinel2' | 'sentinel1' | 'landsat'>('sentinel2');
  const [showFloodOverlay, setShowFloodOverlay] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 5, 95), 95);
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Header Controls */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white" style={{ fontFamily: 'Outfit' }}>
            Interactive Temporal Satellite Comparison
          </h3>
        </div>

        {/* Sensor & Overlay Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['sentinel2', 'sentinel1', 'landsat'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSensorMode(s)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  sensorMode === s ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {s === 'sentinel2' ? 'Sentinel-2' : s === 'sentinel1' ? 'SAR Radar' : 'Landsat'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFloodOverlay(!showFloodOverlay)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
              showFloodOverlay ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800 border-slate-700 text-gray-400'
            }`}
          >
            <Layers className="w-3 h-3" /> AI Flood Overlay
          </button>
        </div>
      </div>

      {/* Date Selector Sub-bar */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-gray-300 font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-[10px] uppercase">PRE-EVENT:</span>
          <select
            value={beforeDate}
            onChange={(e) => setBeforeDate(e.target.value)}
            className="bg-slate-900 text-emerald-400 font-bold border border-slate-700 rounded px-2 py-0.5"
          >
            <option value="28 Jul 2026">28 Jul 2026 (Baseline)</option>
            <option value="1 Aug 2026">1 Aug 2026 (Pre-Monsoon)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-[10px] uppercase">POST-EVENT:</span>
          <select
            value={afterDate}
            onChange={(e) => setAfterDate(e.target.value)}
            className="bg-slate-900 text-rose-400 font-bold border border-slate-700 rounded px-2 py-0.5"
          >
            <option value="5 Aug 2026">5 Aug 2026 (Flood Surge)</option>
            <option value="10 Aug 2026">10 Aug 2026 (Peak Inundation)</option>
            <option value="15 Aug 2026">15 Aug 2026 (Receding)</option>
          </select>
        </div>
      </div>

      {/* Interactive Split View Container */}
      <div
        ref={containerRef}
        className="relative cursor-ew-resize select-none overflow-hidden"
        style={{ height: '340px' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* After Imagery (Full Width) */}
        <div className="absolute inset-0">
          <img
            src={satelliteAfter}
            alt="Post disaster satellite"
            className={`w-full h-full object-cover transition-all ${
              sensorMode === 'sentinel1' ? 'grayscale contrast-200 invert' : sensorMode === 'landsat' ? 'hue-rotate-90 contrast-125' : ''
            }`}
            draggable={false}
          />
          {showFloodOverlay && (
            <div className="absolute inset-0 bg-blue-500/25 pointer-events-none border-2 border-blue-400/60 flex items-center justify-center">
              <span className="bg-slate-950/80 px-3 py-1 rounded text-blue-300 font-bold text-xs border border-blue-500/40">
                🌊 Detected Flood Inundation Area (+4.8 km²)
              </span>
            </div>
          )}
        </div>

        {/* Before Imagery (Clipped via clip-path for reliable responsive sizing) */}
        <div
          className="absolute inset-0 border-r-2 border-white shadow-2xl pointer-events-none"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src={satelliteBefore}
            alt="Pre disaster satellite"
            className={`w-full h-full object-cover transition-all ${
              sensorMode === 'sentinel1' ? 'grayscale contrast-200' : sensorMode === 'landsat' ? 'hue-rotate-90' : ''
            }`}
            draggable={false}
          />
        </div>

        {/* Interactive Slider Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-1 h-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-2xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        {/* Date Overlay Badges */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-xs font-extrabold text-cyan-300 bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
          BEFORE • {beforeDate}
        </div>
        <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-extrabold text-rose-300 bg-slate-950/80 border border-rose-500/30 backdrop-blur-md">
          AFTER • {afterDate}
        </div>
      </div>
    </motion.div>
  );
}
