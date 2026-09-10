import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (installedSuccess) {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 ${className}`}>
          <Check className="w-3.5 h-3.5" />
          <span>Installed!</span>
        </div>
      );
    }

    if (compact) {
      return (
        <button
          id="pwa-install-compact-btn"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 ${className}`}
          title="Install BloomWord app on this device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        id="pwa-install-full-btn"
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all active:scale-95 cursor-pointer border border-indigo-500/30 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100 cursor-pointer transition-all active:scale-95 ${className}`}
          title="Install BloomWord on iPhone or iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-2 border-indigo-100 dark:bg-stone-900 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📲</span>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <p>1. In Safari, tap the <strong className="text-indigo-900">Share</strong> button at the bottom of your screen.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <p>2. Scroll down and tap <strong className="text-indigo-900">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                  <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <p>3. Tap <strong className="text-emerald-950">Add</strong>. BloomWord will now launch like a native app!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-indigo-600 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-indigo-700 shadow-md cursor-pointer transition-all active:scale-95"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
