import { motion } from 'framer-motion';
import type { Detection } from '../../data/mockData';
import {
  Droplets, Flame, Wheat, TreePine,
  MapPin, Calendar, Target, AlertTriangle, TrendingUp
} from 'lucide-react';

const typeConfig = {
  flood: { icon: <Droplets className="w-5 h-5" />, badge: 'badge-flood', label: 'Flood Detected', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  fire: { icon: <Flame className="w-5 h-5" />, badge: 'badge-fire', label: 'Fire Detected', gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  crop_stress: { icon: <Wheat className="w-5 h-5" />, badge: 'badge-crop-stress', label: 'Crop Stress', gradient: 'linear-gradient(135deg, #eab308, #a16207)' },
  healthy: { icon: <TreePine className="w-5 h-5" />, badge: 'badge-healthy', label: 'Healthy Area', gradient: 'linear-gradient(135deg, #22c55e, #15803d)' },
};

const severityColors = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

export default function AIDetectionPanel({ detection }: { detection: Detection }) {
  const config = typeConfig[detection.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3"
        style={{ background: config.gradient }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          {config.icon}
        </div>
        <div>
          <h3 className="text-white font-bold text-base">{config.label}</h3>
          <p className="text-white/70 text-xs">{detection.location}</p>
        </div>
        <div className="ml-auto">
          <span className={`badge ${config.badge}`}>
            {detection.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium flex items-center gap-1.5"
              style={{ color: 'var(--text-secondary)' }}>
              <Target className="w-3.5 h-3.5" /> Confidence
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              {detection.confidence}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${detection.confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: 'var(--color-primary)' }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>AFFECTED AREA</span>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {detection.affectedArea} <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>{detection.affectedAreaUnit}</span>
            </span>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>SEVERITY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: severityColors[detection.severity] }} />
              <span className="text-lg font-bold" style={{ color: severityColors[detection.severity] }}>
                {detection.severity}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Date */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
            {detection.location}
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
            {detection.date}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {detection.description}
        </p>
      </div>
    </motion.div>
  );
}
