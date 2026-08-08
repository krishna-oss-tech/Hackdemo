import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function DemoBadge({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md ${className}`}
      style={{
        background: 'rgba(245, 158, 11, 0.15)', // amber-500 with opacity
        color: '#f59e0b', // amber-500
        border: '1px solid rgba(245, 158, 11, 0.3)',
      }}
    >
      <AlertTriangle className="w-3 h-3" />
      DEMO DATA
    </motion.div>
  );
}
