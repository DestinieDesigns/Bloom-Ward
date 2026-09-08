import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Lock,
  Heart,
  Droplets,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { GardenPlot, GardenPet, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface FlowerGardenProps {
  gardenPlots: GardenPlot[];
  gardenPets: GardenPet[];
  profile: UserProfile;
  onWaterPlot: (plotId: string) => void;
  onAddXp: (xp: number) => void;
}

export const FlowerGarden: React.FC<FlowerGardenProps> = ({
  gardenPlots,
  gardenPets,
  profile,
  onWaterPlot,
  onAddXp
}) => {
  const [selectedPlot, setSelectedPlot] = useState<GardenPlot | null>(null);
  const [isWateringAll, setIsWateringAll] = useState<boolean>(false);

  const handleWaterAll = () => {
    sound.playBloomSparkle();
    triggerCelebrationConfetti();
    setIsWateringAll(true);
    onAddXp(10);

    gardenPlots.forEach((plot) => {
      if (plot.unlocked) {
        onWaterPlot(plot.id);
      }
    });

    setTimeout(() => {
      setIsWateringAll(false);
    }, 2000);
  };

  const getStageDisplay = (stage: 1 | 2 | 3 | 4, color: string) => {
    switch (stage) {
      case 1:
        return { emoji: '🌱', label: 'Tiny Sprout', size: 'text-3xl' };
      case 2:
        return { emoji: '🌿', label: 'Growing Bud', size: 'text-4xl' };
      case 3:
        return { emoji: '🌸', label: 'Blooming Flower', size: 'text-5xl' };
      case 4:
        return { emoji: '🌺', label: 'Radiant Master Bloom', size: 'text-5xl animate-bounce' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Garden Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-2">
          <span>🌸</span>
          <span>Sophia's Magical Knowledge Garden</span>
          <span>🎀</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Watch Your Garden Blossom As You Learn!
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-lg mx-auto mt-1">
          Every word you read, spell, and master showers your garden with sunshine and fresh dew!
        </p>

        {/* Action Water Button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleWaterAll}
            disabled={isWateringAll}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 via-pink-400 to-rose-400 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Droplets className={`w-5 h-5 ${isWateringAll ? 'animate-bounce' : ''}`} />
            <span>{isWateringAll ? 'Watering with Sparkles! ✨' : 'Water the Garden 💧'}</span>
          </button>
        </div>
      </div>

      {/* Streak Rewards Milestones Ribbon */}
      <div className="bg-gradient-to-r from-pink-100/80 via-rose-50 to-purple-100/80 border-2 border-pink-200 rounded-3xl p-5 sm:p-6 mb-10 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base font-['Fredoka']">
              Streak & Knowledge Milestones
            </h3>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-white px-3 py-1 rounded-full border border-orange-200">
            Current Streak: {profile.streak} Days 🔥
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { days: 3, reward: 'Satin Bow Decoration 🎀', unlocked: profile.streak >= 3 },
            { days: 7, reward: 'Special Royal Flower 🌸', unlocked: profile.streak >= 7 },
            { days: 14, reward: 'New Garden Pet: Mochi 🐶', unlocked: profile.streak >= 14 },
            { days: 30, reward: 'Magical Castle Meadow 🏰', unlocked: profile.streak >= 30 }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                item.unlocked
                  ? 'bg-white border-pink-300 shadow-xs'
                  : 'bg-white/50 border-pink-100 opacity-60'
              }`}
            >
              <span className="text-xs font-bold text-pink-700 block mb-0.5">
                {item.days}-Day Streak
              </span>
              <p className="text-[11px] font-semibold text-slate-700">{item.reward}</p>
              <div className="mt-1.5 flex justify-center">
                {item.unlocked ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Garden Flower Bed Plots */}
      <div className="bg-gradient-to-b from-[#FDF2F8] to-[#FFF1F2] rounded-3xl p-6 sm:p-10 border-3 border-pink-200 shadow-xl shadow-pink-200/50 mb-10 relative">
        <div className="flex items-center justify-between mb-6">
          <span className="font-extrabold text-pink-900 text-base sm:text-lg font-['Fredoka'] flex items-center gap-2">
            <span>🏡</span> Blooming Flower Bed
          </span>
          <span className="text-xs text-pink-500 font-medium">
            Tap a flower to nurture it or hear its petal story!
          </span>
        </div>

        {/* Garden Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {gardenPlots.map((plot) => {
            const stageInfo = getStageDisplay(plot.stage, plot.color);
            const isUnlocked = plot.unlocked;

            return (
              <div
                key={plot.id}
                onClick={() => {
                  if (isUnlocked) {
                    sound.playPop();
                    setSelectedPlot(plot);
                    onWaterPlot(plot.id);
                  }
                }}
                className={`relative rounded-3xl p-5 text-center border-2 transition-all flex flex-col items-center justify-between min-h-[190px] shadow-sm cursor-pointer group ${
                  isUnlocked
                    ? 'bg-white hover:border-pink-400 hover:shadow-lg hover:shadow-pink-200 hover:-translate-y-1'
                    : 'bg-pink-50/50 border-dashed border-pink-200 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Accessory Bow / Sparkle */}
                {plot.specialAccessory && isUnlocked && (
                  <span className="absolute top-2.5 right-2.5 text-xs bg-pink-100 border border-pink-200 px-1.5 py-0.5 rounded-full">
                    {plot.specialAccessory === 'bow' ? '🎀' : '✨'}
                  </span>
                )}

                {/* Flower Visualization */}
                <div className="my-auto py-2 flex flex-col items-center">
                  {isUnlocked ? (
                    <div className="relative">
                      <span className={`${stageInfo.size} drop-shadow-sm transition-transform group-hover:scale-110 block`}>
                        {stageInfo.emoji}
                      </span>
                      {plot.stage === 4 && (
                        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-300 absolute -top-1 -right-2 animate-spin" />
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-400">
                      <Lock className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Plot Info */}
                <div className="w-full">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 font-['Fredoka'] truncate">
                    {plot.name}
                  </h4>
                  <p className="text-[11px] text-pink-500 font-medium">
                    {isUnlocked ? stageInfo.label : `Unlocks at ${plot.unlockedAtXp} XP`}
                  </p>

                  {isUnlocked && (
                    <div className="w-full bg-pink-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full"
                        style={{ width: `${(plot.stage / 4) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garden Pets & Animal Friends Shelf */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐰</span>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg font-['Fredoka']">
              Garden Companions & Friends
            </h3>
          </div>
          <span className="text-xs text-pink-500 font-medium">
            Keep learning to welcome new animal friends!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {gardenPets.map((pet) => (
            <div
              key={pet.id}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                pet.unlocked
                  ? 'bg-gradient-to-b from-pink-50 to-purple-50 border-pink-200 shadow-xs'
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <span className="text-4xl block mb-2">{pet.unlocked ? pet.emoji : '🔒'}</span>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 font-['Fredoka']">
                {pet.name}
              </h4>
              <p className="text-[10px] text-pink-600 font-semibold mb-1">{pet.title}</p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {pet.unlocked ? 'Happily hopping in your garden!' : pet.unlockCondition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tapped Plot Dialog */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-2 border-pink-200 shadow-2xl text-center animate-gentle-pulse">
            <span className="text-5xl block mb-3">
              {getStageDisplay(selectedPlot.stage, selectedPlot.color).emoji}
            </span>
            <h4 className="text-2xl font-extrabold text-pink-900 font-['Fredoka'] mb-1">
              {selectedPlot.name}
            </h4>
            <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mb-3">
              {getStageDisplay(selectedPlot.stage, selectedPlot.color).label}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              This blossom grows stronger with every correct spelling and vocabulary question you complete!
            </p>

            <button
              onClick={() => {
                sound.playPop();
                setSelectedPlot(null);
              }}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              🌸 Back to Garden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
