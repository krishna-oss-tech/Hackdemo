import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import MapView from '../components/map/MapView';
import AIDetectionPanel from '../components/analysis/AIDetectionPanel';
import BeforeAfterSlider from '../components/analysis/BeforeAfterSlider';
import AIRecommendations from '../components/analysis/AIRecommendations';
import AIExplainability from '../components/analysis/AIExplainability';
import EarthHealthCard from '../components/cards/EarthHealthCard';
import TimelineSlider from '../components/timeline/TimelineSlider';
import AlertCard from '../components/alerts/AlertCard';
import StatsCharts from '../components/stats/StatsCharts';
import ReportGenerator from '../components/reports/ReportGenerator';
import DisasterDigitalTwin from '../components/digitaltwin/DisasterDigitalTwin';
import { detections, alerts } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Leaf,
  MapPin, Satellite, Clock, FileText, Settings,
  Shield, Droplets, Flame, Wheat, Bell, Cpu, ArrowRight
} from 'lucide-react';

// ============ Dashboard Home ============
function DashboardHome() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleRegionSelect = () => {
    setShowResults(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const quickStats = [
    { label: 'Active Alerts', value: '4', icon: <AlertTriangle className="w-4 h-4" />, color: '#ef4444', change: '+2 today' },
    { label: 'Area Monitored', value: '248 km²', icon: <MapPin className="w-4 h-4" />, color: '#3b82f6', change: '12 regions' },
    { label: 'Crop Health Avg', value: '91%', icon: <Leaf className="w-4 h-4" />, color: '#22c55e', change: '↓ 5% this week' },
    { label: 'AI Accuracy', value: '99.2%', icon: <Shield className="w-4 h-4" />, color: '#8b5cf6', change: 'Last 30 days' },
  ];

  return (
    <div className="space-y-6">
      {/* AI Disaster Digital Twin Banner (USP) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer group"
        onClick={() => navigate('/dashboard/digital-twin')}
        style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                CORE USP
              </span>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                AI Disaster Digital Twin Simulation Platform
              </h2>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Simulate 3D flood surge vectors, dam overflow scenarios, and test what-if evacuations in real-time.
            </p>
          </div>
        </div>

        <button className="btn-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1.5">
          Launch Twin <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {stat.label}
              </span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
              {stat.value}
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map - takes 2 cols */}
        <div className="lg:col-span-2">
          <MapView onRegionSelect={handleRegionSelect} isAnalyzing={isAnalyzing} />
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          <EarthHealthCard />
          {showResults && <AIDetectionPanel detection={detections[0]} />}
        </div>
      </div>

      {/* Second row */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            <BeforeAfterSlider />
            <TimelineSlider />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Third row */}
      {showResults && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIRecommendations />
          </div>
          <AIExplainability />
        </div>
      )}

      {/* Charts */}
      {showResults && <StatsCharts />}
    </div>
  );
}

// ============ Analyze Region Page ============
function AnalyzeRegionPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setShowResults(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Analyze Region
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Select a region on the map to analyze satellite imagery
          </p>
        </div>
        <button onClick={handleAnalyze} className="btn-primary">
          <Satellite className="w-4 h-4" /> Start Analysis
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView onRegionSelect={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
        <div className="space-y-6">
          {showResults ? (
            <>
              <AIDetectionPanel detection={detections[0]} />
              <AIDetectionPanel detection={detections[1]} />
            </>
          ) : (
            <div className="glass-card p-8 text-center">
              <Satellite className="w-12 h-12 mx-auto mb-4 animate-float" style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Ready to Analyze
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Draw an area on the map or click "Start Analysis" to process satellite imagery.
              </p>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <BeforeAfterSlider />
            <AIExplainability />
          </div>
          <AIRecommendations />
        </>
      )}
    </div>
  );
}

// ============ Alerts Page ============
function AlertsPage() {
  const [filter, setFilter] = useState<string>('all');
  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Disaster Alerts
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Real-time disaster alerts from satellite monitoring
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Alerts', icon: <Bell className="w-3.5 h-3.5" /> },
          { key: 'flood', label: 'Flood', icon: <Droplets className="w-3.5 h-3.5" /> },
          { key: 'fire', label: 'Fire', icon: <Flame className="w-3.5 h-3.5" /> },
          { key: 'crop_stress', label: 'Crop Stress', icon: <Wheat className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: filter === tab.key ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-hover)',
              color: filter === tab.key ? 'var(--color-primary)' : 'var(--text-secondary)',
              border: `1px solid ${filter === tab.key ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert, i) => (
          <AlertCard key={alert.id} alert={alert} index={i} />
        ))}
      </div>
    </div>
  );
}

// ============ Crop Health Page ============
function CropHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Crop Health
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Monitor crop health metrics across monitored regions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView />
        </div>
        <div className="space-y-6">
          <EarthHealthCard />
          <AIDetectionPanel detection={detections[3]} />
        </div>
      </div>

      <StatsCharts />
    </div>
  );
}

// ============ Timeline Page ============
function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Event Timeline
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track environmental changes over time
        </p>
      </div>

      <TimelineSlider />

      <div className="grid lg:grid-cols-2 gap-6">
        <BeforeAfterSlider />
        <div className="space-y-6">
          <AIDetectionPanel detection={detections[0]} />
          <AIDetectionPanel detection={detections[2]} />
        </div>
      </div>

      <StatsCharts />
    </div>
  );
}

// ============ Reports Page ============
function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Generate and download comprehensive analysis reports
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ReportGenerator />

        {/* Recent reports */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}>
            <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            Recent Reports
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Nagpur Flood Analysis', date: 'Aug 5, 2026', status: 'Complete' },
              { name: 'Wardha Crop Assessment', date: 'Aug 4, 2026', status: 'Complete' },
              { name: 'Monthly Monitoring Report', date: 'Jul 31, 2026', status: 'Complete' },
              { name: 'Chandrapur Fire Report', date: 'Jul 28, 2026', status: 'Complete' },
            ].map((report, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ background: 'var(--bg-hover)' }}
              >
                <FileText className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{report.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{report.date}</p>
                </div>
                <span className="badge badge-healthy text-[10px]">{report.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <StatsCharts />
    </div>
  );
}

// ============ Settings Page ============
function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Configure your monitoring preferences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            title: 'Alert Preferences',
            items: [
              { label: 'Flood Alerts', enabled: true },
              { label: 'Fire Alerts', enabled: true },
              { label: 'Crop Stress Alerts', enabled: true },
              { label: 'Email Notifications', enabled: false },
              { label: 'Push Notifications', enabled: true },
            ]
          },
          {
            title: 'Monitoring Settings',
            items: [
              { label: 'Auto-analyze new imagery', enabled: true },
              { label: 'High-resolution processing', enabled: false },
              { label: 'Historical comparison', enabled: true },
              { label: 'Weekly summary reports', enabled: true },
              { label: 'Dark satellite tiles', enabled: true },
            ]
          },
        ].map((section, si) => (
          <div key={si} className="glass-card p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}>
              <Settings className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 rounded-full peer
                      peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                      after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                      style={{
                        background: item.enabled ? 'var(--color-primary)' : 'var(--bg-hover)',
                        border: `1px solid ${item.enabled ? 'var(--color-primary)' : 'var(--border-color-light)'}`,
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Main Dashboard Layout ============
export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="digital-twin" element={<DisasterDigitalTwin />} />
            <Route path="analyze" element={<AnalyzeRegionPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="crop-health" element={<CropHealthPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
