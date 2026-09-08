import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  Search,
  CheckCircle,
  Filter,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { KnowledgeGardenWordPlant, VocabWord } from '../../types';
import { getKnowledgeGardenPlants } from '../../utils/learningHomeHelper';
import { GardenPlantAsset } from './GardenPlantAsset';
import { sound } from '../../utils/audio';

interface KnowledgeGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
}

export const KnowledgeGardenModal: React.FC<KnowledgeGardenModalProps> = ({
  isOpen,
  onClose,
  words
}) => {
  const [selectedStage, setSelectedStage] = useState<
    KnowledgeGardenWordPlant['stage'] | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlant, setActivePlant] = useState<KnowledgeGardenWordPlant | null>(null);

  if (!isOpen) return null;

  const plants = getKnowledgeGardenPlants(words);

  const seedCount = plants.filter((p) => p.stage === 'seed').length;
  const sproutCount = plants.filter((p) => p.stage === 'sprout').length;
  const blossomCount = plants.filter((p) => p.stage === 'blossom').length;
  const masteredCount = plants.filter((p) => p.stage === 'permanent_flower').length;

  const filteredPlants = plants.filter((p) => {
    if (selectedStage !== 'all' && p.stage !== selectedStage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.word.toLowerCase().includes(q) || p.definition.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-gradient-to-b from-emerald-50 via-teal-50/50 to-green-50 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl border-4 border-emerald-300 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Garden Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-200 bg-gradient-to-r from-emerald-100/90 via-teal-100/60 to-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌳</span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka'] flex items-center gap-2">
                <span>My Knowledge Garden</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  {masteredCount} Blossoms in Bloom 🌸
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                Watch every word you learn sprout, bud, and blossom into a permanent Knowledge Flower!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-white/60 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Stages Growth Tracker Summary */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-white/70 border-b border-emerald-200/60 text-center">
          <button
            onClick={() => setSelectedStage('seed')}
            className={`p-2 rounded-2xl transition-all cursor-pointer ${
              selectedStage === 'seed'
                ? 'bg-amber-100 border-2 border-amber-300 shadow-sm'
                : 'hover:bg-slate-100/80'
            }`}
          >
            <span className="text-xl sm:text-2xl block">🌱</span>
            <span className="text-[10px] font-bold text-slate-600 block">Seeds</span>
            <span className="text-xs font-extrabold text-amber-700">{seedCount}</span>
          </button>

          <button
            onClick={() => setSelectedStage('sprout')}
            className={`p-2 rounded-2xl transition-all cursor-pointer ${
              selectedStage === 'sprout'
                ? 'bg-lime-100 border-2 border-lime-300 shadow-sm'
                : 'hover:bg-slate-100/80'
            }`}
          >
            <span className="text-xl sm:text-2xl block">🌿</span>
            <span className="text-[10px] font-bold text-slate-600 block">Sprouts</span>
            <span className="text-xs font-extrabold text-lime-700">{sproutCount}</span>
          </button>

          <button
            onClick={() => setSelectedStage('blossom')}
            className={`p-2 rounded-2xl transition-all cursor-pointer ${
              selectedStage === 'blossom'
                ? 'bg-pink-100 border-2 border-pink-300 shadow-sm'
                : 'hover:bg-slate-100/80'
            }`}
          >
            <span className="text-xl sm:text-2xl block">🌺</span>
            <span className="text-[10px] font-bold text-slate-600 block">Budding</span>
            <span className="text-xs font-extrabold text-pink-700">{blossomCount}</span>
          </button>

          <button
            onClick={() => setSelectedStage('permanent_flower')}
            className={`p-2 rounded-2xl transition-all cursor-pointer ${
              selectedStage === 'permanent_flower'
                ? 'bg-emerald-100 border-2 border-emerald-400 shadow-sm'
                : 'hover:bg-slate-100/80'
            }`}
          >
            <span className="text-xl sm:text-2xl block">⭐</span>
            <span className="text-[10px] font-bold text-slate-600 block">Mastered</span>
            <span className="text-xs font-extrabold text-emerald-700">{masteredCount}</span>
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="px-4 py-2 bg-emerald-50/50 flex items-center justify-between gap-2 border-b border-emerald-200/50">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/70" />
            <input
              type="text"
              placeholder="Search words in your garden..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-full bg-white border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-700"
            />
          </div>
          {selectedStage !== 'all' && (
            <button
              onClick={() => setSelectedStage('all')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer whitespace-nowrap"
            >
              Show All Words
            </button>
          )}
        </div>

        {/* Garden Soil Flower Patch */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredPlants.map((plant) => {
              const isMastered = plant.stage === 'permanent_flower';

              return (
                <div
                  key={plant.wordId}
                  onClick={() => {
                    sound.playPop();
                    setActivePlant(plant);
                  }}
                  className={`cursor-pointer group relative p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center min-h-[140px] ${
                    isMastered
                      ? 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1'
                      : plant.stage === 'blossom'
                      ? 'bg-pink-50/80 border-pink-200 hover:border-pink-400'
                      : 'bg-emerald-100/40 border-dashed border-emerald-300/80'
                  }`}
                >
                  {/* Plant Stage Graphic */}
                  <div className="flex-1 flex flex-col items-center justify-center my-1">
                    <GardenPlantAsset
                      stage={plant.stage}
                      species={plant.flowerSpecies}
                      color={plant.flowerColor}
                      size="md"
                    />
                  </div>

                  {/* Word title */}
                  <div className="w-full mt-2">
                    <h5 className="text-xs font-extrabold text-slate-900 truncate">
                      {plant.word}
                    </h5>
                    <span
                      className={`inline-block mt-0.5 text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-800'
                          : plant.stage === 'blossom'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isMastered
                        ? '⭐ Mastered Flower'
                        : plant.stage === 'blossom'
                        ? '🌸 Budding Bloom'
                        : plant.stage === 'sprout'
                        ? '🌿 Growing Sprout'
                        : '🌱 Seed Planted'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Garden Footer Quote */}
        <div className="p-3 bg-emerald-100/60 border-t border-emerald-200 text-center text-[11px] text-emerald-900 font-medium">
          🌱 Every word you practice waters your garden and grows your vocabulary world!
        </div>
      </div>

      {/* Word Details Plant Card Modal */}
      {activePlant && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-4 border-emerald-300 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <GardenPlantAsset
                  stage={activePlant.stage}
                  species={activePlant.flowerSpecies}
                  color={activePlant.flowerColor}
                  size="md"
                />
              </div>
              <button
                onClick={() => setActivePlant(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-extrabold text-slate-900 font-['Fredoka']">
                  {activePlant.word}
                </h4>
                <button
                  onClick={() => sound.speak(activePlant.word)}
                  className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                  title="Pronounce"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {activePlant.syllables && (
                <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
                  • {activePlant.syllables} •
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs leading-relaxed space-y-2">
              <p className="text-slate-800 font-medium">
                <strong className="text-emerald-900">Definition:</strong> {activePlant.definition}
              </p>
              {activePlant.exampleSentence && (
                <p className="text-slate-600 italic">
                  "{activePlant.exampleSentence}"
                </p>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs">
              <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block">
                Garden Growth Status:
              </span>
              <p className="font-bold text-slate-800 mt-0.5">
                {activePlant.stage === 'permanent_flower'
                  ? '🌟 Permanent Knowledge Flower — Mastered with strong memory!'
                  : activePlant.stage === 'blossom'
                  ? '🌸 Budding Bloom — Great understanding, almost mastered!'
                  : activePlant.stage === 'sprout'
                  ? '🌿 Sprout — In active practice through flashcards and tests.'
                  : '🌱 Seed — Newly introduced to your vocabulary.'}
              </p>
            </div>

            <button
              onClick={() => setActivePlant(null)}
              className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-md"
            >
              Keep Growing 🌸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
