import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Droplets,
  Search,
  Filter,
  CheckCircle2,
  Info,
  ArrowRight,
  Home,
  BookOpen,
  ChevronDown,
  X,
  ExternalLink,
  Award,
  SunMedium
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppSection, KnowledgeGardenWordPlant, VocabWord, UserProfile } from '../../types';
import { getKnowledgeGardenPlants } from '../../utils/learningHomeHelper';
import { GardenPlantAsset } from './GardenPlantAsset';
import { sound } from '../../utils/audio';

interface KnowledgeGardenViewProps {
  profile: UserProfile;
  words: VocabWord[];
  onSelectSection: (section: AppSection) => void;
  onSwitchToRoomDecorator: () => void;
}

export const KnowledgeGardenView: React.FC<KnowledgeGardenViewProps> = ({
  profile,
  words,
  onSelectSection,
  onSwitchToRoomDecorator
}) => {
  const [selectedStage, setSelectedStage] = useState<
    KnowledgeGardenWordPlant['stage'] | 'all'
  >('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlant, setActivePlant] = useState<KnowledgeGardenWordPlant | null>(null);
  const [isWateringAll, setIsWateringAll] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [waterNotification, setWaterNotification] = useState(false);

  // Compute all dynamic botanical plants from real words
  const plants = getKnowledgeGardenPlants(words);

  // Counts by visual asset growth stage
  const seedCount = plants.filter((p) => p.stage === 'seed').length;
  const sproutCount = plants.filter((p) => p.stage === 'sprout').length;
  const blossomCount = plants.filter((p) => p.stage === 'blossom').length;
  const masteredCount = plants.filter((p) => p.stage === 'permanent_flower').length;
  const totalWords = plants.length;
  const gardenMasteryRate = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

  // Distinct word categories
  const categories = Array.from(
    new Set(words.map((w) => w.category).filter(Boolean))
  );

  // Filter plants based on user controls
  const filteredPlants = plants.filter((p) => {
    if (selectedStage !== 'all' && p.stage !== selectedStage) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.word.toLowerCase().includes(q) ||
        p.definition.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Water All Garden Action
  const handleWaterGarden = () => {
    sound.playBloomSparkle();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 }
    });
    setIsWateringAll(true);
    setWaterNotification(true);

    setTimeout(() => {
      setIsWateringAll(false);
    }, 2000);

    setTimeout(() => {
      setWaterNotification(false);
    }, 3500);
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in">
      {/* 🌳 GARDEN TOP ATMOSPHERIC HEADER */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-sky-100/90 via-emerald-100/60 to-teal-50/70 p-5 sm:p-6 shadow-sm">
        {/* Soft decorative sunlight & cloud elements */}
        <div className="absolute top-2 right-4 text-amber-300/40 select-none pointer-events-none">
          <SunMedium className="w-24 h-24 sm:w-32 sm:h-32" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-extrabold uppercase tracking-wide">
              <span>🌳</span>
              <span>Living Botanical Garden</span>
              <span>•</span>
              <span>{gardenMasteryRate}% In Full Bloom</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2.5">
              <span>{profile.name}'s Knowledge Garden</span>
              <span className="text-2xl select-none animate-bounce duration-1000">🌸</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Every word you discover, practice, and master takes root here! Watch vocabulary transform dynamically from <strong>dormant seeds</strong> to <strong>tender sprouts</strong>, <strong>budding blossoms</strong>, and eternal <strong>mastered flowers</strong>.
            </p>
          </div>

          {/* Action Header Buttons: Water All Garden + Back to Decorator */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <button
              id="garden-water-all-btn"
              onClick={handleWaterGarden}
              disabled={isWateringAll}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-200 cursor-pointer transition-all"
            >
              <Droplets className={`w-4 h-4 ${isWateringAll ? 'animate-bounce text-sky-200' : ''}`} />
              <span>{isWateringAll ? 'Watering with Sparkles! ✨' : 'Water the Garden 💧'}</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onSwitchToRoomDecorator();
              }}
              className="px-4 py-3 rounded-2xl bg-white/80 hover:bg-white border border-emerald-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
              title="Return to Room Decorator Canvas"
            >
              <Home className="w-4 h-4 text-pink-600" />
              <span>Room Decorator</span>
            </button>
          </div>
        </div>

        {/* Garden Watering Feedback Toast Banner */}
        {waterNotification && (
          <div className="mt-3 p-3 rounded-2xl bg-white/90 border border-sky-300 shadow-sm flex items-center gap-2 text-xs font-bold text-sky-900 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Fresh morning dew applied! Your garden is refreshed and all {totalWords} botanical plants are soaking up knowledge! ✨
            </span>
          </div>
        )}
      </div>

      {/* 📊 4-STAGE GROWTH COUNTER & ASSET STATE SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Stage 1: Seeds */}
        <button
          onClick={() => {
            sound.playPop();
            setSelectedStage(selectedStage === 'seed' ? 'all' : 'seed');
          }}
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 text-left ${
            selectedStage === 'seed'
              ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-200'
              : 'bg-white/85 border-amber-200/80 hover:bg-amber-50/50'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-xl border border-amber-200 shrink-0">
            <GardenPlantAsset stage="seed" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
              Level 1 • Dormant
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 font-['Fredoka'] truncate">
              Seeds Planted
            </h4>
            <span className="text-base sm:text-lg font-extrabold text-amber-700">
              {seedCount}
            </span>
          </div>
        </button>

        {/* Stage 2: Sprouts */}
        <button
          onClick={() => {
            sound.playPop();
            setSelectedStage(selectedStage === 'sprout' ? 'all' : 'sprout');
          }}
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 text-left ${
            selectedStage === 'sprout'
              ? 'bg-lime-100/90 border-lime-400 shadow-md ring-2 ring-lime-200'
              : 'bg-white/85 border-lime-200/80 hover:bg-lime-50/50'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-lime-50 rounded-xl border border-lime-200 shrink-0">
            <GardenPlantAsset stage="sprout" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-800 block">
              Level 2 • Practicing
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 font-['Fredoka'] truncate">
              Tender Sprouts
            </h4>
            <span className="text-base sm:text-lg font-extrabold text-lime-700">
              {sproutCount}
            </span>
          </div>
        </button>

        {/* Stage 3: Budding Blossoms */}
        <button
          onClick={() => {
            sound.playPop();
            setSelectedStage(selectedStage === 'blossom' ? 'all' : 'blossom');
          }}
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 text-left ${
            selectedStage === 'blossom'
              ? 'bg-rose-100/90 border-rose-400 shadow-md ring-2 ring-rose-200'
              : 'bg-white/85 border-rose-200/80 hover:bg-rose-50/50'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl border border-rose-200 shrink-0">
            <GardenPlantAsset stage="blossom" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 block">
              Level 3 • Growing
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 font-['Fredoka'] truncate">
              Budding Blooms
            </h4>
            <span className="text-base sm:text-lg font-extrabold text-rose-700">
              {blossomCount}
            </span>
          </div>
        </button>

        {/* Stage 4: Mastered Flowers */}
        <button
          onClick={() => {
            sound.playPop();
            setSelectedStage(selectedStage === 'permanent_flower' ? 'all' : 'permanent_flower');
          }}
          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 text-left ${
            selectedStage === 'permanent_flower'
              ? 'bg-emerald-100/90 border-emerald-400 shadow-md ring-2 ring-emerald-200'
              : 'bg-white/85 border-emerald-200/80 hover:bg-emerald-50/50'
          }`}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
            <GardenPlantAsset stage="permanent_flower" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              Level 4 • Mastered
            </span>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 font-['Fredoka'] truncate">
              Mastered Flowers
            </h4>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
              {masteredCount}
            </span>
          </div>
        </button>
      </div>

      {/* 📖 EDUCATIONAL VISUAL ASSET MAPPING GUIDE TOGGLE */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-emerald-100 p-3 shadow-xs">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-700 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>How Vocabulary Mastery Maps to Garden Plant Asset States</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showLegend ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showLegend && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
              <div className="flex items-center gap-2 font-extrabold text-amber-900">
                <GardenPlantAsset stage="seed" size="sm" />
                <span>1. Seed State</span>
              </div>
              <p className="text-slate-600 mt-1 leading-snug">
                Planted in dark loam soil with subterranean rootlets. Assigned to newly introduced words with 0 practices.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-lime-50/80 border border-lime-200">
              <div className="flex items-center gap-2 font-extrabold text-lime-900">
                <GardenPlantAsset stage="sprout" size="sm" />
                <span>2. Sprout State</span>
              </div>
              <p className="text-slate-600 mt-1 leading-snug">
                Twin green cotyledon leaves with morning dew. Unlocks after 1-2 flashcard or quiz reviews.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200">
              <div className="flex items-center gap-2 font-extrabold text-rose-900">
                <GardenPlantAsset stage="blossom" size="sm" />
                <span>3. Budding Blossom</span>
              </div>
              <p className="text-slate-600 mt-1 leading-snug">
                Sturdy plant stalk with foliage and swollen colorful flower buds. Unlocks as confidence and test scores rise.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center gap-2 font-extrabold text-emerald-900">
                <GardenPlantAsset stage="permanent_flower" size="sm" />
                <span>4. Mastered Flower</span>
              </div>
              <p className="text-slate-600 mt-1 leading-snug">
                Full perennial bloom with species variety (Rose, Sunflower, Lotus, Tulip, Orchid, Daisy) and golden star crest!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-emerald-100 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search words, definitions, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              sound.playPop();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🌿 BOTANICAL GARDEN PLOTS & LIVING PLANT GRID */}
      <div className="bg-gradient-to-b from-emerald-100/60 via-green-100/40 to-amber-100/50 rounded-3xl p-4 sm:p-6 border-2 border-emerald-200 shadow-inner">
        {filteredPlants.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <span className="text-5xl block">🌱</span>
            <h4 className="text-base font-extrabold text-slate-800 font-['Fredoka']">
              No garden plants match your current filter
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or selecting "All Words" to view your entire flourishing vocabulary collection.
            </p>
            <button
              onClick={() => {
                setSelectedStage('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredPlants.map((plant) => {
              const isMastered = plant.stage === 'permanent_flower';
              const isBlossom = plant.stage === 'blossom';
              const isSprout = plant.stage === 'sprout';

              return (
                <div
                  key={plant.wordId}
                  onClick={() => {
                    sound.playPop();
                    setActivePlant(plant);
                  }}
                  className={`group relative rounded-2xl p-3.5 border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center min-h-[175px] ${
                    isMastered
                      ? 'bg-white/95 border-emerald-300 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1.5'
                      : isBlossom
                      ? 'bg-pink-50/90 border-pink-200 hover:border-pink-400 hover:shadow-md hover:-translate-y-1'
                      : isSprout
                      ? 'bg-lime-50/90 border-lime-200 hover:border-lime-400 hover:shadow-md'
                      : 'bg-amber-50/70 border-dashed border-amber-200/90 hover:bg-amber-100/60'
                  }`}
                >
                  {/* Category Pill Tag */}
                  {plant.category && (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-600 mb-1">
                      {plant.category}
                    </span>
                  )}

                  {/* Visual Botanical Asset Render */}
                  <div className="flex-1 flex items-center justify-center my-1 relative">
                    <GardenPlantAsset
                      stage={plant.stage}
                      species={plant.flowerSpecies}
                      color={plant.flowerColor}
                      size="md"
                    />

                    {/* Mastered Star Emblem */}
                    {isMastered && (
                      <span className="absolute -top-1 -right-1 text-xs select-none">
                        ⭐
                      </span>
                    )}
                  </div>

                  {/* Word Name & Audio Icon */}
                  <div className="w-full mt-1.5">
                    <div className="flex items-center justify-center gap-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 font-['Fredoka'] truncate">
                        {plant.word}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.speak(plant.word);
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Pronounce Word"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Syllables or definition hint */}
                    {plant.syllables && (
                      <span className="text-[9px] text-slate-400 font-semibold block truncate">
                        {plant.syllables}
                      </span>
                    )}

                    {/* Botanical Growth Badge */}
                    <div className="mt-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          isMastered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isBlossom
                            ? 'bg-pink-100 text-pink-800'
                            : isSprout
                            ? 'bg-lime-100 text-lime-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span>{plant.flowerEmoji}</span>
                        <span>
                          {isMastered
                            ? 'Mastered'
                            : isBlossom
                            ? 'Budding'
                            : isSprout
                            ? 'Sprout'
                            : 'Seed'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🌸 INTERACTIVE WORD BOTANY DETAIL MODAL */}
      {activePlant && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-4 border-emerald-300 shadow-2xl space-y-4 animate-in zoom-in-95">
            {/* Header with Visual Asset & Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <GardenPlantAsset
                    stage={activePlant.stage}
                    species={activePlant.flowerSpecies}
                    color={activePlant.flowerColor}
                    size="md"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                      {activePlant.word}
                    </h3>
                    <button
                      onClick={() => sound.speak(activePlant.word)}
                      className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                      title="Hear Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {activePlant.syllables && (
                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                      • {activePlant.syllables} • {activePlant.partOfSpeech || 'word'}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActivePlant(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Growth Stage Progress Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                <span className="text-emerald-900">
                  Growth Status: {activePlant.masteryTitle || 'Learning'}
                </span>
                <span className="text-emerald-700">
                  {activePlant.growthPercent || 50}% Grown
                </span>
              </div>
              <div className="w-full h-2 bg-emerald-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${activePlant.growthPercent || 50}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                {activePlant.stage === 'permanent_flower'
                  ? '🌟 This word is fully mastered! It blooms forever in your garden as a living trophy of your achievement.'
                  : activePlant.stage === 'blossom'
                  ? '🌺 Almost there! A few more successful quizzes or flashcard reviews will make this blossom burst into full perennial bloom.'
                  : activePlant.stage === 'sprout'
                  ? '🌿 Your practice has sprouted green leaves. Keep reviewing to develop vibrant flower buds.'
                  : '🌱 Just planted! Practice this word in Flashcards or Reading to help it sprout.'}
              </p>
            </div>

            {/* Definition & Sentence Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs leading-relaxed space-y-2.5">
              <div>
                <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Meaning:
                </span>
                <p className="text-slate-800 font-medium text-sm mt-0.5">
                  {activePlant.definition}
                </p>
              </div>

              {activePlant.exampleSentence && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Example Sentence:
                  </span>
                  <p className="text-slate-700 italic mt-0.5">
                    "{activePlant.exampleSentence}"
                  </p>
                </div>
              )}
            </div>

            {/* Actions: Water Single Plant + Practice in Flashcards */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  sound.playBloomSparkle();
                  confetti({
                    particleCount: 30,
                    spread: 60,
                    origin: { y: 0.6 }
                  });
                }}
                className="py-2.5 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Water Plant 💧</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActivePlant(null);
                  onSelectSection('flashcards');
                }}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice Word</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
