export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface GameState {
  board: (number | null)[][];
  initialBoard: (number | null)[][];
  solution: number[][];
  notes: Set<number>[][];
  selectedCell: [number, number] | null;
  mistakes: number;
  time: number;
  isPaused: boolean;
  isComplete: boolean;
  difficulty: Difficulty;
  mode: 'Relaxed' | 'Challenge';
  history: (number | null)[][][];
}

export interface Settings {
  showMistakes: boolean;
  highlightRelated: boolean;
  autoNotes: boolean;
  theme: 'Pulse' | 'Midnight' | 'Neon';
}
