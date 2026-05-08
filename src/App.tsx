import React from 'react';
import { useSudoku } from './hooks/useSudoku';
import { SudokuBoard } from './components/SudokuBoard';
import { GameOverModal } from './components/GameOverModal';
import { Difficulty } from './types';
import { motion } from 'motion/react';
import { cn, formatTime } from './lib/utils';

export default function App() {
  const {
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
  } = useSudoku('Medium');

  const [showDifficultySelector, setShowDifficultySelector] = React.useState(false);
  const [isBlitz, setIsBlitz] = React.useState(false);
  const [blitzTime, setBlitzTime] = React.useState(180);

  const isGameOver = state.mistakes >= 3 || state.isComplete || (isBlitz && blitzTime <= 0);

  React.useEffect(() => {
    let interval: any;
    if (isBlitz && !state.isPaused && !isGameOver) {
      interval = setInterval(() => {
        setBlitzTime(t => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlitz, state.isPaused, isGameOver]);

  const handleManualRestart = (level: Difficulty) => {
    restart(level);
    if (isBlitz) setBlitzTime(180);
    setShowDifficultySelector(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDifficultySelector || isGameOver) return;

      if (e.key >= '1' && e.key <= '9') {
        enterNumber(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        eraseCell();
      } else if (e.key === 'n') {
        setNoteMode(!noteMode);
      } else if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
        undo();
      } else if (e.key === 'ArrowUp') {
        selectCell(Math.max(0, (state.selectedCell?.[0] ?? 0) - 1), state.selectedCell?.[1] ?? 0);
      } else if (e.key === 'ArrowDown') {
        selectCell(Math.min(8, (state.selectedCell?.[0] ?? 0) + 1), state.selectedCell?.[1] ?? 0);
      } else if (e.key === 'ArrowLeft') {
        selectCell(state.selectedCell?.[0] ?? 0, Math.max(0, (state.selectedCell?.[1] ?? 0) - 1));
      } else if (e.key === 'ArrowRight') {
        selectCell(state.selectedCell?.[0] ?? 0, Math.min(8, (state.selectedCell?.[1] ?? 0) + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedCell, enterNumber, eraseCell, setNoteMode, noteMode, undo, selectCell, showDifficultySelector, isGameOver]);

  const handleNextLevel = () => {
    const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];
    const currentIndex = difficulties.indexOf(state.difficulty);
    const nextIndex = Math.min(currentIndex + 1, difficulties.length - 1);
    restart(difficulties[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text flex overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside className="w-72 border-r-2 border-cyber-border flex flex-col p-8 bg-cyber-dark">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyber-cyan to-cyber-pink italic">
            SUDOKU<br/>PULSE
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyber-muted mt-2 font-bold">Synthetic Logic Interface</p>
        </div>

        <div className="space-y-8 flex-grow">
          <section>
            <label className="text-[11px] uppercase tracking-widest text-cyber-muted mb-4 block">Complexity Layer</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Easy', 'Medium', 'Hard', 'Expert'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleManualRestart(level)}
                  className={cn(
                    "py-2 px-3 border text-[12px] font-bold transition-all uppercase",
                    state.difficulty === level 
                      ? "border-2 border-cyber-pink text-cyber-pink bg-cyber-pink/10 shadow-[0_0_15px_rgba(255,0,245,0.2)]" 
                      : "border-cyber-border text-cyber-muted hover:border-cyber-cyan hover:text-cyber-cyan"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-cyber-surface p-5 border-l-4 border-cyber-cyan">
            <label className="text-[11px] uppercase tracking-widest text-cyber-cyan block mb-2 font-bold">
              {isBlitz ? "Blitz Protocol" : "Active Challenge"}
            </label>
            <h3 className="text-lg font-serif italic mb-1 text-white">
              {isBlitz ? "The Chrono Breach" : "Synapse Overload"}
            </h3>
            <p className="text-xs text-cyber-muted leading-relaxed">
              {isBlitz 
                ? `Complete under pressure. Time remaining: ${formatTime(blitzTime)}`
                : "Complete Hard mode without using more than 1 hint to unlock 'Neon' assets."}
            </p>
          </section>

          <section>
            <div className="flex justify-between items-end mb-2">
              <label className="text-[11px] uppercase tracking-widest text-cyber-muted">Cognitive Sync</label>
              <span className="text-cyber-cyan font-mono text-xs">
                {Math.round((state.board.flat().filter(c => c !== null).length / 81) * 100)}%
              </span>
            </div>
            <div className="h-1 bg-cyber-border w-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(state.board.flat().filter(c => c !== null).length / 81) * 100}%` }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-pink"
              />
            </div>
          </section>
        </div>

        <div className="mt-auto pt-8">
          <div className="text-center py-4 border-2 border-dashed border-cyber-border relative overflow-hidden group hover:border-cyber-cyan transition-colors cursor-pointer" onClick={() => setIsBlitz(!isBlitz)}>
            {isBlitz && (
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-cyber-cyan/10" 
              />
            )}
            <span className="text-[10px] text-cyber-muted block uppercase tracking-widest mb-1">
              {isBlitz ? "BLITZ TIMER" : "SESSION TIME"}
            </span>
            <span className={cn(
              "text-3xl font-mono transition-colors",
              isBlitz ? "text-cyber-cyan" : "text-white"
            )}>
              {formatTime(isBlitz ? blitzTime : state.time)}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#1A1C23_0%,_#0F1115_100%)] p-8">
        <div className="relative">
          <SudokuBoard
            state={state}
            settings={settings}
            onCellClick={selectCell}
          />
        </div>

        <div className="mt-12 w-full max-w-sm">
          <div className="grid grid-cols-9 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.1, backgroundColor: '#00F0FF', color: '#000' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => enterNumber(num)}
                className="aspect-square flex items-center justify-center bg-white text-black font-black text-xl transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              >
                {num}
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 border-l-2 border-cyber-border flex flex-col p-8 bg-cyber-dark">
        <div className="mb-10">
          <label className="text-[11px] uppercase tracking-widest text-cyber-muted block mb-4">Performance</label>
          <div className="space-y-4">
            <div>
              <span className="text-xs text-cyber-muted block uppercase tracking-tighter">Mistake Counter</span>
              <span className={cn(
                "text-4xl font-mono tracking-tighter",
                state.mistakes > 0 ? "text-red-500" : "text-white"
              )}>
                {state.mistakes}<span className="text-xl opacity-20"> / 3</span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-block self-start px-2 py-0.5 bg-cyber-pink text-black text-[10px] font-black italic">
                STREAK x12
              </div>
              <div className="text-[10px] text-cyber-cyan font-mono animate-pulse">
                COGNITIVE LOAD: {((state.time / 600) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-auto">
          <button 
            onClick={undo}
            className="w-full py-4 bg-cyber-border text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all"
          >
            Undo Alpha
          </button>
          <button 
            onClick={eraseCell}
            className="w-full py-4 border border-cyber-border text-cyber-muted font-bold text-xs tracking-widest uppercase hover:border-cyber-pink hover:text-cyber-pink transition-all"
          >
            Clear Cell
          </button>
          <button 
            onClick={giveHint}
            className="w-full py-4 border border-cyber-border text-cyber-muted font-bold text-xs tracking-widest uppercase hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
          >
            Hint Link
          </button>
          <div className="h-px bg-cyber-border my-6"></div>
          <button 
            onClick={() => restart()}
            className="w-full py-6 bg-gradient-to-r from-cyber-cyan to-cyber-pink text-black font-black text-sm tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 active:scale-95 transition-all"
          >
            REBOOT GRID
          </button>
        </div>

        <div className="mt-8">
          <div className="p-4 border border-cyber-border text-center">
            <p className="text-[9px] text-cyber-muted uppercase leading-relaxed font-mono">
              System status: Optimal<br/>
              Difficulty lock: Active<br/>
              User: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      </aside>

      <GameOverModal
        isOpen={isGameOver}
        isWin={state.isComplete}
        time={state.time}
        difficulty={state.difficulty}
        mistakes={state.mistakes}
        onRestart={() => restart()}
        onNextLevel={handleNextLevel}
      />
    </div>
  );
}
