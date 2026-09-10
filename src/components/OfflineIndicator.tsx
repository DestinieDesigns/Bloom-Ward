import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-9999 flex items-center gap-2 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
        <CheckCircle2 className="w-4 h-4" />
        <span>Back online! Progress synced.</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-9999 flex items-center gap-2 rounded-2xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — All learning & home features cached.</span>
    </div>
  );
};
