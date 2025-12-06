import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { performanceMonitor, checkDeviceCapabilities, isLowEndDevice } from '@/lib/performanceMonitor';

/**
 * Development component for testing animation performance
 * Only include in development builds
 */
export function PerformanceDebugger() {
  const [fps, setFps] = useState(60);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof checkDeviceCapabilities> | null>(null);

  useEffect(() => {
    setDeviceInfo(checkDeviceCapabilities());
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    performanceMonitor.start();

    const interval = setInterval(() => {
      setFps(performanceMonitor.getCurrentFPS());
    }, 100);

    return () => {
      clearInterval(interval);
      performanceMonitor.stop();
    };
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    const metrics = performanceMonitor.stop();
    console.log('Final metrics:', metrics);
  };

  useEffect(() => {
    if (isMonitoring) {
      return startMonitoring();
    }
  }, [isMonitoring]);

  const getFpsColor = () => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFpsStatus = () => {
    if (fps >= 55) return '✅ Optimal';
    if (fps >= 30) return '⚠️ Acceptable';
    return '❌ Poor';
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 max-w-sm"
    >
      <h3 className="text-sm font-semibold mb-2">Performance Monitor</h3>
      
      {isMonitoring && (
        <div className="mb-3">
          <div className={`text-2xl font-bold ${getFpsColor()}`}>
            {fps} FPS
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {getFpsStatus()}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsMonitoring(!isMonitoring)}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors mb-2"
      >
        {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
      </button>

      {deviceInfo && (
        <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
          <div className="font-semibold mb-1">Device Info:</div>
          <div>CPU Cores: {deviceInfo.hardwareConcurrency}</div>
          {deviceInfo.deviceMemory && (
            <div>Memory: {deviceInfo.deviceMemory}GB</div>
          )}
          <div>Transform: {deviceInfo.supportsTransform ? '✅' : '❌'}</div>
          <div>Will-Change: {deviceInfo.supportsWillChange ? '✅' : '❌'}</div>
          <div>Intersection Observer: {deviceInfo.supportsIntersectionObserver ? '✅' : '❌'}</div>
          <div className="mt-2 font-semibold">
            Device Type: {isLowEndDevice() ? '📱 Low-End' : '🚀 High-End'}
          </div>
        </div>
      )}
    </motion.div>
  );
}
