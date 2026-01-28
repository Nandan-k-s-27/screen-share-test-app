// Screen sharing state types
export type ScreenShareStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'cancelled'
  | 'denied'
  | 'error'
  | 'stopped';

// Display surface type from getDisplayMedia
export type DisplaySurfaceType = 'monitor' | 'window' | 'browser' | 'unknown';

// Screen stream metadata
export interface ScreenMetadata {
  displaySurface: DisplaySurfaceType;
  width: number;
  height: number;
  frameRate: number;
}

// Error info for display
export interface ScreenShareError {
  type: 'cancelled' | 'denied' | 'unknown';
  message: string;
}

// Hook return type
export interface UseScreenShareReturn {
  status: ScreenShareStatus;
  stream: MediaStream | null;
  metadata: ScreenMetadata | null;
  error: ScreenShareError | null;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  isSupported: boolean;
}
