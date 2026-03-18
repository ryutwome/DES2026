import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  RotateCcw,
  LogOut,
  Timer,
  Star,
  Zap,
} from "lucide-react";

// ─── Types ───
interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface GameScreenProps {
  gameId: string; // chess, rummy, guess-price, tic-tac-toe, trivia, ludo
  gameName: string;
  gameEmoji: string;
  gameColor: string;
  players: Player[];
  voicePulse: Record<string, boolean>;
  isMeTalking: boolean;
  onToggleMic: () => void;
  onLeaveVoice: () => void;
  onBack: () => void;
}

export function GameScreen({
  gameId,
  gameName,
  gameEmoji,
  gameColor,
  players,
  voicePulse,
  isMeTalking,
  onToggleMic,
  onLeaveVoice,
  onBack,
}: GameScreenProps) {
  const opponent = players.find((p) => p.id !== "me");
  const me = players.find((p) => p.id === "me");

  return (
    <div className="flex flex-col h-full bg-[#111b21]">
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2 shrink-0" style={{ backgroundColor: gameColor }}>
        <button onClick={onBack} className="p-1 text-white">
          <ArrowLeft className="w-[20px] h-[20px]" />
        </button>
        <span className="text-[18px]">{gameEmoji}</span>
        <span className="text-white text-[16px] flex-1" style={{ fontWeight: 600 }}>
          {gameName}
        </span>
        <RotateCcw className="w-[18px] h-[18px] text-white/60" />
      </div>

      {/* Voice chat strip */}
      <div className="bg-[#1f2c34] px-3 py-1.5 flex items-center gap-2 shrink-0">
        <div className="w-[6px] h-[6px] rounded-full bg-[#25D366] animate-pulse" />
        <div className="flex items-center -space-x-2 flex-1">
          {players.map((p) => (
            <img
              key={p.id}
              src={p.avatar}
              alt={p.name}
              className={`w-[22px] h-[22px] rounded-full object-cover border-2 transition-all ${
                voicePulse[p.id] ? "border-[#25D366]" : "border-[#1f2c34]"
              }`}
            />
          ))}
          <span className="text-[#8696a0] text-[11px] ml-3">Voice chat</span>
        </div>
        <button
          onClick={onToggleMic}
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            isMeTalking ? "bg-[#25D366] text-white" : "bg-[#2a3942] text-[#8696a0]"
          }`}
          style={{ fontWeight: 500 }}
        >
          🎤 {isMeTalking ? "On" : "Off"}
        </button>
        <button onClick={onLeaveVoice} className="text-red-400 p-0.5">
          <LogOut className="w-[14px] h-[14px]" />
        </button>
      </div>

      {/* Game area */}
      <div className="flex-1 overflow-y-auto">
        {gameId === "tic-tac-toe" && <TicTacToeGame opponent={opponent} me={me} gameColor={gameColor} />}
        {gameId === "chess" && <ChessGame opponent={opponent} me={me} gameColor={gameColor} />}
        {gameId === "trivia" && <TriviaGame opponent={opponent} me={me} gameColor={gameColor} />}
        {gameId === "guess-price" && <GuessPriceGame opponent={opponent} me={me} gameColor={gameColor} />}
        {gameId === "rummy" && <RummyGame opponent={opponent} me={me} gameColor={gameColor} />}
        {gameId === "ludo" && <LudoGame opponent={opponent} me={me} gameColor={gameColor} players={players} />}
      </div>
    </div>
  );
}

// ─── Shared components ───
function PlayerBar({ me, opponent, myScore, oppScore, gameColor }: {
  me?: Player; opponent?: Player; myScore: number; oppScore: number; gameColor: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1a2730]">
      <div className="flex items-center gap-2">
        <img src={me?.avatar} alt="You" className="w-[28px] h-[28px] rounded-full object-cover border-2 border-[#25D366]" />
        <div>
          <div className="text-white text-[12px]" style={{ fontWeight: 500 }}>You</div>
          <div className="text-[20px]" style={{ fontWeight: 700, color: "#25D366" }}>{myScore}</div>
        </div>
      </div>
      <div className="text-[#667781] text-[13px]" style={{ fontWeight: 600 }}>VS</div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-white text-[12px]" style={{ fontWeight: 500 }}>{opponent?.name || "Opponent"}</div>
          <div className="text-[20px]" style={{ fontWeight: 700, color: gameColor }}>{oppScore}</div>
        </div>
        <img src={opponent?.avatar} alt={opponent?.name} className="w-[28px] h-[28px] rounded-full object-cover border-2 border-[#8696a0]" />
      </div>
    </div>
  );
}

function GameOverOverlay({ winner, onRestart }: { winner: string; onRestart: () => void; }) {
  return (
    <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">
      <div className="bg-[#1f2c34] rounded-2xl px-8 py-6 flex flex-col items-center gap-3 mx-6 shadow-2xl">
        <Star className="w-[40px] h-[40px] text-yellow-400" />
        <div className="text-white text-[20px]" style={{ fontWeight: 700 }}>{winner}</div>
        <div className="text-[#8696a0] text-[13px]">Well played! 🎉</div>
        <button
          onClick={onRestart}
          className="mt-2 bg-[#25D366] text-white rounded-full px-6 py-2 text-[14px] flex items-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <RotateCcw className="w-[16px] h-[16px]" /> Play Again
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 1. TIC TAC TOE
// ═══════════════════════════════════════════════════════
function TicTacToeGame({ opponent, me, gameColor }: { opponent?: Player; me?: Player; gameColor: string }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [scores, setScores] = useState({ me: 0, opp: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  const checkWin = useCallback((b: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, bb, c] of lines) {
      if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
    }
    return b.every((c) => c !== null) ? "draw" : null;
  }, []);

  // AI move
  useEffect(() => {
    if (isMyTurn || winner) return;
    const timer = setTimeout(() => {
      setBoard((prev) => {
        const empty = prev.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
        if (empty.length === 0) return prev;
        // Try to win or block
        const next = [...prev];
        let chosen = -1;
        for (const idx of empty) {
          next[idx] = "O";
          if (checkWin(next) === "O") { chosen = idx; break; }
          next[idx] = null;
        }
        if (chosen === -1) {
          for (const idx of empty) {
            next[idx] = "X";
            if (checkWin(next) === "X") { chosen = idx; break; }
            next[idx] = null;
          }
        }
        if (chosen === -1) {
          if (empty.includes(4)) chosen = 4;
          else chosen = empty[Math.floor(Math.random() * empty.length)];
        }
        const b = [...prev];
        b[chosen] = "O";
        const w = checkWin(b);
        if (w) {
          setTimeout(() => {
            if (w === "O") { setWinner(`${opponent?.name || "Opponent"} wins!`); setScores((s) => ({ ...s, opp: s.opp + 1 })); }
            else if (w === "draw") setWinner("It's a draw!");
            else { setWinner("You win!"); setScores((s) => ({ ...s, me: s.me + 1 })); }
          }, 200);
        }
        setIsMyTurn(true);
        return b;
      });
    }, 600 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [isMyTurn, winner, opponent, checkWin]);

  const handleTap = (i: number) => {
    if (board[i] || !isMyTurn || winner) return;
    const b = [...board];
    b[i] = "X";
    setBoard(b);
    const w = checkWin(b);
    if (w) {
      setTimeout(() => {
        if (w === "X") { setWinner("You win!"); setScores((s) => ({ ...s, me: s.me + 1 })); }
        else if (w === "draw") setWinner("It's a draw!");
        else { setWinner(`${opponent?.name || "Opponent"} wins!`); setScores((s) => ({ ...s, opp: s.opp + 1 })); }
      }, 200);
    }
    setIsMyTurn(false);
  };

  const restart = () => { setBoard(Array(9).fill(null)); setWinner(null); setIsMyTurn(true); };

  return (
    <div className="flex flex-col h-full relative">
      {winner && <GameOverOverlay winner={winner} onRestart={restart} />}
      <PlayerBar me={me} opponent={opponent} myScore={scores.me} oppScore={scores.opp} gameColor={gameColor} />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={`text-[13px] mb-4 ${isMyTurn ? "text-[#25D366]" : "text-[#8696a0]"}`} style={{ fontWeight: 600 }}>
          {isMyTurn ? "Your turn (X)" : `${opponent?.name || "Opponent"}'s turn (O)`}
        </div>
        <div className="grid grid-cols-3 gap-2 w-[240px] h-[240px]">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleTap(i)}
              className="rounded-xl flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: cell ? (cell === "X" ? "#25D366" + "25" : gameColor + "25") : "#1f2c3480" }}
            >
              <span className="text-[36px]" style={{ fontWeight: 700, color: cell === "X" ? "#25D366" : cell === "O" ? "#5fa8d3" : "transparent" }}>
                {cell || "·"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 2. CHESS
// ═══════════════════════════════════════════════════════
const INIT_CHESS = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"],
];
const WHITE_PIECES = new Set(["♙","♖","♘","♗","♕","♔"]);
const BLACK_PIECES = new Set(["♟","♜","♞","♝","♛","♚"]);

function ChessGame({ opponent, me, gameColor }: { opponent?: Player; me?: Player; gameColor: string }) {
  const [board, setBoard] = useState<(string | null)[][]>(INIT_CHESS.map((r) => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [captured, setCaptured] = useState<{ white: string[]; black: string[] }>({ white: [], black: [] });
  const [moveCount, setMoveCount] = useState(0);

  // Simple AI move for black
  useEffect(() => {
    if (isWhiteTurn) return;
    const timer = setTimeout(() => {
      setBoard((prev) => {
        const b = prev.map((r) => [...r]);
        const blackPositions: [number, number][] = [];
        b.forEach((row, r) => row.forEach((cell, c) => { if (cell && BLACK_PIECES.has(cell)) blackPositions.push([r, c]); }));
        // Try random moves
        for (let attempt = 0; attempt < 100; attempt++) {
          const [r, c] = blackPositions[Math.floor(Math.random() * blackPositions.length)];
          const piece = b[r][c]!;
          // Simple: try to move down or diagonal
          const moves: [number, number][] = [];
          if (piece === "♟") {
            if (r + 1 < 8 && !b[r + 1][c]) moves.push([r + 1, c]);
            if (r === 1 && !b[r + 1][c] && !b[r + 2][c]) moves.push([r + 2, c]);
            if (r + 1 < 8 && c - 1 >= 0 && b[r + 1][c - 1] && WHITE_PIECES.has(b[r + 1][c - 1]!)) moves.push([r + 1, c - 1]);
            if (r + 1 < 8 && c + 1 < 8 && b[r + 1][c + 1] && WHITE_PIECES.has(b[r + 1][c + 1]!)) moves.push([r + 1, c + 1]);
          } else {
            // Random adjacent for other pieces
            for (let dr = -2; dr <= 2; dr++) {
              for (let dc = -2; dc <= 2; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!b[nr][nc] || WHITE_PIECES.has(b[nr][nc]!))) {
                  moves.push([nr, nc]);
                }
              }
            }
          }
          if (moves.length > 0) {
            const [nr, nc] = moves[Math.floor(Math.random() * moves.length)];
            if (b[nr][nc] && WHITE_PIECES.has(b[nr][nc]!)) {
              setCaptured((prev2) => ({ ...prev2, black: [...prev2.black, b[nr][nc]!] }));
            }
            b[nr][nc] = b[r][c];
            b[r][c] = null;
            setMoveCount((m) => m + 1);
            setIsWhiteTurn(true);
            return b;
          }
        }
        setIsWhiteTurn(true);
        return b;
      });
    }, 800 + Math.random() * 600);
    return () => clearTimeout(timer);
  }, [isWhiteTurn]);

  const handleTap = (r: number, c: number) => {
    if (!isWhiteTurn) return;
    const cell = board[r][c];
    if (selected) {
      const [sr, sc] = selected;
      const piece = board[sr][sc];
      if (cell && WHITE_PIECES.has(cell)) {
        setSelected([r, c]);
        return;
      }
      // Move
      const b = board.map((row) => [...row]);
      if (cell && BLACK_PIECES.has(cell)) {
        setCaptured((prev) => ({ ...prev, white: [...prev.white, cell] }));
      }
      b[r][c] = piece;
      b[sr][sc] = null;
      setBoard(b);
      setSelected(null);
      setIsWhiteTurn(false);
      setMoveCount((m) => m + 1);
    } else {
      if (cell && WHITE_PIECES.has(cell)) {
        setSelected([r, c]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PlayerBar me={me} opponent={opponent} myScore={captured.white.length} oppScore={captured.black.length} gameColor={gameColor} />
      {/* Turn indicator */}
      <div className="text-center py-1.5">
        <span className={`text-[12px] ${isWhiteTurn ? "text-[#25D366]" : "text-[#8696a0]"}`} style={{ fontWeight: 600 }}>
          {isWhiteTurn ? "Your turn (White)" : `${opponent?.name || "Opponent"}'s turn`} · Move {moveCount + 1}
        </span>
      </div>
      {/* Captured */}
      <div className="flex justify-between px-3 mb-1">
        <div className="flex gap-0.5 text-[14px]">{captured.white.map((p, i) => <span key={i}>{p}</span>)}</div>
        <div className="flex gap-0.5 text-[14px]">{captured.black.map((p, i) => <span key={i}>{p}</span>)}</div>
      </div>
      {/* Board */}
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="rounded-lg overflow-hidden shadow-lg">
          {board.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => {
                const isLight = (r + c) % 2 === 0;
                const isSelected = selected?.[0] === r && selected?.[1] === c;
                return (
                  <button
                    key={c}
                    onClick={() => handleTap(r, c)}
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: isSelected
                        ? "#25D366"
                        : isLight
                          ? "#f0d9b5"
                          : "#b58863",
                    }}
                  >
                    {cell && (
                      <span className="text-[24px]" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                        {cell}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 3. TRIVIA QUIZ
// ═══════════════════════════════════════════════════════
const TRIVIA_QS = [
  { q: "What planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
  { q: "How many bones are in the human body?", opts: ["186", "206", "226", "256"], ans: 1 },
  { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Perth"], ans: 2 },
  { q: "Which element has the symbol 'Au'?", opts: ["Silver", "Aluminum", "Gold", "Argon"], ans: 2 },
  { q: "Who painted the Mona Lisa?", opts: ["Michelangelo", "Da Vinci", "Raphael", "Monet"], ans: 1 },
  { q: "What is the largest ocean on Earth?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
  { q: "In what year did the Berlin Wall fall?", opts: ["1987", "1989", "1991", "1993"], ans: 1 },
  { q: "What gas do plants absorb from air?", opts: ["Oxygen", "Nitrogen", "CO₂", "Hydrogen"], ans: 2 },
];

function TriviaGame({ opponent, me, gameColor }: { opponent?: Player; me?: Player; gameColor: string }) {
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState({ me: 0, opp: 0 });
  const [selected, setSelected] = useState<number | null>(null);
  const [oppSelected, setOppSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const q = TRIVIA_QS[qIndex % TRIVIA_QS.length];

  // Timer
  useEffect(() => {
    if (revealed || gameOver) return;
    if (timeLeft <= 0) { reveal(); return; }
    const t = setTimeout(() => setTimeLeft((tt) => tt - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed, gameOver]);

  // Opponent auto-answer
  useEffect(() => {
    if (revealed || gameOver) return;
    const delay = 2000 + Math.random() * 4000;
    const t = setTimeout(() => {
      if (!revealed) {
        const correct = Math.random() > 0.35;
        setOppSelected(correct ? q.ans : ((q.ans + 1 + Math.floor(Math.random() * 3)) % 4));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [qIndex, gameOver]);

  const reveal = () => {
    setRevealed(true);
    const myCorrect = selected === q.ans;
    const oppCorrect = oppSelected === q.ans;
    setScores((s) => ({
      me: s.me + (myCorrect ? 1 : 0),
      opp: s.opp + (oppCorrect ? 1 : 0),
    }));
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || revealed) return;
    setSelected(idx);
    setTimeout(reveal, 500);
  };

  const nextQ = () => {
    if (qIndex >= TRIVIA_QS.length - 1) {
      setGameOver(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setOppSelected(null);
    setTimeLeft(10);
    setRevealed(false);
  };

  const restart = () => {
    setQIndex(0); setScores({ me: 0, opp: 0 }); setSelected(null);
    setOppSelected(null); setTimeLeft(10); setRevealed(false); setGameOver(false);
  };

  const winnerText = scores.me > scores.opp ? "You win!" : scores.opp > scores.me ? `${opponent?.name || "Opponent"} wins!` : "It's a tie!";

  return (
    <div className="flex flex-col h-full relative">
      {gameOver && <GameOverOverlay winner={winnerText} onRestart={restart} />}
      <PlayerBar me={me} opponent={opponent} myScore={scores.me} oppScore={scores.opp} gameColor={gameColor} />

      <div className="flex-1 flex flex-col px-4 py-3">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#8696a0] text-[11px]" style={{ fontWeight: 600 }}>Q{qIndex + 1}/{TRIVIA_QS.length}</span>
          <div className="flex-1 h-[3px] bg-[#2a3942] rounded-full overflow-hidden">
            <div className="h-full bg-[#25D366] transition-all" style={{ width: `${((qIndex + 1) / TRIVIA_QS.length) * 100}%` }} />
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-[12px] h-[12px] text-[#8696a0]" />
            <span className={`text-[12px] ${timeLeft <= 3 ? "text-red-400" : "text-[#8696a0]"}`} style={{ fontWeight: 600 }}>{timeLeft}s</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#1f2c34] rounded-2xl p-4 mb-4">
          <div className="text-white text-[16px]" style={{ fontWeight: 600, lineHeight: "22px" }}>
            {q.q}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2 flex-1">
          {q.opts.map((opt, i) => {
            let bg = "#1f2c34";
            let border = "transparent";
            let textColor = "white";
            if (revealed) {
              if (i === q.ans) { bg = "#25D366" + "30"; border = "#25D366"; textColor = "#25D366"; }
              else if (i === selected && i !== q.ans) { bg = "#e5393530"; border = "#e53935"; textColor = "#e53935"; }
              else { bg = "#1f2c3480"; textColor = "#667781"; }
            } else if (i === selected) {
              bg = gameColor + "30"; border = gameColor;
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all"
                style={{ backgroundColor: bg, border: `2px solid ${border}` }}
              >
                <span className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[12px] shrink-0"
                  style={{ fontWeight: 700, backgroundColor: "#2a3942", color: textColor }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[14px]" style={{ fontWeight: 500, color: textColor }}>{opt}</span>
                {revealed && i === q.ans && <Star className="w-[14px] h-[14px] text-yellow-400 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {revealed && (
          <button
            onClick={nextQ}
            className="mt-3 bg-[#25D366] text-white rounded-full py-2.5 text-[14px] flex items-center justify-center gap-2"
            style={{ fontWeight: 600 }}
          >
            {qIndex >= TRIVIA_QS.length - 1 ? "See Results" : "Next Question"} <Zap className="w-[14px] h-[14px]" />
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 4. GUESS THE PRICE
// ═══════════════════════════════════════════════════════
const PRODUCTS = [
  { name: "iPhone 16 Pro", emoji: "📱", price: 999 },
  { name: "PS5 Slim", emoji: "🎮", price: 449 },
  { name: "Nike Air Max 90", emoji: "👟", price: 130 },
  { name: "MacBook Air M3", emoji: "💻", price: 1099 },
  { name: "Airpods Pro 2", emoji: "🎧", price: 249 },
  { name: "Dyson V15", emoji: "🧹", price: 749 },
];

function GuessPriceGame({ opponent, me, gameColor }: { opponent?: Player; me?: Player; gameColor: string }) {
  const [pIndex, setPIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [oppGuess, setOppGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState({ me: 0, opp: 0 });
  const [gameOver, setGameOver] = useState(false);

  const product = PRODUCTS[pIndex % PRODUCTS.length];

  // Opponent guess
  useEffect(() => {
    if (revealed || gameOver) return;
    const delay = 1500 + Math.random() * 2000;
    const t = setTimeout(() => {
      const variance = product.price * (0.05 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
      setOppGuess(Math.round(product.price + variance));
    }, delay);
    return () => clearTimeout(t);
  }, [pIndex, gameOver]);

  const handleSubmit = () => {
    if (!guess.trim()) return;
    setRevealed(true);
    const myDiff = Math.abs(parseInt(guess) - product.price);
    const oppDiff = oppGuess !== null ? Math.abs(oppGuess - product.price) : 9999;
    if (myDiff < oppDiff) setScores((s) => ({ ...s, me: s.me + 1 }));
    else if (oppDiff < myDiff) setScores((s) => ({ ...s, opp: s.opp + 1 }));
  };

  const next = () => {
    if (pIndex >= PRODUCTS.length - 1) { setGameOver(true); return; }
    setPIndex((i) => i + 1);
    setGuess(""); setOppGuess(null); setRevealed(false);
  };

  const restart = () => {
    setPIndex(0); setGuess(""); setOppGuess(null); setRevealed(false);
    setScores({ me: 0, opp: 0 }); setGameOver(false);
  };

  const winnerText = scores.me > scores.opp ? "You win!" : scores.opp > scores.me ? `${opponent?.name || "Opponent"} wins!` : "It's a tie!";

  return (
    <div className="flex flex-col h-full relative">
      {gameOver && <GameOverOverlay winner={winnerText} onRestart={restart} />}
      <PlayerBar me={me} opponent={opponent} myScore={scores.me} oppScore={scores.opp} gameColor={gameColor} />

      <div className="flex-1 flex flex-col items-center px-4 py-4">
        <span className="text-[#8696a0] text-[11px] mb-2" style={{ fontWeight: 600 }}>Round {pIndex + 1}/{PRODUCTS.length}</span>

        {/* Product card */}
        <div className="bg-[#1f2c34] rounded-2xl p-6 w-full flex flex-col items-center mb-4">
          <span className="text-[60px] mb-2">{product.emoji}</span>
          <div className="text-white text-[18px]" style={{ fontWeight: 700 }}>{product.name}</div>
          <div className="text-[#8696a0] text-[13px] mt-1">How much does it cost?</div>
          {revealed && (
            <div className="mt-3 bg-[#25D366]/20 rounded-full px-4 py-1">
              <span className="text-[#25D366] text-[20px]" style={{ fontWeight: 700 }}>${product.price}</span>
            </div>
          )}
        </div>

        {/* Input */}
        {!revealed ? (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-[#2a3942] rounded-xl flex items-center px-3">
              <span className="text-[#8696a0] text-[18px]" style={{ fontWeight: 600 }}>$</span>
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Your guess"
                className="flex-1 bg-transparent text-white text-[18px] px-2 py-3 outline-none placeholder:text-[#667781]"
                style={{ fontWeight: 600 }}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#25D366] text-white rounded-xl px-5 py-3 text-[14px]"
              style={{ fontWeight: 600 }}
            >
              Lock in
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex justify-between bg-[#1f2c34] rounded-xl px-4 py-2.5">
              <span className="text-white text-[13px]" style={{ fontWeight: 500 }}>You guessed</span>
              <span className="text-white text-[15px]" style={{ fontWeight: 700 }}>${guess}</span>
            </div>
            <div className="flex justify-between bg-[#1f2c34] rounded-xl px-4 py-2.5">
              <span className="text-white text-[13px]" style={{ fontWeight: 500 }}>{opponent?.name} guessed</span>
              <span className="text-white text-[15px]" style={{ fontWeight: 700 }}>${oppGuess}</span>
            </div>
            <button
              onClick={next}
              className="w-full mt-2 bg-[#25D366] text-white rounded-full py-2.5 text-[14px]"
              style={{ fontWeight: 600 }}
            >
              {pIndex >= PRODUCTS.length - 1 ? "See Results" : "Next Product"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 5. RUMMY
// ═══════════════════════════════════════════════════════
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_COLORS: Record<string, string> = { "♠": "#1a1a2e", "♥": "#e53935", "♦": "#e53935", "♣": "#1a1a2e" };

function makeCard() {
  return { suit: SUITS[Math.floor(Math.random() * 4)], rank: RANKS[Math.floor(Math.random() * 13)], id: Math.random().toString(36).slice(2) };
}

function RummyGame({ opponent, me, gameColor }: { opponent?: Player; me?: Player; gameColor: string }) {
  const [hand, setHand] = useState(() => Array.from({ length: 7 }, makeCard));
  const [discardPile, setDiscardPile] = useState(() => [makeCard()]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [oppCardCount, setOppCardCount] = useState(7);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [turnAction, setTurnAction] = useState<"draw" | "discard">("draw");
  const [message, setMessage] = useState("Draw a card to start your turn");

  const topDiscard = discardPile[discardPile.length - 1];

  const handleDraw = (source: "deck" | "discard") => {
    if (!isMyTurn || turnAction !== "draw") return;
    const newCard = source === "discard" ? topDiscard : makeCard();
    if (source === "discard") setDiscardPile((p) => p.slice(0, -1));
    setHand((h) => [...h, newCard]);
    setTurnAction("discard");
    setMessage("Select a card to discard");
  };

  const handleCardTap = (cardId: string) => {
    if (!isMyTurn) return;
    if (turnAction === "discard") {
      const card = hand.find((c) => c.id === cardId);
      if (!card) return;
      setHand((h) => h.filter((c) => c.id !== cardId));
      setDiscardPile((p) => [...p, card]);
      setTurnAction("draw");
      setIsMyTurn(false);
      setMessage(`${opponent?.name || "Opponent"}'s turn...`);
      // AI turn
      setTimeout(() => {
        setOppCardCount((c) => c); // stays same (draw + discard)
        setDiscardPile((p) => [...p, makeCard()]);
        setIsMyTurn(true);
        setTurnAction("draw");
        setMessage("Your turn — draw a card");
      }, 1200 + Math.random() * 800);
    } else {
      setSelectedCards((prev) => {
        const n = new Set(prev);
        n.has(cardId) ? n.delete(cardId) : n.add(cardId);
        return n;
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PlayerBar me={me} opponent={opponent} myScore={hand.length} oppScore={oppCardCount} gameColor={gameColor} />

      {/* Status */}
      <div className="text-center py-2">
        <span className={`text-[12px] ${isMyTurn ? "text-[#25D366]" : "text-[#8696a0]"}`} style={{ fontWeight: 600 }}>
          {message}
        </span>
      </div>

      {/* Opponent's hand (face down) */}
      <div className="flex justify-center gap-[-4px] px-4 mb-2">
        {Array.from({ length: oppCardCount }).map((_, i) => (
          <div key={i} className="w-[28px] h-[38px] rounded bg-gradient-to-br from-[#c62828] to-[#8e1616] border border-[#d32f2f] -ml-2 first:ml-0"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }} />
        ))}
      </div>

      {/* Table area */}
      <div className="flex-1 flex items-center justify-center gap-6 px-6">
        {/* Draw pile */}
        <button
          onClick={() => handleDraw("deck")}
          className={`w-[60px] h-[84px] rounded-lg flex flex-col items-center justify-center ${
            isMyTurn && turnAction === "draw" ? "ring-2 ring-[#25D366]" : ""
          }`}
          style={{ background: "linear-gradient(135deg, #1565c0, #0d47a1)", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
        >
          <span className="text-white text-[12px]" style={{ fontWeight: 700 }}>DRAW</span>
          <span className="text-white/50 text-[10px]">deck</span>
        </button>

        {/* Discard pile */}
        <button
          onClick={() => handleDraw("discard")}
          className={`w-[60px] h-[84px] rounded-lg bg-white flex flex-col items-center justify-center ${
            isMyTurn && turnAction === "draw" ? "ring-2 ring-[#25D366]" : ""
          }`}
          style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
        >
          {topDiscard && (
            <>
              <span className="text-[10px]" style={{ color: SUIT_COLORS[topDiscard.suit] }}>{topDiscard.suit}</span>
              <span className="text-[20px]" style={{ fontWeight: 700, color: SUIT_COLORS[topDiscard.suit] }}>{topDiscard.rank}</span>
              <span className="text-[10px]" style={{ color: SUIT_COLORS[topDiscard.suit] }}>{topDiscard.suit}</span>
            </>
          )}
        </button>
      </div>

      {/* My hand */}
      <div className="px-2 pb-3 pt-2">
        <div className="flex justify-center overflow-x-auto gap-[-2px]">
          {hand.map((card) => {
            const isSel = selectedCards.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card.id)}
                className={`w-[44px] h-[64px] rounded-lg bg-white flex flex-col items-center justify-center shrink-0 -ml-1.5 first:ml-0 transition-transform ${
                  isSel ? "-translate-y-2 ring-2 ring-[#25D366]" : ""
                }`}
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
              >
                <span className="text-[8px]" style={{ color: SUIT_COLORS[card.suit] }}>{card.suit}</span>
                <span className="text-[16px]" style={{ fontWeight: 700, color: SUIT_COLORS[card.suit] }}>{card.rank}</span>
                <span className="text-[8px]" style={{ color: SUIT_COLORS[card.suit] }}>{card.suit}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 6. LUDO
// ═══════════════════════════════════════════════════════
const LUDO_COLORS = ["#e53935", "#1e88e5", "#43a047", "#fdd835"];

function LudoGame({ opponent, me, gameColor, players }: { opponent?: Player; me?: Player; gameColor: string; players: Player[] }) {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [positions, setPositions] = useState<number[][]>([[0, 0], [0, 0], [0, 0], [0, 0]]); // 4 players × 2 tokens
  const [moveCount, setMoveCount] = useState(0);

  const rollDice = () => {
    if (!isMyTurn || isRolling) return;
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.ceil(Math.random() * 6));
      count++;
      if (count >= 8) {
        clearInterval(interval);
        const final = Math.ceil(Math.random() * 6);
        setDiceValue(final);
        setIsRolling(false);
        // Move a token
        setPositions((prev) => {
          const n = prev.map((p) => [...p]);
          const tokenIdx = n[0][0] <= n[0][1] ? 0 : 1;
          n[0][tokenIdx] = Math.min(n[0][tokenIdx] + final, 56);
          return n;
        });
        setMoveCount((m) => m + 1);
        setIsMyTurn(false);
        // Opponent turn
        setTimeout(() => {
          const oppRoll = Math.ceil(Math.random() * 6);
          setDiceValue(oppRoll);
          setPositions((prev) => {
            const n = prev.map((p) => [...p]);
            const tokenIdx = n[1][0] <= n[1][1] ? 0 : 1;
            n[1][tokenIdx] = Math.min(n[1][tokenIdx] + oppRoll, 56);
            return n;
          });
          setIsMyTurn(true);
          setMoveCount((m) => m + 1);
        }, 1200);
      }
    }, 80);
  };

  const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  return (
    <div className="flex flex-col h-full">
      <PlayerBar me={me} opponent={opponent} myScore={positions[0][0] + positions[0][1]} oppScore={positions[1][0] + positions[1][1]} gameColor={gameColor} />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Simple Ludo board visualization */}
        <div className="w-[260px] h-[260px] relative mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: "#f5f0e8" }}>
          {/* Quadrants */}
          <div className="absolute top-0 left-0 w-[110px] h-[110px] rounded-br-xl" style={{ backgroundColor: LUDO_COLORS[0] + "30" }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((t) => (
                  <div key={t} className="w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: LUDO_COLORS[0], backgroundColor: positions[0][t] > 0 ? LUDO_COLORS[0] : "white" }}>
                    {positions[0][t] > 0 && <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>{positions[0][t]}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[110px] h-[110px] rounded-bl-xl" style={{ backgroundColor: LUDO_COLORS[1] + "30" }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((t) => (
                  <div key={t} className="w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: LUDO_COLORS[1], backgroundColor: positions[1][t] > 0 ? LUDO_COLORS[1] : "white" }}>
                    {positions[1][t] > 0 && <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>{positions[1][t]}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-[110px] h-[110px] rounded-tr-xl" style={{ backgroundColor: LUDO_COLORS[2] + "30" }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((t) => (
                  <div key={t} className="w-[24px] h-[24px] rounded-full border-2" style={{ borderColor: LUDO_COLORS[2], backgroundColor: "white" }} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-[110px] h-[110px] rounded-tl-xl" style={{ backgroundColor: LUDO_COLORS[3] + "30" }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((t) => (
                  <div key={t} className="w-[24px] h-[24px] rounded-full border-2" style={{ borderColor: LUDO_COLORS[3], backgroundColor: "white" }} />
                ))}
              </div>
            </div>
          </div>
          {/* Center star */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[40px] h-[40px] bg-white rounded-lg shadow-sm flex items-center justify-center">
              <Star className="w-[20px] h-[20px] text-yellow-500" />
            </div>
          </div>
          {/* Path indicators */}
          <div className="absolute top-[110px] left-0 right-0 h-[40px] flex items-center justify-center">
            <div className="flex gap-0.5">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="w-[16px] h-[16px] rounded-sm bg-white/80 border border-[#d1d7db]" />
              ))}
            </div>
          </div>
          <div className="absolute left-[110px] top-0 bottom-0 w-[40px] flex flex-col items-center justify-center">
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="w-[16px] h-[16px] rounded-sm bg-white/80 border border-[#d1d7db]" />
              ))}
            </div>
          </div>
        </div>

        {/* Turn + Dice */}
        <div className={`text-[13px] mb-3 ${isMyTurn ? "text-[#25D366]" : "text-[#8696a0]"}`} style={{ fontWeight: 600 }}>
          {isMyTurn ? "Your turn — roll the dice!" : `${opponent?.name || "Opponent"} is rolling...`}
        </div>

        <button
          onClick={rollDice}
          disabled={!isMyTurn || isRolling}
          className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all ${
            isMyTurn && !isRolling ? "bg-white shadow-lg active:scale-90" : "bg-[#2a3942]"
          } ${isRolling ? "animate-bounce" : ""}`}
        >
          <span className="text-[44px]">{DICE_FACES[diceValue - 1]}</span>
        </button>

        <div className="text-[#667781] text-[11px] mt-2">Move {moveCount + 1}</div>
      </div>
    </div>
  );
}