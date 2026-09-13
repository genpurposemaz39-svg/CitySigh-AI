import {
  Camera,
  Vehicle,
  Sighting,
  Alert,
  TrajectoryData,
  ANPRResult,
  TrafficAnalyticsData,
  DashboardStats,
  EvidentiaryReport,
  CameraStatus,
} from '../types';
import {
  INITIAL_DASHBOARD_STATS,
  INITIAL_CAMERAS,
  INITIAL_VEHICLES,
  SIGHTINGS_DATA,
  TRAJECTORY_DATA_SAMPLE,
  ANPR_RESULT_SAMPLE,
  INITIAL_ALERTS,
  TRAFFIC_ANALYTICS_DATA,
  EVIDENTIARY_REPORTS,
  CCTV_IMAGES,
} from '../data/mockData';

// In-memory state holding mutable data for the prototype session
let currentStats: DashboardStats = { ...INITIAL_DASHBOARD_STATS };
let currentCameras: Camera[] = [...INITIAL_CAMERAS];
let currentVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let currentAlerts: Alert[] = [...INITIAL_ALERTS];
let currentReports: EvidentiaryReport[] = [...EVIDENTIARY_REPORTS];

export const apiService = {
  // Reset demo state back to default
  resetDemoData: async (): Promise<void> => {
    currentStats = { ...INITIAL_DASHBOARD_STATS };
    currentCameras = [...INITIAL_CAMERAS];
    currentVehicles = [...INITIAL_VEHICLES];
    currentAlerts = [...INITIAL_ALERTS];
    currentReports = [...EVIDENTIARY_REPORTS];
  },

  // 1. Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const activeAlertsCount = currentAlerts.filter(a => a.status === 'active').length;
    const onlineCamerasCount = currentCameras.filter(c => c.status === 'live').length;
    return {
      ...currentStats,
      activeAlerts: activeAlertsCount,
      onlineCameras: onlineCamerasCount,
      totalCameras: currentCameras.length,
    };
  },

  // 2. Cameras
  getCameras: async (): Promise<Camera[]> => {
    return [...currentCameras];
  },

  getCameraById: async (id: string): Promise<Camera | null> => {
    const found = currentCameras.find(c => c.id.toLowerCase() === id.toLowerCase());
    return found ? { ...found } : null;
  },

  updateCameraStatus: async (id: string, status: CameraStatus): Promise<Camera | null> => {
    const idx = currentCameras.findIndex(c => c.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      currentCameras[idx] = {
        ...currentCameras[idx],
        status,
        fps: status === 'live' ? 25.0 : 0.0,
      };
      return { ...currentCameras[idx] };
    }
    return null;
  },

  updateCamera: async (id: string, updates: Partial<Camera>): Promise<Camera | null> => {
    const idx = currentCameras.findIndex(c => c.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      currentCameras[idx] = {
        ...currentCameras[idx],
        ...updates,
      };
      return { ...currentCameras[idx] };
    }
    return null;
  },

  // 3. Vehicles
  getVehicles: async (query?: string): Promise<Vehicle[]> => {
    if (!query) return [...currentVehicles];
    const q = query.trim().toUpperCase();
    return currentVehicles.filter(
      v =>
        v.plateNumber.toUpperCase().includes(q) ||
        v.makeModel.toUpperCase().includes(q) ||
        v.registeredOwnerState?.toUpperCase().includes(q)
    );
  },

  getVehicleByPlate: async (plate: string): Promise<Vehicle | null> => {
    const clean = plate.trim().toUpperCase();
    const found = currentVehicles.find(v => v.plateNumber.toUpperCase() === clean);
    if (found) return { ...found };

    // Fallback dynamic object if user searches a valid-looking plate format
    if (/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/.test(clean.replace(/\s+/g, ''))) {
      const generated: Vehicle = {
        id: `veh-${clean}`,
        plateNumber: clean,
        vehicleType: 'Sedan',
        makeModel: 'Standard Passenger Vehicle',
        color: 'Silver Grey',
        firstSeen: '13:00:00 IST',
        lastSeen: '14:30:00 IST',
        totalSightings: 2,
        camerasVisited: 2,
        averageSpeed: 52.0,
        riskStatus: 'normal',
        confidence: 94.5,
      };
      return generated;
    }
    return null;
  },

  getVehicleSightings: async (plate: string): Promise<Sighting[]> => {
    const clean = plate.trim().toUpperCase().replace(/\s+/g, '');
    for (const key of Object.keys(SIGHTINGS_DATA)) {
      if (key.replace(/\s+/g, '') === clean) {
        return [...SIGHTINGS_DATA[key]];
      }
    }
    // Return default trajectory sightings
    return [...SIGHTINGS_DATA['GJ05AB1234']];
  },

  // 4. Trajectory Tracking
  getTrajectory: async (plate: string): Promise<TrajectoryData> => {
    const clean = plate.trim().toUpperCase();
    if (clean.includes('DL8C') || clean.includes('DL8CAF7321')) {
      return {
        ...TRAJECTORY_DATA_SAMPLE,
        plateNumber: 'DL8CAF7321',
        vehicleType: 'SUV • Toyota Fortuner (Black)',
        color: 'Attitude Black',
        totalDistanceKm: 18.2,
        durationMin: 26,
        avgSpeedKmh: 74.2,
        startLocation: 'Cam 01 • Expressway North',
        endLocation: 'Cam 03 • Ring Road Flyover Ramp',
        currentStatus: 'In Transit',
        confidenceOverall: 97.4,
        cameraMatchingConf: 98.2,
        temporalConsistencyConf: 96.5,
      };
    }
    return {
      ...TRAJECTORY_DATA_SAMPLE,
      plateNumber: clean || 'GJ05AB1234',
    };
  },

  // 5. ANPR & OCR
  getANPRResult: async (plate?: string): Promise<ANPRResult> => {
    const clean = plate ? plate.trim().toUpperCase() : 'GJ05AB1234';
    if (clean === 'DL8CAF7321') {
      return {
        ...ANPR_RESULT_SAMPLE,
        id: 'anpr-dl8',
        plateNumber: 'DL8CAF7321',
        ocrConfidence: 97.4,
        plateQuality: 'Good',
        recognitionStatus: 'Flagged',
        vehicleType: 'Large SUV (Toyota Fortuner Black)',
        cameraName: 'Cam 03 • Ring Road Flyover Ramp',
        cameraId: 'CAM-03',
        frames: ANPR_RESULT_SAMPLE.frames.map(f => ({
          ...f,
          plateCandidate: 'DL8CAF7321',
        })),
      };
    }
    return { ...ANPR_RESULT_SAMPLE };
  },

  // 6. Traffic Analytics
  getTrafficAnalytics: async (): Promise<TrafficAnalyticsData> => {
    return { ...TRAFFIC_ANALYTICS_DATA };
  },

  // 7. Alerts
  getAlerts: async (category?: string): Promise<Alert[]> => {
    if (!category || category === 'All') return [...currentAlerts];

    const cat = category.toLowerCase();
    return currentAlerts.filter(a => {
      if (cat === 'blacklisted') return a.type.toLowerCase().includes('blacklisted');
      if (cat === 'anomalies') return a.type.toLowerCase().includes('anomaly');
      if (cat === 'overspeeding') return a.type.toLowerCase().includes('overspeeding');
      if (cat === 'unusual stop') return a.type.toLowerCase().includes('stop');
      if (cat === 'low confidence ocr') return a.type.toLowerCase().includes('low confidence');
      return true;
    });
  },

  getAlertById: async (id: string): Promise<Alert | null> => {
    const found = currentAlerts.find(a => a.id.toLowerCase() === id.toLowerCase());
    return found ? { ...found } : null;
  },

  resolveAlert: async (id: string): Promise<Alert | null> => {
    const idx = currentAlerts.findIndex(a => a.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      currentAlerts[idx] = {
        ...currentAlerts[idx],
        status: 'resolved',
        dispatchActionTaken: 'Marked as resolved by Command Center Lead',
      };
      currentStats = {
        ...currentStats,
        activeAlerts: Math.max(0, currentAlerts.filter(a => a.status === 'active').length),
      };
      return { ...currentAlerts[idx] };
    }
    return null;
  },

  // 8. Reports
  getReports: async (): Promise<EvidentiaryReport[]> => {
    return [...currentReports];
  },

  generateReport: async (id: string): Promise<EvidentiaryReport | null> => {
    const report = currentReports.find(r => r.id === id);
    if (report) {
      return {
        ...report,
        generatedDate: new Date().toLocaleTimeString('en-IN') + ' IST (Generated Just Now)',
      };
    }
    return null;
  },

  exportCsvData: (reportTitle: string): string => {
    const timestamp = new Date().toISOString();
    const rows = [
      ['CitySight AI - Enterprise Traffic Intelligence Evidentiary Export'],
      ['Report Type', reportTitle],
      ['Generated At', timestamp],
      ['Source System', 'CitySight Edge ANPR Grid v2.4 (SIH 2026 Build)'],
      [],
      ['Timestamp', 'Camera ID', 'Camera Name', 'Vehicle Plate', 'Velocity (km/h)', 'OCR Conf (%)', 'Risk Flag', 'Corridor'],
      ['14:28:12 IST', 'CAM-03', 'Ring Road Flyover Ramp', 'GJ05AB1234', '61.2', '96.1', 'Normal', 'Ring Road Flyover'],
      ['14:34:45 IST', 'CAM-07', 'Railway Station Plaza', 'GJ05AB1234', '54.8', '95.4', 'Normal', 'Central Transit Spine'],
      ['14:21:40 IST', 'CAM-03', 'Ring Road Flyover Ramp', 'DL8CAF7321', '72.1', '97.4', 'Blacklisted', 'Ring Road Flyover'],
      ['14:08:19 IST', 'CAM-02', 'Central Square Junction', 'UP32AB5678', '94.5', '92.1', 'Overspeeding', 'Airport Expressway (North)'],
      ['13:52:11 IST', 'CAM-04', 'Tech Corridor Boulevard', 'RJ14CD3067', '0.0', '87.6', 'Unusual Stop', 'Tech Corridor South'],
      ['13:31:45 IST', 'CAM-12', 'Central Square Arterial', 'GJ05EF9012', '38.0', '68.3', 'Low OCR Conf', 'M.G. Road Corridor'],
    ];
    return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  },
};
