'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ScreenMetadata } from '@/types';

interface ScreenPreviewProps {
  stream: MediaStream | null;
  metadata: ScreenMetadata | null;
}

/**
 * Component to display live screen preview and metadata with animations
 */
export function ScreenPreview({ stream, metadata }: ScreenPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Attach stream to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      setIsVideoLoaded(false);
    }

    // Cleanup: clear srcObject when stream changes or component unmounts
    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
      setIsVideoLoaded(false);
    };
  }, [stream]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  if (!stream) {
    return null;
  }

  // Get display surface label with icon
  const getDisplaySurfaceInfo = () => {
    if (!metadata) return { icon: '❓', label: 'Unknown', color: 'text-gray-500' };
    
    switch (metadata.displaySurface) {
      case 'monitor':
        return { icon: '🖥️', label: 'Entire Screen', color: 'text-purple-500' };
      case 'window':
        return { icon: '🪟', label: 'Application Window', color: 'text-blue-500' };
      case 'browser':
        return { icon: '🌐', label: 'Browser Tab', color: 'text-green-500' };
      default:
        return { icon: '❓', label: 'Unknown', color: 'text-gray-500' };
    }
  };

  // Format resolution
  const getResolution = () => {
    if (!metadata || !metadata.width || !metadata.height) {
      return 'Unknown';
    }
    return `${metadata.width} × ${metadata.height}`;
  };

  // Get resolution quality label
  const getQualityLabel = () => {
    if (!metadata?.height) return '';
    if (metadata.height >= 2160) return '4K';
    if (metadata.height >= 1440) return '2K';
    if (metadata.height >= 1080) return 'FHD';
    if (metadata.height >= 720) return 'HD';
    return 'SD';
  };

  // Format frame rate
  const getFrameRate = () => {
    if (!metadata || !metadata.frameRate) {
      return 'Unknown';
    }
    return `${Math.round(metadata.frameRate)} FPS`;
  };

  const surfaceInfo = getDisplaySurfaceInfo();
  const qualityLabel = getQualityLabel();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Video Preview Container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl group">
        {/* Loading overlay */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-white/70 text-sm">Loading preview...</span>
            </div>
          </div>
        )}
        
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedData={handleVideoLoaded}
          className={`
            w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain
            transition-opacity duration-500
            ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Live indicator - top left */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span>LIVE</span>
          </div>
        </div>
        
        {/* Quality badge - top right */}
        {qualityLabel && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <div className="bg-blue-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
              {qualityLabel}
            </div>
          </div>
        )}
        
        {/* Quick stats - bottom */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm">
            <span>{surfaceInfo.icon}</span>
            <span>{surfaceInfo.label}</span>
          </div>
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm">
            {getResolution()} • {getFrameRate()}
          </div>
        </div>
      </div>

      {/* Metadata Display Cards */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Stream Information
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Display Type Card */}
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 group/card cursor-default">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gray-600/50 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300`}>
                <span className="text-xl">{surfaceInfo.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Display Type</p>
                <p className="text-sm font-semibold truncate">{surfaceInfo.label}</p>
              </div>
            </div>
          </div>
          
          {/* Resolution Card */}
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 group/card cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600/50 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Resolution</p>
                <p className="text-sm font-semibold truncate">
                  {getResolution()}
                  {qualityLabel && <span className="ml-1.5 text-blue-400 text-xs">({qualityLabel})</span>}
                </p>
              </div>
            </div>
          </div>
          
          {/* Frame Rate Card */}
          <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 hover:from-gray-700/70 hover:to-gray-800/70 transition-all duration-300 group/card cursor-default">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600/50 flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Frame Rate</p>
                <p className="text-sm font-semibold">{getFrameRate()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
