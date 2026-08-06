// ============================================
// TerraAid AI - Mock Data
// Simulated flood event in Nagpur, India (August 2026)
// ============================================

export interface Detection {
  id: string;
  type: 'flood' | 'fire' | 'crop_stress' | 'healthy';
  location: string;
  confidence: number;
  affectedArea: string;
  affectedAreaUnit: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  date: string;
  coordinates: [number, number];
  description: string;
}

export interface Alert {
  id: string;
  type: 'flood' | 'fire' | 'crop_stress';
  title: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  affectedArea: string;
  confidence: number;
  timestamp: string;
  location: string;
  isNew: boolean;
}

export interface TimelineEvent {
  date: string;
  label: string;
  type: 'normal' | 'warning' | 'danger' | 'info';
  description: string;
  healthScore: number;
  floodRisk: number;
  cropHealth: number;
}

export interface Recommendation {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
  category: string;
  icon: string;
}

export interface EarthHealth {
  score: number;
  cropHealth: number;
  floodRisk: number;
  fireRisk: number;
  vegetation: string;
  waterAvailability: string;
  airQuality: string;
  soilMoisture: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
}

// ---- Detections ----
export const detections: Detection[] = [
  {
    id: 'det-001',
    type: 'flood',
    location: 'Nagpur, Maharashtra',
    confidence: 92,
    affectedArea: '4.8',
    affectedAreaUnit: 'km²',
    severity: 'High',
    date: '5 August 2026',
    coordinates: [21.1458, 79.0882],
    description: 'Significant flooding detected along Nag River basin. Water levels have risen 2.3m above normal.',
  },
  {
    id: 'det-002',
    type: 'crop_stress',
    location: 'Wardha District',
    confidence: 87,
    affectedArea: '12',
    affectedAreaUnit: 'hectares',
    severity: 'Medium',
    date: '6 August 2026',
    coordinates: [20.7453, 78.6022],
    description: 'Crop stress detected in cotton and soybean fields due to waterlogging from recent floods.',
  },
  {
    id: 'det-003',
    type: 'flood',
    location: 'Kamptee, Nagpur',
    confidence: 88,
    affectedArea: '2.1',
    affectedAreaUnit: 'km²',
    severity: 'High',
    date: '5 August 2026',
    coordinates: [21.2167, 79.2000],
    description: 'Flash flooding in Kamptee town. Multiple residential areas submerged.',
  },
  {
    id: 'det-004',
    type: 'healthy',
    location: 'Amravati District',
    confidence: 95,
    affectedArea: '340',
    affectedAreaUnit: 'hectares',
    severity: 'Low',
    date: '4 August 2026',
    coordinates: [20.9374, 77.7796],
    description: 'Healthy vegetation detected. Crops in good condition with adequate water supply.',
  },
  {
    id: 'det-005',
    type: 'fire',
    location: 'Chandrapur Forest',
    confidence: 78,
    affectedArea: '0.6',
    affectedAreaUnit: 'km²',
    severity: 'Medium',
    date: '3 August 2026',
    coordinates: [19.9615, 79.2961],
    description: 'Small burn scar detected in deciduous forest. Fire appears contained.',
  },
];

// ---- Alerts ----
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'flood',
    title: 'Flood Alert — Nagpur',
    priority: 'High',
    affectedArea: '4.8 km²',
    confidence: 92,
    timestamp: '2 hours ago',
    location: 'Nag River Basin, Nagpur',
    isNew: true,
  },
  {
    id: 'alert-002',
    type: 'flood',
    title: 'Flash Flood — Kamptee',
    priority: 'Critical',
    affectedArea: '2.1 km²',
    confidence: 88,
    timestamp: '3 hours ago',
    location: 'Kamptee Town',
    isNew: true,
  },
  {
    id: 'alert-003',
    type: 'crop_stress',
    title: 'Crop Stress — Wardha',
    priority: 'Medium',
    affectedArea: '12 hectares',
    confidence: 87,
    timestamp: '5 hours ago',
    location: 'Wardha District',
    isNew: false,
  },
  {
    id: 'alert-004',
    type: 'fire',
    title: 'Burn Scar — Chandrapur',
    priority: 'Low',
    affectedArea: '0.6 km²',
    confidence: 78,
    timestamp: '1 day ago',
    location: 'Chandrapur Forest Reserve',
    isNew: false,
  },
];

// ---- Timeline Events ----
export const timelineEvents: TimelineEvent[] = [
  {
    date: '1 Aug',
    label: 'Normal Conditions',
    type: 'normal',
    description: 'All satellite metrics within normal parameters. Healthy vegetation across monitored regions.',
    healthScore: 94,
    floodRisk: 8,
    cropHealth: 96,
  },
  {
    date: '5 Aug',
    label: 'Flood Detected',
    type: 'danger',
    description: 'Heavy monsoon rainfall causes Nag River overflow. Flooding detected across 4.8 km².',
    healthScore: 72,
    floodRisk: 89,
    cropHealth: 78,
  },
  {
    date: '10 Aug',
    label: 'Crop Stress Rising',
    type: 'warning',
    description: 'Waterlogged fields showing stress signals. NDVI declining in Wardha district.',
    healthScore: 68,
    floodRisk: 62,
    cropHealth: 65,
  },
  {
    date: '15 Aug',
    label: 'Recovery Begins',
    type: 'info',
    description: 'Water levels receding. Early signs of vegetation recovery observed.',
    healthScore: 78,
    floodRisk: 35,
    cropHealth: 72,
  },
  {
    date: '20 Aug',
    label: 'Stabilizing',
    type: 'normal',
    description: 'Region stabilizing. Continued monitoring recommended for secondary flood risks.',
    healthScore: 84,
    floodRisk: 24,
    cropHealth: 82,
  },
];

// ---- AI Recommendations ----
export const recommendations: Recommendation[] = [
  {
    id: 'rec-001',
    priority: 'urgent',
    action: 'Deploy rescue teams to southern Nagpur villages along Nag River.',
    category: 'Emergency Response',
    icon: '🚨',
  },
  {
    id: 'rec-002',
    priority: 'urgent',
    action: 'Evacuate low-lying residential areas in Kamptee town immediately.',
    category: 'Emergency Response',
    icon: '🏃',
  },
  {
    id: 'rec-003',
    priority: 'high',
    action: 'Inspect western agricultural fields for waterlogging damage.',
    category: 'Agriculture',
    icon: '🌾',
  },
  {
    id: 'rec-004',
    priority: 'high',
    action: 'Monitor water levels at Nag River gauge stations every 2 hours.',
    category: 'Monitoring',
    icon: '📊',
  },
  {
    id: 'rec-005',
    priority: 'medium',
    action: 'Coordinate with NDRF for standby deployment in adjacent districts.',
    category: 'Coordination',
    icon: '🤝',
  },
  {
    id: 'rec-006',
    priority: 'medium',
    action: 'Schedule drone survey of Chandrapur forest for burn assessment.',
    category: 'Assessment',
    icon: '🛸',
  },
  {
    id: 'rec-007',
    priority: 'low',
    action: 'Continue satellite monitoring at 6-hour intervals for next 2 weeks.',
    category: 'Monitoring',
    icon: '🛰️',
  },
  {
    id: 'rec-008',
    priority: 'low',
    action: 'Prepare crop damage assessment report for insurance processing.',
    category: 'Documentation',
    icon: '📋',
  },
];

// ---- Earth Health ----
export const earthHealth: EarthHealth = {
  score: 84,
  cropHealth: 91,
  floodRisk: 24,
  fireRisk: 12,
  vegetation: 'Healthy',
  waterAvailability: 'Good',
  airQuality: 'Moderate',
  soilMoisture: 78,
};

// ---- Chart Data ----
export const weeklyDisasterTrend: ChartDataPoint[] = [
  { name: 'Week 1', value: 2, value2: 0, value3: 1 },
  { name: 'Week 2', value: 5, value2: 1, value3: 3 },
  { name: 'Week 3', value: 12, value2: 2, value3: 5 },
  { name: 'Week 4', value: 8, value2: 1, value3: 4 },
  { name: 'Week 5', value: 4, value2: 0, value3: 2 },
];

export const cropHealthTrend: ChartDataPoint[] = [
  { name: '1 Aug', value: 96 },
  { name: '3 Aug', value: 94 },
  { name: '5 Aug', value: 78 },
  { name: '7 Aug', value: 70 },
  { name: '10 Aug', value: 65 },
  { name: '12 Aug', value: 68 },
  { name: '15 Aug', value: 72 },
  { name: '18 Aug', value: 80 },
  { name: '20 Aug', value: 85 },
];

export const affectedAreaComparison: ChartDataPoint[] = [
  { name: 'Nagpur', value: 4.8, value2: 3.2 },
  { name: 'Kamptee', value: 2.1, value2: 1.5 },
  { name: 'Wardha', value: 0.12, value2: 0.08 },
  { name: 'Chandrapur', value: 0.6, value2: 0.2 },
  { name: 'Amravati', value: 0, value2: 0 },
];

// ---- AI Explainability ----
export const aiExplainability = {
  detectionId: 'det-001',
  reasons: [
    {
      icon: '💧',
      title: 'Water Coverage Increase',
      detail: 'Satellite spectral analysis shows water coverage increased by 31% compared to baseline imagery from July 28.',
      confidence: 96,
    },
    {
      icon: '🌿',
      title: 'Vegetation Index Decline',
      detail: 'NDVI (Normalized Difference Vegetation Index) decreased from 0.72 to 0.31 in affected areas, indicating submersion.',
      confidence: 91,
    },
    {
      icon: '📸',
      title: 'Historical Imagery Confirmation',
      detail: 'Temporal comparison with 5 years of August imagery confirms this is an abnormal event. No similar pattern observed since 2021.',
      confidence: 89,
    },
    {
      icon: '🌡️',
      title: 'Thermal Signature Anomaly',
      detail: 'Surface temperature in flooded zones dropped 4.2°C below surrounding areas, consistent with standing water.',
      confidence: 87,
    },
  ],
  overallConfidence: 92,
  model: 'TerraAid Vision v3.2',
  processingTime: '2.4 seconds',
  satelliteSource: 'Sentinel-2 (ESA)',
  resolution: '10m/pixel',
};

// ---- Satellite Layer Definitions ----
export interface SatelliteLayerOption {
  id: 'sentinel2' | 'sentinel1' | 'landsat' | 'clarity' | 'terrain' | 'hybrid';
  name: string;
  badge: string;
  source: string;
  resolution: string;
  url: string;
  attribution: string;
  description: string;
}

export const satelliteLayers: SatelliteLayerOption[] = [
  {
    id: 'sentinel2',
    name: 'Sentinel-2 (Optical)',
    badge: '10m Resolution',
    source: 'Copernicus Sentinel-2 / GEE',
    resolution: '10m/pixel (RGB + NIR)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Copernicus / Esri World Imagery',
    description: 'True-color MSI optical surface reflectance. Ideal for crop health & surface water detection.'
  },
  {
    id: 'sentinel1',
    name: 'Sentinel-1 SAR (Radar)',
    badge: 'Cloud-Penetrating',
    source: 'Copernicus Sentinel-1 C-Band SAR',
    resolution: '20m/pixel (VV + VH Backscatter)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; Copernicus Sentinel-1 SAR / CartoDB',
    description: 'C-band Synthetic Aperture Radar. Penetrates 100% cloud cover & storm rain for flood mapping.'
  },
  {
    id: 'landsat',
    name: 'Landsat 8/9 (Multispectral)',
    badge: '30m Thermal',
    source: 'USGS / NASA Landsat-9 OLI-2',
    resolution: '30m/pixel (Multispectral + Thermal)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; USGS Landsat / Esri',
    description: '30m multispectral + 100m thermal TIRS bands for evapotranspiration & deep burn scars.'
  },
  {
    id: 'clarity',
    name: 'Esri World Imagery Clarity',
    badge: 'High Detail',
    source: 'ArcGIS World Imagery Clarity Archive',
    resolution: '0.5m - 5m/pixel',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, GeoEye',
    description: 'Ultra high-resolution archive imagery focused on spatial clarity and zero cloud cover.'
  },
  {
    id: 'terrain',
    name: 'Terrain Topography (DEM)',
    badge: 'Contour Relief',
    source: 'SRTM 30m DEM / OpenTopoMap',
    resolution: '30m Elevation Grid',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap / SRTM',
    description: 'Topographic contour relief map highlighting elevation slopes and basin drainage.'
  },
  {
    id: 'hybrid',
    name: 'Hybrid (Satellite + Vectors)',
    badge: 'Labels & Boundaries',
    source: 'CartoDB / OpenStreetMap',
    resolution: 'Vector Overlay',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors / CartoDB',
    description: 'Combined high-res satellite backdrop with vector road networks and administrative labels.'
  }
];

// ---- City AOI Targets ----
export interface CityTarget {
  id: string;
  name: string;
  state: string;
  coords: [number, number];
  zoom: number;
  floodRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  cloudCover: number;
  activeDisaster: string;
  polygons: {
    flood?: [number, number][][];
    fire?: [number, number][][];
    cropStress?: [number, number][][];
    healthy?: [number, number][][];
  };
}

export const cityTargets: CityTarget[] = [
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    coords: [21.1458, 79.0882],
    zoom: 11,
    floodRisk: 'High',
    cloudCover: 18,
    activeDisaster: 'Nag River Monsoon Overflow (4.8 km² inundated)',
    polygons: {
      flood: [
        [[21.16, 79.06], [21.17, 79.12], [21.14, 79.13], [21.12, 79.10], [21.13, 79.06]],
        [[21.18, 79.14], [21.20, 79.18], [21.17, 79.19], [21.15, 79.15]]
      ],
      cropStress: [
        [[21.08, 79.02], [21.11, 79.05], [21.09, 79.07], [21.06, 79.04]]
      ],
      healthy: [
        [[21.22, 79.00], [21.25, 79.06], [21.23, 79.08], [21.20, 79.02]]
      ]
    }
  },
  {
    id: 'kamptee',
    name: 'Kamptee',
    state: 'Maharashtra',
    coords: [21.2167, 79.2000],
    zoom: 12,
    floodRisk: 'Critical',
    cloudCover: 78, // High cloud cover forces SAR auto-switch!
    activeDisaster: 'Flash Inundation (2.1 km² submerged • 78% Cloud Cover)',
    polygons: {
      flood: [
        [[21.22, 79.18], [21.24, 79.22], [21.21, 79.23], [21.19, 79.20]]
      ],
      cropStress: [
        [[21.25, 79.15], [21.27, 79.19], [21.24, 79.20], [21.22, 79.16]]
      ]
    }
  },
  {
    id: 'wardha',
    name: 'Wardha',
    state: 'Maharashtra',
    coords: [20.7453, 78.6022],
    zoom: 11,
    floodRisk: 'Medium',
    cloudCover: 12,
    activeDisaster: 'Cotton Field Waterlogging & Stress (12 Hectares)',
    polygons: {
      cropStress: [
        [[20.73, 78.58], [20.76, 78.64], [20.74, 78.66], [20.71, 78.62]]
      ],
      healthy: [
        [[20.78, 78.52], [20.81, 78.57], [20.79, 78.59], [20.76, 78.54]]
      ]
    }
  },
  {
    id: 'chandrapur',
    name: 'Chandrapur',
    state: 'Maharashtra',
    coords: [19.9615, 79.2961],
    zoom: 11,
    floodRisk: 'Low',
    cloudCover: 8,
    activeDisaster: 'Forest Burn Scar (0.6 km² Deciduous Belt)',
    polygons: {
      fire: [
        [[19.97, 79.28], [19.98, 79.32], [19.95, 79.31], [19.96, 79.27]]
      ],
      healthy: [
        [[19.90, 79.20], [19.94, 79.26], [19.92, 79.28], [19.88, 79.22]]
      ]
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai Coast',
    state: 'Maharashtra',
    coords: [19.0760, 72.8777],
    zoom: 11,
    floodRisk: 'High',
    cloudCover: 42,
    activeDisaster: 'High Tide Storm Surge Monitoring',
    polygons: {
      flood: [
        [[19.02, 72.82], [19.06, 72.85], [19.04, 72.87], [19.00, 72.84]]
      ]
    }
  }
];

// ---- Navigation Items ----
export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'analyze', label: 'Analyze Region', icon: 'ScanSearch', path: '/dashboard/analyze' },
  { id: 'alerts', label: 'Disaster Alerts', icon: 'AlertTriangle', path: '/dashboard/alerts' },
  { id: 'crop', label: 'Crop Health', icon: 'Leaf', path: '/dashboard/crop-health' },
  { id: 'timeline', label: 'Timeline', icon: 'Clock', path: '/dashboard/timeline' },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/dashboard/reports' },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/dashboard/settings' },
];

// ---- Features for Landing Page ----
export const features = [
  {
    icon: '🛰️',
    title: 'Satellite Analysis',
    description: 'Process multi-spectral satellite imagery from Sentinel-2 and Landsat to monitor land changes with 10m resolution.',
  },
  {
    icon: '🌊',
    title: 'Disaster Detection',
    description: 'Automatically detect floods, wildfires, and landslides using deep learning models trained on 50,000+ disaster events.',
  },
  {
    icon: '🌾',
    title: 'Crop Monitoring',
    description: 'Track crop health using NDVI, soil moisture, and thermal data. Get early warnings for stress, disease, and drought.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    description: 'Receive actionable, prioritized recommendations powered by our domain-specific language model for disaster response.',
  },
  {
    icon: '⚡',
    title: 'Real-time Alerts',
    description: 'Get instant notifications when anomalies are detected. Configurable thresholds for different event types and regions.',
  },
  {
    icon: '📊',
    title: 'Report Generation',
    description: 'Auto-generate comprehensive PDF reports with maps, satellite imagery, area estimates, and intervention plans.',
  },
];

// ---- How It Works Steps ----
export const howItWorksSteps = [
  {
    step: 1,
    title: 'Select Region',
    description: 'Draw an area of interest on the interactive map or search for a location.',
    icon: '🗺️',
  },
  {
    step: 2,
    title: 'AI Analyzes',
    description: 'Our AI processes multi-temporal satellite imagery to detect changes and anomalies.',
    icon: '🧠',
  },
  {
    step: 3,
    title: 'Detect Changes',
    description: 'View detected disasters, crop stress, and environmental changes on an interactive dashboard.',
    icon: '🔍',
  },
  {
    step: 4,
    title: 'Take Action',
    description: 'Receive AI-powered recommendations and generate professional reports for stakeholders.',
    icon: '🎯',
  },
];

// ---- Stats for Landing Page ----
export const landingStats = [
  { value: '2.4M', label: 'km² Analyzed' },
  { value: '15K+', label: 'Disasters Detected' },
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '< 3s', label: 'Processing Time' },
];
