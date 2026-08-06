import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Calendar } from 'lucide-react';
import satelliteBefore from '../../assets/satellite_before.png';
import satelliteAfter from '../../assets/satellite_after.png';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
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
      <div className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <ArrowLeftRight className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          Before / After Comparison
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          <Calendar className="w-3 h-3" /> Sentinel-2 | 10m Resolution
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative cursor-ew-resize select-none overflow-hidden"
        style={{ height: '320px' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* After image (full width) */}
        <img
          src={satelliteAfter}
          alt="After flood"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={satelliteBefore}
            alt="Before flood"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${containerRef.current ? containerRef.current.offsetWidth : 100}px`, maxWidth: 'none' }}
            draggable={false}
          />
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white shadow-lg" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-gray-800" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          Before — 1 Aug 2026
        </div>
        <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          After — 5 Aug 2026
        </div>
      </div>
    </motion.div>
  );
}
