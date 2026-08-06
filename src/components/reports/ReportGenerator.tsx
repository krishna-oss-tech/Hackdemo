import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, X, MapPin,
  AlertTriangle, Leaf, Check, Loader
} from 'lucide-react';
import { detections, recommendations, earthHealth } from '../../data/mockData';

export default function ReportGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setShowPreview(true);
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Report Generator
          </h3>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Generate a comprehensive analysis report with satellite imagery, detected changes,
          area estimates, and AI recommendations.
        </p>

        <div className="space-y-2 mb-5">
          {['Map & Region Overview', 'Satellite Imagery (Before/After)', 'Detected Changes & Events', 'Affected Area Estimates', 'AI Recommendations'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              {item}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary flex-1 justify-center"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : generated ? (
              <>
                <Check className="w-4 h-4" />
                Report Ready
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
          {generated && (
            <button
              onClick={() => setShowPreview(true)}
              className="btn-outline"
            >
              Preview
            </button>
          )}
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
              style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-color)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-5 border-b flex items-center justify-between"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-card-solid)',
                }}>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                    TerraAid AI — Analysis Report
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Generated on August 6, 2026 • Nagpur Region
                  </p>
                </div>
                <button onClick={() => setShowPreview(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
                    Executive Summary
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Analysis of Sentinel-2 satellite imagery from August 1-6, 2026 reveals significant
                    flood events in the Nagpur-Kamptee corridor. AI models detected flood zones covering
                    approximately 6.9 km² with 92% confidence. Agricultural areas in Wardha district
                    show waterlogging stress across 12 hectares. Immediate intervention recommended.
                  </p>
                </div>

                {/* Detections Table */}
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                    Detected Events
                  </h3>
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: 'var(--bg-hover)' }}>
                          {['Type', 'Location', 'Area', 'Confidence', 'Severity'].map(h => (
                            <th key={h} className="px-3 py-2.5 text-left font-semibold"
                              style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detections.slice(0, 4).map((d) => (
                          <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                            <td className="px-3 py-2.5 font-medium capitalize"
                              style={{ color: 'var(--text-primary)' }}>
                              {d.type.replace('_', ' ')}
                            </td>
                            <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>{d.location}</td>
                            <td className="px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                              {d.affectedArea} {d.affectedAreaUnit}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>{d.confidence}%</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`badge badge-${d.severity.toLowerCase()}`}>{d.severity}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Health Score */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-hover)' }}>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}>
                    <Leaf className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                    Earth Health Score: {earthHealth.score}/100
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Crop Health', value: `${earthHealth.cropHealth}%` },
                      { label: 'Flood Risk', value: `${earthHealth.floodRisk}%` },
                      { label: 'Vegetation', value: earthHealth.vegetation },
                    ].map((m, i) => (
                      <div key={i} className="text-center">
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {recommendations.slice(0, 5).map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span>{r.icon}</span>
                        <span>{r.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  TerraAid AI Report • Confidential • {new Date().toLocaleDateString()}
                </p>
                <button className="btn-primary text-sm py-2 px-4">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
