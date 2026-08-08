export interface AnalysisResult {
  source: 'live_earth_engine' | 'cached_fallback';
  location_name: string;
  latitude: number;
  longitude: number;
  disaster_type: string;
  before_date: string;
  after_date: string;
  satellite_source: string;
  resolution: string;
  affected_area_km2: number;
  total_aoi_km2: number;
  affected_percent: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  severity_reason: string;
  confidence: number;
  confidence_explanation: string;
  mean_ndvi_before: number | null;
  mean_ndvi_after: number | null;
  mean_ndwi_before: number | null;
  mean_ndwi_after: number | null;
  evidence: Array<{
    icon: string;
    title: string;
    detail: string;
    confidence: number;
  }>;
  priority_zones: Array<{
    zone: string;
    priority: string;
    reason: string;
  }>;
  recommendations: Array<{
    priority: 'urgent' | 'high' | 'medium' | 'low';
    action: string;
    category: string;
  }>;
  detected_polygon_geojson: any | null;
  processing_time_sec: number;
}

export interface GeocodeResult {
  display_name: string;
  latitude: number;
  longitude: number;
  type: string;
  importance: number;
}

export interface SpotInspectionResult {
  source: 'live_earth_engine' | 'cached_fallback';
  lat: number;
  lng: number;
  ndvi: number;
  ndwi: number;
  land_cover: string;
  disaster_status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiService = {
  async analyze(params: {
    latitude: number;
    longitude: number;
    radius_km: number;
    disaster_type: string;
    before_date: string;
    after_date: string;
  }): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Analyze API failed:', error);
      throw error;
    }
  },

  async geocode(query: string): Promise<GeocodeResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/geocode?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Geocode API error: ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Geocode API failed:', error);
      return [];
    }
  },

  async spotInspect(lat: number, lng: number): Promise<SpotInspectionResult | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/spot-inspect?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error(`Spot inspect API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Spot inspect API failed:', error);
      return null;
    }
  },
};
