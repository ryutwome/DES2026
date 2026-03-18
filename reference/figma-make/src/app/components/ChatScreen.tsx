import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  SendHorizontal,
  Check,
  CheckCheck,
  Sparkles,
  Keyboard,
  Play,
  Pause,
  Dice5,
  X,
  Users,
  Volume2,
  Trophy,
  Swords,
  Brain,
  Grid3X3,
  CircleDot,
  Gamepad2,
  LogOut,
} from "lucide-react";
import type { Chat, Contact, Message } from "../data/mockData";
import { useAppData } from "../data/AppContext";
import { contacts as allContacts, currentUser } from "../data/mockData";
import { GameScreen } from "./GameScreen";

interface ChatScreenProps {
  chat: Chat;
  contact: Contact;
  onBack: () => void;
}

// ─── Game definitions ───
interface GameDef {
  id: string;
  name: string;
  emoji: string;
  icon: typeof Swords;
  color: string;
  minPlayers: number;
  maxPlayers: number;
  description: string;
}

const GAMES: GameDef[] = [
  { id: "chess", name: "Chess", emoji: "♟️", icon: Swords, color: "#4e342e", minPlayers: 2, maxPlayers: 2, description: "Classic 1v1 strategy battle" },
  { id: "rummy", name: "Rummy", emoji: "🃏", icon: Gamepad2, color: "#c62828", minPlayers: 2, maxPlayers: 4, description: "Card game — match sets & runs" },
  { id: "guess-price", name: "Guess the Price", emoji: "💰", icon: Trophy, color: "#e65100", minPlayers: 2, maxPlayers: 6, description: "Closest guess wins!" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", emoji: "❌", icon: Grid3X3, color: "#1565c0", minPlayers: 2, maxPlayers: 2, description: "Quick X's and O's" },
  { id: "trivia", name: "Trivia Quiz", emoji: "🧠", icon: Brain, color: "#6a1b9a", minPlayers: 2, maxPlayers: 8, description: "Test your knowledge" },
  { id: "ludo", name: "Ludo", emoji: "🎲", icon: CircleDot, color: "#2e7d32", minPlayers: 2, maxPlayers: 4, description: "Race your tokens home" },
];

interface ActiveGame {
  id: string;
  gameDef: GameDef;
  messageId: string;
  players: { id: string; name: string; avatar: string }[];
  maxPlayers: number;
  started: boolean;
  voiceChatActive: boolean;
}

// Simulated voice transcriptions for demo
const voiceTranscriptions = [
  "Hey, just wanted to check in on you. How's everything going?",
  "I was thinking we could grab lunch this weekend, what do you think?",
  "Oh my god, I just saw the funniest thing on the way home",
  "Can you send me that link you mentioned earlier? I forgot to save it",
  "I'm running about ten minutes late, traffic is crazy right now",
  "Yeah that sounds great, let's do it tomorrow around noon",
  "Just finished cooking and honestly it turned out amazing this time",
  "Did you hear what happened? I need to tell you about this",
];

export function ChatScreen({ chat, contact, onBack }: ChatScreenProps) {
  const { messages, getContact, sendMessage, isAiMode, chats, replyInProgress } = useAppData();
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "voice">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState(0);
  const [voiceMessages, setVoiceMessages] = useState<Set<string>>(new Set());

  // Game state
  const [showGamePicker, setShowGamePicker] = useState(false);
  const [gameCards, setGameCards] = useState<Map<string, ActiveGame>>(new Map());
  const [activeGameVoice, setActiveGameVoice] = useState<ActiveGame | null>(null);
  const [voicePulse, setVoicePulse] = useState<Record<string, boolean>>({});
  const [isMeTalking, setIsMeTalking] = useState(false);
  const [activeGameScreen, setActiveGameScreen] = useState<ActiveGame | null>(null);
  const [gameCountdowns, setGameCountdowns] = useState<Map<string, number>>(new Map());
  const countdownRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const playInterval = useRef<NodeJS.Timeout | null>(null);
  const [latestVoiceChatId, setLatestVoiceId] = useState<string | null>(null);
  const pendingGameDef = useRef<GameDef | null>(null);

  const displayName = chat.isGroup ? chat.groupName : contact.name;
  const currentMessages = messages[chat.id] || [];
  const liveChat = chats.find((c) => c.id === chat.id) || chat;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, chat.id]);

  useEffect(() => {
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      if (playInterval.current) clearInterval(playInterval.current);
    };
  }, []);

  // Mark some existing messages as voice for demo
  useEffect(() => {
    const voiceSet = new Set<string>();
    currentMessages.forEach((msg, i) => {
      if (msg.type === "audio" || (i % 3 === 1 && msg.senderId !== "me")) {
        voiceSet.add(msg.id);
      }
    });
    setVoiceMessages(voiceSet);
  }, [chat.id]);

  // Voice chat pulse simulation
  useEffect(() => {
    if (!activeGameVoice) return;
    const interval = setInterval(() => {
      const pulse: Record<string, boolean> = {};
      activeGameVoice.players.forEach((p) => {
        if (p.id !== "me") pulse[p.id] = Math.random() > 0.45;
      });
      if (isMeTalking) pulse["me"] = Math.random() > 0.3;
      setVoicePulse(pulse);
    }, 700);
    return () => clearInterval(interval);
  }, [activeGameVoice, isMeTalking]);

  // Game countdown: detect when a game becomes full and start countdown
  useEffect(() => {
    gameCards.forEach((game, msgId) => {
      const isFull = game.players.length >= game.maxPlayers;
      const iJoined = game.players.some((p) => p.id === "me");
      const hasCountdown = countdownRefs.current.has(msgId);
      if (isFull && iJoined && !hasCountdown && !game.started) {
        // Start countdown from 5
        setGameCountdowns((prev) => new Map(prev).set(msgId, 5));
        const interval = setInterval(() => {
          setGameCountdowns((prev) => {
            const next = new Map(prev);
            const current = next.get(msgId);
            if (current === undefined || current <= 1) {
              clearInterval(interval);
              countdownRefs.current.delete(msgId);
              next.delete(msgId);
              // Launch game
              const card = gameCards.get(msgId);
              if (card) {
                setActiveGameScreen(card);
                setGameCards((gc) => {
                  const updated = new Map(gc);
                  const g = updated.get(msgId);
                  if (g) updated.set(msgId, { ...g, started: true });
                  return updated;
                });
              }
              return next;
            }
            next.set(msgId, current - 1);
            return next;
          });
        }, 1000);
        countdownRefs.current.set(msgId, interval);
      }
    });
  }, [gameCards]);

  // Cleanup countdown intervals on unmount
  useEffect(() => {
    return () => {
      countdownRefs.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  // After sending, mark the actual last message as voice
  useEffect(() => {
    if (latestVoiceChatId === chat.id) {
      const msgs = messages[chat.id] || [];
      const lastMe = [...msgs].reverse().find((m) => m.senderId === "me");
      if (lastMe) {
        setVoiceMessages((prev) => new Set([...prev, lastMe.id]));
      }
      setLatestVoiceId(null);
    }
  }, [currentMessages.length, latestVoiceChatId, chat.id]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chat.id, text.trim());
    setText("");
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    const transcription = voiceTranscriptions[Math.floor(Math.random() * voiceTranscriptions.length)];
    sendMessage(chat.id, transcription);
    setTimeout(() => {
      setVoiceMessages((prev) => {
        const next = new Set(prev);
        next.add(`voice-latest-${Date.now()}`);
        return next;
      });
      setLatestVoiceId(chat.id);
    }, 50);
    setRecordingTime(0);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setRecordingTime(0);
  };

  const handlePlayVoice = (msgId: string) => {
    if (playingMessageId === msgId) {
      if (playInterval.current) clearInterval(playInterval.current);
      setPlayingMessageId(null);
      setPlayProgress(0);
      return;
    }
    setPlayingMessageId(msgId);
    setPlayProgress(0);
    if (playInterval.current) clearInterval(playInterval.current);
    playInterval.current = setInterval(() => {
      setPlayProgress((p) => {
        if (p >= 100) {
          if (playInterval.current) clearInterval(playInterval.current);
          setPlayingMessageId(null);
          return 0;
        }
        return p + 4;
      });
    }, 120);
  };

  // Link pending game to last sent message via useEffect (avoids stale closure)
  useEffect(() => {
    if (!pendingGameDef.current) return;
    const msgs = messages[chat.id] || [];
    const lastMe = [...msgs].reverse().find((m) => m.senderId === "me");
    if (!lastMe) return;
    // Avoid re-linking to an already-linked message
    if (gameCards.has(lastMe.id)) {
      pendingGameDef.current = null;
      return;
    }
    const gameDef = pendingGameDef.current;
    pendingGameDef.current = null;
    const newGame: ActiveGame = {
      id: `game-${Date.now()}`,
      gameDef,
      messageId: lastMe.id,
      players: [],
      maxPlayers: gameDef.maxPlayers,
      started: false,
      voiceChatActive: false,
    };
    setGameCards((prev) => new Map(prev).set(lastMe.id, newGame));
  }, [currentMessages.length]);

  // ─── Game handlers ───
  const handleStartGame = (gameDef: GameDef) => {
    pendingGameDef.current = gameDef;
    sendMessage(chat.id, `🎮 ${gameDef.emoji} ${gameDef.name} — Tap to join!`);
    setShowGamePicker(false);
  };

  const handleJoinGame = (msgId: string) => {
    setGameCards((prev) => {
      const next = new Map(prev);
      const game = next.get(msgId);
      if (!game) return prev;
      const alreadyJoined = game.players.some((p) => p.id === "me");
      if (alreadyJoined) return prev;

      const updatedPlayers = [
        ...game.players,
        { id: "me", name: "You", avatar: currentUser.avatar },
      ];

      // Simulate opponent joining after a short delay
      const hasOther = game.players.some((p) => p.id !== "me");
      if (!hasOther) {
        setTimeout(() => {
          setGameCards((prev2) => {
            const next2 = new Map(prev2);
            const g = next2.get(msgId);
            if (!g) return prev2;
            // Pick a random contact as opponent
            const opponent = allContacts[Math.floor(Math.random() * Math.min(allContacts.length, 5))];
            const withOpponent = [
              ...g.players,
              { id: opponent.id, name: opponent.name.split(" ")[0], avatar: opponent.avatar },
            ];
            next2.set(msgId, {
              ...g,
              players: withOpponent,
              voiceChatActive: true,
            });
            // Auto-activate voice chat
            setActiveGameVoice({
              ...g,
              players: withOpponent,
              voiceChatActive: true,
            });
            return next2;
          });
        }, 1500);
      }

      next.set(msgId, { ...game, players: updatedPlayers });
      return next;
    });
  };

  const handleLeaveVoiceChat = () => {
    setActiveGameVoice(null);
    setIsMeTalking(false);
  };

  const formatRecordTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const statusText = chat.isGroup
    ? (chat.groupMembers || []).map((id) => getContact(id)?.name?.split(" ")[0]).filter(Boolean).join(", ")
    : contact.online
      ? "online"
      : contact.lastSeen || "offline";

  const isVoiceMsg = (msg: Message) => voiceMessages.has(msg.id);

  const getWaveform = (msgId: string) => {
    const seed = msgId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const bars: number[] = [];
    for (let i = 0; i < 28; i++) {
      bars.push(0.2 + Math.abs(Math.sin(seed * 0.3 + i * 0.7)) * 0.8);
    }
    return bars;
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] relative">
      {/* Header */}
      <div className="bg-[#008069] px-2 py-[6px] flex items-center gap-[6px] shrink-0 z-10">
        <button onClick={onBack} className="p-1 text-white">
          <ArrowLeft className="w-[22px] h-[22px]" />
        </button>
        <img src={contact.avatar} alt={displayName} className="w-[38px] h-[38px] rounded-full object-cover" />
        <div className="flex-1 min-w-0 ml-[6px]">
          <div className="text-white text-[16px] truncate flex items-center gap-[6px]" style={{ fontWeight: 500 }}>
            {displayName}
            {isAiMode && !chat.isGroup && (
              <Sparkles className="w-[13px] h-[13px] text-[#d9fdd3] shrink-0" />
            )}
          </div>
          <div className="text-[12.5px] text-white/80 truncate">
            {liveChat.typing ? "typing..." : statusText}
          </div>
        </div>
        <div className="flex items-center">
          <button className="p-[8px] text-white">
            <Video className="w-[20px] h-[20px]" />
          </button>
          <button className="p-[8px] text-white">
            <Phone className="w-[20px] h-[20px]" />
          </button>
          <button className="p-[8px] text-white">
            <MoreVertical className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>

      {/* Game voice chat banner */}
      {activeGameVoice && (
        <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2 shrink-0 z-10">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-[8px] h-[8px] rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-white text-[13px] truncate" style={{ fontWeight: 500 }}>
              {activeGameVoice.gameDef.emoji} {activeGameVoice.gameDef.name} voice chat
            </span>
            {/* Tiny participant avatars */}
            <div className="flex items-center -space-x-2 ml-1">
              {activeGameVoice.players.slice(0, 4).map((p) => (
                <div key={p.id} className="relative">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className={`w-[22px] h-[22px] rounded-full object-cover border-2 transition-all ${
                      voicePulse[p.id] ? "border-[#25D366]" : "border-[#1f2c34]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsMeTalking(!isMeTalking)}
            className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${
              isMeTalking ? "bg-[#25D366] text-white" : "bg-[#2a3942] text-[#8696a0]"
            }`}
            style={{ fontWeight: 500 }}
          >
            {isMeTalking ? "🎤 On" : "🎤 Off"}
          </button>
          <button
            onClick={handleLeaveVoiceChat}
            className="text-red-400 p-1"
          >
            <LogOut className="w-[16px] h-[16px]" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-[12px] py-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 5c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zM5 20c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zM35 25c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zM15 35c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z' fill='%23d4cfc4' fill-opacity='0.35'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='%23efeae2'/%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Date separator */}
        <div className="flex justify-center mb-3">
          <span className="bg-white/90 text-[#54656f] text-[12px] px-3 py-[4px] rounded-[7px] shadow-sm">
            TODAY
          </span>
        </div>

        {/* Encryption notice */}
        <div className="flex justify-center mb-3">
          <span className="bg-[#fdf4c5] text-[#54656f] text-[11.5px] px-[10px] py-[5px] rounded-[8px] text-center max-w-[300px]" style={{ lineHeight: "16px" }}>
            🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </span>
        </div>

        {/* Messages */}
        {currentMessages.map((msg, i) => {
          const isMe = msg.senderId === "me";
          const prevMsg = currentMessages[i - 1];
          const showTail = !prevMsg || prevMsg.senderId !== msg.senderId;
          const senderContact = !isMe ? getContact(msg.senderId) : undefined;
          const isVoice = isVoiceMsg(msg);
          const waveform = isVoice ? getWaveform(msg.id) : [];
          const isPlaying = playingMessageId === msg.id;
          const gameCard = gameCards.get(msg.id);

          // ─── Game card message ───
          if (gameCard) {
            const { gameDef, players, maxPlayers } = gameCard;
            const GameIcon = gameDef.icon;
            const iJoined = players.some((p) => p.id === "me");
            const isFull = players.length >= maxPlayers;

            return (
              <div key={msg.id} className="flex justify-center mb-3">
                <div className="w-[280px] bg-white rounded-[12px] shadow-md overflow-hidden">
                  {/* Game header strip */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ backgroundColor: gameDef.color }}
                  >
                    <div className="w-[42px] h-[42px] bg-white/20 rounded-[10px] flex items-center justify-center">
                      <span className="text-[24px]">{gameDef.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[16px]" style={{ fontWeight: 600 }}>
                        {gameDef.name}
                      </div>
                      <div className="text-white/70 text-[12px]">{gameDef.description}</div>
                    </div>
                  </div>

                  {/* Players section */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-[13px] h-[13px] text-[#8696a0]" />
                        <span className="text-[#667781] text-[12px]" style={{ fontWeight: 500 }}>
                          Players
                        </span>
                      </div>
                      <span
                        className="text-[12px] px-2 py-0.5 rounded-full"
                        style={{
                          fontWeight: 600,
                          color: isFull ? "#008069" : "#667781",
                          backgroundColor: isFull ? "#d8fdd2" : "#f0f2f5",
                        }}
                      >
                        {players.length}/{maxPlayers}
                      </span>
                    </div>

                    {/* Player avatars */}
                    <div className="flex items-center gap-2 mb-3">
                      {players.map((p) => (
                        <div key={p.id} className="flex flex-col items-center">
                          <div className="relative">
                            <img src={p.avatar} alt={p.name} className="w-[36px] h-[36px] rounded-full object-cover" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-[#25D366] rounded-full border-2 border-white flex items-center justify-center">
                              <Check className="w-[7px] h-[7px] text-white" />
                            </div>
                          </div>
                          <span className="text-[10px] text-[#111b21] mt-1" style={{ fontWeight: 500 }}>
                            {p.id === "me" ? "You" : p.name}
                          </span>
                        </div>
                      ))}
                      {/* Empty slots */}
                      {Array.from({ length: maxPlayers - players.length }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="flex flex-col items-center">
                          <div className="w-[36px] h-[36px] rounded-full bg-[#f0f2f5] border-2 border-dashed border-[#d1d7db] flex items-center justify-center">
                            <span className="text-[#8696a0] text-[14px]">?</span>
                          </div>
                          <span className="text-[10px] text-[#8696a0] mt-1">waiting</span>
                        </div>
                      ))}
                    </div>

                    {/* Voice chat indicator */}
                    {gameCard.voiceChatActive && (
                      <div className="flex items-center gap-1.5 mb-2.5 bg-[#d8fdd2] rounded-lg px-2.5 py-1.5">
                        <Volume2 className="w-[12px] h-[12px] text-[#008069]" />
                        <span className="text-[11px] text-[#008069]" style={{ fontWeight: 500 }}>
                          Voice chat active — all players connected
                        </span>
                      </div>
                    )}

                    {/* Join / Status button */}
                    {!iJoined ? (
                      <button
                        onClick={() => handleJoinGame(msg.id)}
                        className="w-full py-2.5 rounded-[10px] text-white text-[15px] flex items-center justify-center gap-2"
                        style={{ fontWeight: 600, backgroundColor: gameDef.color }}
                      >
                        <Gamepad2 className="w-[18px] h-[18px]" />
                        Join Game
                      </button>
                    ) : isFull ? (
                      (() => {
                        const countdown = gameCountdowns.get(msg.id);
                        const started = gameCard.started;
                        if (started) {
                          return (
                            <div
                              className="w-full py-2.5 rounded-[10px] text-white text-[14px] text-center"
                              style={{ fontWeight: 600, backgroundColor: gameDef.color, opacity: 0.7 }}
                            >
                              Game in progress
                            </div>
                          );
                        }
                        if (countdown !== undefined) {
                          const progressPct = ((5 - countdown) / 5) * 100;
                          return (
                            <div className="w-full relative overflow-hidden rounded-[10px]" style={{ backgroundColor: gameDef.color + "30" }}>
                              {/* Progress bar fill */}
                              <div
                                className="absolute inset-y-0 left-0 rounded-[10px] transition-all duration-1000 ease-linear"
                                style={{ width: `${progressPct}%`, backgroundColor: gameDef.color, opacity: 0.3 }}
                              />
                              <div className="relative py-2.5 flex items-center justify-center gap-2">
                                <span className="text-[15px]" style={{ fontWeight: 700, color: gameDef.color }}>
                                  Game starting
                                </span>
                                <span
                                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[16px]"
                                  style={{ fontWeight: 800, backgroundColor: gameDef.color, animation: "pulse 1s ease-in-out infinite" }}
                                >
                                  {countdown}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <button
                            onClick={() => setActiveGameScreen(gameCard)}
                            className="w-full py-2.5 rounded-[10px] text-white text-[15px] flex items-center justify-center gap-2"
                            style={{ fontWeight: 600, backgroundColor: gameDef.color }}
                          >
                            <Play className="w-[16px] h-[16px]" />
                            Play Now
                          </button>
                        );
                      })()
                    ) : (
                      <div className="w-full py-2.5 rounded-[10px] bg-[#f0f2f5] text-[#667781] text-[14px] text-center" style={{ fontWeight: 500 }}>
                        Waiting for players to join...
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="px-4 pb-2 flex justify-end">
                    <span className="text-[11px] text-[#667781]">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          }

          // ─── Regular message ───
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} mb-[2px]`}>
              <div
                className={`relative max-w-[85%] px-[8px] pt-[5px] pb-[6px] rounded-[8px] shadow-sm ${
                  isMe ? "bg-[#d9fdd3]" : "bg-white"
                } ${showTail ? (isMe ? "rounded-tr-none" : "rounded-tl-none") : ""}`}
              >
                {/* Tail */}
                {showTail && (
                  <div className={`absolute top-0 w-[8px] h-[13px] ${isMe ? "-right-[8px]" : "-left-[8px]"}`}>
                    <svg viewBox="0 0 8 13" width="8" height="13">
                      {isMe ? (
                        <path fill="#d9fdd3" d="M1.533 3.568 8 0 0 0v13c.55-2.34 1.07-4.89 1.533-9.432z" />
                      ) : (
                        <path fill="#ffffff" d="M6.467 3.568 0 0h8v13c-.55-2.34-1.07-4.89-1.533-9.432z" />
                      )}
                    </svg>
                  </div>
                )}

                {/* Group sender name */}
                {chat.isGroup && !isMe && showTail && senderContact && (
                  <div className="text-[12.5px] mb-[1px]" style={{ fontWeight: 500, color: getGroupColor(senderContact.id) }}>
                    {senderContact.name}
                  </div>
                )}

                {/* Voice indicator label */}
                {isVoice && (
                  <div className="flex items-center gap-1 mb-[3px]">
                    <Mic className={`w-[11px] h-[11px] ${isMe ? "text-[#008069]" : "text-[#8696a0]"}`} />
                    <span className={`text-[10.5px] ${isMe ? "text-[#008069]" : "text-[#8696a0]"}`} style={{ fontWeight: 500 }}>
                      Voice message
                    </span>
                  </div>
                )}

                {/* Text content */}
                <div className="flex items-end gap-[4px]">
                  <span className="text-[14.2px] text-[#111b21] whitespace-pre-wrap break-words" style={{ lineHeight: "19px" }}>
                    {msg.text}
                  </span>
                  {!isVoice && (
                    <span className="flex items-center gap-[2px] shrink-0 -mb-[2px]">
                      <span className="text-[11px] text-[#667781]">{msg.timestamp}</span>
                      {isMe && (
                        msg.status === "read" ? (
                          <CheckCheck className="w-[16px] h-[16px] text-[#53bdeb]" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="w-[16px] h-[16px] text-[#8696a0]" />
                        ) : (
                          <Check className="w-[16px] h-[16px] text-[#8696a0]" />
                        )
                      )}
                    </span>
                  )}
                </div>

                {/* Voice playback bar */}
                {isVoice && (
                  <div className="mt-[4px] flex items-center gap-2">
                    <button
                      onClick={() => handlePlayVoice(msg.id)}
                      className={`w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0 ${
                        isMe ? "bg-[#008069]" : "bg-[#8696a0]"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-[13px] h-[13px] text-white" />
                      ) : (
                        <Play className="w-[13px] h-[13px] text-white ml-[1px]" />
                      )}
                    </button>
                    <div className="flex items-center gap-[1.5px] flex-1 h-[24px]">
                      {waveform.map((h, wi) => {
                        const progress = isPlaying ? playProgress : 0;
                        const barProgress = (wi / waveform.length) * 100;
                        const isActive = barProgress < progress;
                        return (
                          <div
                            key={wi}
                            className="rounded-full transition-colors duration-100"
                            style={{
                              width: "2.5px",
                              height: `${h * 20}px`,
                              backgroundColor: isActive
                                ? (isMe ? "#008069" : "#54656f")
                                : (isMe ? "#008069" : "#8696a0"),
                              opacity: isActive ? 1 : 0.35,
                            }}
                          />
                        );
                      })}
                    </div>
                    <span className="flex items-center gap-[2px] shrink-0">
                      <span className="text-[11px] text-[#667781]">{msg.timestamp}</span>
                      {isMe && (
                        msg.status === "read" ? (
                          <CheckCheck className="w-[16px] h-[16px] text-[#53bdeb]" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="w-[16px] h-[16px] text-[#8696a0]" />
                        ) : (
                          <Check className="w-[16px] h-[16px] text-[#8696a0]" />
                        )
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {liveChat.typing && (
          <div className="flex justify-start mb-[2px]">
            <div className="bg-white px-[12px] py-[10px] rounded-[8px] rounded-tl-none shadow-sm">
              <div className="flex gap-[4px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-[7px] h-[7px] rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-[7px] h-[7px] rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Game Picker Modal ─── */}
      {showGamePicker && (
        <div className="absolute inset-0 z-30 flex flex-col">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGamePicker(false)} />
          {/* Sheet */}
          <div className="mt-auto relative bg-white rounded-t-[20px] shadow-xl max-h-[70%] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-[36px] h-[4px] rounded-full bg-[#d1d7db]" />
            </div>
            {/* Header */}
            <div className="px-4 pb-3 flex items-center justify-between">
              <div>
                <div className="text-[#111b21] text-[18px]" style={{ fontWeight: 600 }}>Play a game</div>
                <div className="text-[#667781] text-[13px]">Start a game and voice chat together</div>
              </div>
              <button onClick={() => setShowGamePicker(false)} className="p-1.5 text-[#8696a0]">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>
            {/* Game list */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="grid grid-cols-2 gap-2.5">
                {GAMES.map((game) => {
                  const GameIcon = game.icon;
                  return (
                    <button
                      key={game.id}
                      onClick={() => handleStartGame(game)}
                      className="bg-[#f7f8fa] rounded-[14px] p-3 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
                    >
                      <div
                        className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center"
                        style={{ backgroundColor: game.color + "18" }}
                      >
                        <span className="text-[28px]">{game.emoji}</span>
                      </div>
                      <div className="text-[13px] text-[#111b21]" style={{ fontWeight: 600 }}>
                        {game.name}
                      </div>
                      <div className="text-[11px] text-[#667781] text-center" style={{ lineHeight: "14px" }}>
                        {game.minPlayers}-{game.maxPlayers} players
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Recording overlay ─── */}
      {isRecording && (
        <div className="bg-[#008069] px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={handleCancelRecording} className="text-white/70 text-[14px]" style={{ fontWeight: 500 }}>
            Cancel
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="w-[10px] h-[10px] rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[16px] font-mono" style={{ fontWeight: 500 }}>
              {formatRecordTime(recordingTime)}
            </span>
            <div className="flex items-center gap-[2px] ml-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2.5px] rounded-full bg-white/60"
                  style={{
                    height: `${6 + Math.random() * 14}px`,
                    animation: "pulse 0.6s ease-in-out infinite",
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleStopRecording}
            className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center"
          >
            <SendHorizontal className="w-[20px] h-[20px] text-[#008069]" />
          </button>
        </div>
      )}

      {/* ─── Input bar ─── */}
      {!isRecording && (
        <div className="bg-[#f0f2f5] px-[6px] py-[5px] flex items-end gap-[5px] shrink-0">
          {inputMode === "text" ? (
            <>
              <div className="flex-1 flex items-end bg-white rounded-[24px] px-[10px] py-[6px]">
                <button className="p-[4px] text-[#54656f]">
                  <Smile className="w-[24px] h-[24px]" />
                </button>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message"
                  className="flex-1 mx-[8px] outline-none text-[16px] text-[#111b21] placeholder:text-[#8696a0] bg-transparent py-[2px]"
                />
                <button
                  onClick={() => setShowGamePicker(true)}
                  className="p-[4px] text-[#54656f]"
                >
                  <Dice5 className="w-[22px] h-[22px]" />
                </button>
                <button className="p-[4px] text-[#54656f]">
                  <Paperclip className="w-[22px] h-[22px] rotate-[135deg]" />
                </button>
                {!text.trim() && (
                  <button
                    onClick={() => setInputMode("voice")}
                    className="p-[4px] text-[#54656f] ml-1"
                  >
                    <Mic className="w-[22px] h-[22px]" />
                  </button>
                )}
              </div>
              <button
                onClick={text.trim() ? handleSend : undefined}
                className="w-[46px] h-[46px] bg-[#25D366] rounded-full flex items-center justify-center shrink-0"
              >
                {text.trim() ? (
                  <SendHorizontal className="w-[22px] h-[22px] text-white" />
                ) : (
                  <Mic className="w-[22px] h-[22px] text-white" />
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 flex items-center bg-white rounded-[24px] px-[10px] py-[6px] gap-2">
                <button
                  onClick={() => setInputMode("text")}
                  className="p-[4px] text-[#54656f]"
                >
                  <Keyboard className="w-[22px] h-[22px]" />
                </button>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[#8696a0] text-[14px]">Tap mic to record voice</span>
                </div>
                <button
                  onClick={() => setShowGamePicker(true)}
                  className="p-[4px] text-[#54656f]"
                >
                  <Dice5 className="w-[22px] h-[22px]" />
                </button>
                <button className="p-[4px] text-[#54656f]">
                  <Paperclip className="w-[22px] h-[22px] rotate-[135deg]" />
                </button>
              </div>
              <button
                onClick={handleStartRecording}
                className="w-[46px] h-[46px] bg-[#25D366] rounded-full flex items-center justify-center shrink-0 relative"
              >
                <Mic className="w-[22px] h-[22px] text-white" />
                <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20" />
              </button>
            </>
          )}
        </div>
      )}

      {/* ─── Game Screen Overlay ─── */}
      {activeGameScreen && (
        <div className="absolute inset-0 z-40">
          <GameScreen
            gameId={activeGameScreen.gameDef.id}
            gameName={activeGameScreen.gameDef.name}
            gameEmoji={activeGameScreen.gameDef.emoji}
            gameColor={activeGameScreen.gameDef.color}
            players={activeGameScreen.players}
            voicePulse={voicePulse}
            isMeTalking={isMeTalking}
            onToggleMic={() => setIsMeTalking(!isMeTalking)}
            onLeaveVoice={() => { setActiveGameVoice(null); setIsMeTalking(false); setActiveGameScreen(null); }}
            onBack={() => setActiveGameScreen(null)}
          />
        </div>
      )}
    </div>
  );
}

const groupColors = ["#06cf9c", "#25c6da", "#7986cb", "#ee6e73", "#ff7043", "#ffb300", "#e53935", "#8e24aa"];
function getGroupColor(id: string): string {
  return groupColors[(parseInt(id) || 0) % groupColors.length];
}