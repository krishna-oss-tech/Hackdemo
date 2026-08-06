import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { weeklyDisasterTrend, cropHealthTrend, affectedAreaComparison } from '../../data/mockData';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="px-3 py-2 rounded-lg text-xs shadow-lg"
      style={{
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
      }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function StatsCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Weekly Disaster Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4" style={{ color: 'var(--color-danger)' }} />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Weekly Disaster Trend
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyDisasterTrend}>
            <defs>
              <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cropGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area type="monotone" dataKey="value" name="Floods" stroke="#3b82f6" fill="url(#floodGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="value2" name="Fires" stroke="#ef4444" fill="url(#fireGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="value3" name="Crop Stress" stroke="#eab308" fill="url(#cropGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Crop Health Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Crop Health Trend
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={cropHealthTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[50, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" name="NDVI %" stroke="#22c55e" strokeWidth={2.5}
              dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6, fill: '#22c55e' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Affected Area Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-5 lg:col-span-2"
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Affected Area Comparison (km²)
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={affectedAreaComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="value" name="Current Event" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="value2" name="Historical Avg" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
