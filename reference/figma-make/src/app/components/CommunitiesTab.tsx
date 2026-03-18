import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Crown,
  Shield,
  MessageCircle,
  Globe,
  ChevronRight,
  Send,
  Mic,
  Check,
  CheckCheck,
  Megaphone,
  Hash,
  X,
  Settings,
  UserPlus,
  Bell,
  BellOff,
  MoreVertical,
  Image,
  Sparkles,
} from "lucide-react";
import { contacts, currentUser } from "../data/mockData";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  online: boolean;
}

interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

interface DiscussionTopic {
  id: string;
  name: string;
  messageCount: number;
  lastActive: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  members: GroupMember[];
  topics: string[];
  discussionTopics: DiscussionTopic[];
  isAdmin: boolean;
  isCommunity: boolean;
  lastActivity: string;
  messages: GroupMessage[];
  muted: boolean;
  emoji: string;
}

const mockGroups: CommunityGroup[] = [
  {
    id: "g1",
    name: "Woodworkers Guild",
    description: "A gathering of fellow woodworking enthusiasts sharing projects, techniques, tool reviews, and decades of workshop wisdom.",
    coverImage: "https://images.unsplash.com/photo-1766096847418-9a2ae64c9621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kd29ya2luZyUyMHdvcmtzaG9wJTIwdG9vbHMlMjBjcmFmdGluZ3xlbnwxfHx8fDE3NzMyMTE3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 843,
    members: [
      { id: "me", name: "You", avatar: currentUser.avatar, role: "admin", online: true },
      { id: "2", name: "Robert Harris", avatar: contacts[1].avatar, role: "moderator", online: false },
      { id: "6", name: "George Patterson", avatar: contacts[5].avatar, role: "member", online: false },
      { id: "8", name: "William Davis", avatar: contacts[7].avatar, role: "member", online: false },
      { id: "4", name: "Frank Sullivan", avatar: contacts[3].avatar, role: "member", online: false },
    ],
    topics: ["Hand Tools", "Furniture", "Turning", "Joinery"],
    discussionTopics: [
      { id: "dt1", name: "Project Showcase", messageCount: 312, lastActive: "2m ago" },
      { id: "dt2", name: "Tool Reviews & Tips", messageCount: 189, lastActive: "15m ago" },
      { id: "dt3", name: "Finishing Techniques", messageCount: 97, lastActive: "1h ago" },
    ],
    isAdmin: true,
    isCommunity: false,
    lastActivity: "2m ago",
    messages: [
      { id: "m1", senderId: "2", senderName: "Robert Harris", senderAvatar: contacts[1].avatar, text: "Just finished a cherry rocking chair. Took me three months but the joints are tight as a drum.", timestamp: "5:42 PM", status: "read" },
      { id: "m2", senderId: "6", senderName: "George Patterson", senderAvatar: contacts[5].avatar, text: "Beautiful work Robert! What finish did you use?", timestamp: "5:44 PM", status: "read" },
      { id: "m3", senderId: "me", senderName: "You", senderAvatar: currentUser.avatar, text: "That's gorgeous. I've been working on an oak bookcase myself. The mortise and tenon joints gave me fits but I got them right.", timestamp: "5:45 PM", status: "read" },
      { id: "m4", senderId: "8", senderName: "William Davis", senderAvatar: contacts[7].avatar, text: "Anyone tried those new Japanese pull saws? Thinking about picking one up.", timestamp: "5:50 PM", status: "read" },
      { id: "m5", senderId: "4", senderName: "Frank Sullivan", senderAvatar: contacts[3].avatar, text: "Best investment I ever made. Cuts like butter through hardwood.", timestamp: "5:52 PM", status: "delivered" },
    ],
    muted: false,
    emoji: "🪵",
  },
  {
    id: "g2",
    name: "Classic Car Club",
    description: "Restoring, maintaining, and admiring classic automobiles. From barn finds to concours, we share the passion for vintage motoring.",
    coverImage: "https://images.unsplash.com/photo-1764015488424-e6beaa36333a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FyJTIwdmludGFnZSUyMGF1dG9tb2JpbGUlMjByZXN0b3JhdGlvbnxlbnwxfHx8fDE3NzMyMTE3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 1456,
    members: [
      { id: "me", name: "You", avatar: currentUser.avatar, role: "admin", online: true },
      { id: "6", name: "George Patterson", avatar: contacts[5].avatar, role: "admin", online: false },
      { id: "2", name: "Robert Harris", avatar: contacts[1].avatar, role: "moderator", online: false },
      { id: "8", name: "William Davis", avatar: contacts[7].avatar, role: "member", online: false },
    ],
    topics: ["Restoration", "Parts Sourcing", "Car Shows", "Muscle Cars"],
    discussionTopics: [
      { id: "dt4", name: "Barn Finds & Stories", messageCount: 567, lastActive: "5m ago" },
      { id: "dt5", name: "Parts Marketplace", messageCount: 234, lastActive: "30m ago" },
      { id: "dt6", name: "Engine Rebuilds", messageCount: 445, lastActive: "8m ago" },
      { id: "dt7", name: "Show Calendar", messageCount: 123, lastActive: "2h ago" },
    ],
    isAdmin: true,
    isCommunity: true,
    lastActivity: "5m ago",
    messages: [
      { id: "m6", senderId: "6", senderName: "George Patterson", senderAvatar: contacts[5].avatar, text: "The '67 Mustang fastback parts finally came in from Virginia. Fenders are in great shape.", timestamp: "4:30 PM", status: "read" },
      { id: "m7", senderId: "2", senderName: "Robert Harris", senderAvatar: contacts[1].avatar, text: "Lucky find! I'm still hunting for a good carburetor for my '69 Chevelle.", timestamp: "4:32 PM", status: "read" },
      { id: "m8", senderId: "me", senderName: "You", senderAvatar: currentUser.avatar, text: "Swap meet at the fairgrounds next Saturday. I saw carburetors there last time.", timestamp: "4:35 PM", status: "read" },
    ],
    muted: false,
    emoji: "🚗",
  },
  {
    id: "g3",
    name: "Saturday Morning Golfers",
    description: "Our regular group of retirees who hit the links every weekend. Tee times, tips, friendly wagers, and the occasional hole-in-one celebration.",
    coverImage: "https://images.unsplash.com/photo-1590421004947-4b6b42170cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xmJTIwY291cnNlJTIwZ3JlZW4lMjBzdW5ueSUyMG1vcm5pbmd8ZW58MXx8fHwxNzczMjExNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 234,
    members: [
      { id: "4", name: "Frank Sullivan", avatar: contacts[3].avatar, role: "admin", online: false },
      { id: "me", name: "You", avatar: currentUser.avatar, role: "member", online: true },
      { id: "8", name: "William Davis", avatar: contacts[7].avatar, role: "member", online: false },
      { id: "1", name: "Margaret Thompson", avatar: contacts[0].avatar, role: "member", online: true },
    ],
    topics: ["Tee Times", "Tips & Drills", "Equipment", "Course Reviews"],
    discussionTopics: [
      { id: "dt8", name: "Weekly Tee Times", messageCount: 890, lastActive: "10m ago" },
      { id: "dt9", name: "Swing Tips", messageCount: 234, lastActive: "45m ago" },
      { id: "dt10", name: "Equipment Reviews", messageCount: 156, lastActive: "3h ago" },
    ],
    isAdmin: false,
    isCommunity: false,
    lastActivity: "10m ago",
    messages: [
      { id: "m9", senderId: "4", senderName: "Frank Sullivan", senderAvatar: contacts[3].avatar, text: "Shot a 78 yesterday! Best round this season. The new driver is paying off.", timestamp: "7:15 AM", status: "read" },
      { id: "m10", senderId: "8", senderName: "William Davis", senderAvatar: contacts[7].avatar, text: "Outstanding Frank! I managed an 84 but my putting was terrible on the back nine.", timestamp: "8:00 AM", status: "read" },
    ],
    muted: false,
    emoji: "⛳",
  },
  {
    id: "g4",
    name: "Neighborhood Book Club",
    description: "Monthly book picks, lively discussions over coffee, and the occasional author visit. Currently reading: 'A Gentleman in Moscow' by Amor Towles.",
    coverImage: "https://images.unsplash.com/photo-1660805334468-1e8bf5f7621c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY2x1YiUyMHJlYWRpbmclMjBsaWJyYXJ5fGVufDF8fHx8MTc3MzIwNjQ1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 89,
    members: [
      { id: "5", name: "Susan Chen", avatar: contacts[4].avatar, role: "admin", online: true },
      { id: "me", name: "You", avatar: currentUser.avatar, role: "moderator", online: true },
      { id: "7", name: "Dorothy Miller", avatar: contacts[6].avatar, role: "member", online: true },
    ],
    topics: ["Mystery", "Historical Fiction", "Biographies", "Classics"],
    discussionTopics: [
      { id: "dt11", name: "March Book Pick", messageCount: 78, lastActive: "1h ago" },
      { id: "dt12", name: "Genre Recommendations", messageCount: 345, lastActive: "2h ago" },
    ],
    isAdmin: false,
    isCommunity: true,
    lastActivity: "1h ago",
    messages: [
      { id: "m11", senderId: "5", senderName: "Susan Chen", senderAvatar: contacts[4].avatar, text: "Just finished A Gentleman in Moscow. What a beautiful ending. Towles really knows how to write.", timestamp: "2:30 PM", status: "read" },
      { id: "m12", senderId: "7", senderName: "Dorothy Miller", senderAvatar: contacts[6].avatar, text: "Don't say anything else! I'm still on chapter 15. But I'm loving it so far.", timestamp: "2:35 PM", status: "read" },
    ],
    muted: true,
    emoji: "📚",
  },
  {
    id: "g5",
    name: "Lake Fishing Fellowship",
    description: "Early risers and patient souls who love nothing more than a quiet morning on the water. Sharing spots, tackle tips, and tall tales.",
    coverImage: "https://images.unsplash.com/photo-1751840028712-c5d5bfc3683a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwbGFrZSUyMGNhbG0lMjBtb3JuaW5nJTIwb3V0ZG9vcnN8ZW58MXx8fHwxNzczMjExNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 567,
    members: [
      { id: "8", name: "William Davis", avatar: contacts[7].avatar, role: "admin", online: false },
      { id: "me", name: "You", avatar: currentUser.avatar, role: "admin", online: true },
      { id: "4", name: "Frank Sullivan", avatar: contacts[3].avatar, role: "member", online: false },
    ],
    topics: ["Bass Fishing", "Fly Fishing", "Tackle & Gear", "Best Spots"],
    discussionTopics: [
      { id: "dt13", name: "Catch of the Week", messageCount: 456, lastActive: "20m ago" },
      { id: "dt14", name: "Tackle Box Talk", messageCount: 234, lastActive: "1h ago" },
      { id: "dt15", name: "Weather & Conditions", messageCount: 189, lastActive: "4h ago" },
    ],
    isAdmin: true,
    isCommunity: false,
    lastActivity: "20m ago",
    messages: [
      { id: "m13", senderId: "8", senderName: "William Davis", senderAvatar: contacts[7].avatar, text: "Caught a 12-pounder at Miller's Cove this morning! Used a chartreuse spinnerbait.", timestamp: "6:15 AM", status: "read" },
      { id: "m14", senderId: "4", senderName: "Frank Sullivan", senderAvatar: contacts[3].avatar, text: "A 12-pounder? That's a monster! I need to try that cove. What time did you head out?", timestamp: "6:20 AM", status: "read" },
    ],
    muted: false,
    emoji: "🎣",
  },
  {
    id: "g6",
    name: "Grandparents Corner",
    description: "Sharing the joys and adventures of being grandparents. Activities for grandkids, recipes they love, and stories that warm the heart.",
    coverImage: "https://images.unsplash.com/photo-1764816648509-fb6b7fd31211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZGNoaWxkcmVuJTIwZ3JhbmRwYXJlbnRzJTIwZmFtaWx5JTIwZ2F0aGVyaW5nfGVufDF8fHx8MTc3MzIxMTcyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    memberCount: 1234,
    members: [
      { id: "1", name: "Margaret Thompson", avatar: contacts[0].avatar, role: "admin", online: true },
      { id: "9", name: "Barbara Wilson", avatar: contacts[8].avatar, role: "moderator", online: false },
      { id: "me", name: "You", avatar: currentUser.avatar, role: "member", online: true },
    ],
    topics: ["Activities", "Recipes for Kids", "Stories", "Travel with Grandkids"],
    discussionTopics: [
      { id: "dt16", name: "Activity Ideas", messageCount: 567, lastActive: "30m ago" },
      { id: "dt17", name: "Recipes Kids Love", messageCount: 234, lastActive: "2h ago" },
    ],
    isAdmin: false,
    isCommunity: false,
    lastActivity: "30m ago",
    messages: [
      { id: "m15", senderId: "1", senderName: "Margaret Thompson", senderAvatar: contacts[0].avatar, text: "Took the grandkids to the botanical garden yesterday. They loved the butterfly house!", timestamp: "3:00 PM", status: "read" },
      { id: "m16", senderId: "9", senderName: "Barbara Wilson", senderAvatar: contacts[8].avatar, text: "What a lovely idea! My granddaughter has been asking to bake cookies again. Third time this week!", timestamp: "3:05 PM", status: "read" },
    ],
    muted: false,
    emoji: "👴",
  },
];

type ViewState = "list" | "detail" | "chat" | "create" | "publish";

export function CommunitiesTab() {
  const [view, setView] = useState<ViewState>("list");
  const [groups, setGroups] = useState<CommunityGroup[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "my-groups" | "communities">("all");
  const [showMenu, setShowMenu] = useState(false);

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterTab === "my-groups") return matchesSearch && !g.isCommunity;
    if (filterTab === "communities") return matchesSearch && g.isCommunity;
    return matchesSearch;
  });

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;
    const newMsg: GroupMessage = {
      id: `m-${Date.now()}`,
      senderId: "me",
      senderName: "You",
      senderAvatar: currentUser.avatar,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sent",
    };
    setGroups(prev => prev.map(g =>
      g.id === selectedGroup.id ? { ...g, messages: [...g.messages, newMsg] } : g
    ));
    setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
    setMessageInput("");
  };

  const handlePublishAsCommunity = () => {
    if (!selectedGroup) return;
    setGroups(prev => prev.map(g =>
      g.id === selectedGroup.id ? { ...g, isCommunity: true } : g
    ));
    setSelectedGroup(prev => prev ? { ...prev, isCommunity: true } : null);
    setShowPublishConfirm(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  // Chat view inside a group
  if (view === "chat" && selectedGroup) {
    return (
      <div className="flex-1 flex flex-col bg-[#efeae2] h-full">
        {/* Chat header */}
        <div className="bg-[#008069] px-3 py-[10px] flex items-center gap-3 shrink-0">
          <button onClick={() => setView("detail")} className="text-white">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>
          <div className="w-[36px] h-[36px] rounded-full overflow-hidden shrink-0">
            <img src={selectedGroup.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0" onClick={() => setView("detail")}>
            <div className="text-white text-[15px] truncate" style={{ fontWeight: 500 }}>
              {selectedGroup.name}
            </div>
            <div className="text-[#d1f4cc] text-[12px] truncate">
              {selectedGroup.members.filter(m => m.online).map(m => m.name === "You" ? "You" : m.name.split(" ")[0]).join(", ")}
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-white p-1">
              <MoreVertical className="w-[20px] h-[20px]" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl py-1 w-[200px] z-50">
                <button onClick={() => { setView("detail"); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-[#111b21] text-[14px] active:bg-[#f0f2f5]">
                  Group info
                </button>
                {selectedGroup.isAdmin && !selectedGroup.isCommunity && (
                  <button onClick={() => { setShowPublishConfirm(true); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-[#008069] text-[14px] active:bg-[#f0f2f5]">
                    Publish as Community
                  </button>
                )}
                <button onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2.5 text-[#111b21] text-[14px] active:bg-[#f0f2f5]">
                  Mute notifications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {/* Encryption notice */}
          <div className="bg-[#ffecb3] rounded-lg px-3 py-2 mb-3 text-center mx-8">
            <span className="text-[#54656f] text-[11.5px]">
              Messages are end-to-end encrypted. Only members can read them.
            </span>
          </div>

          {selectedGroup.messages.map((msg) => {
            const isMine = msg.senderId === "me";
            return (
              <div key={msg.id} className={`flex mb-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-1.5 relative ${
                    isMine ? "bg-[#d9fdd3]" : "bg-white"
                  }`}
                >
                  {!isMine && (
                    <div className="text-[12.5px] mb-0.5" style={{
                      fontWeight: 500,
                      color: ["#25D366", "#1fa855", "#00a884", "#53bdeb", "#e8a23a", "#ff6b6b"][
                        msg.senderName.charCodeAt(0) % 6
                      ]
                    }}>
                      {msg.senderName}
                    </div>
                  )}
                  <div className="text-[#111b21] text-[14px]" style={{ lineHeight: "1.4" }}>
                    {msg.text}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[#667781] text-[10.5px]">{msg.timestamp}</span>
                    {isMine && (
                      msg.status === "read" ? (
                        <CheckCheck className="w-[14px] h-[14px] text-[#53bdeb]" />
                      ) : msg.status === "delivered" ? (
                        <CheckCheck className="w-[14px] h-[14px] text-[#667781]" />
                      ) : (
                        <Check className="w-[14px] h-[14px] text-[#667781]" />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="bg-[#f0f2f5] px-2 py-[6px] flex items-center gap-2 shrink-0">
          <div className="flex-1 bg-white rounded-full px-4 py-[8px] flex items-center">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message"
              className="flex-1 bg-transparent text-[#111b21] text-[14px] outline-none placeholder:text-[#8696a0]"
            />
          </div>
          {messageInput.trim() ? (
            <button onClick={handleSendMessage} className="w-[44px] h-[44px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <Send className="w-[20px] h-[20px] text-white" />
            </button>
          ) : (
            <button className="w-[44px] h-[44px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <Mic className="w-[20px] h-[20px] text-white" />
            </button>
          )}
        </div>

        {/* Publish confirm modal */}
        {showPublishConfirm && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center px-8">
            <div className="bg-white rounded-2xl w-full p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-[44px] h-[44px] rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <Globe className="w-[22px] h-[22px] text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <div className="text-[#111b21] text-[16px]" style={{ fontWeight: 600 }}>
                    Publish as Community?
                  </div>
                </div>
              </div>
              <p className="text-[#667781] text-[13.5px] mb-4" style={{ lineHeight: "1.5" }}>
                This will make <span style={{ fontWeight: 600 }}>"{selectedGroup.name}"</span> discoverable as a public community. New members can find and join it. You'll remain as admin.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e9edef] text-[#667781] text-[14px]"
                  style={{ fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishAsCommunity}
                  className="flex-1 py-2.5 rounded-full bg-[#25D366] text-white text-[14px]"
                  style={{ fontWeight: 500 }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Publish success toast */}
        {publishSuccess && (
          <div className="absolute top-14 left-4 right-4 bg-[#111b21] rounded-xl px-4 py-3 flex items-center gap-3 z-50 shadow-lg">
            <div className="w-[32px] h-[32px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <Check className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-white text-[14px]" style={{ fontWeight: 500 }}>
              Published as community!
            </span>
          </div>
        )}
      </div>
    );
  }

  // Detail view of a group
  if (view === "detail" && selectedGroup) {
    const admins = selectedGroup.members.filter(m => m.role === "admin");
    const moderators = selectedGroup.members.filter(m => m.role === "moderator");
    const regularMembers = selectedGroup.members.filter(m => m.role === "member");

    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        {/* Cover + Header */}
        <div className="relative shrink-0">
          <div className="h-[140px] overflow-hidden">
            <img src={selectedGroup.coverImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          </div>
          <button
            onClick={() => { setView("list"); setSelectedGroup(null); }}
            className="absolute top-3 left-3 text-white bg-black/30 rounded-full p-1.5"
          >
            <ArrowLeft className="w-[20px] h-[20px]" />
          </button>
          {selectedGroup.isCommunity && (
            <div className="absolute top-3 right-3 bg-[#25D366] rounded-full px-3 py-1 flex items-center gap-1">
              <Globe className="w-[12px] h-[12px] text-white" />
              <span className="text-white text-[11px]" style={{ fontWeight: 600 }}>COMMUNITY</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Group info */}
          <div className="px-4 py-3 border-b border-[#e9edef]">
            <div className="flex items-center gap-2">
              <span className="text-[24px]">{selectedGroup.emoji}</span>
              <h2 className="text-[#111b21] text-[20px] flex-1" style={{ fontWeight: 600 }}>
                {selectedGroup.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[#667781] text-[13px]">
              <Users className="w-[14px] h-[14px]" />
              <span>{formatCount(selectedGroup.memberCount)} members</span>
              <span>·</span>
              <span>Active {selectedGroup.lastActivity}</span>
            </div>
            <p className="text-[#667781] text-[13.5px] mt-2" style={{ lineHeight: "1.5" }}>
              {selectedGroup.description}
            </p>

            {/* Topic labels */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedGroup.topics.map((topic) => (
                <span
                  key={topic}
                  className="bg-[#e7f8e9] text-[#008069] text-[11.5px] px-2.5 py-[4px] rounded-full"
                  style={{ fontWeight: 500 }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 px-4 py-3 border-b border-[#e9edef]">
            <button
              onClick={() => setView("chat")}
              className="flex-1 bg-[#25D366] text-white rounded-full py-2.5 flex items-center justify-center gap-2 text-[14px]"
              style={{ fontWeight: 500 }}
            >
              <MessageCircle className="w-[16px] h-[16px]" />
              Open Chat
            </button>
            {selectedGroup.isAdmin && !selectedGroup.isCommunity && (
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="flex-1 bg-[#008069] text-white rounded-full py-2.5 flex items-center justify-center gap-2 text-[14px]"
                style={{ fontWeight: 500 }}
              >
                <Globe className="w-[16px] h-[16px]" />
                Publish
              </button>
            )}
            {selectedGroup.isCommunity && selectedGroup.isAdmin && (
              <button
                className="px-4 bg-[#f0f2f5] text-[#111b21] rounded-full py-2.5 flex items-center justify-center gap-2 text-[14px]"
                style={{ fontWeight: 500 }}
              >
                <Settings className="w-[16px] h-[16px]" />
              </button>
            )}
          </div>

          {/* Discussion topics */}
          <div className="border-b border-[#e9edef]">
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <span className="text-[#667781] text-[12.5px]" style={{ fontWeight: 500 }}>
                DISCUSSION TOPICS
              </span>
              {selectedGroup.isAdmin && (
                <button className="text-[#008069] text-[12px] flex items-center gap-1">
                  <Plus className="w-[12px] h-[12px]" />
                  <span>Add</span>
                </button>
              )}
            </div>
            {selectedGroup.discussionTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setView("chat")}
                className="w-full flex items-center px-4 py-2.5 active:bg-[#f5f6f6]"
              >
                <div className="w-[40px] h-[40px] rounded-full bg-[#e7f8e9] flex items-center justify-center shrink-0">
                  <Hash className="w-[18px] h-[18px] text-[#25D366]" />
                </div>
                <div className="ml-3 flex-1 min-w-0 text-left">
                  <div className="text-[#111b21] text-[14.5px]" style={{ fontWeight: 400 }}>
                    {topic.name}
                  </div>
                  <div className="text-[#667781] text-[12px]">
                    {topic.messageCount} messages · {topic.lastActive}
                  </div>
                </div>
                <ChevronRight className="w-[16px] h-[16px] text-[#8696a0]" />
              </button>
            ))}
          </div>

          {/* Members */}
          <div className="pb-4">
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <span className="text-[#667781] text-[12.5px]" style={{ fontWeight: 500 }}>
                {formatCount(selectedGroup.memberCount)} MEMBERS
              </span>
              <button className="text-[#008069] text-[12px] flex items-center gap-1">
                <UserPlus className="w-[12px] h-[12px]" />
                <span>Invite</span>
              </button>
            </div>

            {/* Admins */}
            {admins.map((m) => (
              <MemberRow key={m.id} member={m} />
            ))}
            {/* Moderators */}
            {moderators.map((m) => (
              <MemberRow key={m.id} member={m} />
            ))}
            {/* Regular members */}
            {regularMembers.map((m) => (
              <MemberRow key={m.id} member={m} />
            ))}
            {selectedGroup.memberCount > selectedGroup.members.length && (
              <div className="px-4 py-2.5 text-[#008069] text-[13px]" style={{ fontWeight: 500 }}>
                View all {formatCount(selectedGroup.memberCount)} members
              </div>
            )}
          </div>
        </div>

        {/* Publish confirm modal */}
        {showPublishConfirm && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center px-8">
            <div className="bg-white rounded-2xl w-full p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-[44px] h-[44px] rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <Globe className="w-[22px] h-[22px] text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <div className="text-[#111b21] text-[16px]" style={{ fontWeight: 600 }}>
                    Publish as Community?
                  </div>
                </div>
              </div>
              <p className="text-[#667781] text-[13.5px] mb-2" style={{ lineHeight: "1.5" }}>
                This will make <span style={{ fontWeight: 600 }}>"{selectedGroup.name}"</span> discoverable as a public community. New members can find and join it.
              </p>
              <div className="bg-[#f0f2f5] rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-[14px] h-[14px] text-[#008069] mt-0.5 shrink-0" />
                  <span className="text-[#667781] text-[12px]" style={{ lineHeight: "1.5" }}>
                    Communities get a public profile, topic channels, announcement broadcasting, and can be discovered by anyone on WhatsApp.
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishConfirm(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e9edef] text-[#667781] text-[14px]"
                  style={{ fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishAsCommunity}
                  className="flex-1 py-2.5 rounded-full bg-[#25D366] text-white text-[14px]"
                  style={{ fontWeight: 500 }}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Publish success toast */}
        {publishSuccess && (
          <div className="absolute top-3 left-4 right-4 bg-[#111b21] rounded-xl px-4 py-3 flex items-center gap-3 z-50 shadow-lg">
            <div className="w-[32px] h-[32px] rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <Check className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-white text-[14px]" style={{ fontWeight: 500 }}>
              "{selectedGroup.name}" is now a community!
            </span>
          </div>
        )}
      </div>
    );
  }

  // List view (main)
  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      {/* Search bar */}
      <div className="px-3 pt-2 pb-1">
        <div className={`flex items-center gap-2 bg-[#f0f2f5] rounded-full px-3 py-[7px] ${searchFocused ? "ring-1 ring-[#25D366]" : ""}`}>
          <Search className="w-[16px] h-[16px] text-[#8696a0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search groups & communities"
            className="flex-1 bg-transparent text-[#111b21] text-[14px] outline-none placeholder:text-[#8696a0]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[#8696a0]">
              <X className="w-[16px] h-[16px]" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-3 py-2">
        {(
          [
            { key: "all" as const, label: "All", icon: Users },
            { key: "my-groups" as const, label: "My Groups", icon: MessageCircle },
            { key: "communities" as const, label: "Communities", icon: Globe },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilterTab(key)}
            className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[13px] whitespace-nowrap ${
              filterTab === key
                ? "bg-[#d8fdd2] text-[#008069]"
                : "bg-[#f0f2f5] text-[#54656f]"
            }`}
            style={{ fontWeight: filterTab === key ? 600 : 400 }}
          >
            <Icon className="w-[14px] h-[14px]" />
            {label}
          </button>
        ))}
      </div>

      {/* Groups list */}
      {filteredGroups.map((group) => (
        <button
          key={group.id}
          onClick={() => { setSelectedGroup(group); setView("detail"); }}
          className="w-full flex gap-3 px-4 py-[10px] active:bg-[#f5f6f6] text-left"
        >
          {/* Group avatar */}
          <div className="relative shrink-0">
            <div className="w-[52px] h-[52px] rounded-2xl overflow-hidden">
              <img src={group.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
            {group.isCommunity && (
              <div className="absolute -bottom-[2px] -right-[2px] w-[18px] h-[18px] bg-[#25D366] rounded-full flex items-center justify-center border-2 border-white">
                <Globe className="w-[9px] h-[9px] text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 border-b border-[#e9edef] pb-[10px]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px]">{group.emoji}</span>
                  <span className="text-[#111b21] text-[15.5px] truncate" style={{ fontWeight: 400 }}>
                    {group.name}
                  </span>
                  {group.isAdmin && (
                    <Crown className="w-[12px] h-[12px] text-[#e8a23a] shrink-0" />
                  )}
                </div>
              </div>
              <span className="text-[#667781] text-[11.5px] shrink-0 flex items-center gap-1">
                <Users className="w-[11px] h-[11px]" />
                {formatCount(group.memberCount)} members
              </span>
            </div>

            {/* Last message preview */}
            

            {/* Member count + topic labels */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1 text-[#8696a0] text-[11px]">
                <Users className="w-[10px] h-[10px]" />
                <span>{formatCount(group.memberCount)}</span>
              </div>
              {/* Stacked member avatars */}
              <div className="flex -space-x-1.5">
                {group.members.slice(0, 3).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt=""
                    className="w-[16px] h-[16px] rounded-full object-cover border border-white"
                  />
                ))}
              </div>
              <div className="flex gap-1 flex-wrap">
                {group.topics.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="bg-[#f0f2f5] text-[#667781] text-[10px] px-1.5 py-[2px] rounded-full"
                    style={{ fontWeight: 500 }}
                  >
                    {topic}
                  </span>
                ))}
                {group.topics.length > 2 && (
                  <span className="text-[#8696a0] text-[10px]">+{group.topics.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}

      {filteredGroups.length === 0 && (
        <div className="flex flex-col items-center px-8 pt-12 pb-6">
          <div className="w-[80px] h-[80px] rounded-full bg-[#f0f2f5] flex items-center justify-center mb-4">
            <Search className="w-[32px] h-[32px] text-[#8696a0]" />
          </div>
          <div className="text-[#111b21] text-[16px] mb-1" style={{ fontWeight: 500 }}>
            No groups found
          </div>
          <div className="text-[#667781] text-[13.5px] text-center">
            Try a different search or create a new group
          </div>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-20" />

      {/* FAB - Create Group */}
      <button
        className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus className="w-[24px] h-[24px] text-white" />
      </button>
    </div>
  );
}

function MemberRow({ member }: { member: GroupMember }) {
  return (
    <div className="flex items-center px-4 py-2 active:bg-[#f5f6f6]">
      <div className="relative">
        <img src={member.avatar} alt={member.name} className="w-[40px] h-[40px] rounded-full object-cover" />
        {member.online && (
          <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-[#25D366] border-2 border-white" />
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="text-[#111b21] text-[14.5px] truncate">
          {member.id === "me" ? "You" : member.name}
        </div>
        <div className="flex items-center gap-1.5">
          {member.role === "admin" && (
            <span className="flex items-center gap-0.5 text-[#e8a23a] text-[11px]">
              <Crown className="w-[10px] h-[10px]" />
              Admin
            </span>
          )}
          {member.role === "moderator" && (
            <span className="flex items-center gap-0.5 text-[#008069] text-[11px]">
              <Shield className="w-[10px] h-[10px]" />
              Moderator
            </span>
          )}
          {member.role === "member" && (
            <span className="text-[#667781] text-[11px]">Member</span>
          )}
        </div>
      </div>
    </div>
  );
}