import { create } from 'zustand';
import type { AnalysisResult } from '../services/api';

interface AnalysisState {
  // Input parameters
  locationQuery: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  disasterType: 'flood' | 'wildfire' | 'crop_stress';
  beforeDate: string;
  afterDate: string;
  
  // Status
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  
  // Results
  result: AnalysisResult | null;
  
  // Actions
  setParams: (params: Partial<Omit<AnalysisState, 'setParams' | 'setResult' | 'setLoading' | 'setError' | 'result' | 'isLoading' | 'error' | 'isDemo'>>) => void;
  setResult: (result: AnalysisResult | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Default to Nagpur (matching the default demo data)
export const useAnalysisStore = create<AnalysisState>((set) => ({
  locationQuery: 'Nagpur, Maharashtra',
  latitude: 21.1458,
  longitude: 79.0882,
  radiusKm: 5.0,
  disasterType: 'flood',
  beforeDate: '2026-07-01',
  afterDate: '2026-08-05',
  
  isLoading: false,
  error: null,
  isDemo: false,
  
  result: null,
  
  setParams: (params) => set((state) => ({ ...state, ...params })),
  
  setResult: (result) => set({ 
    result, 
    isDemo: result?.source === 'cached_fallback' 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));
