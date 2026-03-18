import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Mic,
  MicOff,
  Play,
  Pause,
  Send,
  ArrowLeft,
  Headphones,
  MessageCircle,
  Users,
  Link2,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  UtensilsCrossed,
  Newspaper,
  Clapperboard,
  HeartPulse,
  X,
  ChevronRight,
  ExternalLink,
  Wand2,
  Type,
} from "lucide-react";
import { useAppData } from "../data/AppContext";
import { stories as mockStories } from "../data/mockData";
import type { Story, VoiceReply } from "../data/mockData";

type FilterType = "all" | "friends" | "recipes" | "news" | "entertainment" | "health";
type ViewState = "feed" | "reading" | "create" | "group-chat";

export function StoriesTab() {
  const { currentUser } = useAppData();
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [filter, setFilter] = useState<FilterType>("all");
  const [view, setView] = useState<ViewState>("feed");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showGroupChat, setShowGroupChat] = useState(false);

  // Create story state
  const [createMode, setCreateMode] = useState<"narrate" | "link" | null>(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [storyLink, setStoryLink] = useState("");
  const [isNarrating, setIsNarrating] = useState(false);
  const [narrationText, setNarrationText] = useState("");
  const [aiStructuring, setAiStructuring] = useState(false);

  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.category === filter);

  const friendStories = stories.filter((s) => s.category === "friends");
  const recipeStories = stories.filter((s) => s.category === "recipes");
  const newsStories = stories.filter((s) => s.category === "news");
  const entertainmentStories = stories.filter((s) => s.category === "entertainment");
  const healthStories = stories.filter((s) => s.category === "health");

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) clearInterval(recordingInterval.current);

    if (selectedStory) {
      // Add mock voice reply
      const newReply: VoiceReply = {
        id: `vr-${Date.now()}`,
        storyId: selectedStory.id,
        senderId: "me",
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")}`,
        timestamp: "Just now",
        transcription: "Great story! I had a similar experience...",
      };

      setStories((prev) =>
        prev.map((s) =>
          s.id === selectedStory.id
            ? {
                ...s,
                voiceReplies: [...s.voiceReplies, newReply],
                replyCount: s.replyCount + 1,
                groupChatId: s.groupChatId || `story-group-${s.id}`,
              }
            : s
        )
      );
      setSelectedStory((prev) =>
        prev
          ? {
              ...prev,
              voiceReplies: [...prev.voiceReplies, newReply],
              replyCount: prev.replyCount + 1,
              groupChatId: prev.groupChatId || `story-group-${prev.id}`,
            }
          : null
      );
    }
    setRecordingTime(0);
  };

  const handleAiStructure = () => {
    setAiStructuring(true);
    // Simulate AI structuring the text
    setTimeout(() => {
      if (storyContent) {
        // AI "improves" the text
        const structured = storyContent
          .replace(/\.\s+/g, ".\n\n")
          .trim();
        setStoryContent(structured);
      } else if (narrationText) {
        setStoryContent(narrationText);
      }
      setAiStructuring(false);
    }, 1500);
  };

  const handlePublishStory = () => {
    if (!storyTitle.trim() || !storyContent.trim()) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      authorId: "me",
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      title: storyTitle,
      content: storyContent,
      linkedUrl: storyLink || undefined,
      linkedTitle: storyLink ? "Linked Content" : undefined,
      timestamp: "Just now",
      listenerCount: 0,
      replyCount: 0,
      category: "friends",
      voiceReplies: [],
    };

    setStories((prev) => [newStory, ...prev]);
    setView("feed");
    setStoryTitle("");
    setStoryContent("");
    setStoryLink("");
    setNarrationText("");
    setCreateMode(null);
  };

  const startNarration = () => {
    setIsNarrating(true);
    // Simulate speech-to-text
    const phrases = [
      "So this one time, ",
      "I was walking through the park ",
      "when I noticed something incredible. ",
      "There was this old oak tree ",
      "with carvings from decades ago...",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < phrases.length) {
        setNarrationText((prev) => prev + phrases[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setIsNarrating(false);
      }
    }, 800);
  };

  const stopNarration = () => {
    setIsNarrating(false);
    if (narrationText) {
      setStoryContent((prev) => prev + narrationText);
    }
  };

  // Story Reading View
  if (view === "reading" && selectedStory) {
    return (
      <div className="flex-1 flex flex-col bg-[#111b21] h-full">
        {/* Header */}
        <div className="bg-[#1f2c34] px-3 py-[10px] flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setView("feed");
              setSelectedStory(null);
              setIsPlaying(false);
            }}
            className="text-[#aebac1]"
          >
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>
          <img
            src={selectedStory.authorAvatar}
            alt={selectedStory.authorName}
            className="w-[36px] h-[36px] rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-white text-[15px] truncate" style={{ fontWeight: 500 }}>
              {selectedStory.authorName}
            </div>
            <div className="text-[#8696a0] text-[12px]">
              {selectedStory.timestamp} · {
                selectedStory.category === "friends" ? "Friend" :
                selectedStory.category === "recipes" ? "Recipes" :
                selectedStory.category === "news" ? "News" :
                selectedStory.category === "entertainment" ? "Entertainment" :
                selectedStory.category === "health" ? "Health" : selectedStory.category
              }
            </div>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-[36px] h-[36px] rounded-full bg-[#25D366] flex items-center justify-center"
          >
            {isPlaying ? (
              <VolumeX className="w-[18px] h-[18px] text-white" />
            ) : (
              <Volume2 className="w-[18px] h-[18px] text-white" />
            )}
          </button>
        </div>

        {/* Cover image */}
        {selectedStory.coverImage && (
          <div className="relative h-[160px] shrink-0">
            <img
              src={selectedStory.coverImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111b21]" />
            <div className="absolute bottom-3 left-4 right-4">
              <h2 className="text-white text-[18px]" style={{ fontWeight: 600 }}>
                {selectedStory.title}
              </h2>
            </div>
          </div>
        )}

        {/* Story content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!selectedStory.coverImage && (
            <h2 className="text-white text-[18px] mb-3" style={{ fontWeight: 600 }}>
              {selectedStory.title}
            </h2>
          )}
          <p className="text-[#e9edef] text-[14.5px] whitespace-pre-line" style={{ lineHeight: "1.6" }}>
            {selectedStory.content}
          </p>

          {/* Linked content */}
          {selectedStory.linkedUrl && (
            <div className="mt-4 bg-[#1f2c34] rounded-xl p-3 flex items-center gap-3">
              <div className="w-[40px] h-[40px] bg-[#2a3942] rounded-lg flex items-center justify-center shrink-0">
                <ExternalLink className="w-[18px] h-[18px] text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#e9edef] text-[13px] truncate" style={{ fontWeight: 500 }}>
                  {selectedStory.linkedTitle}
                </div>
                <div className="text-[#8696a0] text-[11px] truncate">{selectedStory.linkedUrl}</div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#2a3942]">
            <div className="flex items-center gap-1.5 text-[#8696a0] text-[13px]">
              <Headphones className="w-[14px] h-[14px]" />
              <span>{formatCount(selectedStory.listenerCount)} listeners</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8696a0] text-[13px]">
              <Mic className="w-[14px] h-[14px]" />
              <span>{selectedStory.replyCount} voice replies</span>
            </div>
          </div>

          {/* Voice Replies */}
          {selectedStory.voiceReplies.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#8696a0] text-[13px]" style={{ fontWeight: 500 }}>
                  VOICE REPLIES
                </span>
                {selectedStory.groupChatId && (
                  <button
                    onClick={() => setShowGroupChat(true)}
                    className="flex items-center gap-1 text-[#25D366] text-[12px]"
                  >
                    <Users className="w-[12px] h-[12px]" />
                    <span>Join Group Chat</span>
                  </button>
                )}
              </div>

              {selectedStory.voiceReplies.map((reply) => (
                <div key={reply.id} className="flex gap-2.5 mb-3">
                  <img
                    src={reply.senderAvatar}
                    alt={reply.senderName}
                    className="w-[32px] h-[32px] rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#25D366] text-[13px]" style={{ fontWeight: 500 }}>
                        {reply.senderId === "me" ? "You" : reply.senderName}
                      </span>
                      <span className="text-[#667781] text-[11px]">{reply.timestamp}</span>
                    </div>
                    {/* Voice message bubble */}
                    <div className="bg-[#1f2c34] rounded-lg p-2.5 mt-1 flex items-center gap-2">
                      <button className="w-[28px] h-[28px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                        <Play className="w-[14px] h-[14px] text-white ml-0.5" />
                      </button>
                      <div className="flex-1">
                        <div className="flex gap-[2px] items-center h-[20px]">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-[3px] rounded-full bg-[#8696a0]"
                              style={{ height: `${4 + Math.random() * 14}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[#8696a0] text-[11px] shrink-0">{reply.duration}</span>
                    </div>
                    {reply.transcription && (
                      <div className="text-[#8696a0] text-[12px] mt-1 italic">
                        "{reply.transcription}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Group chat notice */}
          {selectedStory.groupChatId && selectedStory.voiceReplies.length > 0 && (
            <button
              onClick={() => setShowGroupChat(true)}
              className="w-full mt-3 bg-[#1f2c34] rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-[40px] h-[40px] bg-[#25D366]/20 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-[20px] h-[20px] text-[#25D366]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[#e9edef] text-[14px]" style={{ fontWeight: 500 }}>
                  Story Discussion Group
                </div>
                <div className="text-[#8696a0] text-[12px]">
                  {selectedStory.voiceReplies.length + 1} members discussing this story
                </div>
              </div>
              <ChevronRight className="w-[18px] h-[18px] text-[#8696a0]" />
            </button>
          )}
        </div>

        {/* Voice reply bar */}
        <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2 shrink-0">
          {isRecording ? (
            <>
              <div className="flex-1 flex items-center gap-3 px-3">
                <div className="w-[10px] h-[10px] rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[14px]">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                </span>
                <div className="flex-1 flex gap-[2px] items-center h-[20px]">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] rounded-full bg-[#25D366] animate-pulse"
                      style={{
                        height: `${4 + Math.random() * 16}px`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={stopRecording}
                className="w-[44px] h-[44px] rounded-full bg-red-500 flex items-center justify-center"
              >
                <Send className="w-[20px] h-[20px] text-white" />
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-[10px]">
                <span className="text-[#8696a0] text-[14px]">Reply with voice...</span>
              </div>
              <button
                onClick={startRecording}
                className="w-[44px] h-[44px] rounded-full bg-[#25D366] flex items-center justify-center"
              >
                <Mic className="w-[20px] h-[20px] text-white" />
              </button>
            </>
          )}
        </div>

        {/* Group Chat Modal */}
        {showGroupChat && selectedStory.groupChatId && (
          <div className="absolute inset-0 bg-[#111b21] z-50 flex flex-col">
            <div className="bg-[#1f2c34] px-3 py-[10px] flex items-center gap-3">
              <button onClick={() => setShowGroupChat(false)} className="text-[#aebac1]">
                <ArrowLeft className="w-[22px] h-[22px]" />
              </button>
              <div className="w-[36px] h-[36px] rounded-full bg-[#25D366]/20 flex items-center justify-center">
                <Users className="w-[18px] h-[18px] text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[15px] truncate" style={{ fontWeight: 500 }}>
                  {selectedStory.title}
                </div>
                <div className="text-[#8696a0] text-[12px]">
                  {selectedStory.voiceReplies.length + 1} members
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {/* Encryption notice */}
              <div className="bg-[#182229] rounded-lg px-3 py-2 mb-3 text-center">
                <span className="text-[#8696a0] text-[11.5px]">
                  Voice repliers are auto-added to this story discussion group
                </span>
              </div>

              {/* Author's original post */}
              <div className="flex gap-2 mb-3">
                <img src={selectedStory.authorAvatar} alt="" className="w-[28px] h-[28px] rounded-full object-cover shrink-0" />
                <div className="bg-[#1f2c34] rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="text-[#25D366] text-[12.5px] mb-0.5" style={{ fontWeight: 500 }}>
                    {selectedStory.authorName}
                  </div>
                  <div className="text-[#e9edef] text-[13.5px]">
                    Thanks everyone for the amazing voice replies on my story! Let's keep the conversation going here.
                  </div>
                  <div className="text-[#667781] text-[10.5px] text-right mt-1">{selectedStory.timestamp}</div>
                </div>
              </div>

              {/* Replies as messages */}
              {selectedStory.voiceReplies.map((reply) => (
                <div key={reply.id} className={`flex gap-2 mb-3 ${reply.senderId === "me" ? "flex-row-reverse" : ""}`}>
                  {reply.senderId !== "me" && (
                    <img src={reply.senderAvatar} alt="" className="w-[28px] h-[28px] rounded-full object-cover shrink-0" />
                  )}
                  <div className={`rounded-lg px-3 py-2 max-w-[85%] ${reply.senderId === "me" ? "bg-[#005c4b]" : "bg-[#1f2c34]"}`}>
                    {reply.senderId !== "me" && (
                      <div className="text-[#25D366] text-[12.5px] mb-0.5" style={{ fontWeight: 500 }}>
                        {reply.senderName}
                      </div>
                    )}
                    <div className="text-[#e9edef] text-[13.5px]">
                      {reply.transcription || "Voice message"}
                    </div>
                    <div className="text-[#667781] text-[10.5px] text-right mt-1">{reply.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-[10px]">
                <span className="text-[#8696a0] text-[14px]">Type a message</span>
              </div>
              <button className="w-[44px] h-[44px] rounded-full bg-[#25D366] flex items-center justify-center">
                <Mic className="w-[20px] h-[20px] text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Create Story View
  if (view === "create") {
    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        {/* Header */}
        <div className="bg-[#008069] px-3 py-[10px] flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setView("feed");
              setCreateMode(null);
              setStoryTitle("");
              setStoryContent("");
              setStoryLink("");
              setNarrationText("");
            }}
            className="text-white"
          >
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>
          <span className="text-white text-[18px]" style={{ fontWeight: 500 }}>
            Create Story
          </span>
          <div className="flex-1" />
          {storyTitle && storyContent && (
            <button
              onClick={handlePublishStory}
              className="bg-white/20 rounded-full px-4 py-[6px] text-white text-[14px]"
              style={{ fontWeight: 500 }}
            >
              Publish
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Mode selector */}
          {!createMode && (
            <div className="p-4">
              <div className="text-[#111b21] text-[16px] mb-1" style={{ fontWeight: 500 }}>
                How do you want to tell your story?
              </div>
              <div className="text-[#667781] text-[13.5px] mb-4">
                Share something meaningful with the world
              </div>

              <button
                onClick={() => setCreateMode("narrate")}
                className="w-full bg-[#f0f2f5] rounded-2xl p-4 flex items-center gap-4 mb-3 active:bg-[#e9edef]"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <Mic className="w-[24px] h-[24px] text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[#111b21] text-[15px]" style={{ fontWeight: 500 }}>
                    Narrate a Story
                  </div>
                  <div className="text-[#667781] text-[13px]">
                    Speak your story and AI converts it to text
                  </div>
                </div>
                <ChevronRight className="w-[18px] h-[18px] text-[#8696a0]" />
              </button>

              <button
                onClick={() => setCreateMode("link")}
                className="w-full bg-[#f0f2f5] rounded-2xl p-4 flex items-center gap-4 mb-3 active:bg-[#e9edef]"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#667781] flex items-center justify-center shrink-0">
                  <Link2 className="w-[24px] h-[24px] text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[#111b21] text-[15px]" style={{ fontWeight: 500 }}>
                    Link + Narrate
                  </div>
                  <div className="text-[#667781] text-[13px]">
                    Share an article or video with your commentary
                  </div>
                </div>
                <ChevronRight className="w-[18px] h-[18px] text-[#8696a0]" />
              </button>

              <button
                onClick={() => setCreateMode("narrate")}
                className="w-full bg-[#f0f2f5] rounded-2xl p-4 flex items-center gap-4 active:bg-[#e9edef]"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#e8a23a] flex items-center justify-center shrink-0">
                  <Type className="w-[24px] h-[24px] text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[#111b21] text-[15px]" style={{ fontWeight: 500 }}>
                    Write It Out
                  </div>
                  <div className="text-[#667781] text-[13px]">
                    Type your story and let AI help structure it
                  </div>
                </div>
                <ChevronRight className="w-[18px] h-[18px] text-[#8696a0]" />
              </button>
            </div>
          )}

          {/* Narrate / Write mode */}
          {createMode && (
            <div className="p-4">
              {/* Link input (if link mode) */}
              {createMode === "link" && (
                <div className="mb-4">
                  <label className="text-[#667781] text-[12px] mb-1 block" style={{ fontWeight: 500 }}>
                    LINK URL
                  </label>
                  <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-xl px-3 py-2.5">
                    <Link2 className="w-[18px] h-[18px] text-[#8696a0] shrink-0" />
                    <input
                      type="url"
                      value={storyLink}
                      onChange={(e) => setStoryLink(e.target.value)}
                      placeholder="Paste article or video URL..."
                      className="flex-1 bg-transparent text-[#111b21] text-[14px] outline-none placeholder:text-[#8696a0]"
                    />
                  </div>
                  {storyLink && (
                    <div className="mt-2 bg-[#e7f8e9] rounded-lg p-2.5 flex items-center gap-2">
                      <ExternalLink className="w-[14px] h-[14px] text-[#008069] shrink-0" />
                      <span className="text-[#008069] text-[12px] truncate">{storyLink}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="mb-4">
                <label className="text-[#667781] text-[12px] mb-1 block" style={{ fontWeight: 500 }}>
                  STORY TITLE
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="Give your story a title..."
                  className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-[#111b21] text-[15px] outline-none placeholder:text-[#8696a0]"
                  style={{ fontWeight: 500 }}
                />
              </div>

              {/* Voice narration */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#667781] text-[12px]" style={{ fontWeight: 500 }}>
                    YOUR STORY
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAiStructure}
                      disabled={aiStructuring || (!storyContent && !narrationText)}
                      className="flex items-center gap-1 text-[#008069] text-[12px] disabled:opacity-40"
                    >
                      <Sparkles className="w-[12px] h-[12px]" />
                      <span>{aiStructuring ? "Structuring..." : "AI Structure"}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Write or narrate your story..."
                  className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-[#111b21] text-[14px] outline-none placeholder:text-[#8696a0] min-h-[160px] resize-none"
                  style={{ lineHeight: "1.6" }}
                />

                {/* Narration text preview */}
                {isNarrating && narrationText && (
                  <div className="mt-2 bg-[#e7f8e9] rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-[8px] h-[8px] rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[#008069] text-[11px]" style={{ fontWeight: 500 }}>
                        TRANSCRIBING...
                      </span>
                    </div>
                    <span className="text-[#111b21] text-[13px]">{narrationText}</span>
                  </div>
                )}
              </div>

              {/* Voice / AI controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={isNarrating ? stopNarration : startNarration}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 ${
                    isNarrating
                      ? "bg-red-500 text-white"
                      : "bg-[#25D366] text-white"
                  }`}
                >
                  {isNarrating ? (
                    <>
                      <MicOff className="w-[18px] h-[18px]" />
                      <span className="text-[14px]" style={{ fontWeight: 500 }}>Stop Narrating</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-[18px] h-[18px]" />
                      <span className="text-[14px]" style={{ fontWeight: 500 }}>Start Narrating</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleAiStructure}
                  disabled={aiStructuring || !storyContent}
                  className="w-[48px] h-[48px] rounded-xl bg-[#f0f2f5] flex items-center justify-center disabled:opacity-40"
                >
                  <Wand2 className="w-[20px] h-[20px] text-[#008069]" />
                </button>

                <button
                  className="w-[48px] h-[48px] rounded-xl bg-[#f0f2f5] flex items-center justify-center"
                  title="AI Text-to-Speech preview"
                >
                  <Volume2 className="w-[20px] h-[20px] text-[#008069]" />
                </button>
              </div>

              {/* AI help note */}
              <div className="mt-4 bg-[#f0f2f5] rounded-xl p-3 flex items-start gap-2.5">
                <Sparkles className="w-[16px] h-[16px] text-[#008069] shrink-0 mt-0.5" />
                <div className="text-[#667781] text-[12.5px]" style={{ lineHeight: "1.5" }}>
                  <span style={{ fontWeight: 500 }}>AI Assistant:</span> Narrate freely and tap "AI Structure" to organize your thoughts. AI will format paragraphs, improve flow, and add structure while keeping your voice authentic.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Feed View (main)
  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      {/* Header section */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#111b21] text-[16px]" style={{ fontWeight: 500 }}>
            Stories
          </span>
          <div className="flex items-center gap-1">
            <Headphones className="w-[14px] h-[14px] text-[#667781]" />
            <span className="text-[#667781] text-[12px]">{formatCount(stories.reduce((a, s) => a + s.listenerCount, 0))} listening</span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {(
            [
              { key: "all" as FilterType, label: "All Stories", icon: BookOpen },
              { key: "friends" as FilterType, label: "Friends", icon: Users },
              { key: "recipes" as FilterType, label: "Recipes", icon: UtensilsCrossed },
              { key: "news" as FilterType, label: "News", icon: Newspaper },
              { key: "entertainment" as FilterType, label: "Entertainment", icon: Clapperboard },
              { key: "health" as FilterType, label: "Health", icon: HeartPulse },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[13px] whitespace-nowrap shrink-0 ${
                filter === key
                  ? "bg-[#d8fdd2] text-[#008069]"
                  : "bg-[#f0f2f5] text-[#54656f]"
              }`}
              style={{ fontWeight: filter === key ? 600 : 400 }}
            >
              <Icon className="w-[14px] h-[14px]" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* My story prompt */}
      <button
        onClick={() => setView("create")}
        className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6] w-full"
      >
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt="My story"
            className="w-[52px] h-[52px] rounded-full object-cover"
          />
          <div className="absolute -bottom-[2px] -right-[2px] w-[22px] h-[22px] bg-[#25D366] rounded-full flex items-center justify-center border-2 border-white">
            <Plus className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="ml-[14px] flex-1">
          <div className="text-[#111b21] text-[16px]" style={{ fontWeight: 400 }}>
            Tell Your Story
          </div>
          <div className="text-[#667781] text-[13.5px]">Narrate, write, or link content</div>
        </div>
        <div className="flex items-center gap-1 text-[#25D366]">
          <Mic className="w-[16px] h-[16px]" />
          <Sparkles className="w-[14px] h-[14px]" />
        </div>
      </button>

      {/* Stories by category in feed mode */}
      {filter === "all" ? (
        <>
          {/* Friends section */}
          {friendStories.length > 0 && (
            <StorySection
              title="FROM FRIENDS"
              stories={friendStories}
              onSelect={(s) => {
                setSelectedStory(s);
                setView("reading");
              }}
              formatCount={formatCount}
            />
          )}

          {/* Recipes */}
          {recipeStories.length > 0 && (
            <StorySection
              title="RECIPES"
              stories={recipeStories}
              onSelect={(s) => {
                setSelectedStory(s);
                setView("reading");
              }}
              formatCount={formatCount}
            />
          )}

          {/* News */}
          {newsStories.length > 0 && (
            <StorySection
              title="NEWS"
              stories={newsStories}
              onSelect={(s) => {
                setSelectedStory(s);
                setView("reading");
              }}
              formatCount={formatCount}
            />
          )}

          {/* Entertainment */}
          {entertainmentStories.length > 0 && (
            <StorySection
              title="ENTERTAINMENT"
              stories={entertainmentStories}
              onSelect={(s) => {
                setSelectedStory(s);
                setView("reading");
              }}
              formatCount={formatCount}
            />
          )}

          {/* Health */}
          {healthStories.length > 0 && (
            <StorySection
              title="HEALTH"
              stories={healthStories}
              onSelect={(s) => {
                setSelectedStory(s);
                setView("reading");
              }}
              formatCount={formatCount}
            />
          )}
        </>
      ) : (
        <StorySection
          title=""
          stories={filteredStories}
          onSelect={(s) => {
            setSelectedStory(s);
            setView("reading");
          }}
          formatCount={formatCount}
        />
      )}

      {/* Bottom padding */}
      <div className="h-20" />

      {/* FAB - Create Story */}
      <button
        onClick={() => setView("create")}
        className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg"
      >
        <Mic className="w-[24px] h-[24px] text-white" />
      </button>
    </div>
  );
}

function StorySection({
  title,
  stories,
  onSelect,
  formatCount,
}: {
  title: string;
  stories: Story[];
  onSelect: (s: Story) => void;
  formatCount: (n: number) => string;
}) {
  return (
    <div>
      {title && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-[#667781] text-[12.5px]" style={{ fontWeight: 500 }}>
            {title}
          </span>
        </div>
      )}
      {stories.map((story) => (
        <button
          key={story.id}
          onClick={() => onSelect(story)}
          className="w-full flex gap-3 px-4 py-[10px] active:bg-[#f5f6f6] text-left"
        >
          {/* Cover / Avatar */}
          {story.coverImage ? (
            <div className="w-[60px] h-[60px] rounded-xl overflow-hidden shrink-0 relative">
              <img
                src={story.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-1 left-1">
                <img
                  src={story.authorAvatar}
                  alt=""
                  className="w-[20px] h-[20px] rounded-full object-cover border border-white"
                />
              </div>
            </div>
          ) : (
            <div className="w-[60px] h-[60px] rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
              <img
                src={story.authorAvatar}
                alt=""
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-[#111b21] text-[15px] truncate" style={{ fontWeight: 500 }}>
                  {story.title}
                </div>
                <div className="text-[#667781] text-[13px]">
                  {story.authorName} · {story.timestamp}
                </div>
              </div>
            </div>
            <div className="text-[#667781] text-[13px] line-clamp-1 mt-0.5">
              {story.content.slice(0, 80)}...
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-[#8696a0] text-[11.5px]">
                <Headphones className="w-[11px] h-[11px]" />
                <span>{formatCount(story.listenerCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-[#8696a0] text-[11.5px]">
                <Mic className="w-[11px] h-[11px]" />
                <span>{story.replyCount}</span>
              </div>
              {story.linkedUrl && (
                <div className="flex items-center gap-1 text-[#008069] text-[11.5px]">
                  <Link2 className="w-[11px] h-[11px]" />
                  <span>Link</span>
                </div>
              )}
              {story.voiceReplies.length > 0 && story.groupChatId && (
                <div className="flex items-center gap-1 text-[#25D366] text-[11.5px]">
                  <Users className="w-[11px] h-[11px]" />
                  <span>Group</span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}