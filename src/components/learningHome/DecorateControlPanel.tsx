import React, { useState, useEffect } from 'react';
import {
  Move,
  RotateCw,
  Maximize2,
  Minimize2,
  Archive,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { HomeItem, PlacedHomeItem } from '../../types';
import { sound } from '../../utils/audio';

interface DecorateControlPanelProps {
  placedItem: PlacedHomeItem;
  itemDef: HomeItem;
  canvasElement: HTMLDivElement | null;
  onScaleChange: (delta: number) => void;
  onRotate: () => void;
  onNudgeMove: (deltaX: number, deltaY: number) => void;
  onBringForward: () => void;
  onStoreItem: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onCancel: () => void;
  onDone: () => void;
  isMovingActive: boolean;
  onToggleMoveActive: () => void;
}

export const DecorateControlPanel: React.FC<DecorateControlPanelProps> = ({
  placedItem,
  itemDef,
  onScaleChange,
  onRotate,
  onNudgeMove,
  onBringForward,
  onStoreItem,
  onCancel,
  onDone,
  isMovingActive,
  onToggleMoveActive
}) => {
  const [showStoreConfirm, setShowStoreConfirm] = useState(false);
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

  const scalePercent = Math.round(placedItem.scale * 100);
  // Auto-dock to opposite side on desktop so panel never covers the selected object
  const dockSide = placedItem.x > 50 ? 'left' : 'right';

  // -------------------------------------------------------------
  // 1. MOBILE BOTTOM ACTION SHEET (Part 5: fixed bottom sheet)
  // -------------------------------------------------------------
  if (isMobileScreen) {
    return (
      <div
        id="decorate-mobile-control-sheet"
        className="fixed inset-x-0 bottom-0 z-50 bg-white/98 backdrop-blur-lg border-t-2 border-amber-300 shadow-[0_-10px_35px_rgba(0,0,0,0.18)] rounded-t-3xl px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,16px))] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Item name, badge & scale/rot */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{itemDef.icon || '🪑'}</span>
            <div>
              <h4 className="text-sm font-black text-stone-900 leading-tight">
                {itemDef.name}
              </h4>
              <p className="text-[11px] font-semibold text-amber-700 capitalize">
                {itemDef.category} • Size: {scalePercent}% • Rot: {placedItem.rotation}°
              </p>
            </div>
          </div>
          <button
            id="mobile-control-done-btn"
            onClick={() => {
              sound.playSuccessChime();
              onDone();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
            title="Finish editing"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>

        {/* Store Confirmation Overlay */}
        {showStoreConfirm ? (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 mb-2 flex flex-col gap-2.5 animate-in fade-in">
            <p className="text-xs font-extrabold text-rose-950 text-center">
              Store <strong>{itemDef.name}</strong> back in your inventory backpack?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStoreConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs min-h-[44px] cursor-pointer"
              >
                Keep in Room
              </button>
              <button
                onClick={() => {
                  setShowStoreConfirm(false);
                  onStoreItem();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 min-h-[44px] shadow-sm cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                <span>Store Item 📦</span>
              </button>
            </div>
          </div>
        ) : isMovingActive ? (
          /* Nudge Direction Pad */
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-2.5 mb-2.5 flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-amber-600" />
              <span>Tap arrows to nudge item, or drag it directly on screen:</span>
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full max-w-xs">
              <div />
              <button
                onClick={() => onNudgeMove(0, -4)}
                className="min-h-[44px] py-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center active:scale-90"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />
              <button
                onClick={() => onNudgeMove(-4, 0)}
                className="min-h-[44px] py-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center active:scale-90"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleMoveActive}
                className="min-h-[44px] py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center active:scale-95"
              >
                Done
              </button>
              <button
                onClick={() => onNudgeMove(4, 0)}
                className="min-h-[44px] py-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center active:scale-90"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div />
              <button
                onClick={() => onNudgeMove(0, 4)}
                className="min-h-[44px] py-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center active:scale-90"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <div />
            </div>
          </div>
        ) : null}

        {/* Action Buttons Grid (48px targets for easy tapping) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Move Button */}
          <button
            onClick={onToggleMoveActive}
            className={`min-h-[48px] py-2.5 px-2 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 ${
              isMovingActive
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-stone-100 hover:bg-amber-100 text-stone-800'
            }`}
          >
            <Move className="w-4 h-4 text-amber-600" />
            <span>Move</span>
          </button>

          {/* Rotate Button */}
          <button
            onClick={() => {
              sound.playPop();
              onRotate();
            }}
            className="min-h-[48px] py-2.5 px-2 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <RotateCw className="w-4 h-4 text-amber-700" />
            <span>Rotate</span>
          </button>

          {/* Grow Button */}
          <button
            onClick={() => {
              sound.playPop();
              onScaleChange(0.1);
            }}
            disabled={placedItem.scale >= 2.0}
            className="min-h-[48px] py-2.5 px-2 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-40"
          >
            <Maximize2 className="w-4 h-4 text-emerald-600" />
            <span>Grow</span>
          </button>

          {/* Shrink Button */}
          <button
            onClick={() => {
              sound.playPop();
              onScaleChange(-0.1);
            }}
            disabled={placedItem.scale <= 0.6}
            className="min-h-[48px] py-2.5 px-2 rounded-2xl bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 disabled:opacity-40"
          >
            <Minimize2 className="w-4 h-4 text-amber-600" />
            <span>Shrink</span>
          </button>

          {/* Layer Front */}
          <button
            onClick={() => {
              sound.playPop();
              onBringForward();
            }}
            className="min-h-[48px] py-2.5 px-2 rounded-2xl bg-stone-100 hover:bg-indigo-100 text-stone-800 font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Front</span>
          </button>

          {/* Store in inventory */}
          <button
            onClick={() => setShowStoreConfirm(true)}
            className="min-h-[48px] py-2.5 px-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <Archive className="w-4 h-4 text-rose-600" />
            <span>Store 📦</span>
          </button>
        </div>

        {/* Footer: Cancel / Done Row */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100">
          <button
            onClick={onCancel}
            className="flex-1 min-h-[44px] py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={() => {
              sound.playSuccessChime();
              onDone();
            }}
            className="flex-2 min-h-[44px] py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Save & Done</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DESKTOP & TABLET PERSISTENT SIDE PANEL (Part 4 of Spec)
  // -------------------------------------------------------------
  return (
    <div
      id="decorate-desktop-action-panel"
      className={`absolute z-50 top-4 ${
        dockSide === 'left' ? 'left-4' : 'right-4'
      } w-64 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-300 p-3.5 space-y-3 animate-in fade-in zoom-in-95 pointer-events-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Item Name & Info */}
      <div className="flex items-start justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0">{itemDef.icon || '🪑'}</span>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-stone-900 truncate" title={itemDef.name}>
              {itemDef.name}
            </h4>
            <p className="text-[10px] font-semibold text-amber-700 truncate">
              {itemDef.category.toUpperCase()} • {scalePercent}%
            </p>
          </div>
        </div>
        <button
          onClick={onDone}
          className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 cursor-pointer transition-colors"
          title="Done editing"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Store Confirmation Overlay */}
      {showStoreConfirm ? (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-3 space-y-2 animate-in fade-in">
          <p className="text-xs font-extrabold text-rose-950 text-center">
            Store <strong>{itemDef.name}</strong> back in your backpack inventory?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStoreConfirm(false)}
              className="flex-1 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-bold text-xs cursor-pointer hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowStoreConfirm(false);
                onStoreItem();
              }}
              className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Store 📦</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Main Controls Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Move Button */}
            <button
              id="desktop-btn-move"
              onClick={onToggleMoveActive}
              className={`p-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 min-h-[42px] ${
                isMovingActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60'
              }`}
              title="Click & drag object or use nudge arrows"
            >
              <Move className="w-4 h-4 text-amber-600" />
              <span>Move</span>
            </button>

            {/* Rotate Button */}
            <button
              id="desktop-btn-rotate"
              onClick={() => {
                sound.playPop();
                onRotate();
              }}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 min-h-[42px]"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-4 h-4 text-amber-700" />
              <span>Rotate</span>
            </button>

            {/* Grow Button */}
            <button
              id="desktop-btn-grow"
              onClick={() => {
                sound.playPop();
                onScaleChange(0.1);
              }}
              disabled={placedItem.scale >= 2.0}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border border-stone-200/60 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-40 min-h-[42px]"
              title="Make item larger (+10%)"
            >
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>Grow</span>
            </button>

            {/* Shrink Button */}
            <button
              id="desktop-btn-shrink"
              onClick={() => {
                sound.playPop();
                onScaleChange(-0.1);
              }}
              disabled={placedItem.scale <= 0.6}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-stone-200/60 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-40 min-h-[42px]"
              title="Make item smaller (-10%)"
            >
              <Minimize2 className="w-4 h-4 text-amber-600" />
              <span>Shrink</span>
            </button>

            {/* Bring to Front */}
            <button
              id="desktop-btn-front"
              onClick={() => {
                sound.playPop();
                onBringForward();
              }}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-indigo-50 text-stone-800 hover:text-indigo-900 border border-stone-200/60 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 min-h-[42px]"
              title="Bring object to front layer"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Layer Front</span>
            </button>

            {/* Store Button */}
            <button
              id="desktop-btn-store"
              onClick={() => setShowStoreConfirm(true)}
              className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 min-h-[42px]"
              title="Remove from room and return 1 copy to inventory"
            >
              <Archive className="w-4 h-4 text-rose-600" />
              <span>Store 📦</span>
            </button>
          </div>

          {/* Nudge D-Pad when move active */}
          {isMovingActive && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-2 space-y-1.5 animate-in fade-in">
              <span className="text-[10px] font-extrabold text-amber-950 block text-center">
                Arrow Nudge or Drag Directly
              </span>
              <div className="grid grid-cols-3 gap-1 max-w-[150px] mx-auto">
                <div />
                <button
                  onClick={() => onNudgeMove(0, -3)}
                  className="p-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 flex items-center justify-center hover:bg-amber-100 active:scale-90 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <div />
                <button
                  onClick={() => onNudgeMove(-3, 0)}
                  className="p-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 flex items-center justify-center hover:bg-amber-100 active:scale-90 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center justify-center text-[10px] font-bold text-amber-700">
                  •
                </div>
                <button
                  onClick={() => onNudgeMove(3, 0)}
                  className="p-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 flex items-center justify-center hover:bg-amber-100 active:scale-90 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div />
                <button
                  onClick={() => onNudgeMove(0, 3)}
                  className="p-1.5 rounded-xl bg-white border border-amber-200 text-amber-900 flex items-center justify-center hover:bg-amber-100 active:scale-90 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <div />
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer: Cancel & Done */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
        <button
          id="desktop-btn-cancel"
          onClick={onCancel}
          className="flex-1 py-2 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          title="Revert transform changes"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
        <button
          id="desktop-btn-done"
          onClick={() => {
            sound.playSuccessChime();
            onDone();
          }}
          className="flex-2 py-2 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
          title="Finish editing this object"
        >
          <Check className="w-4 h-4" />
          <span>Done ✓</span>
        </button>
      </div>
    </div>
  );
};
