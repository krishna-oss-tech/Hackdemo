import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Satellite, Search, Calendar, MapPin, AlertCircle } from 'lucide-react';
import MapView from '../components/map/MapView';
import AIDetectionPanel from '../components/analysis/AIDetectionPanel';
import BeforeAfterSlider from '../components/analysis/BeforeAfterSlider';
import AIExplainability from '../components/analysis/AIExplainability';
import AIRecommendations from '../components/analysis/AIRecommendations';
import { useAnalysisStore } from '../stores/analysisStore';
import { apiService } from '../services/api';
import { demoAnalysisResult } from '../data/demoData';

export default function AnalyzeRegionPage() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';
  
  const store = useAnalysisStore();
  const [searchInput, setSearchInput] = useState(store.locationQuery);
  const [geocodeResults, setGeocodeResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Set demo mode data if URL has ?demo=true
  useEffect(() => {
    if (isDemoMode && !store.result) {
      store.setResult(demoAnalysisResult);
    }
  }, [isDemoMode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    const results = await apiService.geocode(searchInput);
    setGeocodeResults(results);
    setShowDropdown(true);
  };

  const selectLocation = (result: any) => {
    store.setParams({
      locationQuery: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    });
    setSearchInput(result.display_name);
    setShowDropdown(false);
  };

  const handleAnalyze = async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const result = await apiService.analyze({
        latitude: store.latitude,
        longitude: store.longitude,
        radius_km: store.radiusKm,
        disaster_type: store.disasterType,
        before_date: store.beforeDate,
        after_date: store.afterDate,
      });
      store.setResult(result);
    } catch (err: any) {
      store.setError(err.message || 'Analysis failed');
    } finally {
      store.setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Live Region Analysis
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure parameters and run AI detection on satellite imagery.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Map and Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 relative">
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Location Search</label>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search city, region..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              </form>
              
              {showDropdown && geocodeResults.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {geocodeResults.map((r, i) => (
                    <div 
                      key={i} 
                      className="p-3 hover:bg-slate-700 cursor-pointer text-sm border-b border-slate-700 last:border-0"
                      onClick={() => selectLocation(r)}
                    >
                      <div className="font-semibold text-slate-200">{r.display_name.split(',')[0]}</div>
                      <div className="text-xs text-slate-400">{r.display_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Disaster Type</label>
              <select 
                value={store.disasterType}
                onChange={(e) => store.setParams({ disasterType: e.target.value as any })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200"
              >
                <option value="flood">Flood</option>
                <option value="wildfire">Wildfire</option>
                <option value="crop_stress">Crop Stress</option>
              </select>
            </div>

            <button 
              onClick={handleAnalyze} 
              disabled={store.isLoading}
              className="btn-primary w-full py-2 flex items-center justify-center gap-2"
            >
              {store.isLoading ? (
                <span className="animate-pulse flex items-center gap-2"><Satellite className="w-4 h-4 animate-spin" /> Processing...</span>
              ) : (
                <><Satellite className="w-4 h-4" /> Analyze</>
              )}
            </button>
          </div>

          <MapView />
        </div>

        {/* Right Column: Results Summary */}
        <div className="space-y-6">
          {store.error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Analysis Failed</h4>
                <p className="text-xs opacity-80 mt-1">{store.error}</p>
              </div>
            </div>
          )}

          {store.result ? (
            <AIDetectionPanel />
          ) : (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Satellite className="w-12 h-12 mb-4 animate-float opacity-50" style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Awaiting Analysis
              </h3>
              <p className="text-sm text-center max-w-[250px]" style={{ color: 'var(--text-secondary)' }}>
                Search for a location and click Analyze to fetch satellite data and run the AI models.
              </p>
            </div>
          )}
        </div>
      </div>

      {store.result && (
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
