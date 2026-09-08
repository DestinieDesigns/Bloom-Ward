import React, { useState, useMemo } from 'react';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  title = 'Grown-Up Access Only',
  description = 'To protect student privacy and account settings, please answer this quick question.'
}) => {
  // Generate random math challenge
  const challenge = useMemo(() => {
    const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const b = Math.floor(Math.random() * 7) + 3; // 3 to 9
    return { a, b, answer: a * b };
  }, [isOpen]);

  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(inputVal.trim(), 10) === challenge.answer) {
      sound.playSuccessChime();
      setErrorMsg('');
      onSuccess();
    } else {
      sound.playWrongAnswer();
      setErrorMsg('Not quite right. Please ask a grown-up for help!');
      setInputVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Quicksand']">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-slate-200 relative text-left">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 font-['Fredoka']">
              {title}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Parent & Guardian Area
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block mb-1">
              Math Challenge
            </span>
            <p className="text-2xl font-black text-slate-800 font-['Fredoka']">
              What is {challenge.a} × {challenge.b} ?
            </p>
          </div>

          <div>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter answer"
              autoFocus
              className="w-full text-center text-xl font-bold py-3 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-500 mt-1 text-center">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 cursor-pointer transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-95 shadow-md shadow-indigo-200 cursor-pointer transition-all disabled:opacity-50 text-center flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
