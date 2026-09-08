import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { VocabWord, MasteryLevel } from '../types';
import { sound } from '../utils/audio';
import { getMasteryIcon, getMasteryLabel } from '../utils/adaptive';
import { triggerSparkleConfetti } from '../utils/storage';
import { WordCard } from './WordCard';

interface ReviewGardenProps {
  allWords: VocabWord[];
  onAddNewWord: (newWord: VocabWord) => void;
  onPracticeWord: (word: VocabWord) => void;
}

export const ReviewGarden: React.FC<ReviewGardenProps> = ({
  allWords,
  onAddNewWord,
  onPracticeWord
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Word Form State
  const [newWordText, setNewWordText] = useState('');
  const [newPronunciation, setNewPronunciation] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState<'noun' | 'verb' | 'adjective' | 'adverb'>('noun');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('My Custom Words');
  const [newSynonyms, setNewSynonyms] = useState('');

  const filteredWords = allWords.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMastery =
      selectedMasteryFilter === 'all'
        ? true
        : selectedMasteryFilter === 'homework'
        ? w.isHomework || w.sourceType === 'homework'
        : selectedMasteryFilter === 'reading'
        ? w.sourceType === 'reading'
        : selectedMasteryFilter === 'need_help'
        ? w.masteryLevel === 'new' || w.masteryLevel === 'learning' || w.incorrectCount > 0
        : w.masteryLevel === selectedMasteryFilter;

    return matchesSearch && matchesMastery;
  });

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordText.trim() || !newDefinition.trim()) return;

    sound.playSuccessChime();
    triggerSparkleConfetti();

    const created: VocabWord = {
      id: `custom-${Date.now()}`,
      word: newWordText.trim().toLowerCase(),
      definition: newDefinition.trim(),
      pronunciation: newPronunciation.trim() || newWordText.trim(),
      partOfSpeech: newPartOfSpeech,
      exampleSentence:
        newExample.trim() || `The word "${newWordText}" was added to my learning garden.`,
      synonyms: newSynonyms
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      difficulty: 'medium',
      category: newCategory.trim() || 'My Custom Words',
      gradeLevel: 4,
      mastered: false,
      masteryLevel: 'new',
      timesPracticed: 0,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticedDate: null,
      isCustom: true
    };

    onAddNewWord(created);
    setShowAddModal(false);

    // Reset form
    setNewWordText('');
    setNewPronunciation('');
    setNewDefinition('');
    setNewExample('');
    setNewSynonyms('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-2">
          <span>🌸</span>
          <span>Review Garden & Word Library</span>
          <span>📚</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Your Growing Vocabulary Library
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-lg mx-auto mt-1">
          Review words needing extra practice, search definitions, or add new words from books you read!
        </p>
      </div>

      {/* Action Bar: Search, Filters & Add Button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-100 shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words, definitions, or categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-pink-50/60 border border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-pink-500 text-pink-900 placeholder:text-pink-300"
          />
        </div>

        {/* Mastery Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Words', count: allWords.length },
            {
              id: 'homework',
              label: '🎒 Homework',
              count: allWords.filter((w) => w.isHomework || w.sourceType === 'homework').length
            },
            {
              id: 'reading',
              label: '📖 Book Discoveries',
              count: allWords.filter((w) => w.sourceType === 'reading').length
            },
            {
              id: 'need_help',
              label: '🌱 Needs Help',
              count: allWords.filter(
                (w) => w.masteryLevel === 'new' || w.masteryLevel === 'learning' || w.incorrectCount > 0
              ).length
            },
            {
              id: 'growing',
              label: '🌸 Growing',
              count: allWords.filter((w) => w.masteryLevel === 'growing').length
            },
            {
              id: 'almost_mastered',
              label: '🌺 Almost Mastered',
              count: allWords.filter((w) => w.masteryLevel === 'almost_mastered').length
            },
            {
              id: 'mastered',
              label: '👑 Mastered',
              count: allWords.filter((w) => w.masteryLevel === 'mastered').length
            }
          ].map((tab) => {
            const isActive = selectedMasteryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedMasteryFilter(tab.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xs'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className="ml-1 opacity-80">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Add Word Button */}
        <button
          onClick={() => {
            sound.playPop();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Word</span>
        </button>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-pink-100 text-center max-w-md mx-auto">
          <span className="text-4xl block mb-2">🌸</span>
          <h4 className="font-extrabold text-slate-800 text-base font-['Fredoka'] mb-1">
            No Words Found
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search filter or add this word to your learning garden!
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedMasteryFilter('all');
            }}
            className="text-xs font-bold text-pink-600 hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onPractice={onPracticeWord}
            />
          ))}
        </div>
      )}

      {/* Add New Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-pink-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌸</span>
                <h3 className="font-extrabold text-pink-900 text-lg sm:text-xl font-['Fredoka']">
                  Add Word to Learning Garden
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Vocabulary Word *
                </label>
                <input
                  type="text"
                  required
                  value={newWordText}
                  onChange={(e) => setNewWordText(e.target.value)}
                  placeholder="e.g. splendid"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-sm text-pink-950 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pronunciation Guide
                  </label>
                  <input
                    type="text"
                    value={newPronunciation}
                    onChange={(e) => setNewPronunciation(e.target.value)}
                    placeholder="e.g. SPLEN-did"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Part of Speech
                  </label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs text-slate-800 bg-white"
                  >
                    <option value="noun">Noun</option>
                    <option value="verb">Verb</option>
                    <option value="adjective">Adjective</option>
                    <option value="adverb">Adverb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Child-Friendly Definition *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Explain what it means in simple, clear words..."
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Example Sentence
                </label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Use it in an encouraging sentence..."
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs sm:text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Synonyms (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newSynonyms}
                    onChange={(e) => setNewSynonyms(e.target.value)}
                    placeholder="e.g. wonderful, grand"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Descriptive, Nature"
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-pink-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer hover:scale-105 transition-transform"
                >
                  🌸 Add to My Garden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
