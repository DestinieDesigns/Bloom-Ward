import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FurnitureActionType, HomeItem, PlacedHomeItem } from '../../types';

export interface SelectedInteractiveObject {
  instanceId: string;
  placed: PlacedHomeItem;
  item: HomeItem;
}

interface PlayInteractionPanelProps {
  selectedObject: SelectedInteractiveObject;
  actions: { action: FurnitureActionType; label: string; icon: string }[];
  onPerformAction: (action: FurnitureActionType) => void;
  onClose: () => void;
}

export const PlayInteractionPanel: React.FC<PlayInteractionPanelProps> = ({
  selectedObject,
  actions,
  onPerformAction,
  onClose
}) => {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Responsive screen detection
  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 680);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const { item, placed } = selectedObject;
  // Dock to opposite side on desktop so panel never covers the selected object
  const dockSide = placed.x > 50 ? 'left' : 'right';

  // -------------------------------------------------------------
  // 1. MOBILE VIEW: FIXED BOTTOM INTERACTION SHEET
  // -------------------------------------------------------------
  if (isMobileScreen) {
    return (
      <div
        id="play-mobile-interaction-sheet"
        role="dialog"
        aria-label={`${item.name} interactions`}
        className="fixed inset-x-0 bottom-0 z-[80] bg-white/98 backdrop-blur-lg border-t-2 border-amber-300 shadow-[0_-12px_45px_rgba(0,0,0,0.22)] rounded-t-3xl px-4 pt-3.5 pb-[calc(1.25rem+env(safe-area-inset-bottom,16px))] animate-in slide-in-from-bottom duration-200"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Grab Handle */}
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-2.5 opacity-70" />

        {/* Header: Item icon, name & close button */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl select-none shrink-0">{item.icon || '🪑'}</span>
            <div className="min-w-0">
              <h4 className="text-base font-black text-amber-950 truncate leading-tight">
                {item.name}
              </h4>
              <p className="text-xs font-semibold text-stone-500">
                What would you like to do?
              </p>
            </div>
          </div>
          <button
            id="mobile-play-close-x-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close interaction menu"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 active:scale-95 cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {actions.map((actObj) => (
            <button
              key={actObj.action + actObj.label}
              id={`mobile-action-${actObj.action}`}
              onClick={(e) => {
                e.stopPropagation();
                onPerformAction(actObj.action);
              }}
              className="min-h-[48px] py-3 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-200/80 text-amber-950 font-black text-sm flex items-center gap-2.5 shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
            >
              <span className="text-xl select-none shrink-0">{actObj.icon}</span>
              <span className="truncate">{actObj.label}</span>
            </button>
          ))}

          {/* Explicit Close Button in Grid */}
          <button
            id="mobile-action-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="min-h-[48px] py-3 px-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border-2 border-stone-200 text-stone-700 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4 shrink-0" />
            <span>Close</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DESKTOP VIEW: PERSISTENT SAFE-AREA FLOATING PANEL
  // -------------------------------------------------------------
  return (
    <div
      id="play-desktop-interaction-panel"
      role="dialog"
      aria-label={`${item.name} interactions`}
      className={`absolute bottom-3 sm:bottom-4 z-40 max-w-sm w-80 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-300 p-3.5 sm:p-4 animate-in fade-in zoom-in-95 duration-150 ${
        dockSide === 'left' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
      }`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl select-none shrink-0">{item.icon || '🪑'}</span>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-black text-amber-950 truncate leading-tight">
              {item.name}
            </h4>
            <p className="text-[11px] sm:text-xs font-semibold text-stone-500">
              What would you like to do?
            </p>
          </div>
        </div>
        <button
          id="desktop-play-close-x-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close interaction menu"
          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-600 active:scale-95 cursor-pointer transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons grid */}
      <div className="grid grid-cols-2 gap-2 pt-3">
        {actions.map((actObj) => (
          <button
            key={actObj.action + actObj.label}
            id={`desktop-action-${actObj.action}`}
            onClick={(e) => {
              e.stopPropagation();
              onPerformAction(actObj.action);
            }}
            className="min-h-[44px] sm:min-h-[48px] py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-200/80 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer text-left"
          >
            <span className="text-lg select-none shrink-0">{actObj.icon}</span>
            <span className="truncate">{actObj.label}</span>
          </button>
        ))}

        {/* Explicit Close Button */}
        <button
          id="desktop-action-close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="min-h-[44px] sm:min-h-[48px] py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 border-2 border-stone-200 text-stone-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4 shrink-0" />
          <span>Close</span>
        </button>
      </div>
    </div>
  );
};
