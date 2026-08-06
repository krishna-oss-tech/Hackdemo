import { useState } from 'react';
import { motion } from 'framer-motion';
import { timelineEvents } from '../../data/mockData';
import {
  Clock, AlertTriangle, CheckCircle, Info, AlertOctagon,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const typeConfig = {
  normal: { color: '#22c55e', icon: <CheckCircle className="w-4 h-4" />, bg: 'rgba(34, 197, 94, 0.15)' },
  warning: { color: '#eab308', icon: <AlertTriangle className="w-4 h-4" />, bg: 'rgba(234, 179, 8, 0.15)' },
  danger: { color: '#ef4444', icon: <AlertOctagon className="w-4 h-4" />, bg: 'rgba(239, 68, 68, 0.15)' },
  info: { color: '#3b82f6', icon: <Info className="w-4 h-4" />, bg: 'rgba(59, 130, 246, 0.15)' },
};

export default function TimelineSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeEvent = timelineEvents[activeIndex];
  const config = typeConfig[activeEvent.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          Event Timeline
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveIndex(Math.min(timelineEvents.length - 1, activeIndex + 1))}
            disabled={activeIndex === timelineEvents.length - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="relative">
          {/* Track */}
          <div className="h-1 rounded-full" style={{ background: 'var(--bg-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--color-primary)' }}
              animate={{ width: `${(activeIndex / (timelineEvents.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Nodes */}
          <div className="flex justify-between absolute -top-2.5 left-0 right-0">
            {timelineEvents.map((event, i) => {
              const cfg = typeConfig[event.type];
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="relative group"
                >
                  <motion.div
                    animate={{
                      scale: i === activeIndex ? 1.3 : 1,
                      boxShadow: i === activeIndex ? `0 0 12px ${cfg.color}40` : 'none',
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: i <= activeIndex ? cfg.color : 'var(--bg-hover)',
                      border: `2px solid ${i <= activeIndex ? cfg.color : 'var(--border-color-light)'}`,
                    }}
                  >
                    {i <= activeIndex && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </motion.div>
                  <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap"
                    style={{ color: i === activeIndex ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                    {event.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail */}
      <div className="p-5 pt-10">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: config.bg, color: config.color }}>
              {config.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {activeEvent.label}
              </h4>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {activeEvent.date} 2026
              </span>
            </div>
          </div>

          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {activeEvent.description}
          </p>

          {/* Mini metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Health', value: activeEvent.healthScore, color: '#10b981' },
              { label: 'Flood Risk', value: activeEvent.floodRisk, color: '#3b82f6' },
              { label: 'Crop Health', value: activeEvent.cropHealth, color: '#22c55e' },
            ].map((m, i) => (
              <div key={i} className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-hover)' }}>
                <span className="text-[10px] font-medium block" style={{ color: 'var(--text-tertiary)' }}>
                  {m.label}
                </span>
                <motion.span
                  key={`${activeIndex}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-bold block"
                  style={{ color: m.color }}
                >
                  {m.value}%
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
