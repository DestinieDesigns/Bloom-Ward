import React, { useState } from 'react';
import {
  Compass,
  Home,
  BookOpen,
  GraduationCap,
  Flower2,
  Palette,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Sun,
  Wind,
  MapPin,
  Flame,
  Coins
} from 'lucide-react';
import { UserProfile, AppSection } from '../../types';
import { sound } from '../../utils/audio';

interface WorldDestination {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  description: string;
  atmosphere: string;
  bgGradient: string;
  accentColor: string;
  badge: string;
  activities: string[];
  targetSection: AppSection;
  previewArt: string;
}

const WORLD_DESTINATIONS: WorldDestination[] = [
  {
    id: 'my_home',
    name: 'My Cozy Home',
    category: 'Residence',
    icon: '🏡',
    tagline: 'Your personal cozy haven & living world',
    description:
      'The heart of your adventure. Sleep in your cozy bed, study at your desk, water your house plants, pet your fluffy companion, and decorate every room to reflect your unique style.',
    atmosphere: 'Warm wood, gentle sunlight, purring companion, soft ticking clock',
    bgGradient: 'from-amber-100 via-rose-50 to-orange-100',
    accentColor: 'border-amber-300 text-amber-900',
    badge: 'Home Base',
    activities: ['Interactive Furniture', 'Pet Care & Play', 'Room Decorating', 'Custom Outfits'],
    targetSection: 'home',
    previewArt: '🛏️ 📚 🐾 🪴 🪟'
  },
  {
    id: 'grand_library',
    name: 'The Grand Library',
    category: 'Literature & Stories',
    icon: '🏛️',
    tagline: 'Towering shelves, spiral staircases & cozy reading nooks',
    description:
      'Step into the serene whisper of pages turning. Cozy up in an oversized leather armchair under stained glass windows, explore classic tales, and discover wonderful new words in context.',
    atmosphere: 'Old paper scent, velvet cushions, amber lantern glow, gentle rain outside',
    bgGradient: 'from-sky-100 via-indigo-50 to-blue-100',
    accentColor: 'border-sky-300 text-sky-900',
    badge: 'Reading Adventure',
    activities: ['15-Minute Reading Timer', 'Word Discovery in Books', 'Personal Reading Log', 'Story Reflections'],
    targetSection: 'read',
    previewArt: '📖 🕯️ 📜 🪑 ☕'
  },
  {
    id: 'learning_school',
    name: 'The Learning School & Study',
    category: 'Academics & Words',
    icon: '🏫',
    tagline: 'Interactive study desks & the spelling laboratory',
    description:
      'A sunlit workshop dedicated to mastering words. Engage with the interactive chalkboard, test your spelling instincts in the lab, and conquer your Daily 3 New Words.',
    atmosphere: 'Chalk click, morning sunlight, crisp notebooks, cheerful chimes',
    bgGradient: 'from-amber-100 via-yellow-50 to-emerald-100',
    accentColor: 'border-amber-300 text-amber-900',
    badge: 'Core Curriculum',
    activities: ["Today's 3 New Words", 'True Spelling Test', 'Interactive Flashcards', 'Word Mastery Stages'],
    targetSection: 'learn',
    previewArt: '📝 🔬 📐 💡 🎯'
  },
  {
    id: 'nature_garden',
    name: 'The Botanical Nature Garden',
    category: 'Living Knowledge',
    icon: '🌿',
    tagline: 'Where mastered words bloom into vibrant flowers',
    description:
      'Stroll across gentle stone bridges surrounded by wildflowers and flowing streams. Each vocabulary word you practice takes root as a tiny seed, growing through sprouts and buds into permanent blossoming flowers.',
    atmosphere: 'Fresh morning dew, buzzing honeybees, gentle breeze, birdsong',
    bgGradient: 'from-emerald-100 via-teal-50 to-green-100',
    accentColor: 'border-emerald-300 text-emerald-900',
    badge: 'Knowledge Garden',
    activities: ['Water Word Plants', 'Seed to Blossom Growth', 'Flower Species Catalog', 'Review Garden Stroll'],
    targetSection: 'garden',
    previewArt: '🌱 🌸 🦋 🐝 💧'
  },
  {
    id: 'faith_garden',
    name: 'The Faith & Reflection Garden',
    category: 'Spiritual Peace',
    icon: '🕊️',
    tagline: 'Quiet reflection, biblical wisdom & lasting peace',
    description:
      'A sanctuary shaded by ancient olive trees and stone pathways. Discover foundational Biblical vocabulary, read inspiring scriptures, and reflect on kindness, wisdom, and character virtues.',
    atmosphere: 'Peaceful stillness, soft sunlight, rustling leaves, pure serenity',
    bgGradient: 'from-rose-100 via-amber-50 to-purple-100',
    accentColor: 'border-purple-300 text-purple-900',
    badge: 'Reflection & Scripture',
    activities: ['Daily Bible Word', 'Scripture Verse Explorer', 'Life Application Reflections', 'Faith Growth Badges'],
    targetSection: 'faith_garden',
    previewArt: '🕊️ 🫒 ✝️ 📖 🌾'
  },
  {
    id: 'world_boutique',
    name: 'Cobblestone Boutique & Shop',
    category: 'Commerce & Rewards',
    icon: '🛍️',
    tagline: 'Artisan furniture, cozy decor & companion pet adoption',
    description:
      'A quaint village shop bell rings as you walk inside. Exchange coins earned from reading and spelling for handcrafted beds, reading desks, glowing lamps, seasonal items, and adorable pets.',
    atmosphere: 'Brass shopkeeper bell, polished brass shelves, festive displays',
    bgGradient: 'from-orange-100 via-amber-50 to-rose-100',
    accentColor: 'border-orange-300 text-orange-900',
    badge: 'Reward Shop',
    activities: ['Furniture Collections', 'Room Wallpapers & Floors', 'Companion Pet Adoptions', 'Seasonal Holiday Items'],
    targetSection: 'shop',
    previewArt: '🛋️ 🎁 🧸 🪙 ✨'
  }
];

interface WorldExplorerProps {
  profile: UserProfile;
  onSelectSection: (section: AppSection) => void;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({
  profile,
  onSelectSection
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>('my_home');

  const activeDest = WORLD_DESTINATIONS.find((d) => d.id === selectedDestId) || WORLD_DESTINATIONS[0];

  const handleTravel = (dest: WorldDestination) => {
    sound.playBloomSparkle();
    onSelectSection(dest.targetSection);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-['Quicksand']">
      {/* Top Welcome Ribbon */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 p-6 sm:p-8 text-white shadow-xl border border-white/20">
        <div className="relative z-10 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs sm:text-sm font-black mb-2">
            <Compass className="w-4 h-4 text-amber-300" />
            <span>BloomWord Valley • Connected World</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
            The Explorable Learning World
          </h1>
          <p className="text-sm text-teal-100 mt-1 font-bold leading-relaxed max-w-xl">
            Your home connects to a vibrant world of discovery. Travel between the Library, School, Nature Garden, Reflection Sanctuary, and the Village Boutique.
          </p>
        </div>

        {/* Floating Accents */}
        <div className="absolute top-3 right-6 text-6xl opacity-15 pointer-events-none select-none">
          🗺️
        </div>
        <div className="absolute -bottom-6 right-28 text-7xl opacity-15 pointer-events-none select-none">
          🏰
        </div>
      </div>

      {/* Main Grid: Interactive Map Nodes on Left, Selected Destination Peek on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: World Map Nodes (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-600">
              Select a Destination
            </span>
            <span className="text-xs font-bold text-stone-500">
              6 Connected Locations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WORLD_DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <div
                  key={dest.id}
                  onClick={() => {
                    sound.playPop();
                    setSelectedDestId(dest.id);
                  }}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? `bg-gradient-to-br ${dest.bgGradient} ${dest.accentColor} shadow-md scale-[1.02] ring-2 ring-amber-400/40`
                      : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xl p-2 rounded-xl bg-white/80 shadow-2xs">
                      {dest.icon}
                    </span>
                    <span
                      className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {dest.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-stone-900 tracking-tight">
                      {dest.name}
                    </h3>
                    <p className="text-2xs text-stone-600 font-medium line-clamp-1 mt-0.5">
                      {dest.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5 text-2xs font-bold">
                    <span className="text-stone-500">{dest.category}</span>
                    <span className="text-amber-800 flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Destination Feature Card (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xl space-y-5 sticky top-20">
            {/* Visual Header */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${activeDest.bgGradient} border border-amber-200 text-center relative overflow-hidden`}>
              <div className="text-5xl mb-2 animate-bounce duration-2000">{activeDest.icon}</div>
              <h2 className="text-xl font-black text-stone-900">{activeDest.name}</h2>
              <p className="text-xs font-bold text-stone-700 mt-1">{activeDest.tagline}</p>
              <div className="text-lg mt-3 select-none tracking-widest opacity-80">
                {activeDest.previewArt}
              </div>
            </div>

            {/* Atmosphere Quote */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left">
              <div className="flex items-center gap-1.5 text-2xs font-black uppercase tracking-wider text-amber-900 mb-1">
                <Sun className="w-3 h-3 text-amber-600" />
                <span>Atmosphere & Vibe</span>
              </div>
              <p className="text-xs text-amber-950 font-bold italic">
                "{activeDest.atmosphere}"
              </p>
            </div>

            {/* Description */}
            <div className="text-left space-y-1">
              <span className="text-2xs font-black uppercase tracking-wider text-stone-500">
                About this location
              </span>
              <p className="text-xs text-stone-700 font-medium leading-relaxed">
                {activeDest.description}
              </p>
            </div>

            {/* Available Activities */}
            <div className="text-left space-y-2">
              <span className="text-2xs font-black uppercase tracking-wider text-stone-500">
                Highlights & Activities
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeDest.activities.map((act, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-2xs font-bold text-stone-800 flex items-center gap-1.5"
                  >
                    <span className="text-amber-600">✨</span>
                    <span className="truncate">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Button */}
            <button
              onClick={() => handleTravel(activeDest)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Enter {activeDest.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
