import { useState, useEffect } from 'react';
import { DashboardStats, Camera } from '../types';

export function useRealtimeTraffic(initialStats?: DashboardStats) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats || null);
  const [currentTime, setCurrentTime] = useState<string>('14:32:00 IST');
  const [currentDate, setCurrentDate] = useState<string>('12 Sep 2026');
  const [latestEvent, setLatestEvent] = useState<{
    id: string;
    text: string;
    plate: string;
    time: string;
    camera: string;
  } | null>(null);

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} IST`);
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Update simulated vehicle counter smoothly every 4 seconds
  useEffect(() => {
    const trafficInterval = setInterval(() => {
      setStats(prev => {
        if (!prev) return null;
        // Natural small jitter in detected vehicles (+1 to +3)
        const increment = Math.floor(Math.random() * 3) + 1;
        return {
          ...prev,
          totalVehiclesDetected: prev.totalVehiclesDetected + increment,
        };
      });
    }, 4000);

    return () => clearInterval(trafficInterval);
  }, []);

  return {
    stats,
    setStats,
    currentTime,
    currentDate,
    latestEvent,
  };
}
