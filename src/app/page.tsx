'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ========================================
    // CENTER-FOCUSED MOUSE REACTIVE BACKGROUND
    // ========================================
    // The glow effect is constrained to a central zone.
    // Cursor influence is interpolated toward center when outside bounds.
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      // Raw cursor position as percentage (0-100)
      const rawX = (e.clientX / window.innerWidth) * 100;
      const rawY = (e.clientY / window.innerHeight) * 100;
      
      // Define the interaction zone (center 50% of screen)
      // Values outside this zone will be interpolated back toward center
      const CENTER = 50;
      const ZONE_RADIUS = 25; // 25% from center = 50% total zone (25-75%)
      const MIN_BOUND = CENTER - ZONE_RADIUS; // 25%
      const MAX_BOUND = CENTER + ZONE_RADIUS; // 75%
      
      // Clamp and interpolate function
      // When cursor is outside the zone, smoothly pull the effect toward center
      const constrainToCenter = (value: number): number => {
        if (value >= MIN_BOUND && value <= MAX_BOUND) {
          // Inside the zone - allow full movement but scaled to feel natural
          // Map 25-75 range to 35-65 range for subtle movement
          const normalized = (value - MIN_BOUND) / (MAX_BOUND - MIN_BOUND); // 0-1
          return 35 + (normalized * 30); // Output: 35-65%
        } else if (value < MIN_BOUND) {
          // Left/Top edge - interpolate toward minimum allowed position
          // The further out, the stronger the pull back to center
          const distanceFromZone = MIN_BOUND - value;
          const pullStrength = Math.min(distanceFromZone / MIN_BOUND, 1);
          return 35 + (pullStrength * 15); // Stays between 35-50%
        } else {
          // Right/Bottom edge - interpolate toward maximum allowed position
          const distanceFromZone = value - MAX_BOUND;
          const pullStrength = Math.min(distanceFromZone / (100 - MAX_BOUND), 1);
          return 65 - (pullStrength * 15); // Stays between 50-65%
        }
      };
      
      // Apply constraints to both axes
      const constrainedX = constrainToCenter(rawX);
      const constrainedY = constrainToCenter(rawY);
      
      // Calculate intensity based on distance from center
      // Glow is strongest at center, weakest at edges
      const distanceFromCenterX = Math.abs(rawX - CENTER);
      const distanceFromCenterY = Math.abs(rawY - CENTER);
      const maxDistance = Math.sqrt(50 * 50 + 50 * 50); // Max possible distance
      const currentDistance = Math.sqrt(distanceFromCenterX ** 2 + distanceFromCenterY ** 2);
      const intensity = Math.max(0.3, 1 - (currentDistance / maxDistance)); // 0.3-1.0 range
      
      // Update CSS variables
      heroRef.current.style.setProperty('--mouse-x', `${constrainedX}%`);
      heroRef.current.style.setProperty('--mouse-y', `${constrainedY}%`);
      heroRef.current.style.setProperty('--glow-intensity', `${intensity}`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartTest = () => {
    // Check if browser supports screen sharing
    const hasAPI =
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getDisplayMedia === 'function';
    
    // Also check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
    const isSupported = hasAPI && isSecureContext;

    if (isSupported) {
      router.push('/screen-test');
    } else {
      setShowUnsupportedMessage(true);
    }
  };

  return (
    <div ref={heroRef} className="bg-hero">
      {/* Hero Content */}
      <div className="hero-container">
        {/* Core Content - Centered with background glow */}
        <div className="hero-core">
          {/* Title */}
          <h1 className="hero-title">Screen Share Test App&nbsp;</h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle">
            Test your browser&apos;s screen sharing capabilities with real-time preview and detailed stream information.
          </p>

          {/* Unsupported Browser Message - only shows after clicking button */}
          {showUnsupportedMessage && (
            <div className="status-badge status-badge--error">
              <span className="status-badge-dot status-badge-dot--error" />
              <span className="status-badge-text">Your browser does not support screen sharing. Please use a modern browser with HTTPS.</span>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleStartTest}
            className="btn-primary"
          >
            Start Screen Test
          </button>
        </div>

        {/* Feature Cards */}
        <div className="cards-section">
          <h2 className="cards-section-title">What this app demonstrates</h2>
          
          <div className="cards-grid">
            {/* Permission Handling Card */}
            <div className="feature-card">
              <div className="feature-card-icon feature-card-icon--amber">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-card-title">Permission Handling</h3>
              <p className="feature-card-description">Proper handling of all permission states</p>
            </div>

            {/* Live Preview Card */}
            <div className="feature-card">
              <div className="feature-card-icon feature-card-icon--blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-card-title">Live Preview</h3>
              <p className="feature-card-description">Real-time screen preview with metadata</p>
            </div>

            {/* Lifecycle Management Card */}
            <div className="feature-card">
              <div className="feature-card-icon feature-card-icon--green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="feature-card-title">Lifecycle Management</h3>
              <p className="feature-card-description">Clean resource handling and cleanup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
