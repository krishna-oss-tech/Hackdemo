import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Layers, Play, RefreshCw,
  Waves, Flame, Droplets, ArrowUpRight, CheckCircle2, Sliders, Activity, Database, ShieldCheck
} from 'lucide-react';

export default function DisasterDigitalTwin() {
  const [simulationType, setSimulationType] = useState<'flood' | 'wildfire'>('flood');
  const [rainfall, setRainfall] = useState<number>(120); // mm/hr
  const [damBreach, setDamBreach] = useState<boolean>(false);
  const [windSpeed, setWindSpeed] = useState<number>(45); // km/h
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Dynamic simulation calculations based on twin state
  const baseInundation = simulationType === 'flood'
    ? Math.round((rainfall * 0.08 + (damBreach ? 8.5 : 0)) * 10) / 10
    : Math.round((windSpeed * 0.15) * 10) / 10;

  const basePopulationRisk = Math.round(baseInundation * 1420);
  const baseAgriLoss = Math.round(baseInundation * 3.4 * 10) / 10; // in Crores INR

  // Mitigation effects
  const mitigationEffect = activeIntervention === 'barrier' ? 0.35 : activeIntervention === 'spillway' ? 0.50 : activeIntervention === 'evacuation' ? 0.10 : 0;
  const currentInundation = Math.max(0.5, Math.round((baseInundation * (1 - mitigationEffect)) * 10) / 10);
  const currentPopulationRisk = Math.round(basePopulationRisk * (1 - (activeIntervention === 'evacuation' ? 0.85 : mitigationEffect)));
  const currentAgriLoss = Math.round(baseAgriLoss * (1 - mitigationEffect) * 10) / 10;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - USP Highlight */}
      <div className="glass-card p-6 relative overflow-hidden" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
             style={{ background: 'var(--color-primary)' }} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                 style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Cpu className="w-3.5 h-3.5" />
              FLAGSHIP USP • REAL-TIME AI DISASTER DIGITAL TWIN
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Nagpur Hydrological & Disaster Twin
            </h1>
            <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Continuous 3D spatial replica synchronized with Sentinel-2 satellite telemetry, terrain DEM models, and physics-informed AI engines for real-time scenario simulation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-card px-3 py-2 text-right">
              <div className="flex items-center gap-1.5 justify-end text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                TWIN LIVE SYNCED
              </div>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Latency: 180ms</span>
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="btn-primary py-2.5 px-5 text-sm font-semibold flex items-center gap-2 shrink-0"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Simulating Twin...' : 'Re-Run Physics Model'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel & Live Digital Twin View */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Physics Controls & Scenario Parameters */}
        <div className="space-y-6">
          {/* Twin Mode Selection */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sliders className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              Simulated Hazard Model
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setSimulationType('flood')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  simulationType === 'flood' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Waves className="w-4 h-4" /> Flood Surge Twin
              </button>
              <button
                onClick={() => setSimulationType('wildfire')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  simulationType === 'wildfire' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Flame className="w-4 h-4" /> Wildfire Twin
              </button>
            </div>

            {simulationType === 'flood' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span style={{ color: 'var(--text-secondary)' }}>Precipitation Rate</span>
                    <span className="font-bold text-blue-400">{rainfall} mm/hr</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={250}
                    value={rainfall}
                    onChange={(e) => setRainfall(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-blue-950 accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Moderate Rain</span>
                    <span>Extreme Monsoon</span>
                  </div>
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <div>
                      <span className="text-xs font-medium block" style={{ color: 'var(--text-primary)' }}>Nag River Dam Gate Overflow</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Simulate 100% capacity spillway release</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={damBreach}
                      onChange={(e) => setDamBreach(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span style={{ color: 'var(--text-secondary)' }}>Surface Wind Speed</span>
                    <span className="font-bold text-amber-400">{windSpeed} km/h</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-amber-950 accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* What-If Mitigation Simulator */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                What-If Mitigation Simulator
              </h3>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Test simulated response actions on the Digital Twin to evaluate reduction in casualty and economic impact:
            </p>

            <div className="space-y-2">
              {[
                { id: 'barrier', title: 'Deploy Smart Sandbag Embankments', save: '35% Flood Reduction' },
                { id: 'spillway', title: 'Controlled Diversion to Kamptee Reservoir', save: '50% Peak Surge Drop' },
                { id: 'evacuation', title: 'Execute Rapid Zone-3 Evacuation Protocol', save: '85% Population Risk Mitigated' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIntervention(activeIntervention === item.id ? null : item.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    activeIntervention === item.id
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${activeIntervention === item.id ? 'text-emerald-400' : 'text-gray-600'}`} />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    {item.save}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive 3D Digital Twin View & Output Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Twin Visual Canvas */}
          <div className="glass-card p-4 relative overflow-hidden min-h-[380px] flex flex-col justify-between"
               style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 14, 26, 0.95) 100%)' }}>
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10 mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Nagpur Mesh ID: #TWIN-NGP-9021</span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Droplets className="w-3.5 h-3.5" /> Hydro Dynamic DEM (30m)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Database className="w-3.5 h-3.5" /> Sentinel-2 SAR Stream
                </span>
              </div>
            </div>

            {/* Interactive Grid & Simulated Spatial Canvas */}
            <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-6">
              
              {/* Grid Background Effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#10b981 1px, #030712 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px'
                }}
              />

              {/* Simulation Hotspot Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: simulationType === 'flood'
                    ? 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0) 70%)'
                    : 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(239, 68, 68, 0) 70%)'
                }}
              />

              {/* Central Twin Overlay Information */}
              <div className="relative z-10 text-center space-y-3 max-w-md bg-slate-900/80 p-6 rounded-2xl border border-slate-700/60 backdrop-blur-xl shadow-2xl">
                <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-white">Live Twin Simulation Active</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Modelling flood vector along <span className="text-emerald-400 font-semibold">Nag River Basin</span> & <span className="text-blue-400 font-semibold">Kamptee Lowlands</span>.
                </p>

                <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-gray-400 block">Peak Inundation</span>
                    <span className="text-sm font-bold text-blue-400">{currentInundation} km²</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-gray-400 block">Population Impact</span>
                    <span className="text-sm font-bold text-amber-400">{currentPopulationRisk.toLocaleString()} civilians</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Real-time Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-4 z-10">
              <div className="glass-card p-3 text-center">
                <div className="text-[11px] text-gray-400">Simulated Area Submerged</div>
                <div className="text-xl font-extrabold text-blue-400 mt-0.5">{currentInundation} km²</div>
                {activeIntervention && (
                  <span className="text-[10px] text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <ArrowUpRight className="w-3 h-3 rotate-180" /> {Math.round(mitigationEffect * 100)}% Saved by Mitigation
                  </span>
                )}
              </div>

              <div className="glass-card p-3 text-center">
                <div className="text-[11px] text-gray-400">Predicted Population Risk</div>
                <div className="text-xl font-extrabold text-amber-400 mt-0.5">{currentPopulationRisk.toLocaleString()}</div>
                <span className="text-[10px] text-gray-400 mt-0.5 block">High Evacuation Priority</span>
              </div>

              <div className="glass-card p-3 text-center">
                <div className="text-[11px] text-gray-400">Est. Crop Damage (INR)</div>
                <div className="text-xl font-extrabold text-rose-400 mt-0.5">₹{currentAgriLoss} Cr</div>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Cotton & Soy Cotton Belts</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
