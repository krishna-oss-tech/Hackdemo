import { motion } from 'framer-motion';
import type { Alert } from '../../data/mockData';
import {
  Droplets, Flame, Wheat, MapPin,
  Clock, AlertTriangle
} from 'lucide-react';

const typeConfig = {
  flood: { icon: <Droplets className="w-4 h-4" />, color: '#3b82f6', label: 'Flood' },
  fire: { icon: <Flame className="w-4 h-4" />, color: '#ef4444', label: 'Fire' },
  crop_stress: { icon: <Wheat className="w-4 h-4" />, color: '#eab308', label: 'Crop Stress' },
};

const priorityConfig = {
  Critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  High: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  Medium: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
  Low: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
};

export default function AlertCard({ alert, index = 0 }: { alert: Alert; index?: number }) {
  const type = typeConfig[alert.type];
  const priority = priorityConfig[alert.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-4 relative overflow-hidden group"
    >
      {/* New indicator */}
      {alert.isNew && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: priority.color }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: priority.color }} />
          </span>
        </div>
      )}

      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: type.color }} />

      <div className="flex items-start gap-3 pl-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${type.color}15`, color: type.color }}>
          {type.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {alert.title}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{ background: priority.bg, color: priority.color }}>
              {alert.priority}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${type.color}10`, color: type.color }}>
              {type.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {alert.location}
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {alert.affectedArea}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1.5 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {alert.timestamp}
            </span>
            <span>Confidence: <strong style={{ color: 'var(--color-primary)' }}>{alert.confidence}%</strong></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
