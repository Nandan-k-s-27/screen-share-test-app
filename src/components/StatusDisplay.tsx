'use client';

import React from 'react';
import type { ScreenShareStatus, ScreenShareError } from '@/types';

interface StatusDisplayProps {
  status: ScreenShareStatus;
  error: ScreenShareError | null;
}

/**
 * Component to display the current screen sharing status with animations
 */
export function StatusDisplay({ status, error }: StatusDisplayProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: '🎬',
          title: 'Ready to Share',
          description: 'Click the button below to start sharing your screen.',
          bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-gray-200 dark:bg-gray-700',
          pulseColor: '',
        };
      case 'requesting':
        return {
          icon: '⏳',
          title: 'Requesting Permission',
          description: 'Please select a screen, window, or tab to share...',
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900',
          pulseColor: 'animate-pulse',
        };
      case 'active':
        return {
          icon: '🟢',
          title: 'Screen Sharing Active',
          description: 'Your screen is being shared. You can see the preview below.',
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
          textColor: 'text-green-700 dark:text-green-300',
          borderColor: 'border-green-300 dark:border-green-700',
          iconBg: 'bg-green-100 dark:bg-green-900',
          pulseColor: '',
        };
      case 'cancelled':
        return {
          icon: '⚠️',
          title: 'Sharing Cancelled',
          description: error?.message || 'Screen sharing was cancelled.',
          bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
          textColor: 'text-amber-700 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-700',
          iconBg: 'bg-amber-100 dark:bg-amber-900',
          pulseColor: '',
        };
      case 'denied':
        return {
          icon: '🚫',
          title: 'Permission Denied',
          description: error?.message || 'Screen sharing permission was denied.',
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900',
          pulseColor: '',
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Error Occurred',
          description: error?.message || 'An unexpected error occurred.',
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900',
          pulseColor: 'animate-shake',
        };
      case 'stopped':
        return {
          icon: '⏹️',
          title: 'Screen Sharing Stopped',
          description: 'Screen sharing has ended. You can start a new session.',
          bgColor: 'bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900',
          textColor: 'text-slate-700 dark:text-slate-300',
          borderColor: 'border-slate-200 dark:border-slate-700',
          iconBg: 'bg-slate-200 dark:bg-slate-700',
          pulseColor: '',
        };
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          description: 'Something went wrong.',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-300 dark:border-gray-600',
          iconBg: 'bg-gray-200 dark:bg-gray-700',
          pulseColor: '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border-2 rounded-2xl p-6 md:p-8
        transition-all duration-500 ease-out
        transform hover:scale-[1.01]
        shadow-lg hover:shadow-xl
        ${config.pulseColor}
      `}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        {/* Animated Icon Container */}
        <div 
          className={`
            ${config.iconBg}
            w-16 h-16 sm:w-14 sm:h-14 rounded-2xl 
            flex items-center justify-center flex-shrink-0
            transition-all duration-300
            ${status === 'active' ? 'animate-bounce-slow' : ''}
            ${status === 'requesting' ? 'animate-spin-slow' : ''}
          `}
        >
          <span className="text-3xl sm:text-2xl" role="img" aria-hidden="true">
            {config.icon}
          </span>
        </div>
        
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-lg font-bold mb-2 sm:mb-1">
            {config.title}
          </h3>
          <p className="text-sm sm:text-base opacity-90 leading-relaxed">
            {config.description}
          </p>
          
          {/* Progress indicator for requesting state */}
          {status === 'requesting' && (
            <div className="mt-4 sm:mt-3">
              <div className="h-1.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-progress-indeterminate" />
              </div>
            </div>
          )}
          
          {/* Active indicator pulse */}
          {status === 'active' && (
            <div className="mt-4 sm:mt-3 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wide">
                Live Stream Active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
