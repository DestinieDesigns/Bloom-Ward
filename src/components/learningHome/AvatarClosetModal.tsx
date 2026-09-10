import React, { useState, useEffect } from 'react';
import {
  CharacterCustomization,
  CharacterState,
  WardrobeCategory,
  WardrobeItem,
  SavedOutfit
} from '../../types';
import { HomeCharacter } from './HomeCharacter';
import {
  WARDROBE_ITEMS,
  HAIR_COLORS,
  SKIN_TONES,
  PRESET_OUTFITS,
  getWardrobeItemById,
  getWardrobeItemsByCategory
} from '../../data/wardrobeCatalog';
import {
  X,
  Sparkles,
  Check,
  Lock,
  Coins,
  Bookmark,
  Heart,
  Save,
  Trash2,
  RotateCcw,
  Sliders,
  Shirt,
  Glasses
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AvatarClosetModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CharacterCustomization;
  onSave: (customization: CharacterCustomization) => void;
  learningCoins?: number;
  onDeductCoins?: (amount: number) => boolean;
  unlockedWardrobeIds?: string[];
  onUnlockWardrobeItem?: (itemId: string) => void;
}

const STORAGE_SAVED_OUTFITS_KEY = 'bloomword_user_saved_outfits_v1';
const STORAGE_UNLOCKED_WARDROBE_KEY = 'bloomword_unlocked_wardrobe_v1';

export const AvatarClosetModal: React.FC<AvatarClosetModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSave,
  learningCoins = 150,
  onDeductCoins,
  unlockedWardrobeIds = [],
  onUnlockWardrobeItem
}) => {
  const [current, setCurrent] = useState<CharacterCustomization>(customization);
  const [activeCategory, setActiveCategory] = useState<WardrobeCategory | 'face' | 'outfits'>('tops');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set(unlockedWardrobeIds));

  // Load saved outfits and unlocked items from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_OUTFITS_KEY);
      if (stored) {
        setSavedOutfits(JSON.parse(stored));
      } else {
        setSavedOutfits(PRESET_OUTFITS);
      }

      const storedUnlocked = localStorage.getItem(STORAGE_UNLOCKED_WARDROBE_KEY);
      if (storedUnlocked) {
        const parsed = JSON.parse(storedUnlocked);
        setUnlockedItems(new Set([...unlockedWardrobeIds, ...parsed]));
      }
    } catch {
      setSavedOutfits(PRESET_OUTFITS);
    }
  }, [unlockedWardrobeIds]);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setCurrent(customization);
    }
  }, [isOpen, customization]);

  if (!isOpen) return null;

  const previewState: CharacterState = {
    x: 50,
    y: 50,
    facing: 'right',
    animation: 'idle',
    customization: current
  };

  const handleEquipItem = (item: WardrobeItem) => {
    sound.playPop();
    const updated = { ...current };

    switch (item.category) {
      case 'tops':
        updated.topId = item.id;
        updated.dressId = undefined; // mutually exclusive with full dresses
        updated.sleepwearId = undefined;
        updated.outfitColor = item.color;
        break;
      case 'bottoms':
        updated.bottomId = item.id;
        updated.dressId = undefined;
        updated.sleepwearId = undefined;
        break;
      case 'dresses':
        updated.dressId = item.id;
        updated.topId = undefined;
        updated.bottomId = undefined;
        updated.sleepwearId = undefined;
        updated.outfitColor = item.color;
        break;
      case 'sleepwear':
        updated.sleepwearId = item.id;
        updated.dressId = undefined;
        updated.topId = undefined;
        updated.bottomId = undefined;
        updated.outfitColor = item.color;
        break;
      case 'shoes':
        updated.shoesId = item.id;
        break;
      case 'hair':
        updated.hairStyle = item.renderKey;
        break;
      case 'accessories':
        updated.accessoryId = item.id;
        break;
      case 'headwear':
        updated.headwearId = item.id;
        break;
      case 'eyewear':
        updated.eyewearId = item.id;
        break;
    }

    setCurrent(updated);
  };

  const handleRemoveCategoryItem = (category: WardrobeCategory) => {
    sound.playPop();
    const updated = { ...current };
    switch (category) {
      case 'tops':
        updated.topId = undefined;
        break;
      case 'bottoms':
        updated.bottomId = undefined;
        break;
      case 'dresses':
        updated.dressId = undefined;
        break;
      case 'sleepwear':
        updated.sleepwearId = undefined;
        break;
      case 'accessories':
        updated.accessoryId = undefined;
        break;
      case 'headwear':
        updated.headwearId = undefined;
        break;
      case 'eyewear':
        updated.eyewearId = undefined;
        break;
    }
    setCurrent(updated);
  };

  const handleUnlockItem = (item: WardrobeItem) => {
    if (!item.price) return;
    if (learningCoins < item.price) {
      sound.playPop();
      return;
    }

    if (onDeductCoins && !onDeductCoins(item.price)) {
      return;
    }

    sound.playBloomSparkle();
    const nextUnlocked = new Set(unlockedItems);
    nextUnlocked.add(item.id);
    setUnlockedItems(nextUnlocked);

    try {
      localStorage.setItem(STORAGE_UNLOCKED_WARDROBE_KEY, JSON.stringify(Array.from(nextUnlocked)));
    } catch {
      // ignore
    }

    if (onUnlockWardrobeItem) {
      onUnlockWardrobeItem(item.id);
    }

    handleEquipItem(item);
  };

  const handleSaveCurrentOutfit = () => {
    if (!newOutfitName.trim()) return;
    sound.playSuccessChime();

    const newOutfit: SavedOutfit = {
      id: `outfit-${Date.now()}`,
      name: newOutfitName.trim(),
      icon: '✨',
      customization: { ...current },
      createdAt: new Date().toISOString()
    };

    const updated = [newOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    try {
      localStorage.setItem(STORAGE_SAVED_OUTFITS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewOutfitName('');
    setShowSavePrompt(false);
  };

  const handleDeleteSavedOutfit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playPop();
    const updated = savedOutfits.filter((o) => o.id !== id);
    setSavedOutfits(updated);
    try {
      localStorage.setItem(STORAGE_SAVED_OUTFITS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleEquipSavedOutfit = (outfit: SavedOutfit) => {
    sound.playSuccessChime();
    setCurrent({ ...outfit.customization });
  };

  const handleSaveAndApply = () => {
    sound.playSuccessChime();
    onSave(current);
    onClose();
  };

  const isItemUnlocked = (item: WardrobeItem) => {
    return item.unlocked || unlockedItems.has(item.id);
  };

  // Filter items for active tab
  const categoryItems = activeCategory === 'face' || activeCategory === 'outfits'
    ? []
    : getWardrobeItemsByCategory(activeCategory).filter((item) => {
        if (selectedCollection === 'all') return true;
        return item.collection === selectedCollection;
      });

  const collections = ['all', 'everyday', 'cozy', 'scholar', 'cottage', 'nature', 'faith', 'sporty', 'sleepy'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col h-[92vh] max-h-[860px]"
      >
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-100/90 via-rose-100/70 to-amber-100/90 px-6 py-3.5 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪞</span>
            <div>
              <h2 className="text-lg font-black text-amber-950 flex items-center gap-2">
                Wardrobe & Styling Studio
              </h2>
              <p className="text-xs text-amber-800 font-medium">
                Dress your character in layered clothing and collectibles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Learning Coins Display */}
            <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
              <span className="text-sm">🪙</span>
              <span className="font-black text-xs text-amber-950">{learningCoins}</span>
              <span className="text-2xs text-amber-700 font-bold uppercase">Coins</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center border border-amber-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split Layout: Left Avatar Mirror vs Right Wardrobe Rack */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* ========================================================= */}
          {/* 🌟 LEFT: LARGE AVATAR MIRROR STAGE */}
          {/* ========================================================= */}
          <div className="w-full md:w-80 bg-gradient-to-b from-stone-50 via-amber-50/50 to-stone-100 p-5 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-amber-100 shrink-0">
            {/* Decorative Arched Mirror Frame */}
            <div className="w-full flex-1 max-h-[360px] bg-white rounded-t-full rounded-b-3xl border-4 border-amber-300/80 shadow-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
              {/* Mirror Reflection Sheen */}
              <div className="absolute top-0 right-0 w-32 h-64 bg-gradient-to-bl from-white/60 via-white/20 to-transparent rotate-12 pointer-events-none" />

              {/* Character in center */}
              <div className="relative z-10 scale-110 sm:scale-125 transition-transform duration-300">
                <HomeCharacter state={previewState} size="xl" showShadow={true} />
              </div>

              {/* Mirror Base Pedestal */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-amber-100/60 border-t border-amber-200/80" />
            </div>

            {/* Quick Action Ribbon Under Mirror */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSavePrompt(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-amber-300"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Outfit
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    setCurrent({
                      ...current,
                      expression: current.expression === 'happy' ? 'proud' : current.expression === 'proud' ? 'sleepy' : 'happy'
                    });
                  }}
                  className="py-2 px-3 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                  title="Cycle expression"
                >
                  😊 Emote
                </button>
              </div>

              {/* Main Save & Wear Button */}
              <button
                onClick={handleSaveAndApply}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-amber-600/30 transition-all cursor-pointer transform active:scale-98"
              >
                <Check className="w-4 h-4" />
                Wear This Look
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 👗 RIGHT: WARDROBE RACK & CATEGORIES */}
          {/* ========================================================= */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-2 bg-stone-50 border-b border-stone-200 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'tops', label: 'Tops', icon: '👕' },
                { id: 'bottoms', label: 'Bottoms', icon: '👖' },
                { id: 'dresses', label: 'Dresses', icon: '👗' },
                { id: 'sleepwear', label: 'Sleepwear', icon: '🌙' },
                { id: 'shoes', label: 'Shoes', icon: '👟' },
                { id: 'hair', label: 'Hair', icon: '💇' },
                { id: 'headwear', label: 'Headwear', icon: '🎀' },
                { id: 'accessories', label: 'Accessories', icon: '✨' },
                { id: 'eyewear', label: 'Glasses', icon: '👓' },
                { id: 'face', label: 'Colors', icon: '🎨' },
                { id: 'outfits', label: 'Outfits', icon: '⭐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playPop();
                    setActiveCategory(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-Collection Filter Bar (only for clothing items) */}
            {activeCategory !== 'face' && activeCategory !== 'outfits' && (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50/40 border-b border-amber-100 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-2xs font-bold text-amber-900 uppercase mr-1">Collection:</span>
                {collections.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-bold capitalize transition-colors cursor-pointer ${
                      selectedCollection === col
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-100/60'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}

            {/* Tab Contents */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* 1. CLOTHING ITEMS GRID */}
              {activeCategory !== 'face' && activeCategory !== 'outfits' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Remove Item Button */}
                  <button
                    onClick={() => handleRemoveCategoryItem(activeCategory as WardrobeCategory)}
                    className="p-3.5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/60 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🚫</span>
                    <span className="text-xs font-bold text-stone-600">None / Remove</span>
                  </button>

                  {categoryItems.map((item) => {
                    const unlocked = isItemUnlocked(item);
                    const isEquipped =
                      current.topId === item.id ||
                      current.bottomId === item.id ||
                      current.dressId === item.id ||
                      current.sleepwearId === item.id ||
                      current.shoesId === item.id ||
                      current.headwearId === item.id ||
                      current.eyewearId === item.id ||
                      current.accessoryId === item.id ||
                      current.hairStyle === item.renderKey;

                    return (
                      <div
                        key={item.id}
                        className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/30'
                            : unlocked
                            ? 'border-stone-200 hover:border-amber-300 bg-white hover:bg-amber-50/20'
                            : 'border-stone-200/80 bg-stone-50/80 opacity-90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-2xl sm:text-3xl p-1.5 rounded-xl bg-stone-100 border border-stone-200">
                            {item.icon}
                          </span>
                          <span className="text-2xs font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {item.collection}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{item.name}</h4>
                          <p className="text-2xs text-stone-500 line-clamp-2 mt-0.5">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                          {unlocked ? (
                            isEquipped ? (
                              <span className="w-full text-center py-1 text-2xs font-extrabold text-amber-700 bg-amber-100 rounded-lg flex items-center justify-center gap-1">
                                <Check className="w-3 h-3" /> Equipped
                              </span>
                            ) : (
                              <button
                                onClick={() => handleEquipItem(item)}
                                className="w-full py-1.5 text-xs font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                              >
                                Wear
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleUnlockItem(item)}
                              disabled={!item.price || learningCoins < item.price}
                              className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                item.price && learningCoins >= item.price
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              }`}
                              title={item.unlockRequirement}
                            >
                              <Lock className="w-3 h-3" />
                              {item.price ? `${item.price} Coins` : 'Special Reward'}
                            </button>
                          )}
                        </div>

                        {!unlocked && !item.price && (
                          <div className="text-2xs text-amber-800 font-semibold mt-1 bg-amber-100/80 px-1.5 py-0.5 rounded text-center">
                            {item.unlockRequirement}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. FACE, SKIN TONE & HAIR COLOR PALETTE */}
              {activeCategory === 'face' && (
                <div className="space-y-6">
                  {/* Skin Tones */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block mb-2.5">
                      Skin Tone
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => {
                            sound.playPop();
                            setCurrent({ ...current, skinTone: tone.id });
                          }}
                          className={`w-11 h-11 rounded-full border-3 transition-transform cursor-pointer shadow-2xs ${
                            current.skinTone === tone.id
                              ? 'scale-115 border-amber-600 ring-4 ring-amber-400/30'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: tone.id }}
                          title={tone.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hair Colors */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block mb-2.5">
                      Hair Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {HAIR_COLORS.map((hair) => (
                        <button
                          key={hair.id}
                          onClick={() => {
                            sound.playPop();
                            setCurrent({ ...current, hairColor: hair.id });
                          }}
                          className={`w-11 h-11 rounded-full border-3 transition-transform cursor-pointer shadow-2xs ${
                            current.hairColor === hair.id
                              ? 'scale-115 border-amber-600 ring-4 ring-amber-400/30'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: hair.id }}
                          title={hair.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Expressions */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block mb-2.5">
                      Facial Expression
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'happy', label: 'Happy', emoji: '😊' },
                        { id: 'calm', label: 'Peaceful', emoji: '😌' },
                        { id: 'proud', label: 'Scholar Proud', emoji: '🌟' },
                        { id: 'sleepy', label: 'Sleepy / Rest', emoji: '😴' },
                        { id: 'curious', label: 'Curious', emoji: '🧐' },
                        { id: 'thinking', label: 'Thinking', emoji: '🤔' }
                      ].map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => {
                            sound.playPop();
                            setCurrent({ ...current, expression: exp.id as any });
                          }}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            current.expression === exp.id
                              ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-300/40'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700 font-medium'
                          }`}
                        >
                          <span className="text-2xl">{exp.emoji}</span>
                          <span className="text-xs">{exp.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SAVED & PRESET OUTFITS TAB */}
              {activeCategory === 'outfits' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm text-stone-900">Preset & Saved Outfits</h3>
                    <button
                      onClick={() => setShowSavePrompt(true)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Current Look
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedOutfits.map((outfit) => (
                      <div
                        key={outfit.id}
                        onClick={() => handleEquipSavedOutfit(outfit)}
                        className="p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 to-white hover:from-amber-100/60 hover:to-amber-50/60 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-white border border-amber-200 group-hover:scale-110 transition-transform">
                            {outfit.icon}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900">{outfit.name}</h4>
                            <p className="text-2xs text-stone-500">Tap to instantly wear</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                            Equip
                          </span>
                          {/* Allow deleting custom outfits */}
                          {outfit.id.startsWith('outfit-') && (
                            <button
                              onClick={(e) => handleDeleteSavedOutfit(e, outfit.id)}
                              className="w-7 h-7 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete outfit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Outfit Prompt Modal Overlay */}
        {showSavePrompt && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
            <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-amber-200 animate-scale-up">
              <h3 className="font-extrabold text-base text-amber-950 mb-1">Save Outfit</h3>
              <p className="text-xs text-stone-600 mb-3">Give this fashionable combination a name:</p>
              <input
                type="text"
                value={newOutfitName}
                onChange={(e) => setNewOutfitName(e.target.value)}
                placeholder="e.g. Cozy Study Session, Sunday Best"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 mb-4"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCurrentOutfit}
                  disabled={!newOutfitName.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Save Outfit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
