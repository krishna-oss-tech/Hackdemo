import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalysisStore } from '../../stores/analysisStore';
import { Bot, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

const priorityColors: Record<string, any> = {
  urgent: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
  high: { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.2)' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', color: '#facc15', border: 'rgba(234, 179, 8, 0.2)' },
  low: { bg: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' },
};

export default function AIRecommendations() {
  const store = useAnalysisStore();
  const detection = store.result;
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Reset animation when new data arrives
  useEffect(() => {
    setIsTyping(true);
    setVisibleCount(0);
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [detection]);

  useEffect(() => {
    if (!detection) return;
    if (!isTyping && visibleCount < detection.recommendations.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTyping, visibleCount, detection]);

  if (!detection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          AI Response Recommendations
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] flex items-center gap-1 font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
            <AlertTriangle className="w-3 h-3" />
            AI GENERATED - VERIFY
          </span>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
            {detection.recommendations.length} Actions
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
              <Bot className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Synthesizing mitigation strategies based on satellite detection...
            </span>
          </div>
        )}

        {/* Recommendations */}
        {detection.recommendations.slice(0, visibleCount).map((rec, i) => {
          const pColor = priorityColors[rec.priority] || priorityColors.medium;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-700"
              style={{ background: 'var(--bg-hover)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {rec.action}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                    style={{ background: pColor.bg, color: pColor.color, border: `1px solid ${pColor.border}` }}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {rec.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
