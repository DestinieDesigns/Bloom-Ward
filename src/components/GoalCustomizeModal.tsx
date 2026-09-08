import React, { useState } from 'react';
import { X, Check, Sliders, Clock, Brain, Layers, Edit3 } from 'lucide-react';
import { DailyGoalConfig, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface GoalCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: DailyGoalConfig;
  profileName: string;
  onSave: (newGoals: DailyGoalConfig) => void;
}

export const GoalCustomizeModal: React.FC<GoalCustomizeModalProps> = ({
  isOpen,
  onClose,
  currentGoals,
  profileName,
  onSave
}) => {
  const [readingMinutes, setReadingMinutes] = useState<number>(currentGoals.readingMinutes || 15);
  const [vocabularyWords, setVocabularyWords] = useState<number>(currentGoals.vocabularyWords || 5);
  const [flashcardsCount, setFlashcardsCount] = useState<number>(currentGoals.flashcardsCount || 10);
  const [spellingWords, setSpellingWords] = useState<number>(currentGoals.spellingWords || 5);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playSuccessChime();
    onSave({
      readingMinutes,
      vocabularyWords,
      flashcardsCount,
      spellingWords
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-200 text-left space-y-6 max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-['Fredoka']">
                Personalize Daily Goals
              </h3>
              <p className="text-xs text-slate-500">
                Tailor the daily learning targets for {profileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Reading Minutes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>📖 Daily Reading Time Goal</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setReadingMinutes(mins);
                  }}
                  className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    readingMinutes === mins
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-extrabold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>{mins} Minutes</div>
                  {mins === 15 && <span className="text-[10px] text-orange-600 font-normal">★ Standard</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Words */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span>🧠 New Vocabulary Words Per Day</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setVocabularyWords(count);
                  }}
                  className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    vocabularyWords === count
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-extrabold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>{count} Words</div>
                  {count === 3 && <span className="text-[10px] text-indigo-600 font-normal">Gentle</span>}
                  {count === 5 && <span className="text-[10px] text-indigo-600 font-normal">★ Standard</span>}
                  {count === 10 && <span className="text-[10px] text-indigo-600 font-normal">Ambitious</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcards Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-pink-500" />
              <span>🎴 Flashcards To Review Daily</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setFlashcardsCount(count);
                  }}
                  className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    flashcardsCount === count
                      ? 'border-pink-500 bg-pink-50 text-pink-800 font-extrabold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>{count} Cards</div>
                  {count === 10 && <span className="text-[10px] text-pink-600 font-normal">★ Standard</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Spelling Words Count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-teal-500" />
              <span>✏️ Spelling Words Practiced Daily</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSpellingWords(count);
                  }}
                  className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    spellingWords === count
                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-extrabold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>{count} Words</div>
                  {count === 5 && <span className="text-[10px] text-teal-600 font-normal">★ Standard</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save My Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
