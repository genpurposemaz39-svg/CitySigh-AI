import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationPath } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { LiveCamerasPage } from './pages/LiveCamerasPage';
import { ANPRPage } from './pages/ANPRPage';
import { VehicleSearchPage } from './pages/VehicleSearchPage';
import { TrajectoryTrackingPage } from './pages/TrajectoryTrackingPage';
import { TrafficAnalyticsPage } from './pages/TrafficAnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { CameraManagementPage } from './pages/CameraManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CameraModal } from './components/cameras/CameraModal';
import { AlertModal } from './components/alerts/AlertModal';
import { useRealtimeTraffic } from './hooks/useRealtimeTraffic';
import { apiService } from './services/apiService';
import {
  Camera,
  Alert,
  Vehicle,
  DashboardStats,
  CameraStatus,
  TrafficAnalyticsData,
  EvidentiaryReport,
} from './types';
import {
  INITIAL_DASHBOARD_STATS,
  INITIAL_CAMERAS,
  INITIAL_ALERTS,
  INITIAL_VEHICLES,
  TRAFFIC_ANALYTICS_DATA,
  EVIDENTIARY_REPORTS,
} from './data/mockData';

export function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<NavigationPath>('dashboard');

  // Core Data State
  const [stats, setStats] = useState<DashboardStats>(INITIAL_DASHBOARD_STATS);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [analytics, setAnalytics] = useState<TrafficAnalyticsData>(TRAFFIC_ANALYTICS_DATA);
  const [reports, setReports] = useState<EvidentiaryReport[]>(EVIDENTIARY_REPORTS);

  // Cross-Navigation & Modal Parameters
  const [activeCameraModal, setActiveCameraModal] = useState<Camera | null>(null);
  const [activeAlertModal, setActiveAlertModal] = useState<Alert | null>(null);
  const [selectedPlateForTrajectory, setSelectedPlateForTrajectory] = useState<string>('GJ05AB1234');
  const [selectedPlateForANPR, setSelectedPlateForANPR] = useState<string>('GJ05AB1234');
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState<string>('');

  // Real-time simulated ticking and increment
  const { currentTime, currentDate } = useRealtimeTraffic(stats);

  // Load initial fresh data
  useEffect(() => {
    async function loadData() {
      const s = await apiService.getDashboardStats();
      const c = await apiService.getCameras();
      const a = await apiService.getAlerts();
      const v = await apiService.getVehicles();
      const rep = await apiService.getReports();
      setStats(s);
      setCameras(c);
      setAlerts(a);
      setVehicles(v);
      setReports(rep);
    }
    loadData();
  }, []);

  // Handlers for cross-page user flows
  const handleSelectCamera = async (cameraId: string) => {
    const cam = await apiService.getCameraById(cameraId);
    if (cam) {
      setActiveCameraModal(cam);
    }
  };

  const handleSelectAlert = async (alertId: string) => {
    const alt = await apiService.getAlertById(alertId);
    if (alt) {
      setActiveAlertModal(alt);
    }
  };

  const handleTrackVehicle = (plate: string) => {
    setSelectedPlateForTrajectory(plate);
    setCurrentPath('trajectory-tracking');
  };

  const handleInspectANPR = (plate: string) => {
    setSelectedPlateForANPR(plate);
    setCurrentPath('anpr-ocr');
  };

  const handleSearchSelectVehicle = (plate: string) => {
    setVehicleSearchQuery(plate);
    setCurrentPath('vehicle-search');
  };

  const handleStatusChange = async (cameraId: string, newStatus: CameraStatus) => {
    const updated = await apiService.updateCameraStatus(cameraId, newStatus);
    if (updated) {
      setCameras(prev => prev.map(c => (c.id === cameraId ? updated : c)));
      if (activeCameraModal && activeCameraModal.id === cameraId) {
        setActiveCameraModal(updated);
      }
      const newStats = await apiService.getDashboardStats();
      setStats(newStats);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    const updated = await apiService.resolveAlert(alertId);
    if (updated) {
      setAlerts(prev => prev.map(a => (a.id === alertId ? updated : a)));
      if (activeAlertModal && activeAlertModal.id === alertId) {
        setActiveAlertModal(updated);
      }
      const newStats = await apiService.getDashboardStats();
      setStats(newStats);
    }
  };

  const handleResetDemo = async () => {
    await apiService.resetDemoData();
    setStats({ ...INITIAL_DASHBOARD_STATS });
    setCameras([...INITIAL_CAMERAS]);
    setAlerts([...INITIAL_ALERTS]);
    setVehicles([...INITIAL_VEHICLES]);
    setReports([...EVIDENTIARY_REPORTS]);
  };

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-white">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        activeAlertCount={activeAlertsCount}
      />

      {/* Main Content Area (offset by sidebar width: 16rem / 64) */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Top Header */}
        <Header
          onNavigate={setCurrentPath}
          onSearchSelectVehicle={handleSearchSelectVehicle}
          onSearchSelectCamera={handleSelectCamera}
          currentTime={currentTime}
          currentDate={currentDate}
          onResetDemo={handleResetDemo}
        />

        {/* Demo Quick Navigation Chips Banner */}
        <div className="px-8 pt-4 pb-1 flex items-center justify-between gap-2 overflow-x-auto text-xs bg-surface-container-lowest/70 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-caption-caps text-[0.625rem] text-slate-500 font-bold uppercase tracking-wider">
              Quick Scenarios:
            </span>
            <button
              onClick={() => handleTrackVehicle('GJ05AB1234')}
              className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[0.6875rem] transition-colors"
            >
              Track White Creta (GJ05AB1234)
            </button>
            <button
              onClick={() => handleSelectAlert('alt-01')}
              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[0.6875rem] transition-colors border border-rose-200"
            >
              BOLO Blacklisted (DL8CAF7321)
            </button>
            <button
              onClick={() => handleInspectANPR('GJ05AB1234')}
              className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-[0.6875rem] transition-colors"
            >
              Inspect ANPR OCR Fusion
            </button>
            <button
              onClick={() => setCurrentPath('traffic-analytics')}
              className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-[0.6875rem] transition-colors"
            >
              Origin-Destination Flow Matrix
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[0.6875rem] text-slate-400 font-mono">
            <span>EDGE WAN: 38/42 NODES ONLINE</span>
          </div>
        </div>

        {/* Page Routing Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {currentPath === 'dashboard' && (
            <DashboardPage
              stats={stats}
              cameras={cameras}
              alerts={alerts}
              onNavigate={setCurrentPath}
              onSelectCamera={handleSelectCamera}
              onSelectAlert={handleSelectAlert}
              onTrackVehicle={handleTrackVehicle}
              onInspectANPR={handleInspectANPR}
            />
          )}

          {currentPath === 'live-cameras' && (
            <LiveCamerasPage
              cameras={cameras}
              onSelectCamera={handleSelectCamera}
              onTrackVehicle={handleTrackVehicle}
              onInspectANPR={handleInspectANPR}
              onStatusChange={handleStatusChange}
            />
          )}

          {currentPath === 'anpr-ocr' && (
            <ANPRPage
              initialPlate={selectedPlateForANPR}
              onTrackVehicle={handleTrackVehicle}
              onViewVehicleSearch={handleSearchSelectVehicle}
            />
          )}

          {currentPath === 'vehicle-search' && (
            <VehicleSearchPage
              vehicles={vehicles}
              initialSearch={vehicleSearchQuery}
              onTrackVehicle={handleTrackVehicle}
              onInspectANPR={handleInspectANPR}
            />
          )}

          {currentPath === 'trajectory-tracking' && (
            <TrajectoryTrackingPage
              plateNumber={selectedPlateForTrajectory}
              onSelectCamera={handleSelectCamera}
              onInspectANPR={handleInspectANPR}
            />
          )}

          {currentPath === 'traffic-analytics' && (
            <TrafficAnalyticsPage
              analytics={analytics}
            />
          )}

          {currentPath === 'alerts-intelligence' && (
            <AlertsPage
              alerts={alerts}
              onSelectAlert={handleSelectAlert}
              onResolveAlert={handleResolveAlert}
              onTrackVehicle={handleTrackVehicle}
              onInspectANPR={handleInspectANPR}
            />
          )}

          {currentPath === 'camera-management' && (
            <CameraManagementPage
              cameras={cameras}
              onSelectCamera={handleSelectCamera}
              onStatusChange={handleStatusChange}
            />
          )}

          {currentPath === 'reports' && (
            <ReportsPage
              reports={reports}
            />
          )}

          {currentPath === 'settings' && (
            <SettingsPage
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {activeCameraModal && (
        <CameraModal
          camera={activeCameraModal}
          onClose={() => setActiveCameraModal(null)}
          onStatusChange={handleStatusChange}
          onTrackVehicle={handleTrackVehicle}
          onInspectANPR={handleInspectANPR}
        />
      )}

      {activeAlertModal && (
        <AlertModal
          alert={activeAlertModal}
          onClose={() => setActiveAlertModal(null)}
          onResolve={handleResolveAlert}
          onTrackVehicle={handleTrackVehicle}
          onInspectANPR={handleInspectANPR}
        />
      )}
    </div>
  );
}

export default App;
