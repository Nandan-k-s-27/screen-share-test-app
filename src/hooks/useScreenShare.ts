'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  ScreenShareStatus,
  ScreenMetadata,
  ScreenShareError,
  UseScreenShareReturn,
  DisplaySurfaceType,
} from '@/types';

/**
 * Custom hook for managing screen sharing functionality
 * Handles all screen sharing states, lifecycle, and cleanup
 */
export function useScreenShare(): UseScreenShareReturn {
  const [status, setStatus] = useState<ScreenShareStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [metadata, setMetadata] = useState<ScreenMetadata | null>(null);
  const [error, setError] = useState<ScreenShareError | null>(null);
  
  // Ref to track if component is mounted for async operations
  const isMountedRef = useRef(true);
  // Ref to store stream for cleanup without stale closure issues
  const streamRef = useRef<MediaStream | null>(null);

  // Check if getDisplayMedia is supported
  const isSupported = typeof window !== 'undefined' && 
    typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    typeof navigator.mediaDevices.getDisplayMedia === 'function';

  /**
   * Cleanup function to stop all tracks and release resources
   */
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        // Remove event listeners
        track.onended = null;
      });
      streamRef.current = null;
    }
    if (isMountedRef.current) {
      setStream(null);
      setMetadata(null);
    }
  }, []);

  /**
   * Stop screen sharing and update state
   */
  const stopScreenShare = useCallback(() => {
    cleanup();
    if (isMountedRef.current) {
      setStatus('stopped');
      setError(null);
    }
  }, [cleanup]);

  /**
   * Extract metadata from video track settings
   */
  const extractMetadata = useCallback((track: MediaStreamTrack): ScreenMetadata => {
    const settings = track.getSettings();
    
    // Get display surface type (tab/window/screen)
    // Cast to access displaySurface which may not be in standard TypeScript types
    const extendedSettings = settings as MediaTrackSettings & { 
      displaySurface?: string;
    };
    
    let displaySurface: DisplaySurfaceType = 'unknown';
    if (extendedSettings.displaySurface) {
      const surface = extendedSettings.displaySurface.toLowerCase();
      if (surface === 'monitor') displaySurface = 'monitor';
      else if (surface === 'window') displaySurface = 'window';
      else if (surface === 'browser') displaySurface = 'browser';
    }

    return {
      displaySurface,
      width: settings.width || 0,
      height: settings.height || 0,
      frameRate: settings.frameRate || 0,
    };
  }, []);

  /**
   * Parse error to determine specific error type
   */
  const parseError = useCallback((err: unknown): ScreenShareError => {
    if (err instanceof Error) {
      const errorName = err.name.toLowerCase();
      const errorMessage = err.message.toLowerCase();

      // User cancelled the screen picker dialog
      if (
        errorName === 'aborterror' || 
        errorName === 'notallowederror' && errorMessage.includes('cancel')
      ) {
        return {
          type: 'cancelled',
          message: 'Screen sharing was cancelled. You can try again when ready.',
        };
      }

      // User denied permission
      if (errorName === 'notallowederror' || errorName === 'permissiondeniederror') {
        return {
          type: 'denied',
          message: 'Screen sharing permission was denied. Please allow access to share your screen.',
        };
      }

      // Unknown error
      return {
        type: 'unknown',
        message: err.message || 'An unexpected error occurred while starting screen share.',
      };
    }

    return {
      type: 'unknown',
      message: 'An unexpected error occurred.',
    };
  }, []);

  /**
   * Start screen sharing
   */
  const startScreenShare = useCallback(async () => {
    // Clear previous state
    setError(null);
    setMetadata(null);
    cleanup();

    if (!isSupported) {
      setError({
        type: 'unknown',
        message: 'Screen sharing is not supported in this browser.',
      });
      setStatus('error');
      return;
    }

    try {
      setStatus('requesting');

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      // Check if component is still mounted
      if (!isMountedRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      // Store stream in ref for cleanup
      streamRef.current = mediaStream;
      setStream(mediaStream);

      // Get video track and extract metadata
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const trackMetadata = extractMetadata(videoTrack);
        setMetadata(trackMetadata);

        // Set up track ended listener for when user stops from browser UI
        videoTrack.onended = () => {
          if (isMountedRef.current) {
            cleanup();
            setStatus('stopped');
          }
        };
      }

      setStatus('active');
    } catch (err) {
      if (!isMountedRef.current) return;

      const parsedError = parseError(err);
      setError(parsedError);

      switch (parsedError.type) {
        case 'cancelled':
          setStatus('cancelled');
          break;
        case 'denied':
          setStatus('denied');
          break;
        default:
          setStatus('error');
      }
    }
  }, [isSupported, cleanup, extractMetadata, parseError]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      // Cleanup any active streams on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.onended = null;
        });
        streamRef.current = null;
      }
    };
  }, []);

  return {
    status,
    stream,
    metadata,
    error,
    startScreenShare,
    stopScreenShare,
    isSupported,
  };
}
