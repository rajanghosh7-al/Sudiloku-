import React from 'react';
import { SudokuCell } from './SudokuCell';
import { GameState, Settings } from '../types';

interface SudokuBoardProps {
  state: GameState;
  settings: Settings;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  state,
  settings,
  onCellClick,
}) => {
  const { board, initialBoard, notes, selectedCell, solution } = state;

  return (
    <div className="w-full max-w-md mx-auto bg-cyber-dark border-2 border-cyber-border overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-none relative p-1">
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />
      <div className="sudoku-grid">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;
            const isRelated = selectedCell 
              ? (selectedCell[0] === rIdx || selectedCell[1] === cIdx || 
                 (Math.floor(selectedCell[0] / 3) === Math.floor(rIdx / 3) && 
                  Math.floor(selectedCell[1] / 3) === Math.floor(cIdx / 3)))
              : false;
            
            const selectedValue = selectedCell ? board[selectedCell[0]][selectedCell[1]] : null;
            const isSameNumber = selectedValue !== null && cell === selectedValue;
            const isCorrect = cell === solution[rIdx][cIdx];

            return (
              <SudokuCell
                key={`${rIdx}-${cIdx}`}
                value={cell}
                initialValue={initialBoard[rIdx][cIdx]}
                notes={notes[rIdx][cIdx]}
                isSelected={isSelected}
                isRelated={isRelated && settings.highlightRelated}
                isSameNumber={isSameNumber}
                isCorrect={isCorrect}
                showMistakes={settings.showMistakes}
                onClick={() => onCellClick(rIdx, cIdx)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
