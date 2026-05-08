import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, GameState, Settings } from '../types';
import { SudokuEngine } from '../lib/sudoku';

export function useSudoku(initialDifficulty: Difficulty = 'Medium') {
  const [state, setState] = useState<GameState>(() => {
    const { board, solution } = SudokuEngine.generatePuzzle(initialDifficulty);
    return {
      board,
      initialBoard: board.map(row => [...row]),
      solution,
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>())),
      selectedCell: null,
      mistakes: 0,
      time: 0,
      isPaused: false,
      isComplete: false,
      difficulty: initialDifficulty,
      mode: 'Relaxed',
      history: [board.map(row => [...row])],
    };
  });

  const [settings, setSettings] = useState<Settings>({
    showMistakes: true,
    highlightRelated: true,
    autoNotes: false,
    theme: 'Pulse',
  });

  const [noteMode, setNoteMode] = useState(false);

  useEffect(() => {
    let interval: any;
    if (!state.isPaused && !state.isComplete) {
      interval = setInterval(() => {
        setState(s => ({ ...s, time: s.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isPaused, state.isComplete]);

  const selectCell = (row: number, col: number) => {
    setState(s => ({ ...s, selectedCell: [row, col] }));
  };

  const enterNumber = useCallback((num: number) => {
    if (!state.selectedCell || state.isPaused || state.isComplete) return;
    const [r, c] = state.selectedCell;
    
    // Can't edit initial clues
    if (state.initialBoard[r][c] !== null) return;

    if (noteMode) {
      setState(s => {
        const newNotes = s.notes.map(row => row.map(cell => new Set(cell)));
        if (newNotes[r][c].has(num)) {
          newNotes[r][c].delete(num);
        } else {
          newNotes[r][c].add(num);
        }
        return { ...s, notes: newNotes };
      });
    } else {
      const isCorrect = state.solution[r][c] === num;
      
      setState(s => {
        const newBoard = s.board.map(row => [...row]);
        newBoard[r][c] = num;
        
        let newMistakes = s.mistakes;
        if (!isCorrect && settings.showMistakes) {
          newMistakes += 1;
        }

        const isWin = newBoard.every((row, rIdx) => 
          row.every((cell, cIdx) => cell === s.solution[rIdx][cIdx])
        );

        return {
          ...s,
          board: newBoard,
          mistakes: newMistakes,
          isComplete: isWin,
          history: [...s.history, newBoard.map(row => [...row])],
        };
      });
    }
  }, [state.selectedCell, noteMode, state.solution, state.initialBoard, state.isPaused, state.isComplete, settings.showMistakes]);

  const restart = (difficulty: Difficulty = state.difficulty) => {
    const { board, solution } = SudokuEngine.generatePuzzle(difficulty);
    setState({
      board,
      initialBoard: board.map(row => [...row]),
      solution,
      notes: Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set<number>())),
      selectedCell: null,
      mistakes: 0,
      time: 0,
      isPaused: false,
      isComplete: false,
      difficulty,
      mode: 'Relaxed',
      history: [board.map(row => [...row])],
    });
  };

  const undo = () => {
    setState(s => {
      if (s.history.length <= 1) return s;
      const newHistory = s.history.slice(0, -1);
      return {
        ...s,
        board: newHistory[newHistory.length - 1].map(row => [...row]),
        history: newHistory,
      };
    });
  };

  const eraseCell = () => {
    if (!state.selectedCell || state.isPaused || state.isComplete) return;
    const [r, c] = state.selectedCell;
    if (state.initialBoard[r][c] !== null) return;

    setState(s => {
      const newBoard = s.board.map(row => [...row]);
      newBoard[r][c] = null;
      const newNotes = s.notes.map(row => row.map(cell => new Set(cell)));
      newNotes[r][c].clear();
      return { ...s, board: newBoard, notes: newNotes };
    });
  };

  const giveHint = () => {
    if (!state.selectedCell || state.isPaused || state.isComplete) return;
    const [r, c] = state.selectedCell;
    if (state.board[r][c] !== null) return;

    const correctNum = state.solution[r][c];
    enterNumber(correctNum);
  };

  return {
    state,
    settings,
    noteMode,
    setNoteMode,
    selectCell,
    enterNumber,
    eraseCell,
    giveHint,
    restart,
    undo,
    setSettings,
    togglePause: () => setState(s => ({ ...s, isPaused: !s.isPaused })),
  };
}
