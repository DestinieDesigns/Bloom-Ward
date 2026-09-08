import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Plus,
  BookOpen,
  X,
  CheckCircle2,
  ListPlus,
  FileText,
  Volume2
} from 'lucide-react';
import { VocabWord } from '../types';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti } from '../utils/storage';
import { lookupOrGenerateWordDetails, createVocabWordFromDiscovery } from '../utils/dictionary';

interface HomeworkWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWords: (words: VocabWord[]) => void;
  onAddXp: (amount: number) => void;
}

export const HomeworkWordsModal: React.FC<HomeworkWordsModalProps> = ({
  isOpen,
  onClose,
  onAddWords,
  onAddXp
}) => {
  const [tab, setTab] = useState<'bulk' | 'single'>('bulk');
  const [homeworkTag, setHomeworkTag] = useState<string>('Friday Spelling Test');

  // Bulk input
  const [bulkText, setBulkText] = useState<string>('');

  // Single word input
  const [singleWord, setSingleWord] = useState<string>('');
  const [singleSentence, setSingleSentence] = useState<string>('');
  const [singleMeaning, setSingleMeaning] = useState<string>('');

  const [addedCount, setAddedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSaveBulk = () => {
    if (!bulkText.trim()) return;

    // Split by comma, newline, or semicolon
    const rawTokens = bulkText.split(/[\n,;]+/).map((t) => t.trim()).filter((t) => t.length > 0);
    if (rawTokens.length === 0) return;

    const createdWords: VocabWord[] = rawTokens.map((raw) => {
      const lookup = lookupOrGenerateWordDetails(raw);
      return createVocabWordFromDiscovery(
        lookup,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        homeworkTag || 'School Homework'
      );
    });

    onAddWords(createdWords);
    onAddXp(createdWords.length * 15);
    sound.playSuccessChime();
    triggerCelebrationConfetti();
    setAddedCount(createdWords.length);

    setTimeout(() => {
      setAddedCount(null);
      setBulkText('');
      onClose();
    }, 1500);
  };

  const handleSaveSingle = () => {
    if (!singleWord.trim()) return;

    const lookup = lookupOrGenerateWordDetails(singleWord, singleSentence);
    if (singleMeaning.trim()) {
      lookup.definition = singleMeaning.trim();
      lookup.simpleMeaning = singleMeaning.trim();
    }

    const created = createVocabWordFromDiscovery(
      lookup,
      undefined,
      undefined,
      undefined,
      singleSentence,
      true,
      homeworkTag || 'School Homework'
    );

    onAddWords([created]);
    onAddXp(20);
    sound.playSuccessChime();
    triggerCelebrationConfetti();
    setAddedCount(1);

    setTimeout(() => {
      setAddedCount(null);
      setSingleWord('');
      setSingleSentence('');
      setSingleMeaning('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-indigo-200 text-left space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs mb-1">
                <span>🎒</span>
                <span>School & Homework Practice</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
                Have School Homework Words?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Enter words from your teacher, spelling test, or school workbook. They'll be tagged with 🎒 and prioritized in your daily adventures and spelling games!
        </p>

        {/* Success Alert */}
        {addedCount !== null && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-center space-y-1 animate-in zoom-in-95">
            <div className="text-2xl">🎉</div>
            <p className="font-extrabold text-base font-['Fredoka']">
              Added {addedCount} Homework {addedCount === 1 ? 'Word' : 'Words'}!
            </p>
            <p className="text-xs text-emerald-700">
              Ready for spelling challenges and daily review!
            </p>
          </div>
        )}

        {addedCount === null && (
          <>
            {/* Homework Tag input */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                🏷️ Homework / Test Name
              </label>
              <input
                type="text"
                value={homeworkTag}
                onChange={(e) => setHomeworkTag(e.target.value)}
                placeholder="e.g. Friday Spelling Test, Science Unit 3, Week 5 Vocabulary"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Tab switch */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setTab('bulk')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'bulk'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListPlus className="w-4 h-4" />
                <span>Paste Multiple Words</span>
              </button>
              <button
                onClick={() => setTab('single')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'single'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>One Word with Details</span>
              </button>
            </div>

            {tab === 'bulk' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Paste or Type List of Words (separated by commas or new lines)
                  </label>
                  <textarea
                    rows={4}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="e.g.&#10;perseverance&#10;magnificent&#10;luminous&#10;ecosystem"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-medium text-slate-800"
                  />
                </div>

                <button
                  id="save-homework-bulk-btn"
                  onClick={handleSaveBulk}
                  disabled={!bulkText.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add All Homework Words to Practice</span>
                </button>
              </div>
            )}

            {tab === 'single' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Word *
                  </label>
                  <input
                    type="text"
                    value={singleWord}
                    onChange={(e) => setSingleWord(e.target.value)}
                    placeholder="e.g. Spectacular"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Definition or Meaning (Optional)
                  </label>
                  <input
                    type="text"
                    value={singleMeaning}
                    onChange={(e) => setSingleMeaning(e.target.value)}
                    placeholder="e.g. Beautiful and dramatic in a wonderful way"
                    className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Example Sentence (Optional)
                  </label>
                  <input
                    type="text"
                    value={singleSentence}
                    onChange={(e) => setSingleSentence(e.target.value)}
                    placeholder="e.g. The fireworks display was spectacular."
                    className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-xs font-medium"
                  />
                </div>

                <button
                  id="save-homework-single-btn"
                  onClick={handleSaveSingle}
                  disabled={!singleWord.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Homework Word</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
