import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  Package,
  BookMarked,
  DoorOpen,
  RotateCcw,
  Volume2,
  HelpCircle,
  Eye,
  Brush,
  ChevronDown,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import {
  AppSection,
  HomeItem,
  HomeRoom,
  HomeRoomId,
  PlacedHomeItem,
  StickerItem,
  UserLearningHomeState,
  UserProfile,
  VocabWord,
  ReadingSession
} from '../types';
import {
  ROOM_THEME_OPTIONS,
  INITIAL_ROOMS,
  INITIAL_HOME_ITEMS
} from '../data/learningHomeData';
import {
  loadLearningHomeState,
  saveLearningHomeState,
  loadStickerBook,
  saveStickerBook,
  checkEducationalItemUnlocks,
  updateRoomUnlockProgression,
  updateStickerBookProgression
} from '../utils/learningHomeHelper';
import { RoomCanvas } from './learningHome/RoomCanvas';
import { CollectionDrawer } from './learningHome/CollectionDrawer';
import { StickerBookModal } from './learningHome/StickerBookModal';
import { KnowledgeGardenModal } from './learningHome/KnowledgeGardenModal';
import { RoomSwitcherModal } from './learningHome/RoomSwitcherModal';
import { EarnedGiftModal } from './learningHome/EarnedGiftModal';
import { sound } from '../utils/audio';

interface LearningHomeProps {
  profile: UserProfile;
  words: VocabWord[];
  readingSessions?: ReadingSession[];
  onSelectSection: (section: AppSection) => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const LearningHome: React.FC<LearningHomeProps> = ({
  profile,
  words,
  readingSessions = [],
  onSelectSection,
  onUpdateProfile
}) => {
  // Master Home State
  const [homeState, setHomeState] = useState<UserLearningHomeState>(() => {
    return profile.learningHomeState || loadLearningHomeState();
  });

  // Sticker Book State
  const [stickers, setStickers] = useState<StickerItem[]>(() => loadStickerBook());

  // UI Modals State
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [isRoomSwitcherOpen, setIsRoomSwitcherOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isDecoratingMode, setIsDecoratingMode] = useState(true);
  const [saveToastVisible, setSaveToastVisible] = useState(false);

  // Surprise Earned Gift State
  const [earnedGift, setEarnedGift] = useState<{
    item: HomeItem;
    reason: string;
  } | null>(null);

  // Check for newly unlocked items or rooms based on learning milestones
  useEffect(() => {
    // 1. Check items
    const itemUnlockResult = checkEducationalItemUnlocks(
      profile,
      words,
      readingSessions,
      homeState.unlockedItemIds
    );

    // 2. Check rooms
    const roomUnlockResult = updateRoomUnlockProgression(
      profile,
      words,
      readingSessions,
      homeState.rooms
    );

    // 3. Check stickers
    const stickerUnlockResult = updateStickerBookProgression(
      profile,
      words,
      readingSessions,
      stickers
    );

    let hasStateChange = false;
    let nextState = { ...homeState };

    if (itemUnlockResult.newlyUnlockedItems.length > 0) {
      hasStateChange = true;
      nextState.unlockedItemIds = itemUnlockResult.allUnlockedIds;
      // Show first new gift
      const latestGift = itemUnlockResult.newlyUnlockedItems[0];
      setEarnedGift({
        item: latestGift,
        reason: `Earned via your hard work: ${latestGift.unlockCondition}!`
      });
    }

    if (roomUnlockResult.newlyUnlockedRooms.length > 0) {
      hasStateChange = true;
      nextState.rooms = roomUnlockResult.updatedRooms;
    } else {
      nextState.rooms = roomUnlockResult.updatedRooms;
    }

    if (stickerUnlockResult.newlyUnlockedStickers.length > 0) {
      setStickers(stickerUnlockResult.updatedStickers);
      saveStickerBook(stickerUnlockResult.updatedStickers);
    }

    if (hasStateChange) {
      setHomeState(nextState);
      saveLearningHomeState(nextState);
      if (onUpdateProfile) {
        onUpdateProfile({ learningHomeState: nextState });
      }
    }
  }, [profile.xp, profile.streak, profile.totalReadingMinutes, words.length]);

  // Active Room
  const activeRoom: HomeRoom =
    homeState.rooms[homeState.activeRoomId] || INITIAL_ROOMS.main_room;

  // Persist helper
  const persistHomeState = (updatedState: UserLearningHomeState) => {
    setHomeState(updatedState);
    saveLearningHomeState(updatedState);
    if (onUpdateProfile) {
      onUpdateProfile({ learningHomeState: updatedState });
    }
    setSaveToastVisible(true);
    setTimeout(() => setSaveToastVisible(false), 2000);
  };

  // Update placed items in current room
  const handleUpdatePlacedItems = (placedItems: PlacedHomeItem[]) => {
    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        placedItems
      }
    };
    persistHomeState({
      ...homeState,
      rooms: updatedRooms
    });
  };

  // Place new item from Collection
  const handlePlaceItem = (item: HomeItem) => {
    const newInstanceId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: PlacedHomeItem = {
      instanceId: newInstanceId,
      itemId: item.id,
      x: 50,
      y: 55,
      scale: item.defaultScale || 1.0,
      rotation: 0,
      zIndex: (activeRoom.placedItems.length || 0) + 10
    };

    const updatedPlaced = [...activeRoom.placedItems, newItem];
    handleUpdatePlacedItems(updatedPlaced);
    setIsCollectionOpen(false);
  };

  // Place sticker from Sticker Book
  const handlePlaceStickerInRoom = (sticker: StickerItem) => {
    // Find or create a matching sticker item
    let matchingItem = INITIAL_HOME_ITEMS.find((i) => i.name === sticker.name);
    if (!matchingItem) {
      matchingItem = {
        id: sticker.id,
        name: sticker.name,
        category: 'sticker',
        icon: sticker.icon,
        description: sticker.description,
        unlocked: true,
        unlockCondition: sticker.unlockCondition,
        unlockSource: 'milestone',
        defaultScale: 1.1,
        isResizable: true,
        isRotatable: true
      };
    }
    handlePlaceItem(matchingItem);
  };

  // Remove item from room back to collection
  const handleRemoveItem = (instanceId: string) => {
    const updatedPlaced = activeRoom.placedItems.filter((p) => p.instanceId !== instanceId);
    handleUpdatePlacedItems(updatedPlaced);
  };

  // Switch Theme / Style for current room
  const handleSelectTheme = (themeId: HomeRoom['styleTheme']) => {
    sound.playPop();
    const themeDef = ROOM_THEME_OPTIONS.find((t) => t.id === themeId);
    if (!themeDef) return;

    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        styleTheme: themeId,
        wallpaperClass: themeDef.wallpaperClass,
        flooringClass: themeDef.flooringClass
      }
    };
    persistHomeState({
      ...homeState,
      rooms: updatedRooms
    });
    setIsThemeMenuOpen(false);
  };

  // Reset current room to starter layout
  const handleResetRoom = () => {
    if (!window.confirm('Reset this room back to its cozy starter layout?')) return;
    sound.playPop();
    const defaultRoom = INITIAL_ROOMS[homeState.activeRoomId] || INITIAL_ROOMS.main_room;
    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        placedItems: defaultRoom.placedItems
      }
    };
    persistHomeState({
      ...homeState,
      rooms: updatedRooms
    });
  };

  // Mastered words count for the garden badge
  const masteredWordsCount = words.filter((w) => w.mastered).length;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 font-['Quicksand'] animate-in fade-in">
      {/* 🏡 Top Header with Room Selector, Theme, and Mode Toggles */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              setIsRoomSwitcherOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200/80 text-pink-900 cursor-pointer transition-all active:scale-95"
            title="Switch Room"
          >
            <span className="text-2xl">{activeRoom.icon}</span>
            <div className="text-left">
              <span className="text-[10px] font-bold text-pink-600 block uppercase tracking-wider">
                Current Room
              </span>
              <span className="text-sm font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-1">
                {activeRoom.name}
                <ChevronDown className="w-3.5 h-3.5 text-pink-600" />
              </span>
            </div>
          </button>
        </div>

        {/* Action Controls: Decorate Mode vs Play Mode + Theme */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Theme Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playPop();
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Change Room Atmosphere"
            >
              <Palette className="w-4 h-4 text-pink-500" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Theme Dropdown Menu */}
            {isThemeMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-pink-200 p-2 z-50 space-y-1 animate-in zoom-in-95">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                  Room Atmospheres
                </span>
                {ROOM_THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                      activeRoom.styleTheme === theme.id
                        ? 'bg-pink-100 text-pink-800'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{theme.icon}</span>
                    <span className="truncate">{theme.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mode Toggle: Decorating vs Play/Explore */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                sound.playPop();
                setIsDecoratingMode(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                isDecoratingMode
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brush className="w-3.5 h-3.5" />
              <span>Decorate</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setIsDecoratingMode(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                !isDecoratingMode
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
          </div>

          {/* Reset Room Button */}
          <button
            onClick={handleResetRoom}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 cursor-pointer transition-colors"
            title="Reset Room Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🏡 Interactive Room Canvas */}
      <RoomCanvas
        room={activeRoom}
        onUpdatePlacedItems={handleUpdatePlacedItems}
        onRemoveItem={handleRemoveItem}
        onSelectSection={onSelectSection}
        isDecoratingMode={isDecoratingMode}
      />

      {/* 🎒 Bottom Feature Dock / Tool Buttons */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-3 sm:p-4 border-2 border-pink-100 shadow-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Collection Drawer Button */}
        <button
          id="home-open-collection-btn"
          onClick={() => {
            sound.playPop();
            setIsCollectionOpen(true);
          }}
          className="flex-1 min-w-[120px] py-2.5 px-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <span className="text-base">🎒</span>
          <span>My Collection</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
            {homeState.unlockedItemIds.length}
          </span>
        </button>

        {/* Sticker Book Button */}
        <button
          id="home-open-stickerbook-btn"
          onClick={() => {
            sound.playPop();
            setIsStickerBookOpen(true);
          }}
          className="flex-1 min-w-[120px] py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <span className="text-base">📒</span>
          <span>Sticker Book</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
            {stickers.filter((s) => s.unlocked).length}
          </span>
        </button>

        {/* Knowledge Garden Button */}
        <button
          id="home-open-garden-btn"
          onClick={() => {
            sound.playPop();
            setIsGardenOpen(true);
          }}
          className="flex-1 min-w-[120px] py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <span className="text-base">🌳</span>
          <span>Knowledge Garden</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px]">
            {masteredWordsCount}
          </span>
        </button>

        {/* Rooms Switcher Button */}
        <button
          id="home-open-rooms-btn"
          onClick={() => {
            sound.playPop();
            setIsRoomSwitcherOpen(true);
          }}
          className="py-2.5 px-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          title="View All Unlocked Rooms"
        >
          <DoorOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Rooms</span>
        </button>
      </div>

      {/* Auto-Save Notification Toast */}
      {saveToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Room design auto-saved! 🏡</span>
        </div>
      )}

      {/* 🎒 Collection Drawer Modal */}
      <CollectionDrawer
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
        unlockedItemIds={homeState.unlockedItemIds}
        placedItems={activeRoom.placedItems}
        onPlaceItem={handlePlaceItem}
      />

      {/* 📒 Sticker Book Album Modal */}
      <StickerBookModal
        isOpen={isStickerBookOpen}
        onClose={() => setIsStickerBookOpen(false)}
        stickers={stickers}
        onPlaceStickerInRoom={handlePlaceStickerInRoom}
      />

      {/* 🌳 Knowledge Garden Modal */}
      <KnowledgeGardenModal
        isOpen={isGardenOpen}
        onClose={() => setIsGardenOpen(false)}
        words={words}
      />

      {/* 🚪 Room Switcher Modal */}
      <RoomSwitcherModal
        isOpen={isRoomSwitcherOpen}
        onClose={() => setIsRoomSwitcherOpen(false)}
        rooms={homeState.rooms}
        activeRoomId={homeState.activeRoomId}
        onSelectRoom={(roomId) => {
          persistHomeState({
            ...homeState,
            activeRoomId: roomId
          });
        }}
      />

      {/* 🎉 Earned Gift Surprise Celebration Modal */}
      <EarnedGiftModal
        gift={earnedGift}
        onAddToHome={(item) => {
          handlePlaceItem(item);
          setEarnedGift(null);
        }}
        onSaveToCollection={() => {
          setEarnedGift(null);
        }}
        onDismiss={() => setEarnedGift(null)}
      />
    </div>
  );
};
