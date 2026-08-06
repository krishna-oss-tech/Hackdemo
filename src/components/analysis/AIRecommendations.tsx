import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { recommendations } from '../../data/mockData';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';

const priorityColors = {
  urgent: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
  high: { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.2)' },
  medium: { bg: 'rgba(234, 179, 8, 0.1)', color: '#facc15', border: 'rgba(234, 179, 8, 0.2)' },
  low: { bg: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' },
};

export default function AIRecommendations() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isTyping && visibleCount < recommendations.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTyping, visibleCount]);

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
          <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          AI Recommended Actions
        </h3>
        <span className="text-[10px] font-medium px-2 py-1 rounded-full"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
          {recommendations.length} Actions
        </span>
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
              AI is generating recommendations...
            </span>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.slice(0, visibleCount).map((rec) => {
          const pColor = priorityColors[rec.priority];
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group"
              style={{ background: 'var(--bg-hover)' }}
            >
              <span className="text-lg shrink-0 mt-0.5">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {rec.action}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                    style={{ background: pColor.bg, color: pColor.color, border: `1px solid ${pColor.border}` }}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    {rec.category}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-tertiary)' }} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
