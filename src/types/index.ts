export type CameraStatus = 'live' | 'offline' | 'maintenance';
export type TrafficLevel = 'FREE' | 'MOD' | 'HEAVY' | 'CONG';
export type VehicleRiskStatus = 'normal' | 'watchlist' | 'blacklisted' | 'anomaly';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'investigating' | 'resolved';

export interface Camera {
  id: string; // e.g. "CAM-01"
  name: string; // e.g. "Expressway North"
  location: string; // e.g. "Sector 14 Arterial"
  corridor: string; // e.g. "M.G. Road Corridor"
  latitude: number;
  longitude: number;
  status: CameraStatus;
  fps: number;
  vehicleCount: number;
  vehiclesPerMin: number;
  trafficLevel: TrafficLevel;
  streamUrl: string;
  lastActive: string;
  resolution: string;
  ipAddress: string;
  model: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string; // e.g. "GJ05AB1234"
  vehicleType: 'Sedan' | 'SUV' | 'Hatchback' | 'Truck' | 'Bus' | 'Motorcycle';
  makeModel: string;
  color: string;
  firstSeen: string;
  lastSeen: string;
  totalSightings: number;
  camerasVisited: number;
  averageSpeed: number;
  riskStatus: VehicleRiskStatus;
  confidence: number;
  flagReason?: string;
  registeredOwnerState?: string;
}

export interface Sighting {
  id: string;
  vehiclePlate: string;
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  confidence: number;
  speed: number;
  lane: number;
  status: 'Verified' | 'Flagged' | 'Review';
  snapshotUrl: string;
  plateCropUrl: string;
}

export interface TrajectoryCheckpoint {
  checkpointId: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  speed: number;
  confidence: number;
  coordinateX: number; // For SVG GIS Canvas
  coordinateY: number;
  latitude: number;
  longitude: number;
  heading: string;
  status: string;
  snapshotUrl: string;
}

export interface TrajectoryData {
  plateNumber: string;
  vehicleType: string;
  color: string;
  totalDistanceKm: number;
  durationMin: number;
  avgSpeedKmh: number;
  startLocation: string;
  endLocation: string;
  confidenceOverall: number;
  cameraMatchingConf: number;
  temporalConsistencyConf: number;
  checkpoints: TrajectoryCheckpoint[];
  currentStatus: 'In Transit' | 'Exited Corridor' | 'Stationary';
  nextPredictedHandoff?: {
    predictedCameraId: string;
    predictedCameraName: string;
    estimatedArrival: string;
    probability: number;
  };
}

export interface OCRFrame {
  frameNumber: number;
  timestampOffset: string;
  confidence: number;
  plateCandidate: string;
  characterConfidences: number[];
  sharpnessScore: number;
}

export interface ANPRResult {
  id: string;
  plateNumber: string;
  ocrConfidence: number;
  plateQuality: 'High' | 'Good' | 'Fair' | 'Poor';
  recognitionStatus: 'Verified' | 'Pending Review' | 'Flagged';
  vehicleType: string;
  cctvSnapshotUrl: string;
  plateRegionUrl: string;
  vehicleBoundingBox: { x: number; y: number; width: number; height: number };
  plateBoundingBox: { x: number; y: number; width: number; height: number };
  cameraName: string;
  cameraId: string;
  timestamp: string;
  frames: OCRFrame[];
  conditions: {
    name: string;
    passed: boolean;
    metric: string;
    description: string;
  }[];
  processingSteps: {
    name: string;
    status: 'completed' | 'processing' | 'pending';
    latencyMs: number;
  }[];
}

export interface Alert {
  id: string;
  type: 'Blacklisted Vehicle' | 'Suspicious Route Anomaly' | 'Overspeeding' | 'Unusual Stop Duration' | 'Low Confidence OCR';
  vehicleNumber: string;
  cameraId: string;
  cameraName: string;
  location: string;
  timestamp: string;
  confidence: number;
  status: AlertStatus;
  severity: AlertSeverity;
  details: string;
  snapshotUrl: string;
  speed?: number;
  speedLimit?: number;
  assignedOfficer?: string;
  dispatchActionTaken?: string;
}

export interface TrafficSector {
  id: string;
  name: string;
  corridor: string;
  status: TrafficLevel;
  percentage: number;
  flowPerHour: number;
  avgSpeed: number;
}

export interface OriginDestinationFlow {
  origin: string;
  destination: string;
  count: number;
  corridor: string;
  changePercent: number;
  peakHour: string;
}

export interface TrafficAnalyticsData {
  peakHourlyFlow: number;
  averageCitySpeed: number;
  totalActiveSignals: number;
  sectors: TrafficSector[];
  hourlyFlow: { hour: string; vehicles: number; speed: number }[];
  odFlows: OriginDestinationFlow[];
  modalSplit: { type: string; count: number; percentage: number; color: string }[];
  congestionChokepoints: {
    name: string;
    corridor: string;
    queueLengthMeters: number;
    delaySeconds: number;
    adaptiveSignalState: string;
    status: 'Severe' | 'Moderate' | 'Free';
  }[];
}

export interface DashboardStats {
  totalVehiclesDetected: number;
  activeTrajectories: number;
  activeAlerts: number;
  averageTrafficSpeed: number;
  onlineCameras: number;
  totalCameras: number;
  detectionAccuracyPct: number;
}

export interface EvidentiaryReport {
  id: string;
  title: string;
  category: 'Traffic' | 'ANPR' | 'Trajectory' | 'Congestion' | 'Security' | 'Hardware';
  description: string;
  generatedDate: string;
  period: string;
  recordCount: number;
  format: 'CSV' | 'PDF' | 'JSON';
  fileSizeBytes: string;
  status: 'Ready' | 'Generating';
}
