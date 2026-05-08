import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTime } from '../lib/utils';
import { Difficulty } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  isWin: boolean;
  time: number;
  difficulty: Difficulty;
  mistakes: number;
  onRestart: () => void;
  onNextLevel: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWin,
  time,
  difficulty,
  mistakes,
  onRestart,
  onNextLevel,
}) => {
  React.useEffect(() => {
    if (isOpen && isWin) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F27D26', '#FF4E00', '#FFD700']
      });
    }
  }, [isOpen, isWin]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-cyber-surface w-full max-w-sm rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-cyber-border p-8 text-center"
          >
            {isWin ? (
              <div className="mb-6 inline-flex p-4 rounded-full bg-cyber-cyan/10">
                <Trophy className="w-12 h-12 text-cyber-cyan" />
              </div>
            ) : (
              <div className="mb-6 inline-flex p-4 rounded-full bg-red-900/20">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            )}

            <h2 className="text-3xl font-black mb-2 tracking-tight italic text-white uppercase">
              {isWin ? "WELL PLAYED!" : "GAME OVER"}
            </h2>
            <p className="text-cyber-muted mb-8 font-medium">
              {isWin 
                ? `You breached ${difficulty} security in ${formatTime(time)}.`
                : "The system locked you out. Cognitive retry required."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-cyber-dark p-4 rounded-2xl border border-cyber-border">
                <div className="flex items-center justify-center gap-1.5 mb-1 opacity-50">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Time</span>
                </div>
                <div className="text-lg font-black font-mono text-cyber-cyan">{formatTime(time)}</div>
              </div>
              <div className="bg-cyber-dark p-4 rounded-2xl border border-cyber-border">
                <div className="flex items-center justify-center gap-1.5 mb-1 opacity-50">
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Mistakes</span>
                </div>
                <div className="text-lg font-black font-mono text-cyber-pink">{mistakes}/3</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onRestart}
                className="w-full py-4 bg-transparent border-2 border-cyber-border text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                REBOOT
              </button>
              {isWin && (
                <button
                  onClick={onNextLevel}
                  className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-cyber-pink text-black rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyber-cyan/25 hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest"
                >
                  Next Node
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
