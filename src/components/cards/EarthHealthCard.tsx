import { motion } from 'framer-motion';
import { earthHealth } from '../../data/mockData';
import { Heart, Droplets, Flame, TreePine, CloudRain } from 'lucide-react';

function ProgressRing({ value, size = 120, stroke = 8, color }: { value: number; size?: number; stroke?: number; color: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        stroke="var(--bg-hover)"
        fill="none"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={color}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={`${circumference} ${circumference}`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function EarthHealthCard() {
  const metrics = [
    { label: 'Crop Health', value: earthHealth.cropHealth, icon: <TreePine className="w-4 h-4" />, color: '#22c55e' },
    { label: 'Flood Risk', value: earthHealth.floodRisk, icon: <Droplets className="w-4 h-4" />, color: '#3b82f6' },
    { label: 'Fire Risk', value: earthHealth.fireRisk, icon: <Flame className="w-4 h-4" />, color: '#ef4444' },
    { label: 'Soil Moisture', value: earthHealth.soilMoisture, icon: <CloudRain className="w-4 h-4" />, color: '#8b5cf6' },
  ];

  const statusMetrics = [
    { label: 'Vegetation', value: earthHealth.vegetation, color: '#22c55e' },
    { label: 'Water', value: earthHealth.waterAvailability, color: '#3b82f6' },
    { label: 'Air Quality', value: earthHealth.airQuality, color: '#eab308' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <Heart className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
        <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Earth Health Score
        </h3>
      </div>

      {/* Main Score Ring */}
      <div className="flex items-center justify-center mb-6 relative">
        <ProgressRing value={earthHealth.score} size={140} stroke={10} color="#10b981" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-extrabold"
            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}
          >
            {earthHealth.score}
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            / 100
          </span>
        </div>
      </div>

      {/* Metric Bars */}
      <div className="space-y-3 mb-5">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium flex items-center gap-1.5"
                style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: m.color }}>{m.icon}</span>
                {m.label}
              </span>
              <span className="text-xs font-bold" style={{ color: m.color }}>
                {m.value}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                className="h-full rounded-full"
                style={{ background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        {statusMetrics.map((s, i) => (
          <div key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: `${s.color}15`,
              color: s.color,
              border: `1px solid ${s.color}30`,
            }}>
            {s.label}: {s.value}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
