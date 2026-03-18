import { useState, useEffect } from "react";
import {
  Radio,
  Volume2,
  Users,
  ArrowLeft,
  Plus,
  Crown,
  Headphones,
  MapPin,
  Flame,
  LogOut,
} from "lucide-react";
import { contacts as allContacts, currentUser } from "../data/mockData";

interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  isTalking: boolean;
  isHost: boolean;
}

interface LiveRoom {
  id: string;
  title: string;
  description: string;
  category: string;
  hostId: string;
  hostName: string;
  participants: RoomParticipant[];
  peopleCount: number;
  startedAt: string;
  location: string;
}

type FilterType = "all" | "nearby" | "popular";

const mockRooms: LiveRoom[] = [
  {
    id: "r1",
    title: "Coffee shop hangout",
    description: "Just people chatting over coffee. Drop in, say hi or just listen.",
    category: "chill",
    hostId: "1",
    hostName: "Sarah",
    participants: [
      { id: "1", name: "Sarah", avatar: allContacts[0].avatar, isTalking: true, isHost: true },
      { id: "3", name: "Emily", avatar: allContacts[2].avatar, isTalking: false, isHost: false },
      { id: "6", name: "David", avatar: allContacts[5].avatar, isTalking: false, isHost: false },
      { id: "5", name: "Lisa", avatar: allContacts[4].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 7,
    startedAt: "2h",
    location: "Downtown",
  },
  {
    id: "r2",
    title: "Parents of toddlers 😅",
    description: "Surviving the chaos together. Vent, laugh, share tips.",
    category: "talk",
    hostId: "9",
    hostName: "Natalie",
    participants: [
      { id: "9", name: "Natalie", avatar: allContacts[8].avatar, isTalking: false, isHost: true },
      { id: "7", name: "Aria", avatar: allContacts[6].avatar, isTalking: true, isHost: false },
      { id: "1", name: "Sarah", avatar: allContacts[0].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 5,
    startedAt: "45m",
    location: "Westside",
  },
  {
    id: "r3",
    title: "Study room - no talking 📚",
    description: "Silent co-working. Just knowing others are here helps. Mic on = expelled.",
    category: "chill",
    hostId: "6",
    hostName: "David",
    participants: [
      { id: "6", name: "David", avatar: allContacts[5].avatar, isTalking: false, isHost: true },
      { id: "2", name: "Marcus", avatar: allContacts[1].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 12,
    startedAt: "4h",
    location: "University area",
  },
  {
    id: "r4",
    title: "Walking the dog rn",
    description: "Anyone else walking their dog? Let's keep each other company.",
    category: "chill",
    hostId: "8",
    hostName: "Ryan",
    participants: [
      { id: "8", name: "Ryan", avatar: allContacts[7].avatar, isTalking: true, isHost: true },
      { id: "4", name: "James", avatar: allContacts[3].avatar, isTalking: true, isHost: false },
    ],
    peopleCount: 3,
    startedAt: "15m",
    location: "Central Park",
  },
  {
    id: "r5",
    title: "Weekend football plans",
    description: "Organizing a 5-a-side for Saturday. Need 2 more players.",
    category: "sports",
    hostId: "4",
    hostName: "James",
    participants: [
      { id: "4", name: "James", avatar: allContacts[3].avatar, isTalking: false, isHost: true },
      { id: "8", name: "Ryan", avatar: allContacts[7].avatar, isTalking: false, isHost: false },
      { id: "2", name: "Marcus", avatar: allContacts[1].avatar, isTalking: true, isHost: false },
    ],
    peopleCount: 6,
    startedAt: "30m",
    location: "Eastside",
  },
  {
    id: "r6",
    title: "Late night thoughts",
    description: "Can't sleep? Same. Let's talk about nothing and everything.",
    category: "talk",
    hostId: "3",
    hostName: "Emily",
    participants: [
      { id: "3", name: "Emily", avatar: allContacts[2].avatar, isTalking: true, isHost: true },
      { id: "5", name: "Lisa", avatar: allContacts[4].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 4,
    startedAt: "1h",
    location: "Midtown",
  },
  {
    id: "r7",
    title: "Cooking dinner together 🍳",
    description: "Making pasta from scratch. Join if you're cooking too!",
    category: "chill",
    hostId: "7",
    hostName: "Aria",
    participants: [
      { id: "7", name: "Aria", avatar: allContacts[6].avatar, isTalking: true, isHost: true },
      { id: "9", name: "Natalie", avatar: allContacts[8].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 3,
    startedAt: "20m",
    location: "Northside",
  },
  {
    id: "r8",
    title: "Job hunt support group",
    description: "Sharing leads, reviewing each other's resumes, moral support.",
    category: "talk",
    hostId: "2",
    hostName: "Marcus",
    participants: [
      { id: "2", name: "Marcus", avatar: allContacts[1].avatar, isTalking: false, isHost: true },
      { id: "6", name: "David", avatar: allContacts[5].avatar, isTalking: true, isHost: false },
      { id: "3", name: "Emily", avatar: allContacts[2].avatar, isTalking: false, isHost: false },
      { id: "1", name: "Sarah", avatar: allContacts[0].avatar, isTalking: false, isHost: false },
    ],
    peopleCount: 8,
    startedAt: "1h 30m",
    location: "Downtown",
  },
  {
    id: "r9",
    title: "Garage sale finds today",
    description: "Found amazing stuff at the flea market. Sharing the best deals.",
    category: "chill",
    hostId: "5",
    hostName: "Lisa",
    participants: [
      { id: "5", name: "Lisa", avatar: allContacts[4].avatar, isTalking: true, isHost: true },
    ],
    peopleCount: 2,
    startedAt: "10m",
    location: "Suburbs",
  },
  {
    id: "r10",
    title: "New in the neighbourhood",
    description: "Just moved here last week. Looking for friends and recommendations!",
    category: "talk",
    hostId: "7",
    hostName: "Aria",
    participants: [
      { id: "7", name: "Aria", avatar: allContacts[6].avatar, isTalking: false, isHost: true },
      { id: "4", name: "James", avatar: allContacts[3].avatar, isTalking: true, isHost: false },
    ],
    peopleCount: 4,
    startedAt: "50m",
    location: "Westside",
  },
];

export function RadioTab() {
  const [rooms, setRooms] = useState<LiveRoom[]>(mockRooms);
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeRoom, setActiveRoom] = useState<LiveRoom | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [talkingPulse, setTalkingPulse] = useState<Record<string, boolean>>({});

  // Create room form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Simulate talking indicators
  useEffect(() => {
    if (!activeRoom) return;
    const interval = setInterval(() => {
      const newPulse: Record<string, boolean> = {};
      activeRoom.participants.forEach((p) => {
        if (p.isTalking) newPulse[p.id] = Math.random() > 0.35;
      });
      if (isTalking) newPulse["me"] = Math.random() > 0.3;
      setTalkingPulse(newPulse);
    }, 700);
    return () => clearInterval(interval);
  }, [activeRoom, isTalking]);

  // Simulate small count fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prev) =>
        prev.map((r) => ({
          ...r,
          peopleCount: Math.max(r.participants.length, r.peopleCount + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0)),
        }))
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...rooms].sort((a, b) => b.peopleCount - a.peopleCount);
  const filtered =
    filter === "all"
      ? sorted
      : filter === "popular"
        ? sorted.slice(0, 5)
        : sorted; // "nearby" shows all for demo

  // Group avatar: stack of first 3 participant avatars
  const GroupAvatar = ({ participants }: { participants: RoomParticipant[] }) => {
    const count = Math.min(participants.length, 3);
    if (count === 1) {
      return (
        <div className="relative w-[50px] h-[50px] shrink-0">
          <img src={participants[0].avatar} alt="" className="w-[50px] h-[50px] rounded-full object-cover" />
        </div>
      );
    }
    if (count === 2) {
      return (
        <div className="relative w-[50px] h-[50px] shrink-0">
          <img src={participants[0].avatar} alt="" className="w-[32px] h-[32px] rounded-full object-cover absolute top-0 left-0 border-2 border-white" />
          <img src={participants[1].avatar} alt="" className="w-[32px] h-[32px] rounded-full object-cover absolute bottom-0 right-0 border-2 border-white" />
        </div>
      );
    }
    return (
      <div className="relative w-[50px] h-[50px] shrink-0">
        <img src={participants[0].avatar} alt="" className="w-[28px] h-[28px] rounded-full object-cover absolute top-0 left-[11px] border-2 border-white" />
        <img src={participants[1].avatar} alt="" className="w-[28px] h-[28px] rounded-full object-cover absolute bottom-[2px] left-0 border-2 border-white" />
        <img src={participants[2].avatar} alt="" className="w-[28px] h-[28px] rounded-full object-cover absolute bottom-[2px] right-0 border-2 border-white" />
      </div>
    );
  };

  const handleJoinRoom = (room: LiveRoom) => {
    setActiveRoom(room);
    setIsTalking(false);
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id ? { ...r, peopleCount: r.peopleCount + 1 } : r
      )
    );
  };

  const handleLeaveRoom = () => {
    if (activeRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id ? { ...r, peopleCount: Math.max(r.participants.length, r.peopleCount - 1) } : r
        )
      );
    }
    setActiveRoom(null);
    setIsTalking(false);
  };

  const handleCreateRoom = () => {
    if (!newTitle.trim()) return;
    const newRoom: LiveRoom = {
      id: `room-${Date.now()}`,
      title: newTitle,
      description: newDesc || "Open voice room",
      category: "talk",
      hostId: "me",
      hostName: currentUser.name.split(" ")[0],
      participants: [
        { id: "me", name: currentUser.name.split(" ")[0], avatar: currentUser.avatar, isTalking: true, isHost: true },
      ],
      peopleCount: 1,
      startedAt: "now",
      location: "Nearby",
    };
    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setIsTalking(true);
    setShowCreate(false);
    setNewTitle("");
    setNewDesc("");
  };

  // ─── Inside a room ───
  if (activeRoom) {
    const allPeople = [
      ...activeRoom.participants,
      { id: "me", name: "You", avatar: currentUser.avatar, isTalking, isHost: false },
    ];

    return (
      <div className="flex-1 flex flex-col bg-[#111b21] h-full">
        {/* Header */}
        <div className="bg-[#1f2c34] px-3 py-[10px] flex items-center gap-3 shrink-0">
          <button onClick={handleLeaveRoom} className="text-[#aebac1]">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[16px] truncate" style={{ fontWeight: 500 }}>
              {activeRoom.title}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#8696a0]">
              <span className="flex items-center gap-1 text-[#25D366]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#25D366] animate-pulse" />
                live
              </span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Users className="w-[10px] h-[10px]" />
                {activeRoom.peopleCount} people
              </span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-[10px] h-[10px]" />
                {activeRoom.location}
              </span>
            </div>
          </div>
        </div>

        {/* Room body */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {/* Description */}
          <p className="text-[#8696a0] text-[13px] mb-4" style={{ lineHeight: 1.5 }}>
            {activeRoom.description}
          </p>

          {/* Participant grid */}
          <div className="flex flex-wrap gap-x-3 gap-y-4">
            {allPeople.map((p) => {
              const isPulsing = talkingPulse[p.id];
              return (
                <div key={p.id} className="flex flex-col items-center w-[60px]">
                  <div className="relative">
                    <div
                      className={`rounded-full p-[2.5px] transition-all duration-300 ${
                        isPulsing
                          ? "bg-[#25D366] shadow-[0_0_10px_rgba(37,211,102,0.4)]"
                          : "bg-transparent"
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-[44px] h-[44px] rounded-full object-cover"
                      />
                    </div>
                    {p.isHost && (
                      <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#e8a23a] rounded-full flex items-center justify-center">
                        <Crown className="w-[9px] h-[9px] text-white" />
                      </div>
                    )}
                    {isPulsing && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-[16px] h-[16px] bg-[#25D366] rounded-full flex items-center justify-center">
                        <Volume2 className="w-[8px] h-[8px] text-white" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 text-center truncate w-full ${
                      p.id === "me" ? "text-[#25D366]" : "text-[#e9edef]"
                    }`}
                  >
                    {p.id === "me" ? "You" : p.name}
                  </span>
                </div>
              );
            })}
            {/* Others count */}
            {activeRoom.peopleCount > activeRoom.participants.length + 1 && (
              <div className="flex flex-col items-center w-[60px]">
                <div className="w-[49px] h-[49px] rounded-full bg-[#2a3942] flex items-center justify-center">
                  <span className="text-[#8696a0] text-[12px]" style={{ fontWeight: 500 }}>
                    +{activeRoom.peopleCount - activeRoom.participants.length - 1}
                  </span>
                </div>
                <span className="text-[#8696a0] text-[11px] mt-1.5">others</span>
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="mt-6 bg-[#1f2c34] rounded-xl px-3 py-2.5 flex items-start gap-2.5">
            <Volume2 className="w-[14px] h-[14px] text-[#25D366] shrink-0 mt-0.5" />
            <p className="text-[#8696a0] text-[12px]" style={{ lineHeight: 1.5 }}>
              This is an open room. Everyone can talk or just listen — no permission needed. Be kind.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-1.5 bg-red-500/15 text-red-400 rounded-full px-4 py-[8px] text-[13px]"
            style={{ fontWeight: 500 }}
          >
            <LogOut className="w-[14px] h-[14px]" />
            Leave quietly
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setIsTalking(!isTalking)}
            className={`rounded-full px-4 py-[8px] text-[13px] transition-colors ${
              isTalking
                ? "bg-[#25D366] text-white"
                : "bg-[#2a3942] text-[#8696a0]"
            }`}
            style={{ fontWeight: 500 }}
          >
            {isTalking ? "Talking" : "Tap to talk"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Create room sheet ───
  if (showCreate) {
    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        <div className="bg-[#008069] px-3 py-[10px] flex items-center gap-3 shrink-0">
          <button onClick={() => setShowCreate(false)} className="text-white">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>
          <span className="text-white text-[18px]" style={{ fontWeight: 500 }}>
            Start a room
          </span>
          <div className="flex-1" />
          {newTitle.trim() && (
            <button
              onClick={handleCreateRoom}
              className="bg-white/20 rounded-full px-4 py-[6px] text-white text-[14px]"
              style={{ fontWeight: 500 }}
            >
              Go live
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <label className="text-[#667781] text-[12px] mb-1.5 block" style={{ fontWeight: 500 }}>
              WHAT'S IT ABOUT?
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Walking to the store"
              className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-[#111b21] text-[15px] outline-none placeholder:text-[#8696a0]"
            />
          </div>
          <div className="mb-4">
            <label className="text-[#667781] text-[12px] mb-1.5 block" style={{ fontWeight: 500 }}>
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Tell people what to expect..."
              className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-[#111b21] text-[14px] outline-none placeholder:text-[#8696a0] min-h-[70px] resize-none"
            />
          </div>
          <div className="bg-[#f0f2f5] rounded-xl p-3 flex items-start gap-2.5">
            <Radio className="w-[15px] h-[15px] text-[#008069] shrink-0 mt-0.5" />
            <p className="text-[#667781] text-[12.5px]" style={{ lineHeight: 1.5 }}>
              Anyone nearby can find and join your room. It stays live as long as someone's in it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Room list (looks like group chats) ───
  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden relative">
      {/* Filter row */}
      <div className="px-4 pt-3 pb-1 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          {([
            { key: "all" as FilterType, label: "All rooms" },
            { key: "nearby" as FilterType, label: "Nearby", icon: MapPin },
            { key: "popular" as FilterType, label: "Popular", icon: Flame },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1 px-3 py-[5px] rounded-full text-[13px] ${
                filter === key
                  ? "bg-[#d8fdd2] text-[#008069]"
                  : "bg-[#f0f2f5] text-[#54656f]"
              }`}
              style={{ fontWeight: filter === key ? 600 : 400 }}
            >
              {Icon && <Icon className="w-[12px] h-[12px]" />}
              {label}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-[#8696a0] text-[11px]">
            {filtered.reduce((a, r) => a + r.peopleCount, 0)} online
          </span>
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto pb-20">
        {filtered.map((room) => {
          // Who's currently talking?
          const talkers = room.participants.filter((p) => p.isTalking);
          const talkingNames = talkers.map((p) => p.name).join(", ");

          return (
            <button
              key={room.id}
              onClick={() => handleJoinRoom(room)}
              className="w-full flex items-center gap-3 px-4 py-[10px] active:bg-[#f5f6f6] text-left"
            >
              {/* Group avatar */}
              <div className="relative">
                <GroupAvatar participants={room.participants} />
                {/* Live indicator dot */}
                <div className="absolute -bottom-[1px] -right-[1px] w-[14px] h-[14px] bg-[#25D366] rounded-full border-2 border-white flex items-center justify-center">
                  <Volume2 className="w-[7px] h-[7px] text-white" />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 border-b border-[#e9edef] pb-[10px]">
                <div className="flex items-center justify-between mb-[1px]">
                  <span className="text-[#111b21] text-[16px] truncate flex-1" style={{ fontWeight: 500 }}>
                    {room.title}
                  </span>
                  <span className="text-[#667781] text-[12px] ml-2 shrink-0">{room.startedAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    {talkers.length > 0 ? (
                      <span className="text-[#667781] text-[13px] truncate">
                        <span className="text-[#25D366]">●</span>{" "}
                        {talkingNames} talking
                      </span>
                    ) : (
                      <span className="text-[#667781] text-[13px] truncate">
                        Quiet right now...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 ml-2 shrink-0">
                    <Users className="w-[13px] h-[13px] text-[#8696a0]" />
                    <span className="text-[#8696a0] text-[12px]">{room.peopleCount}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus className="w-[24px] h-[24px] text-white" />
      </button>
    </div>
  );
}
