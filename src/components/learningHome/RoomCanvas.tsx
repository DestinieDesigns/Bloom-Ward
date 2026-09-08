import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Trash2,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  Info,
  Check,
  X,
  Volume2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import {
  HomeItem,
  HomeRoom,
  PlacedHomeItem,
  AppSection
} from '../../types';
import { INITIAL_HOME_ITEMS } from '../../data/learningHomeData';
import { sound } from '../../utils/audio';

interface RoomCanvasProps {
  room: HomeRoom;
  onUpdatePlacedItems: (items: PlacedHomeItem[]) => void;
  onRemoveItem: (instanceId: string) => void;
  onSelectSection: (section: AppSection) => void;
  isDecoratingMode: boolean;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  room,
  onUpdatePlacedItems,
  onRemoveItem,
  onSelectSection,
  isDecoratingMode
}) => {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [activePetDialogue, setActivePetDialogue] = useState<{ name: string; text: string } | null>(null);
  const [activeWordCard, setActiveWordCard] = useState<{ word: string; definition: string } | null>(null);
  const [interactiveStation, setInteractiveStation] = useState<{
    title: string;
    description: string;
    targetSection: AppSection;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map of item definitions for fast lookup
  const itemMap = useRef<Map<string, HomeItem>>(new Map());
  useEffect(() => {
    const map = new Map<string, HomeItem>();
    INITIAL_HOME_ITEMS.forEach((i) => map.set(i.id, i));
    itemMap.current = map;
  }, []);

  const selectedPlacedItem = room.placedItems.find((p) => p.instanceId === selectedInstanceId);
  const selectedItemDef = selectedPlacedItem ? itemMap.current.get(selectedPlacedItem.itemId) : null;

  // Global pointer up to end drag
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  // Handle pointer down on an item
  const handleItemPointerDown = (
    e: React.PointerEvent,
    item: PlacedHomeItem,
    itemDef?: HomeItem
  ) => {
    e.stopPropagation();

    // If in Explore mode (not Decorating mode), handle interactions instead of drag
    if (!isDecoratingMode) {
      handleItemInteraction(itemDef);
      return;
    }

    sound.playPop();
    setSelectedInstanceId(item.instanceId);
    isDraggingRef.current = true;

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const itemPixelX = (item.x / 100) * canvasRect.width;
    const itemPixelY = (item.y / 100) * canvasRect.height;

    dragStartOffsetRef.current = {
      x: e.clientX - canvasRect.left - itemPixelX,
      y: e.clientY - canvasRect.top - itemPixelY
    };
  };

  // Handle pointer move across canvas
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !selectedInstanceId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentMouseX = e.clientX - canvasRect.left - dragStartOffsetRef.current.x;
    const currentMouseY = e.clientY - canvasRect.top - dragStartOffsetRef.current.y;

    // Convert to percentage (clamped between 5% and 95%)
    const newX = Math.max(5, Math.min(95, Math.round((currentMouseX / canvasRect.width) * 100)));
    const newY = Math.max(10, Math.min(92, Math.round((currentMouseY / canvasRect.height) * 100)));

    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        return { ...p, x: newX, y: newY };
      }
      return p;
    });

    onUpdatePlacedItems(updated);
  };

  // Handle clicks on interactive items
  const handleItemInteraction = (itemDef?: HomeItem) => {
    if (!itemDef) return;

    sound.playPop();

    if (itemDef.interactiveType === 'companion_pet' && itemDef.interactiveData?.petDialogue) {
      sound.playSuccessChime();
      setActivePetDialogue({
        name: itemDef.interactiveData.petName || itemDef.name,
        text: itemDef.interactiveData.petDialogue
      });
      return;
    }

    if (itemDef.interactiveType === 'knowledge_flower' && itemDef.interactiveData?.word) {
      setActiveWordCard({
        word: itemDef.interactiveData.word,
        definition: itemDef.interactiveData.definition || 'A marvelous word you mastered!'
      });
      return;
    }

    if (itemDef.interactiveData?.targetSection) {
      setInteractiveStation({
        title: itemDef.interactiveData.title || itemDef.name,
        description: itemDef.interactiveData.description || 'Open this interactive learning station.',
        targetSection: itemDef.interactiveData.targetSection
      });
    }
  };

  // Rotate item by 90 degrees
  const handleRotate = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        const nextRotation = (p.rotation + 90) % 360;
        return { ...p, rotation: nextRotation };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Scale item up or down
  const handleScaleChange = (delta: number) => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        const nextScale = Math.max(0.7, Math.min(1.8, parseFloat((p.scale + delta).toFixed(2))));
        return { ...p, scale: nextScale };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  // Bring item forward (increase z-index)
  const handleBringForward = () => {
    if (!selectedInstanceId) return;
    sound.playPop();
    const maxZ = Math.max(...room.placedItems.map((p) => p.zIndex || 1), 1);
    const updated = room.placedItems.map((p) => {
      if (p.instanceId === selectedInstanceId) {
        return { ...p, zIndex: maxZ + 1 };
      }
      return p;
    });
    onUpdatePlacedItems(updated);
  };

  return (
    <div className="relative w-full select-none">
      {/* 🏡 3D Perspective Room Stage */}
      <div
        ref={canvasRef}
        id="learning-home-canvas"
        onPointerMove={handleCanvasPointerMove}
        onClick={() => {
          if (isDecoratingMode) {
            setSelectedInstanceId(null);
          }
        }}
        className={`relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 transition-all ${room.wallpaperClass}`}
        style={{
          perspective: '1000px',
          touchAction: 'none'
        }}
      >
        {/* Architectural Room Perspective: Ceiling Molding */}
        <div className="absolute top-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-b from-white/30 to-transparent pointer-events-none border-b border-white/20 z-1" />

        {/* Room Window with Daylight / Starlight Accent */}
        <div className="absolute top-8 right-12 sm:right-20 w-24 sm:w-36 h-28 sm:h-40 rounded-t-full border-4 border-white/70 bg-gradient-to-b from-sky-200/50 via-cyan-100/30 to-amber-100/20 shadow-inner backdrop-blur-xs flex items-center justify-center pointer-events-none z-1">
          {/* Window Panes Grid */}
          <div className="w-full h-0.5 bg-white/70 absolute top-1/2" />
          <div className="h-full w-0.5 bg-white/70 absolute left-1/2" />
          <span className="text-2xl sm:text-4xl opacity-50 select-none">☀️</span>
        </div>

        {/* Left Perspective Wall Angle */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-2" />
        {/* Right Perspective Wall Angle */}
        <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-2" />

        {/* Realistic Wooden or Tiled Flooring Area (Bottom 40%) */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[42%] pointer-events-none z-2 ${room.flooringClass}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'perspective(400px) rotateX(20deg)',
            transformOrigin: 'bottom'
          }}
        >
          {/* Subtle floor plank lines */}
          <div className="w-full h-full opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Placed Items Render Loop */}
        {room.placedItems.map((placed) => {
          const itemDef = itemMap.current.get(placed.itemId);
          if (!itemDef) return null;

          const isSelected = placed.instanceId === selectedInstanceId && isDecoratingMode;
          const isSticker = itemDef.category === 'sticker';
          const isCompanion = itemDef.category === 'companion';

          return (
            <div
              key={placed.instanceId}
              id={`home-item-${placed.instanceId}`}
              onPointerDown={(e) => handleItemPointerDown(e, placed, itemDef)}
              className={`absolute cursor-pointer transition-transform ${
                isSelected
                  ? 'ring-4 ring-pink-500/80 ring-offset-2 ring-offset-white/80 rounded-2xl shadow-xl'
                  : 'hover:scale-105'
              } flex flex-col items-center justify-center touch-none`}
              style={{
                left: `${placed.x}%`,
                top: `${placed.y}%`,
                transform: `translate(-50%, -50%) rotate(${placed.rotation}deg) scale(${placed.scale})`,
                zIndex: isSelected ? 99 : placed.zIndex || 10
              }}
            >
              {/* Item Visual Rendering */}
              <div className="relative group">
                <span
                  className={`block transition-all select-none ${
                    isSticker
                      ? 'text-4xl sm:text-6xl drop-shadow-md'
                      : isCompanion
                      ? 'text-5xl sm:text-7xl drop-shadow-lg animate-bounce duration-1000'
                      : 'text-5xl sm:text-7xl drop-shadow-lg'
                  }`}
                >
                  {itemDef.icon}
                </span>

                {/* Subtle hover label in explore mode */}
                {!isDecoratingMode && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                    {itemDef.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Floating Decorating Tool Bar for Selected Item */}
        {selectedPlacedItem && selectedItemDef && isDecoratingMode && (
          <div
            className="absolute z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-pink-300 p-2 flex items-center gap-1.5 transition-all -translate-x-1/2"
            style={{
              left: `${selectedPlacedItem.x}%`,
              top: `${Math.max(8, selectedPlacedItem.y - 18)}%`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 cursor-pointer transition-transform active:scale-90"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Scale Down */}
            <button
              onClick={() => handleScaleChange(-0.1)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-transform active:scale-90"
              title="Make Smaller"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Scale Up */}
            <button
              onClick={() => handleScaleChange(0.1)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-transform active:scale-90"
              title="Make Larger"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Bring to Front */}
            <button
              onClick={handleBringForward}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer transition-transform active:scale-90"
              title="Bring to Front"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Remove item back to inventory */}
            <button
              onClick={() => {
                sound.playPop();
                onRemoveItem(selectedPlacedItem.instanceId);
                setSelectedInstanceId(null);
              }}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-transform active:scale-90"
              title="Return to Collection"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Deselect */}
            <button
              onClick={() => setSelectedInstanceId(null)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              title="Done"
            >
              <Check className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Empty Room Hint */}
        {room.placedItems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
            <span className="text-5xl mb-2 animate-pulse">🏡</span>
            <p className="font-extrabold text-sm sm:text-base font-['Fredoka'] text-slate-600">
              Your room is ready for decorating!
            </p>
            <p className="text-xs text-slate-500">
              Tap "🎒 My Collection" below to place furniture, stickers, and cozy companions.
            </p>
          </div>
        )}
      </div>

      {/* --- POPUP DIALOGS FOR INTERACTIVE STATIONS --- */}

      {/* 🐾 Pet Dialogue Speech Bubble */}
      {activePetDialogue && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-pink-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <span className="text-5xl block animate-bounce">🐾</span>
            <h4 className="text-xl font-extrabold text-slate-800 font-['Fredoka']">
              {activePetDialogue.name} says:
            </h4>
            <div className="p-4 rounded-2xl bg-pink-50 text-pink-900 font-semibold text-sm leading-relaxed border border-pink-100">
              "{activePetDialogue.text}"
            </div>
            <button
              onClick={() => {
                sound.playPop();
                setActivePetDialogue(null);
              }}
              className="w-full py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-sm cursor-pointer shadow-md transition-all active:scale-95"
            >
              Thanks, {activePetDialogue.name}! 🌸
            </button>
          </div>
        </div>
      )}

      {/* 🌸 Knowledge Flower Word Inspector Modal */}
      {activeWordCard && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-emerald-200 shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-4xl">🌺</span>
              <button
                onClick={() => setActiveWordCard(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Mastered Knowledge Flower
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                {activeWordCard.word}
              </h4>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              "{activeWordCard.definition}"
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => sound.speak(activeWordCard.word)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Word</span>
              </button>
              <button
                onClick={() => setActiveWordCard(null)}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Keep Blooming 🌸
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📚 Interactive Station (Reading Corner / Desk / Spelling Lab) */}
      {interactiveStation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-indigo-200 shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-4xl">✨</span>
              <button
                onClick={() => setInteractiveStation(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900 font-['Fredoka']">
                {interactiveStation.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {interactiveStation.description}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setInteractiveStation(null)}
                className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Stay in Home
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  const target = interactiveStation.targetSection;
                  setInteractiveStation(null);
                  onSelectSection(target);
                }}
                className="flex-1 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Jump In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
