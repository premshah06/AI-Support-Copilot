/**
 * Performance monitoring utilities for animations
 * Helps verify 60fps performance and detect issues
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  totalFrames: number;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private droppedFrames = 0;
  private isMonitoring = false;
  private animationFrameId: number | null = null;

  /**
   * Start monitoring frame rate
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.droppedFrames = 0;
    this.lastTime = performance.now();
    this.measureFrameRate();
  }

  /**
   * Stop monitoring and return metrics
   */
  stop(): PerformanceMetrics {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    return {
      fps: Math.round(this.fps),
      frameTime: 1000 / this.fps,
      droppedFrames: this.droppedFrames,
      totalFrames: this.frameCount,
    };
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return Math.round(this.fps);
  }

  /**
   * Check if performance is acceptable (>30fps)
   */
  isPerformanceAcceptable(): boolean {
    return this.fps >= 30;
  }

  /**
   * Check if performance is optimal (>55fps)
   */
  isPerformanceOptimal(): boolean {
    return this.fps >= 55;
  }

  private measureFrameRate = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    // Calculate FPS
    this.frameCount++;
    const currentFPS = 1000 / delta;
    
    // Smooth FPS calculation using exponential moving average
    this.fps = this.fps * 0.9 + currentFPS * 0.1;

    // Detect dropped frames (frame took longer than 16.67ms)
    if (delta > 16.67) {
      this.droppedFrames++;
    }

    this.lastTime = currentTime;
    this.animationFrameId = requestAnimationFrame(this.measureFrameRate);
  };
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook to monitor animation performance
 * Usage: const metrics = useAnimationPerformance(isAnimating);
 */
export function measureAnimationPerformance(
  callback: () => void,
  duration: number = 1000
): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    performanceMonitor.start();
    callback();

    setTimeout(() => {
      const metrics = performanceMonitor.stop();
      resolve(metrics);
    }, duration);
  });
}

/**
 * Log performance metrics to console
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  console.group('🎯 Animation Performance Metrics');
  console.log(`FPS: ${metrics.fps}`);
  console.log(`Frame Time: ${metrics.frameTime.toFixed(2)}ms`);
  console.log(`Dropped Frames: ${metrics.droppedFrames} / ${metrics.totalFrames}`);
  console.log(`Performance: ${metrics.fps >= 55 ? '✅ Optimal' : metrics.fps >= 30 ? '⚠️ Acceptable' : '❌ Poor'}`);
  console.groupEnd();
}

/**
 * Check if device supports smooth animations
 */
export function checkDeviceCapabilities(): {
  supportsTransform: boolean;
  supportsWillChange: boolean;
  supportsIntersectionObserver: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
} {
  const testElement = document.createElement('div');
  
  return {
    supportsTransform: 'transform' in testElement.style,
    supportsWillChange: 'willChange' in testElement.style,
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: (navigator as any).deviceMemory,
  };
}

/**
 * Detect if device is low-end and should use simplified animations
 */
export function isLowEndDevice(): boolean {
  const capabilities = checkDeviceCapabilities();
  
  // Consider low-end if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM (if available)
  // - Doesn't support modern features
  return (
    capabilities.hardwareConcurrency < 4 ||
    (capabilities.deviceMemory !== undefined && capabilities.deviceMemory < 4) ||
    !capabilities.supportsWillChange
  );
}

/**
 * Get recommended animation settings based on device
 */
export function getRecommendedAnimationSettings(): {
  enableComplexAnimations: boolean;
  enableStagger: boolean;
  maxStaggerDelay: number;
  transitionDuration: number;
} {
  const isLowEnd = isLowEndDevice();
  
  return {
    enableComplexAnimations: !isLowEnd,
    enableStagger: !isLowEnd,
    maxStaggerDelay: isLowEnd ? 0 : 50,
    transitionDuration: isLowEnd ? 150 : 200,
  };
}
