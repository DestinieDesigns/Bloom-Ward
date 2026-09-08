import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Plus,
  Heart
} from 'lucide-react';
import { ReadingStory, VocabWord } from '../types';
import { sound } from '../utils/audio';
import { triggerCelebrationConfetti, triggerSparkleConfetti } from '../utils/storage';

interface ReadingRoomProps {
  stories: ReadingStory[];
  allWords: VocabWord[];
  onAddWordToReview: (word: VocabWord) => void;
  onStoryCompleted: (storyId: string, score: number) => void;
  onAddXp: (xp: number) => void;
}

export const ReadingRoom: React.FC<ReadingRoomProps> = ({
  stories,
  allWords,
  onAddWordToReview,
  onStoryCompleted,
  onAddXp
}) => {
  const [selectedStory, setSelectedStory] = useState<ReadingStory>(stories[0] || null);
  const [tappedWord, setTappedWord] = useState<VocabWord | null>(null);

  // Comprehension Quiz state
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const handleSelectStory = (story: ReadingStory) => {
    sound.playPop();
    setSelectedStory(story);
    setShowQuiz(false);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSubmittedQuiz(false);
    setTappedWord(null);
  };

  const handleWordTap = (rawWord: string) => {
    sound.playPop();
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    const matched = allWords.find((w) => w.word.toLowerCase() === clean);

    if (matched) {
      setTappedWord(matched);
      sound.speak(matched.word);
    } else {
      // Create quick definition card on the fly if needed
      setTappedWord({
        id: `temp-${clean}`,
        word: clean,
        definition: 'A wonderful word from your reading story!',
        pronunciation: clean,
        partOfSpeech: 'noun',
        exampleSentence: `"${rawWord}" was used in "${selectedStory.title}".`,
        synonyms: [],
        difficulty: 'medium',
        category: 'Story Vocabulary',
        gradeLevel: 4,
        mastered: false,
        masteryLevel: 'new',
        timesPracticed: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastPracticedDate: null
      });
      sound.speak(clean);
    }
  };

  const handleAnswerQuestion = (optionIdx: number) => {
    sound.playPop();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (currentQuestionIdx + 1 < selectedStory.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      selectedStory.questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctIndex) {
          correctCount++;
        }
      });
      const calculatedScore = Math.round((correctCount / selectedStory.questions.length) * 100);
      setQuizScore(calculatedScore);
      setSubmittedQuiz(true);

      if (calculatedScore >= 75) {
        sound.playLevelUpFanfare();
        triggerCelebrationConfetti();
        onAddXp(25);
      } else {
        sound.playSuccessChime();
        onAddXp(15);
      }

      onStoryCompleted(selectedStory.id, calculatedScore);
    }
  };

  // Helper to render passage with clickable interactive words
  const renderInteractivePassage = (passage: string) => {
    const paragraphs = passage.split('\n\n');

    return (
      <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed font-['Quicksand']">
        {paragraphs.map((para, pIdx) => {
          const words = para.split(' ');
          return (
            <p key={pIdx}>
              {words.map((w, wIdx) => {
                const clean = w.toLowerCase().replace(/[^a-z]/g, '');
                const isFocus = selectedStory.vocabularyFocus.some(
                  (f) => f.toLowerCase() === clean
                );

                if (isFocus) {
                  return (
                    <button
                      key={wIdx}
                      onClick={() => handleWordTap(w)}
                      className="mx-0.5 px-1.5 py-0.5 rounded-lg bg-pink-100/80 hover:bg-pink-200 text-pink-900 font-bold border-b-2 border-pink-400 cursor-pointer inline-flex items-center gap-0.5 transition-all hover:scale-105"
                      title="Tap to see definition & hear word"
                    >
                      <span>{w}</span>
                      <span className="text-[10px] text-pink-500">🌸</span>
                    </button>
                  );
                }

                return <span key={wIdx}>{w} </span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 mb-2">
          <span>📖</span>
          <span>The Cozy Reading Room</span>
          <span>✨</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-900 tracking-tight font-['Fredoka']">
          Read, Understand & Explore Stories
        </h2>
        <p className="text-xs sm:text-sm text-pink-500 max-w-md mx-auto">
          Tap any highlighted flower word to hear it pronounced and see what it means!
        </p>
      </div>

      {/* Stories Carousel / Shelf */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {stories.map((story) => {
          const isSelected = selectedStory.id === story.id;
          return (
            <button
              key={story.id}
              onClick={() => handleSelectStory(story)}
              className={`p-4 rounded-3xl text-left border-2 transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-tr from-pink-50 to-purple-50 border-pink-400 shadow-md shadow-pink-200/60 scale-102'
                  : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-pink-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-2xl">{story.icon}</span>
                {story.completed && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base font-['Fredoka'] line-clamp-1">
                {story.title}
              </h3>
              <p className="text-xs text-pink-500 font-medium mb-1">{story.theme}</p>
              <p className="text-[11px] text-slate-500">
                {story.vocabularyFocus.length} Focus Words
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Story Book & Reader */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-pink-100 shadow-xl shadow-pink-100/60 relative overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-1">
              {selectedStory.theme}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Fredoka']">
              {selectedStory.title}
            </h3>
            <p className="text-xs sm:text-sm text-pink-500 font-medium">{selectedStory.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                sound.speak(selectedStory.passage.slice(0, 250));
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> Listen to Beginning
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setShowQuiz(!showQuiz);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showQuiz ? 'Return to Story' : 'Take Comprehension Quiz'}</span>
            </button>
          </div>
        </div>

        {/* View mode: Reading or Comprehension Quiz */}
        {!showQuiz ? (
          <div>
            {/* Story Passage with Interactive Tappable Words */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-pink-50/30 to-purple-50/20 border border-pink-100 mb-6">
              {renderInteractivePassage(selectedStory.passage)}
            </div>

            {/* Vocabulary Focus Pill Box */}
            <div className="bg-pink-50/80 border border-pink-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-pink-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Tap to learn:
                </span>
                {selectedStory.vocabularyFocus.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => handleWordTap(w)}
                    className="px-2.5 py-1 rounded-xl bg-white border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-100 transition-colors cursor-pointer"
                  >
                    🌸 {w}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  sound.playSuccessChime();
                  setShowQuiz(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                <span>Answer Story Questions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* COMPREHENSION QUIZ VIEW */
          <div>
            {!submittedQuiz ? (
              <div className="max-w-2xl mx-auto py-2">
                <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-4">
                  <span className="text-xs font-bold text-pink-600">
                    Question {currentQuestionIdx + 1} of {selectedStory.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Comprehension Check
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-800 mb-5">
                  {selectedStory.questions[currentQuestionIdx].question}
                </p>

                <div className="space-y-3 mb-6">
                  {selectedStory.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerQuestion(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 font-medium text-sm sm:text-base transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-pink-100 border-pink-500 text-pink-950 font-bold shadow-sm'
                            : 'bg-white border-pink-100 hover:border-pink-300 text-slate-700'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-pink-50 border border-pink-200 text-pink-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-pink-100">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="text-xs text-pink-600 font-bold hover:underline cursor-pointer"
                  >
                    ← Read Story Again
                  </button>

                  <button
                    disabled={userAnswers[currentQuestionIdx] === undefined}
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>
                      {currentQuestionIdx + 1 < selectedStory.questions.length
                        ? 'Next Question'
                        : 'Submit Answers ✨'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Score Result */
              <div className="text-center py-6 max-w-lg mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-3xl shadow-md mb-4">
                  {quizScore >= 75 ? '🌸' : '🌱'}
                </div>

                <h4 className="text-2xl font-extrabold text-pink-900 font-['Fredoka'] mb-1">
                  Comprehension Score: {quizScore}%
                </h4>
                <p className="text-sm text-slate-600 mb-6 font-medium">
                  {quizScore >= 75
                    ? 'Superb reading comprehension! You understood the story beautifully!'
                    : 'Good try! Reading stories regularly helps your comprehension grow every day.'}
                </p>

                <div className="space-y-3 mb-6 text-left">
                  {selectedStory.questions.map((q, idx) => {
                    const isRight = userAnswers[idx] === q.correctIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm ${
                          isRight
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          Q{idx + 1}: {q.question}
                        </p>
                        <p className="text-xs opacity-90">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    sound.playPop();
                    setShowQuiz(false);
                    setUserAnswers({});
                    setCurrentQuestionIdx(0);
                    setSubmittedQuiz(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  🌸 Read Another Story
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Word Tapped Modal */}
      {tappedWord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-pink-200 shadow-2xl relative animate-gentle-pulse">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                Word Exploration 🌸
              </span>
              <button
                onClick={() => setTappedWord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-2xl font-extrabold text-pink-900 font-['Fredoka']">
                  {tappedWord.word}
                </h4>
                <p className="text-xs text-pink-500 italic">/{tappedWord.pronunciation}/</p>
              </div>

              <button
                onClick={() => sound.speak(tappedWord.word)}
                className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            </div>

            <div className="bg-pink-50 rounded-2xl p-3 mb-3 border border-pink-100">
              <p className="text-xs font-bold text-pink-600 uppercase mb-1">What It Means</p>
              <p className="text-sm text-slate-700 font-medium">{tappedWord.definition}</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-3 mb-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 uppercase mb-1">In a Sentence</p>
              <p className="text-xs sm:text-sm text-slate-700 italic">"{tappedWord.exampleSentence}"</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  sound.playSuccessChime();
                  triggerSparkleConfetti();
                  onAddWordToReview(tappedWord);
                  setTappedWord(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add to My Learning Garden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
