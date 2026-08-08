import type { AnalysisResult } from '../services/api';

export const demoAnalysisResult: AnalysisResult = {
  source: 'cached_fallback',
  location_name: "Nagpur, Maharashtra",
  latitude: 21.1458,
  longitude: 79.0882,
  disaster_type: "flood",
  before_date: "2026-07-01",
  after_date: "2026-08-05",
  satellite_source: "Sentinel-2 MSI (Copernicus) — cached reference",
  resolution: "10m/pixel",
  affected_area_km2: 4.8,
  total_aoi_km2: 78.5,
  affected_percent: 6.1,
  severity: "High",
  severity_reason: "Significant change detected across multiple connected zones along the Nag River basin.",
  confidence: 87,
  confidence_explanation: "Confidence is based on detected change patterns and available satellite evidence.",
  mean_ndvi_before: 0.72,
  mean_ndvi_after: 0.31,
  mean_ndwi_before: 0.15,
  mean_ndwi_after: 0.68,
  evidence: [
    {
      icon: "💧",
      title: "Significant Water-Index Change",
      detail: "NDWI increased from 0.15 to 0.68 between dates, indicating surface water expansion across the AOI.",
      confidence: 92,
    },
    {
      icon: "🌿",
      title: "Vegetation Index Drop",
      detail: "NDVI decreased from 0.72 to 0.31 in affected areas, consistent with submersion or waterlogging.",
      confidence: 89,
    },
    {
      icon: "🔗",
      title: "Connected Change Regions",
      detail: "Detected change pixels form large connected clusters rather than scattered noise, indicating a real event.",
      confidence: 85,
    },
    {
      icon: "📅",
      title: "Temporal Consistency",
      detail: "Change pattern is absent in the same period of previous years, confirming this is anomalous.",
      confidence: 83,
    },
  ],
  priority_zones: [
    {
      zone: "Zone A — Nag River South Bank",
      priority: "High",
      reason: "Largest contiguous affected area (2.3 km²) with nearby residential infrastructure.",
    },
    {
      zone: "Zone B — Kamptee Lowlands",
      priority: "High",
      reason: "Low elevation basin with poor drainage; risk of prolonged waterlogging.",
    },
    {
      zone: "Zone C — Western Agricultural Belt",
      priority: "Medium",
      reason: "Moderate crop stress detected; cotton and soybean fields showing early waterlogging signs.",
    },
  ],
  recommendations: [
    {
      priority: "urgent",
      action: "Deploy assessment teams to Nag River south bank residential areas.",
      category: "Emergency Response",
    },
    {
      priority: "urgent",
      action: "Coordinate with NDRF for Kamptee lowlands evacuation readiness.",
      category: "Emergency Response",
    },
    {
      priority: "high",
      action: "Monitor water levels at all river gauge stations every 2 hours.",
      category: "Monitoring",
    },
    {
      priority: "high",
      action: "Inspect western agricultural fields for waterlogging damage extent.",
      category: "Agriculture",
    },
    {
      priority: "medium",
      action: "Schedule follow-up satellite acquisition in 5 days to track recession.",
      category: "Monitoring",
    },
  ],
  detected_polygon_geojson: {
    "type": "Feature",
    "properties": {"type": "flood", "area_km2": 4.8},
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [79.06, 21.16],
                [79.12, 21.17],
                [79.13, 21.14],
                [79.10, 21.12],
                [79.06, 21.13],
                [79.06, 21.16],
            ]
        ],
    },
  },
  processing_time_sec: 0.12,
};
