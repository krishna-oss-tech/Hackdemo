import { motion } from 'framer-motion';
import { useAnalysisStore } from '../../stores/analysisStore';
import { Brain, Cpu } from 'lucide-react';

export default function AIExplainability() {
  const store = useAnalysisStore();
  const detection = store.result;

  if (!detection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden h-full flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Brain className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          Why did AI detect this?
        </h3>
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
          Traceability Log
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
        {detection.evidence.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="p-3 rounded-xl border border-slate-800"
            style={{ background: 'var(--bg-hover)' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">{reason.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {reason.title}
                  </h4>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    {reason.confidence}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {reason.detail}
                </p>
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${reason.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-primary)' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Model info - Fixed to bottom */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="p-3 rounded-xl flex items-center gap-3"
          style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}>
          <Cpu className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} />
          <div className="flex-1">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              Google Earth Engine • TerraAid AI Pipeline
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              {detection.satellite_source} • {detection.resolution} • Processing Time: {detection.processing_time_sec}s
            </p>
          </div>
          <div className="text-right shrink-0 pl-2 border-l border-indigo-500/20">
            <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
              {detection.confidence}%
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              Overall
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
