import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShoppingBag,
  User,
  Coins,
  Flame,
  Undo2,
  Check,
  Gamepad2,
  DoorOpen,
  X,
  Palette,
  HelpCircle,
  ArrowLeft
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
  ReadingSession,
  CharacterState,
  CharacterCustomization,
  FurnitureCollection
} from '../types';
import {
  ROOM_THEME_OPTIONS,
  INITIAL_ROOMS,
  INITIAL_HOME_ITEMS
} from '../data/learningHomeData';
import { STARTER_PACK_ITEM_IDS, SHOP_CATALOG_ITEMS, getShopItemById } from '../data/homeShopCatalog';
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
import { KnowledgeGardenView } from './learningHome/KnowledgeGardenView';
import { DecorateDrawer, DecorateMainTab } from './learningHome/DecorateDrawer';
import { CollectionDrawer } from './learningHome/CollectionDrawer';
import { StickerBookModal } from './learningHome/StickerBookModal';
import { KnowledgeGardenModal } from './learningHome/KnowledgeGardenModal';
import { RoomSwitcherModal } from './learningHome/RoomSwitcherModal';
import { EarnedGiftModal } from './learningHome/EarnedGiftModal';
import { HomeShop } from './learningHome/HomeShop';
import { CharacterCustomizerModal } from './learningHome/CharacterCustomizerModal';
import { DEFAULT_CHARACTER_CUSTOMIZATION } from './learningHome/HomeCharacter';
import { DesktopShopSidebar } from './learningHome/DesktopShopSidebar';
import { FurnitureCollectionBar } from './learningHome/FurnitureCollectionBar';
import { ItemDetailsAndInteractions } from './learningHome/ItemDetailsAndInteractions';
import { SeasonalCollectionsView } from './learningHome/SeasonalCollectionsView';
import { CoinRewardGuideModal } from './learningHome/CoinRewardGuideModal';
import { ItemDetailsModal } from './learningHome/ItemDetailsModal';
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
    const loaded = profile.learningHomeState || loadLearningHomeState();
    return {
      ...loaded,
      character: loaded.character || {
        x: 45,
        y: 65,
        facing: 'right',
        animation: 'idle',
        customization: DEFAULT_CHARACTER_CUSTOMIZATION
      },
      learningCoins: typeof profile.learningCoins === 'number'
        ? profile.learningCoins
        : typeof loaded.learningCoins === 'number'
        ? loaded.learningCoins
        : 350
    };
  });

  // Active Main View: Room Canvas vs Boutique Shop vs Botanical Knowledge Garden
  const [activeMainView, setActiveMainView] = useState<'room' | 'shop' | 'garden'>('room');

  // Mode: Default strictly to PLAY MODE (false) as requested in Section 1
  const [isDecoratingMode, setIsDecoratingMode] = useState<boolean>(false);

  // Decorate Drawer state
  const [decorateTab, setDecorateTab] = useState<DecorateMainTab>('furniture');
  const [isDecorateDrawerOpen, setIsDecorateDrawerOpen] = useState<boolean>(false);

  // Undo history for room decorating (up to 20 past configurations)
  const [history, setHistory] = useState<
    Array<{ placedItems: PlacedHomeItem[]; inventory: Record<string, number> }>
  >([]);

  // Sticker Book State
  const [stickers, setStickers] = useState<StickerItem[]>(() => loadStickerBook());

  // UI Modals State
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);
  const [isGardenOpen, setIsGardenOpen] = useState(false);
  const [isRoomSwitcherOpen, setIsRoomSwitcherOpen] = useState(false);
  const [isCharacterCustomizerOpen, setIsCharacterCustomizerOpen] = useState(false);
  const [isCoinRewardGuideOpen, setIsCoinRewardGuideOpen] = useState(false);
  const [isItemDetailsModalOpen, setIsItemDetailsModalOpen] = useState(false);
  const [saveToastVisible, setSaveToastVisible] = useState(false);

  // Selected item for the Item Details & Interactive Preview panel
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<HomeItem | null>(() => {
    return (
      SHOP_CATALOG_ITEMS.find((i) => i.id === 'furn-classic-single-bed') ||
      INITIAL_HOME_ITEMS[0] ||
      null
    );
  });

  // User Coins
  const userCoins = profile.learningCoins ?? homeState.learningCoins ?? 350;

  // Surprise Earned Gift State
  const [earnedGift, setEarnedGift] = useState<{
    item: HomeItem;
    reason: string;
  } | null>(null);

  // Active Room reference
  const activeRoom: HomeRoom =
    homeState.rooms[homeState.activeRoomId] || INITIAL_ROOMS.main_room;

  // Persist State helper
  const persistHomeState = (newState: UserLearningHomeState) => {
    setHomeState(newState);
    saveLearningHomeState(newState);
    if (onUpdateProfile) {
      onUpdateProfile({
        learningHomeState: newState,
        learningCoins: newState.learningCoins
      });
    }
  };

  // Push to Undo history before modifying placed items
  const pushHistory = (snapshot: {
    placedItems: PlacedHomeItem[];
    inventory: Record<string, number>;
  }) => {
    setHistory((prev) => [snapshot, ...prev].slice(0, 20));
  };

  // Perform Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    sound.playPop();
    const previous = history[0];
    setHistory((prev) => prev.slice(1));

    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        placedItems: previous.placedItems
      }
    };
    persistHomeState({
      ...homeState,
      inventory: previous.inventory,
      rooms: updatedRooms
    });
  };

  // Sync educational unlocks on mount and when words/reading updates
  useEffect(() => {
    const unlockResult = checkEducationalItemUnlocks(
      profile,
      words,
      readingSessions,
      homeState.unlockedItemIds
    );

    if (unlockResult.newlyUnlockedItems.length > 0) {
      const updatedUnlocked = [
        ...homeState.unlockedItemIds,
        ...unlockResult.newlyUnlockedItems.map((i) => i.id)
      ];
      const nextInventory = { ...(homeState.inventory || {}) };
      for (const item of unlockResult.newlyUnlockedItems) {
        if ((nextInventory[item.id] || 0) === 0) {
          nextInventory[item.id] = 1;
        }
      }
      const updatedState = {
        ...homeState,
        unlockedItemIds: updatedUnlocked,
        inventory: nextInventory
      };
      persistHomeState(updatedState);

      const firstNewItem = unlockResult.newlyUnlockedItems[0];
      setEarnedGift({
        item: firstNewItem,
        reason: firstNewItem.unlockCondition || 'Learning achievement unlocked!'
      });
      sound.playLevelUpFanfare();
    }

    const { updatedRooms, newlyUnlockedRooms } = updateRoomUnlockProgression(
      profile,
      words,
      readingSessions,
      homeState.rooms
    );
    if (newlyUnlockedRooms.length > 0) {
      persistHomeState({
        ...homeState,
        rooms: updatedRooms
      });
    }

    const { updatedStickers, newlyUnlockedStickers } = updateStickerBookProgression(
      profile,
      words,
      readingSessions,
      stickers
    );
    if (newlyUnlockedStickers.length > 0) {
      setStickers(updatedStickers);
      saveStickerBook(updatedStickers);
    }
  }, [words.length, profile.streakDays, readingSessions.length]);

  // Update placed items for active room
  const handleUpdatePlacedItems = (placedItems: PlacedHomeItem[]) => {
    pushHistory({
      placedItems: activeRoom.placedItems,
      inventory: homeState.inventory || {}
    });
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

    setSaveToastVisible(true);
    setTimeout(() => setSaveToastVisible(false), 2000);
  };

  // Update room style (walls, floors, theme)
  const handleUpdateRoomStyle = (updates: {
    wallpaperClass?: string;
    flooringClass?: string;
    styleTheme?: HomeRoom['styleTheme'];
  }) => {
    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        ...updates
      }
    };
    persistHomeState({
      ...homeState,
      rooms: updatedRooms
    });
  };

  // Update character position/animation
  const handleUpdateCharacter = (character: CharacterState) => {
    persistHomeState({
      ...homeState,
      character
    });
  };

  // Save character customization
  const handleSaveCharacterCustomization = (customization: CharacterCustomization) => {
    const updatedChar: CharacterState = {
      ...homeState.character,
      customization
    };
    persistHomeState({
      ...homeState,
      character: updatedChar
    });
  };

  // Buy item from boutique shop (increments item inventory quantity by 1)
  const handleBuyItem = (item: HomeItem) => {
    const price = item.price ?? 0;
    if (userCoins < price) {
      sound.playPop();
      return;
    }

    sound.playSuccessChime();
    const nextCoins = userCoins - price;
    const nextUnlocked = Array.from(new Set([...homeState.unlockedItemIds, item.id]));
    const currentInventory = homeState.inventory || {};
    const currentCount = currentInventory[item.id] || 0;
    const nextInventory: Record<string, number> = {
      ...currentInventory,
      [item.id]: currentCount + 1
    };

    const updatedState: UserLearningHomeState = {
      ...homeState,
      learningCoins: nextCoins,
      unlockedItemIds: nextUnlocked,
      inventory: nextInventory
    };

    persistHomeState(updatedState);
    if (onUpdateProfile) {
      onUpdateProfile({
        learningCoins: nextCoins,
        learningHomeState: updatedState
      });
    }
  };

  // Place item into room (decrements inventory by exactly 1)
  const handlePlaceItem = (item: HomeItem) => {
    const currentInventory = homeState.inventory || {};
    const currentCount = currentInventory[item.id] || 0;

    // Must have at least 1 in backpack inventory to place
    if (currentCount <= 0) {
      sound.playPop();
      return;
    }

    sound.playPop();
    const nextInventory: Record<string, number> = {
      ...currentInventory,
      [item.id]: Math.max(0, currentCount - 1)
    };

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
    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        placedItems: updatedPlaced
      }
    };

    const updatedState: UserLearningHomeState = {
      ...homeState,
      inventory: nextInventory,
      rooms: updatedRooms
    };

    pushHistory({
      placedItems: activeRoom.placedItems,
      inventory: currentInventory
    });
    persistHomeState(updatedState);
    setActiveMainView('room');

    setSaveToastVisible(true);
    setTimeout(() => setSaveToastVisible(false), 2000);
  };

  // Store item: removes from active room and returns exactly 1 copy to backpack inventory
  const handleStoreItem = (instanceId: string) => {
    const itemToStore = activeRoom.placedItems.find((p) => p.instanceId === instanceId);
    if (!itemToStore) return;

    sound.playPop();
    const currentInventory = homeState.inventory || {};
    const currentCount = currentInventory[itemToStore.itemId] || 0;
    const nextInventory: Record<string, number> = {
      ...currentInventory,
      [itemToStore.itemId]: currentCount + 1
    };

    const updatedPlaced = activeRoom.placedItems.filter((p) => p.instanceId !== instanceId);
    const updatedRooms = {
      ...homeState.rooms,
      [homeState.activeRoomId]: {
        ...activeRoom,
        placedItems: updatedPlaced
      }
    };

    const updatedState: UserLearningHomeState = {
      ...homeState,
      inventory: nextInventory,
      rooms: updatedRooms
    };

    pushHistory({
      placedItems: activeRoom.placedItems,
      inventory: currentInventory
    });
    persistHomeState(updatedState);

    setSaveToastVisible(true);
    setTimeout(() => setSaveToastVisible(false), 2000);
  };

  // Remove item from room (stores back to inventory)
  const handleRemoveItem = (instanceId: string) => {
    handleStoreItem(instanceId);
  };

  // Handle switching to Decorate Mode
  const handleEnterDecorate = () => {
    sound.playPop();
    setIsDecoratingMode(true);
    setIsDecorateDrawerOpen(true);
    setDecorateTab('furniture');
    setActiveMainView('room');
  };

  // Handle switching to Play Mode
  const handleEnterPlay = () => {
    sound.playPop();
    setIsDecoratingMode(false);
    setIsDecorateDrawerOpen(false);
    setActiveMainView('room');
  };

  return (
    <div id="learning-home-world" className="space-y-3 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 🏡 1. MINIMAL TOP BAR: Only My Home, Coins, Streak, Profile */}
      {/* ========================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl px-4 py-3 border-2 border-amber-100 shadow-2xs flex items-center justify-between gap-3">
        {/* Left: 🏡 My Home (clicking allows room switching) */}
        <button
          id="home-room-title-btn"
          onClick={() => {
            sound.playPop();
            setIsRoomSwitcherOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-200 text-xs font-black cursor-pointer transition-all active:scale-95"
          title="Switch room or haven"
        >
          <span className="text-lg">🏡</span>
          <span className="text-sm font-extrabold tracking-tight">My Home</span>
          <span className="text-xs text-amber-700/70 font-medium hidden sm:inline">
            • {activeRoom.name}
          </span>
        </button>

        {/* Right: 🪙 Coin Balance, 🔥 Streak, 👤 Profile / Avatar Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 🪙 Coin Balance & How to Earn Guide */}
          <div className="flex items-center gap-1">
            <button
              id="learning-coins-header-pill"
              onClick={() => {
                sound.playPop();
                setIsCoinRewardGuideOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-200/90 hover:from-amber-200 hover:to-amber-300 border border-amber-300 px-3 py-1.5 rounded-2xl shadow-2xs transition-transform active:scale-95 cursor-pointer"
              title="LearningCoins balance. Tap to see how to earn!"
            >
              <span className="text-base">🪙</span>
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {userCoins.toLocaleString()}
              </span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setIsCoinRewardGuideOpen(true);
              }}
              className="w-7 h-7 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              title="How to Earn Coins"
            >
              ?
            </button>
          </div>

          {/* 🔥 Current Streak */}
          <div
            className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-2xl shadow-2xs"
            title={`Current Learning Streak: ${profile.streakDays || 1} day(s)`}
          >
            <span className="text-base">🔥</span>
            <span className="text-xs sm:text-sm font-black text-rose-800">
              {profile.streakDays || 1}
            </span>
          </div>

          {/* 🎒 Backpack / Inventory Collection */}
          <button
            id="open-backpack-collection-btn"
            onClick={() => {
              sound.playPop();
              setIsCollectionOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-950 text-xs font-extrabold border border-pink-200 cursor-pointer transition-colors active:scale-95"
            title="Open Backpack Collection"
          >
            <span className="text-base">🎒</span>
            <span className="hidden sm:inline font-bold">Backpack</span>
          </button>

          {/* 👤 Profile / Avatar Access */}
          <button
            id="open-character-customizer-btn"
            onClick={() => {
              sound.playPop();
              setIsCharacterCustomizerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold border border-stone-200 cursor-pointer transition-colors active:scale-95"
            title="Profile & Mini Learner Avatar"
          >
            <span className="text-base">👤</span>
            <span className="hidden sm:inline font-bold">
              {profile.name ? profile.name.split(' ')[0] : 'Learner'}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🖼️ 2. CENTERPIECE ROOM WORLD OR OVERLAY SHOP */}
      {/* ========================================================= */}
      {activeMainView === 'shop' ? (
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-amber-100 min-h-[580px]">
          {/* Top navigation ribbon to return to room canvas */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-amber-50/90 border-b border-amber-200">
            <button
              onClick={() => {
                sound.playPop();
                setActiveMainView('room');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/60 text-stone-800 font-extrabold text-xs border border-amber-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700" />
              <span>Return to Room Canvas</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-black text-amber-950">
              <span className="text-stone-500 font-medium">Available:</span>
              <span>🪙 {userCoins.toLocaleString()} Coins</span>
            </div>
          </div>

          <HomeShop
            userCoins={userCoins}
            unlockedItemIds={homeState.unlockedItemIds}
            inventory={homeState.inventory || {}}
            onBuyItem={handleBuyItem}
            onPlaceItem={(item) => {
              handlePlaceItem(item);
              setActiveMainView('room');
              setIsDecoratingMode(true);
            }}
            onClose={() => setActiveMainView('room')}
          />
        </div>
      ) : activeMainView === 'garden' ? (
        <KnowledgeGardenView
          profile={profile}
          words={words}
          onSelectSection={onSelectSection}
          onSwitchToRoomDecorator={() => setActiveMainView('room')}
        />
      ) : (
        <div className="space-y-6">
          {/* ========================================================= */}
          {/* 🏡 2A. DESKTOP 2-COLUMN DASHBOARD (ROOM ON LEFT, SHOP ON RIGHT) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Room Canvas + Play/Decorate/Shop Navigation Bar */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3">
              <RoomCanvas
                room={activeRoom}
                onUpdatePlacedItems={handleUpdatePlacedItems}
                onRemoveItem={handleRemoveItem}
                onStoreItem={handleStoreItem}
                onSelectSection={onSelectSection}
                isDecoratingMode={isDecoratingMode}
                character={homeState.character}
                onUpdateCharacter={handleUpdateCharacter}
                themeId={profile.theme}
                onUndo={handleUndo}
                canUndo={history.length > 0}
              />

              {/* 🎮 Bottom Navigation Mode Bar */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-2.5 sm:p-3.5 border-2 border-amber-100 shadow-sm flex items-center justify-between gap-2 max-w-2xl mx-auto">
                {!isDecoratingMode ? (
                  /* --- PLAY MODE: 3 Primary Actions --- */
                  <div className="flex items-center justify-center gap-3 w-full">
                    {/* 🎮 Play */}
                    <button
                      id="home-mode-play-btn"
                      onClick={handleEnterPlay}
                      className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Play</span>
                    </button>

                    {/* ✨ Decorate */}
                    <button
                      id="home-mode-decorate-btn"
                      onClick={handleEnterDecorate}
                      className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Decorate</span>
                    </button>

                    {/* 🛍️ Shop */}
                    <button
                      id="home-mode-shop-btn"
                      onClick={() => {
                        sound.playPop();
                        setActiveMainView('shop');
                      }}
                      className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Shop</span>
                    </button>
                  </div>
                ) : (
                  /* --- DECORATE MODE: Dedicated Actions --- */
                  <div className="flex items-center justify-between gap-2 w-full">
                    {/* Categories Pills */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* 🪑 Furniture */}
                      <button
                        onClick={() => {
                          sound.playPop();
                          setDecorateTab('furniture');
                          setIsDecorateDrawerOpen(true);
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                          isDecorateDrawerOpen && decorateTab === 'furniture'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        <span>🪑</span>
                        <span>Furniture</span>
                      </button>

                      {/* 🌸 Decor */}
                      <button
                        onClick={() => {
                          sound.playPop();
                          setDecorateTab('decor');
                          setIsDecorateDrawerOpen(true);
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                          isDecorateDrawerOpen && decorateTab === 'decor'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        <span>🌸</span>
                        <span>Decor</span>
                      </button>

                      {/* 🧱 Room */}
                      <button
                        onClick={() => {
                          sound.playPop();
                          setDecorateTab('room');
                          setIsDecorateDrawerOpen(true);
                        }}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                          isDecorateDrawerOpen && decorateTab === 'room'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        <span>🧱</span>
                        <span>Room</span>
                      </button>
                    </div>

                    {/* Action Controls: Undo & Done */}
                    <div className="flex items-center gap-1.5">
                      {/* ↩️ Undo */}
                      <button
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-extrabold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          history.length === 0
                            ? 'text-stone-300 cursor-not-allowed bg-stone-50'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                        title="Undo last change"
                      >
                        <Undo2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Undo</span>
                      </button>

                      {/* ✓ Done */}
                      <button
                        onClick={handleEnterPlay}
                        className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                        title="Finish decorating and enter Play Mode"
                      >
                        <Check className="w-4 h-4" />
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Desktop Shop Sidebar (Hidden on mobile, visible on desktop) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <DesktopShopSidebar
                userCoins={userCoins}
                unlockedItemIds={homeState.unlockedItemIds}
                inventory={homeState.inventory || {}}
                placedItemIds={activeRoom.placedItems.map((p) => p.itemId)}
                onBuyItem={handleBuyItem}
                onPlaceItem={(item) => {
                  handlePlaceItem(item);
                  setIsDecoratingMode(true);
                }}
                onSelectItemForInspection={(item) => {
                  setSelectedItemForDetails(item);
                }}
                onOpenFullShop={() => setActiveMainView('shop')}
                selectedItemId={selectedItemForDetails?.id}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 🛋️ 2B. FURNITURE & DECORATION COLLECTION */}
          {/* ========================================================= */}
          <FurnitureCollectionBar
            unlockedItemIds={homeState.unlockedItemIds}
            inventory={homeState.inventory || {}}
            placedItems={activeRoom.placedItems}
            onPlaceItem={(item) => {
              handlePlaceItem(item);
              setIsDecoratingMode(true);
            }}
            onSelectItemForInspection={(item) => {
              setSelectedItemForDetails(item);
            }}
            onOpenShop={() => setActiveMainView('shop')}
            selectedItemId={selectedItemForDetails?.id}
          />

          {/* ========================================================= */}
          {/* 📦 2C. ITEM DETAILS & INTERACTIVE ITEMS (2-COLUMN) */}
          {/* ========================================================= */}
          <ItemDetailsAndInteractions
            selectedItem={selectedItemForDetails}
            unlockedItemIds={homeState.unlockedItemIds}
            inventory={homeState.inventory || {}}
            userCoins={userCoins}
            onBuyItem={handleBuyItem}
            onPlaceItem={(item) => {
              handlePlaceItem(item);
              setIsDecoratingMode(true);
            }}
            onSelectInteractiveItemExample={(itemId) => {
              const it = SHOP_CATALOG_ITEMS.find((i) => i.id === itemId);
              if (it) {
                setSelectedItemForDetails(it);
              }
            }}
          />

          {/* ========================================================= */}
          {/* 🍂 2D. SEASONAL COLLECTIONS */}
          {/* ========================================================= */}
          <SeasonalCollectionsView
            unlockedItemIds={homeState.unlockedItemIds}
            inventory={homeState.inventory || {}}
            onSelectSeasonalItem={(item) => {
              setSelectedItemForDetails(item);
            }}
            onOpenShopToSeason={() => {
              setActiveMainView('shop');
            }}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 🪑 PROGRESSIVE DISCLOSURE DECORATE DRAWER */}
      {/* ========================================================= */}
      <DecorateDrawer
        isOpen={isDecoratingMode && isDecorateDrawerOpen && activeMainView === 'room'}
        activeTab={decorateTab}
        onClose={() => setIsDecorateDrawerOpen(false)}
        unlockedItemIds={homeState.unlockedItemIds}
        inventory={homeState.inventory || {}}
        currentRoom={activeRoom}
        onPlaceItem={handlePlaceItem}
        onUpdateRoomStyle={handleUpdateRoomStyle}
        onOpenShop={() => {
          setIsDecorateDrawerOpen(false);
          setActiveMainView('shop');
        }}
      />

      {/* 🎒 Collection / Backpack Drawer */}
      <CollectionDrawer
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
        unlockedItemIds={homeState.unlockedItemIds}
        inventory={homeState.inventory || {}}
        placedItems={activeRoom.placedItems}
        onPlaceItem={(item) => {
          handlePlaceItem(item);
          setIsCollectionOpen(false);
          setIsDecoratingMode(true);
        }}
        onOpenShop={() => {
          setIsCollectionOpen(false);
          setActiveMainView('shop');
        }}
      />

      {/* Auto-Save Notification Toast */}
      {saveToastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900/90 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Room saved! 🏡</span>
        </div>
      )}

      {/* 👤 Character Customizer Modal */}
      <CharacterCustomizerModal
        isOpen={isCharacterCustomizerOpen}
        onClose={() => setIsCharacterCustomizerOpen(false)}
        customization={homeState.character?.customization || DEFAULT_CHARACTER_CUSTOMIZATION}
        onSave={handleSaveCharacterCustomization}
      />

      {/* 🚪 Room Switcher Modal */}
      <RoomSwitcherModal
        isOpen={isRoomSwitcherOpen}
        onClose={() => setIsRoomSwitcherOpen(false)}
        rooms={homeState.rooms}
        activeRoomId={homeState.activeRoomId}
        onSelectRoom={(roomId) => {
          if (roomId === 'knowledge_garden') {
            setActiveMainView('garden');
          } else {
            setActiveMainView('room');
          }
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

      {/* 🪙 How to Earn Learning Coins Guide Modal */}
      <CoinRewardGuideModal
        isOpen={isCoinRewardGuideOpen}
        onClose={() => setIsCoinRewardGuideOpen(false)}
        userCoins={userCoins}
        streakDays={profile.streakDays || 1}
      />

      {/* 📦 Focused Item Details Modal (on deep inspect) */}
      <ItemDetailsModal
        item={selectedItemForDetails}
        isOpen={isItemDetailsModalOpen}
        onClose={() => setIsItemDetailsModalOpen(false)}
        isUnlocked={
          selectedItemForDetails
            ? homeState.unlockedItemIds.includes(selectedItemForDetails.id) ||
              selectedItemForDetails.unlocked
            : false
        }
        inventoryCount={
          selectedItemForDetails
            ? homeState.inventory?.[selectedItemForDetails.id] || 0
            : 0
        }
        userCoins={userCoins}
        onBuyItem={handleBuyItem}
        onPlaceItem={(item) => {
          handlePlaceItem(item);
          setIsItemDetailsModalOpen(false);
          setIsDecoratingMode(true);
        }}
      />
    </div>
  );
};
