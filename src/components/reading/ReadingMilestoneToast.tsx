import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Sparkles, BookOpen } from 'lucide-react';

export interface ReadingMilestone {
  minute: number;
  label: string;
  icon: string;
  coins: number;
  xp: number;
  message: string;
}

interface ReadingMilestoneToastProps {
  milestone: ReadingMilestone | null;
  onDismiss: () => void;
  autoDismissDurationMs?: number;
}

export const ReadingMilestoneToast: React.FC<ReadingMilestoneToastProps> = ({
  milestone,
  onDismiss,
  autoDismissDurationMs = 5500
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingMsRef = useRef<number>(autoDismissDurationMs);

  useEffect(() => {
    if (!milestone) {
      setProgress(100);
      return;
    }

    remainingMsRef.current = autoDismissDurationMs;
    startTimeRef.current = Date.now();
    setProgress(100);

    const tickInterval = 50;
    progressIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        remainingMsRef.current -= tickInterval;
        const newPercent = Math.max(0, (remainingMsRef.current / autoDismissDurationMs) * 100);
        setProgress(newPercent);

        if (remainingMsRef.current <= 0) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          onDismiss();
        }
      }
    }, tickInterval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [milestone, isPaused, autoDismissDurationMs, onDismiss]);

  return (
    <AnimatePresence>
      {milestone && (
        <div
          id="reading-milestone-toast-container"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-lg w-[92vw] sm:w-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-md text-slate-100 border border-slate-700/80 shadow-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-3.5"
            role="status"
            aria-live="polite"
          >
            {/* Ambient Quiet Pulsing Accent Behind Icon */}
            <div className="relative shrink-0 flex items-center justify-center">
              <span className="absolute -inset-1 rounded-xl bg-emerald-500/20 blur-xs animate-pulse" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/90 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
                {milestone.icon}
              </div>
            </div>

            {/* Notification Body */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <BookOpen className="w-2.5 h-2.5" />
                  Reading Milestone
                </span>
                <span className="text-xs font-extrabold text-slate-200 font-['Fredoka']">
                  {milestone.label}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-tight line-clamp-2">
                {milestone.message}
              </p>

              {/* Quiet Reward Badges */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <span>🪙</span>
                  <span>+{milestone.coins} coins</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  <span>+{milestone.xp} XP</span>
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline ml-auto">
                  Quietly logged
                </span>
              </div>
            </div>

            {/* Quick Dismiss Button */}
            <button
              id="dismiss-reading-milestone-btn"
              onClick={onDismiss}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer self-start sm:self-center"
              title="Dismiss notification"
              aria-label="Dismiss milestone notification"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Delicate Thin Countdown Progress Bar along bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
