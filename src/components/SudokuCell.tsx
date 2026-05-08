import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SudokuCellProps {
  value: number | null;
  initialValue: number | null;
  notes: Set<number>;
  isSelected: boolean;
  isRelated: boolean;
  isSameNumber: boolean;
  isCorrect: boolean;
  showMistakes: boolean;
  onClick: () => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  initialValue,
  notes,
  isSelected,
  isRelated,
  isSameNumber,
  isCorrect,
  showMistakes,
  onClick,
}) => {
  const isInitial = initialValue !== null;
  const isError = !isCorrect && value !== null && showMistakes;

  return (
    <motion.div
      onClick={onClick}
      animate={isError ? {
        x: [0, -4, 4, -2, 2, 0],
      } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sudoku-cell text-xl sm:text-2xl md:text-3xl font-serif no-select",
        isSelected && "bg-cyber-pink text-black font-black z-10",
        !isSelected && isSameNumber && "bg-cyber-cyan/15",
        !isSelected && !isSameNumber && isRelated && "bg-cyber-surface",
        isInitial ? "text-cyber-cyan font-bold bg-cyber-surface/50" : "text-cyber-text",
        isError && "bg-red-900/50 text-red-400 shadow-[inset_0_0_15px_rgba(220,38,38,0.2)]",
      )}
    >
      <AnimatePresence mode="wait">
        {value !== null ? (
          <motion.span
            key="value"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full h-full flex items-center justify-center"
          >
            {value}
          </motion.span>
        ) : (
          <div className="grid grid-cols-3 w-full h-full p-0.5 pointer-events-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div
                key={num}
                className={cn(
                  "text-[9px] sm:text-[10px] md:text-[11px] leading-none flex items-center justify-center transition-opacity",
                  notes.has(num) ? "opacity-100" : "opacity-0"
                )}
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {isSelected && (
        <motion.div
          layoutId="cell-highlight"
          className="absolute inset-0 border-2 border-cyber-pink pointer-events-none"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};
