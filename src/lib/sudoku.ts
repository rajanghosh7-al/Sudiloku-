export class SudokuEngine {
  private static SIZE = 9;
  private static SUB_SIZE = 3;

  static isValid(board: (number | null)[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check col
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  static solve(board: (number | null)[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.solve(board)) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  static generateSolution(): number[][] {
    const board: (number | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
    this.solve(board);
    return board as number[][];
  }

  static generatePuzzle(difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'): { board: (number | null)[][], solution: number[][] } {
    const solution = this.generateSolution();
    const board = solution.map(row => [...row]);
    
    let attempts: number;
    switch (difficulty) {
      case 'Easy': attempts = 30; break;
      case 'Medium': attempts = 45; break;
      case 'Hard': attempts = 55; break;
      case 'Expert': attempts = 64; break;
    }

    let count = 0;
    while (count < attempts) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (board[r][c] !== null) {
        board[r][c] = null;
        count++;
      }
    }

    return { board, solution };
  }
}
