'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ScreenPreview } from '@/components';
import { useScreenShare } from '@/hooks';

export default function ScreenTestPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const hasRequestedRef = useRef(false);
  
  const {
    status,
    stream,
    metadata,
    error,
    startScreenShare,
    stopScreenShare,
  } = useScreenShare();

  // Auto-request screen share permission on page load
  useEffect(() => {
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      startScreenShare();
    }
  }, [startScreenShare]);

  // Mouse reactive background effect (same as landing page)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rawX = (e.clientX / window.innerWidth) * 100;
      const rawY = (e.clientY / window.innerHeight) * 100;
      
      const CENTER = 50;
      const ZONE_RADIUS = 25;
      const MIN_BOUND = CENTER - ZONE_RADIUS;
      const MAX_BOUND = CENTER + ZONE_RADIUS;
      
      const constrainToCenter = (value: number): number => {
        if (value >= MIN_BOUND && value <= MAX_BOUND) {
          const normalized = (value - MIN_BOUND) / (MAX_BOUND - MIN_BOUND);
          return 35 + (normalized * 30);
        } else if (value < MIN_BOUND) {
          const distanceFromZone = MIN_BOUND - value;
          const pullStrength = Math.min(distanceFromZone / MIN_BOUND, 1);
          return 35 + (pullStrength * 15);
        } else {
          const distanceFromZone = value - MAX_BOUND;
          const pullStrength = Math.min(distanceFromZone / (100 - MAX_BOUND), 1);
          return 65 - (pullStrength * 15);
        }
      };
      
      const constrainedX = constrainToCenter(rawX);
      const constrainedY = constrainToCenter(rawY);
      
      const distanceFromCenterX = Math.abs(rawX - CENTER);
      const distanceFromCenterY = Math.abs(rawY - CENTER);
      const maxDistance = Math.sqrt(50 * 50 + 50 * 50);
      const currentDistance = Math.sqrt(distanceFromCenterX ** 2 + distanceFromCenterY ** 2);
      const intensity = Math.max(0.3, 1 - (currentDistance / maxDistance));
      
      heroRef.current.style.setProperty('--mouse-x', `${constrainedX}%`);
      heroRef.current.style.setProperty('--mouse-y', `${constrainedY}%`);
      heroRef.current.style.setProperty('--glow-intensity', `${intensity}`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStopShare = () => {
    stopScreenShare();
  };

  const handleRetry = async () => {
    await startScreenShare();
  };

  const handleBackHome = () => {
    stopScreenShare();
    router.push('/');
  };

  // Get status display info
  const getStatusInfo = () => {
    switch (status) {
      case 'requesting':
        return {
          icon: '⏳',
          title: 'Requesting Permission',
          description: 'Please select a screen, window, or tab to share...',
          color: 'blue'
        };
      case 'active':
        return {
          icon: '🟢',
          title: 'Screen Sharing Active',
          description: 'Your screen is being shared. Click stop when done.',
          color: 'green'
        };
      case 'stopped':
        return {
          icon: '⏹️',
          title: 'Screen Sharing Stopped',
          description: 'Click "Try Again" to share your screen again.',
          color: 'gray'
        };
      case 'cancelled':
        return {
          icon: '⚠️',
          title: 'Screen Share Cancelled',
          description: error?.message || 'You cancelled the screen picker.',
          color: 'yellow'
        };
      case 'denied':
        return {
          icon: '🚫',
          title: 'Permission Denied',
          description: error?.message || 'Screen sharing permission was denied.',
          color: 'red'
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Unexpected Error',
          description: error?.message || 'An unknown error occurred.',
          errorType: error?.type || 'unknown',
          color: 'red'
        };
      default:
        return {
          icon: '📺',
          title: 'Screen Test',
          description: 'Starting screen share...',
          color: 'blue'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isSharing = status === 'active';
  const showRetryOptions = ['stopped', 'cancelled', 'denied', 'error'].includes(status);

  return (
    <div ref={heroRef} className="bg-hero test-page-container" style={{ minHeight: '100vh' }}>
      {/* Fixed Bottom Centered Spinner - Compact and interactive */}
      {status === 'requesting' && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
          background: 'rgba(59, 130, 246, 0.15)',
          border: '2px solid var(--accent-blue)',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
          animation: 'pulse-glow 2s ease-in-out infinite'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '4px solid rgba(59, 130, 246, 0.3)',
            borderTopColor: 'var(--accent-blue)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      )}

      {/* Main Content */}
      <div className="hero-container" style={{ paddingTop: 'var(--space-16)' }}>
        {/* Status Display - only show for stopped, denied, error states */}
        {['stopped', 'denied', 'error'].includes(status) && (
          <div className="feature-card status-card" style={{ 
            maxWidth: '500px', 
            margin: '0 auto var(--space-6)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: 'var(--space-3)',
              filter: statusInfo.color === 'green' ? 'drop-shadow(0 0 10px var(--accent-green))' : 'none'
            }}>
              {statusInfo.icon}
            </div>
            <h2 className="status-card-title" style={{
              fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            {statusInfo.title}
          </h2>
          <p className="status-card-message" style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)'
          }}>
            {statusInfo.description}
          </p>
        </div>
        )}

        {/* Screen Preview (only when active) */}
        {isSharing && (
          <div className="preview-container" style={{ maxWidth: '900px', margin: '0 auto var(--space-6)', position: 'relative' }}>
            {/* Floating Live Badge on Preview */}
            <div className="live-badge" style={{
              position: 'absolute',
              top: 'var(--space-3)',
              left: 'var(--space-3)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: 'var(--accent-green)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--accent-green)',
                animation: 'pulse-dot-enhanced 2s ease-in-out infinite'
              }} />
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--accent-green)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Live</span>
            </div>
            <ScreenPreview stream={stream} metadata={metadata} />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: 'var(--space-3)'
        }}>
          {/* Active State - Show Stop button */}
          {isSharing && (
            <button onClick={handleStopShare} className="btn-danger">
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Screen Share
            </button>
          )}

          {/* Retry/Error State - Show retry options */}
          {showRetryOptions && (
            <div className="action-buttons-group" style={{ display: 'flex', flexDirection: 'row', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={handleRetry} className="btn-primary">
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Screen Test
              </button>
              <button onClick={handleBackHome} className="btn-secondary">
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
