import React, { useState } from 'react';
import { Cloud, CloudCheck, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SyncStatus } from '../services/syncService';

interface SyncIndicatorProps {
  status: SyncStatus;
  isCloudActive: boolean;
  onOpenAuth?: () => void;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status,
  isCloudActive,
  onOpenAuth
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  let icon = <Cloud className="w-3.5 h-3.5 text-emerald-500" />;
  let label = 'Saved';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (status === 'saving') {
    icon = <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />;
    label = 'Saving...';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (status === 'offline' || !isCloudActive) {
    icon = <CloudOff className="w-3.5 h-3.5 text-amber-500" />;
    label = isCloudActive ? 'Offline' : 'Device Only';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (status === 'synced') {
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    label = 'Cloud Saved';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        id="sync-status-indicator-btn"
        onClick={() => {
          if (!isCloudActive && onOpenAuth) {
            onOpenAuth();
          } else {
            setShowTooltip(!showTooltip);
          }
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeColor} transition-all cursor-pointer shadow-xs`}
        title="Account & Save Status"
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 animate-fadeIn text-left">
          <p className="font-bold flex items-center gap-1 mb-1">
            {isCloudActive ? '☁️ Cloud Auto-Save Active' : '📱 Saved to This Device'}
          </p>
          <p className="text-[11px] text-slate-300 leading-tight">
            {isCloudActive
              ? 'Your words, reading streaks, spelling, and XP automatically save to your secure cloud account.'
              : 'Your learning progress is saved on this device. Create a free account to back up and sync across devices!'}
          </p>
          {!isCloudActive && onOpenAuth && (
            <button
              onClick={() => {
                setShowTooltip(false);
                onOpenAuth();
              }}
              className="mt-2 w-full py-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold rounded-lg text-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              Sign In or Create Account
            </button>
          )}
        </div>
      )}
    </div>
  );
};
