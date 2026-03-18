export interface Contact {
  id: string;
  name: string;
  avatar: string;
  about: string;
  phone: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "audio" | "document";
}

export interface Chat {
  id: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  typing: boolean;
  isGroup: boolean;
  groupName?: string;
  groupMembers?: string[];
}

export interface Status {
  id: string;
  contactId: string;
  timestamp: string;
  viewed: boolean;
}

export interface Story {
  id: string;
  authorId: string; // contact id or "me" or stranger ids
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string; // the narrated story text
  coverImage?: string;
  linkedUrl?: string; // optional article/video link
  linkedTitle?: string;
  timestamp: string;
  listenerCount: number;
  replyCount: number;
  category: "friends" | "recipes" | "news" | "entertainment" | "health";
  voiceReplies: VoiceReply[];
  groupChatId?: string; // group chat created from voice replies
}

export interface VoiceReply {
  id: string;
  storyId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  duration: string; // e.g. "0:42"
  timestamp: string;
  transcription?: string;
}

export interface Call {
  id: string;
  contactId: string;
  type: "audio" | "video";
  direction: "incoming" | "outgoing" | "missed";
  timestamp: string;
  duration?: string;
}

export const currentUser: Contact = {
  id: "me",
  name: "You",
  avatar: "https://images.unsplash.com/photo-1613394242132-1268854bde44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBtYW4lMjBncmF5JTIwaGFpciUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NzMyMTE3MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  about: "Retired and loving every minute of it.",
  phone: "+1 (555) 000-0000",
  online: true,
};

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Margaret Thompson",
    avatar: "https://images.unsplash.com/photo-1761414500568-1348275e08a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMGVsZWdhbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMxNTU2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Grandma of 5. Life is beautiful.",
    phone: "+1 (555) 123-4567",
    online: true,
  },
  {
    id: "2",
    name: "Robert Harris",
    avatar: "https://images.unsplash.com/photo-1609741200119-b292937ea2eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMG1hbiUyMGdsYXNzZXMlMjBkaXN0aW5ndWlzaGVkJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMjExNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Woodworking and black coffee.",
    phone: "+1 (555) 234-5678",
    online: false,
    lastSeen: "Today at 2:30 PM",
  },
  {
    id: "3",
    name: "Linda Carter",
    avatar: "https://images.unsplash.com/photo-1764173039248-78beb636931a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBnYXJkZW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "My garden is my happy place.",
    phone: "+1 (555) 345-6789",
    online: true,
  },
  {
    id: "4",
    name: "Frank Sullivan",
    avatar: "https://images.unsplash.com/photo-1607975517837-c8e8ccf2dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVkJTIwbWFuJTIwb3V0ZG9vcnMlMjBoaWtpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Old golfer, young spirit.",
    phone: "+1 (555) 456-7890",
    online: false,
    lastSeen: "Yesterday at 11:45 PM",
  },
  {
    id: "5",
    name: "Susan Chen",
    avatar: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBBc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMjExNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Book club organizer and pie baker.",
    phone: "+1 (555) 567-8901",
    online: true,
  },
  {
    id: "6",
    name: "George Patterson",
    avatar: "https://images.unsplash.com/photo-1444069069008-83a57aac43ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBnZW50bGVtYW4lMjBiZWFyZCUyMHBvcnRyYWl0JTIwZGlzdGluZ3Vpc2hlZHxlbnwxfHx8fDE3NzMyMTE3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Classic cars and jazz records.",
    phone: "+1 (555) 678-9012",
    online: false,
    lastSeen: "Today at 10:15 AM",
  },
  {
    id: "7",
    name: "Dorothy Miller",
    avatar: "https://images.unsplash.com/photo-1641749631692-44ad83f07ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMHdvbWFuJTIwcmVhZGluZyUyMGdsYXNzZXMlMjBwb3J0cmFpdCUyMHdhcm18ZW58MXx8fHwxNzczMjExNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Knitting, tea, and good conversation.",
    phone: "+1 (555) 789-0123",
    online: true,
  },
  {
    id: "8",
    name: "William Davis",
    avatar: "https://images.unsplash.com/photo-1731335150363-0dcd7db3b908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVkJTIwY291cGxlJTIwbWF0dXJlJTIwbWFuJTIwcG9ydHJhaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzczMjExNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Fishing is the answer to everything.",
    phone: "+1 (555) 890-1234",
    online: false,
    lastSeen: "Today at 4:00 PM",
  },
  {
    id: "9",
    name: "Barbara Wilson",
    avatar: "https://images.unsplash.com/photo-1572924171681-a5873cdf8664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjB3b21hbiUyMHdoaXRlJTIwaGFpciUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzczMjExNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    about: "Church choir and morning walks.",
    phone: "+1 (555) 901-2345",
    online: false,
    lastSeen: "Yesterday at 8:30 PM",
  },
];

export const chats: Chat[] = [
  {
    id: "chat1",
    contactId: "1",
    lastMessage: "Are you bringing your famous potato salad to the cookout?",
    lastMessageTime: "5:42 PM",
    unreadCount: 3,
    pinned: true,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat2",
    contactId: "2",
    lastMessage: "The new chisel set arrived. Sharpest I've ever used",
    lastMessageTime: "4:18 PM",
    unreadCount: 0,
    pinned: true,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat3",
    contactId: "3",
    lastMessage: "Photo",
    lastMessageTime: "3:55 PM",
    unreadCount: 1,
    pinned: false,
    muted: false,
    typing: true,
    isGroup: false,
  },
  {
    id: "chat10",
    contactId: "1",
    lastMessage: "Linda: Don't forget the sunscreen!",
    lastMessageTime: "2:30 PM",
    unreadCount: 12,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: true,
    groupName: "Sunday Brunch Crew",
    groupMembers: ["1", "3", "5", "7"],
  },
  {
    id: "chat4",
    contactId: "4",
    lastMessage: "Tee time at 7am Saturday. Don't be late!",
    lastMessageTime: "1:22 PM",
    unreadCount: 0,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat5",
    contactId: "5",
    lastMessage: "I picked up that mystery novel you recommended!",
    lastMessageTime: "12:05 PM",
    unreadCount: 2,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat11",
    contactId: "2",
    lastMessage: "George: The '67 Mustang parts just came in",
    lastMessageTime: "11:45 AM",
    unreadCount: 5,
    pinned: false,
    muted: true,
    typing: false,
    isGroup: true,
    groupName: "Classic Car Club",
    groupMembers: ["2", "6", "8"],
  },
  {
    id: "chat6",
    contactId: "6",
    lastMessage: "Found a mint condition vinyl at the flea market!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat7",
    contactId: "7",
    lastMessage: "The grandkids loved the cookies we baked",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    pinned: false,
    muted: true,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat8",
    contactId: "8",
    lastMessage: "Caught a 12-pounder at the lake this morning!",
    lastMessageTime: "Monday",
    unreadCount: 0,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: false,
  },
  {
    id: "chat9",
    contactId: "9",
    lastMessage: "See you at choir practice Thursday!",
    lastMessageTime: "Monday",
    unreadCount: 0,
    pinned: false,
    muted: false,
    typing: false,
    isGroup: false,
  },
];

export const messages: Record<string, Message[]> = {
  chat1: [
    { id: "m1", chatId: "chat1", senderId: "1", text: "Good morning! How's your back feeling today?", timestamp: "5:10 PM", status: "read", type: "text" },
    { id: "m2", chatId: "chat1", senderId: "me", text: "Much better! That new stretching routine is really helping", timestamp: "5:12 PM", status: "read", type: "text" },
    { id: "m3", chatId: "chat1", senderId: "1", text: "Wonderful! So we're doing a cookout this Saturday at our place", timestamp: "5:15 PM", status: "read", type: "text" },
    { id: "m4", chatId: "chat1", senderId: "1", text: "The whole neighborhood gang is coming", timestamp: "5:16 PM", status: "read", type: "text" },
    { id: "m5", chatId: "chat1", senderId: "me", text: "Count me in! I'll fire up the smoker", timestamp: "5:20 PM", status: "read", type: "text" },
    { id: "m6", chatId: "chat1", senderId: "me", text: "What time should I come over?", timestamp: "5:20 PM", status: "read", type: "text" },
    { id: "m7", chatId: "chat1", senderId: "1", text: "Around 4pm. Harold is setting up the tables early", timestamp: "5:25 PM", status: "read", type: "text" },
    { id: "m8", chatId: "chat1", senderId: "me", text: "Perfect. I'll bring some ribs and my special rub", timestamp: "5:30 PM", status: "delivered", type: "text" },
    { id: "m9", chatId: "chat1", senderId: "1", text: "Oh that would be marvelous! And maybe some of that homemade lemonade?", timestamp: "5:35 PM", status: "read", type: "text" },
    { id: "m10", chatId: "chat1", senderId: "1", text: "Are you bringing your famous potato salad to the cookout?", timestamp: "5:42 PM", status: "read", type: "text" },
  ],
  chat2: [
    { id: "m20", chatId: "chat2", senderId: "me", text: "Robert, I finally finished that oak bookcase", timestamp: "3:00 PM", status: "read", type: "text" },
    { id: "m21", chatId: "chat2", senderId: "2", text: "No kidding! Send me a photo", timestamp: "3:05 PM", status: "read", type: "text" },
    { id: "m22", chatId: "chat2", senderId: "2", text: "I've been working on a rocking chair. The joints are giving me trouble", timestamp: "3:30 PM", status: "read", type: "text" },
    { id: "m23", chatId: "chat2", senderId: "me", text: "Mortise and tenon? I had the same issue last year", timestamp: "3:35 PM", status: "read", type: "text" },
    { id: "m24", chatId: "chat2", senderId: "2", text: "Exactly. The shoulders aren't sitting flush", timestamp: "3:40 PM", status: "read", type: "text" },
    { id: "m25", chatId: "chat2", senderId: "me", text: "Try paring with a wider chisel. I'll show you Saturday", timestamp: "3:45 PM", status: "read", type: "text" },
    { id: "m26", chatId: "chat2", senderId: "me", text: "By the way, my new chisel set just arrived", timestamp: "4:10 PM", status: "read", type: "text" },
    { id: "m27", chatId: "chat2", senderId: "2", text: "The new chisel set arrived. Sharpest I've ever used", timestamp: "4:18 PM", status: "read", type: "text" },
  ],
  chat3: [
    { id: "m30", chatId: "chat3", senderId: "3", text: "Look at my tomatoes this year! Biggest ones yet", timestamp: "3:30 PM", status: "read", type: "text" },
    { id: "m31", chatId: "chat3", senderId: "me", text: "Wow, those are gorgeous! What variety?", timestamp: "3:32 PM", status: "read", type: "text" },
    { id: "m32", chatId: "chat3", senderId: "3", text: "Brandywine heirlooms. Come pick some when they're ripe!", timestamp: "3:40 PM", status: "read", type: "text" },
    { id: "m33", chatId: "chat3", senderId: "me", text: "I'd love that! My zucchini is going crazy this year too", timestamp: "3:50 PM", status: "read", type: "text" },
    { id: "m34", chatId: "chat3", senderId: "3", text: "Photo", timestamp: "3:55 PM", status: "read", type: "text" },
  ],
  chat4: [
    { id: "m40", chatId: "chat4", senderId: "4", text: "You missed a beautiful round yesterday. Shot a 78!", timestamp: "12:00 PM", status: "read", type: "text" },
    { id: "m41", chatId: "chat4", senderId: "me", text: "78? That's your best this season! I was fixing the gutters all day", timestamp: "12:30 PM", status: "read", type: "text" },
    { id: "m42", chatId: "chat4", senderId: "4", text: "Tee time at 7am Saturday. Don't be late!", timestamp: "1:22 PM", status: "read", type: "text" },
  ],
  chat5: [
    { id: "m50", chatId: "chat5", senderId: "5", text: "The book club is reading a John le Carre novel next month", timestamp: "11:00 AM", status: "read", type: "text" },
    { id: "m51", chatId: "chat5", senderId: "me", text: "Oh wonderful, which one? I love his work", timestamp: "11:10 AM", status: "read", type: "text" },
    { id: "m52", chatId: "chat5", senderId: "5", text: "I picked up that mystery novel you recommended!", timestamp: "12:05 PM", status: "read", type: "text" },
  ],
  chat6: [
    { id: "m60", chatId: "chat6", senderId: "6", text: "Went to the antique fair this morning", timestamp: "Yesterday", status: "read", type: "text" },
    { id: "m61", chatId: "chat6", senderId: "me", text: "Find anything good?", timestamp: "Yesterday", status: "read", type: "text" },
    { id: "m62", chatId: "chat6", senderId: "6", text: "Found a mint condition vinyl at the flea market!", timestamp: "Yesterday", status: "read", type: "text" },
  ],
  chat7: [
    { id: "m70", chatId: "chat7", senderId: "7", text: "The grandkids loved the cookies we baked", timestamp: "Yesterday", status: "read", type: "text" },
  ],
  chat8: [
    { id: "m80", chatId: "chat8", senderId: "8", text: "Caught a 12-pounder at the lake this morning!", timestamp: "Monday", status: "read", type: "text" },
  ],
  chat9: [
    { id: "m90", chatId: "chat9", senderId: "9", text: "See you at choir practice Thursday!", timestamp: "Monday", status: "read", type: "text" },
  ],
  chat10: [
    { id: "m100", chatId: "chat10", senderId: "3", text: "What should we bring for brunch on Sunday?", timestamp: "1:00 PM", status: "read", type: "text" },
    { id: "m101", chatId: "chat10", senderId: "5", text: "I'll make my cinnamon rolls!", timestamp: "1:10 PM", status: "read", type: "text" },
    { id: "m102", chatId: "chat10", senderId: "me", text: "I can handle the eggs and bacon", timestamp: "1:30 PM", status: "read", type: "text" },
    { id: "m103", chatId: "chat10", senderId: "7", text: "I'll bring fresh orange juice from the farmers market", timestamp: "2:00 PM", status: "read", type: "text" },
    { id: "m104", chatId: "chat10", senderId: "1", text: "Linda: Don't forget the sunscreen!", timestamp: "2:30 PM", status: "read", type: "text" },
  ],
  chat11: [
    { id: "m110", chatId: "chat11", senderId: "2", text: "Swap meet at the fairgrounds next Saturday", timestamp: "10:00 AM", status: "read", type: "text" },
    { id: "m111", chatId: "chat11", senderId: "8", text: "I need a carburetor for the Chevy. I'll be there", timestamp: "10:15 AM", status: "read", type: "text" },
    { id: "m112", chatId: "chat11", senderId: "6", text: "The '67 Mustang parts just came in", timestamp: "11:45 AM", status: "read", type: "text" },
  ],
};

export const statuses: Status[] = [
  { id: "s1", contactId: "1", timestamp: "Today, 4:30 PM", viewed: false },
  { id: "s2", contactId: "3", timestamp: "Today, 2:15 PM", viewed: false },
  { id: "s3", contactId: "5", timestamp: "Today, 12:00 PM", viewed: true },
  { id: "s4", contactId: "7", timestamp: "Today, 10:30 AM", viewed: true },
  { id: "s5", contactId: "9", timestamp: "Yesterday, 9:00 PM", viewed: true },
];

export const calls: Call[] = [
  { id: "c1", contactId: "1", type: "video", direction: "incoming", timestamp: "Today, 5:00 PM", duration: "12:34" },
  { id: "c2", contactId: "2", type: "audio", direction: "outgoing", timestamp: "Today, 3:00 PM", duration: "5:21" },
  { id: "c3", contactId: "3", type: "video", direction: "missed", timestamp: "Today, 1:30 PM" },
  { id: "c4", contactId: "4", type: "audio", direction: "incoming", timestamp: "Yesterday, 8:00 PM", duration: "45:12" },
  { id: "c5", contactId: "5", type: "video", direction: "outgoing", timestamp: "Yesterday, 2:00 PM", duration: "8:45" },
  { id: "c6", contactId: "6", type: "audio", direction: "missed", timestamp: "Monday, 11:00 AM" },
  { id: "c7", contactId: "7", type: "audio", direction: "incoming", timestamp: "Monday, 9:30 AM", duration: "3:15" },
  { id: "c8", contactId: "1", type: "video", direction: "outgoing", timestamp: "Sunday, 7:00 PM", duration: "28:00" },
];

export function getContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

export const stories: Story[] = [
  {
    id: "story1",
    authorId: "1",
    authorName: "Margaret Thompson",
    authorAvatar: "https://images.unsplash.com/photo-1761414500568-1348275e08a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMGVsZWdhbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMxNTU2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "The Day My Grandson Taught Me to Fish",
    content: "I've been fishing for over 40 years, and I thought I knew everything there was to know. Then my 8-year-old grandson Tommy came along on our lake trip last weekend. He insisted on using a stick and some string instead of my fancy rod. I laughed at first. Two hours later, he'd caught three bluegill and I had nothing. He looked at me with those big eyes and said, 'Grandpa, you're thinking too hard. The fish can tell.' That boy reminded me why I fell in love with fishing in the first place. It was never about the gear. It was about the quiet and the patience.",
    coverImage: "https://images.unsplash.com/photo-1751840028712-c5d5bfc3683a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwbGFrZSUyMGNhbG0lMjBtb3JuaW5nJTIwb3V0ZG9vcnN8ZW58MXx8fHwxNzczMjExNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    timestamp: "2h ago",
    listenerCount: 847,
    replyCount: 23,
    category: "friends",
    voiceReplies: [
      { id: "vr1", storyId: "story1", senderId: "3", senderName: "Linda Carter", senderAvatar: "https://images.unsplash.com/photo-1764173039248-78beb636931a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBnYXJkZW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", duration: "0:42", timestamp: "1h ago", transcription: "Oh Margaret, that is just precious! My granddaughter did the same thing in my garden. Kids really do know best sometimes..." },
      { id: "vr2", storyId: "story1", senderId: "7", senderName: "Dorothy Miller", senderAvatar: "https://images.unsplash.com/photo-1641749631692-44ad83f07ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMHdvbWFuJTIwcmVhZGluZyUyMGdsYXNzZXMlMjBwb3J0cmFpdCUyMHdhcm18ZW58MXx8fHwxNzczMjExNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", duration: "0:28", timestamp: "45m ago", transcription: "That story made my day. You should frame that fishing photo of you two!" },
    ],
    groupChatId: "story-group-1",
  },
  {
    id: "story2",
    authorId: "3",
    authorName: "Linda Carter",
    authorAvatar: "https://images.unsplash.com/photo-1764173039248-78beb636931a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwd29tYW4lMjBnYXJkZW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "How My Garden Saved Me After Retirement",
    content: "When I retired two years ago after 35 years of teaching, I honestly didn't know what to do with myself. The silence of the house was deafening. My husband suggested I start a garden. I thought it was a silly idea. But that first spring, kneeling in the dirt with seeds in my hand, something clicked. Watching those first tomato sprouts push through the soil felt like a small miracle. Now I grow enough vegetables to share with half the neighborhood. The garden taught me that retirement isn't an ending. It's just a different kind of growing season.",
    coverImage: "https://images.unsplash.com/photo-1770982699106-7dfcce2c44d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBnYXJkZW4lMjBhbGxvdG1lbnQlMjBncm93aW5nfGVufDF8fHx8MTc3MzIxMTcyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    timestamp: "4h ago",
    listenerCount: 2341,
    replyCount: 89,
    category: "health",
    voiceReplies: [
      { id: "vr3", storyId: "story2", senderId: "4", senderName: "Frank Sullivan", senderAvatar: "https://images.unsplash.com/photo-1607975517837-c8e8ccf2dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVkJTIwbWFuJTIwb3V0ZG9vcnMlMjBoaWtpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", duration: "1:15", timestamp: "3h ago", transcription: "Linda, I can relate completely. Golf did the same for me after I left the firm. You need something to pour yourself into..." },
    ],
    groupChatId: "story-group-2",
  },
  {
    id: "story3",
    authorId: "6",
    authorName: "George Patterson",
    authorAvatar: "https://images.unsplash.com/photo-1444069069008-83a57aac43ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBnZW50bGVtYW4lMjBiZWFyZCUyMHBvcnRyYWl0JTIwZGlzdGluZ3Vpc2hlZHxlbnwxfHx8fDE3NzMyMTE3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Restoring a 1965 Ford Mustang From a Barn Find",
    content: "Last January, I got a call from a buddy who'd found a '65 Mustang fastback sitting in a barn in rural Virginia. It hadn't moved in 22 years. Mice had made a home in the back seat, the engine was seized, and rust had eaten through the floor pans. Everyone said I was crazy to take it on at my age. Eight months and a lot of skinned knuckles later, that car rolled out of my garage under its own power for the first time. The sound of that 289 V8 firing up is something I'll never forget. My wife says I talk about that car more than I talk about her. She's probably right.",
    coverImage: "https://images.unsplash.com/photo-1764015488424-e6beaa36333a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FyJTIwdmludGFnZSUyMGF1dG9tb2JpbGUlMjByZXN0b3JhdGlvbnxlbnwxfHx8fDE3NzMyMTE3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedUrl: "https://www.hagerty.com/restoration-tips",
    linkedTitle: "Hagerty: Classic Car Restoration Guide",
    timestamp: "6h ago",
    listenerCount: 5620,
    replyCount: 203,
    category: "news",
    voiceReplies: [],
  },
  {
    id: "story4",
    authorId: "stranger1",
    authorName: "Harold Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1607975517837-c8e8ccf2dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVkJTIwbWFuJTIwb3V0ZG9vcnMlMjBoaWtpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMyMTE3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "My Mother's Sunday Gravy Recipe Almost Died With Her",
    content: "My mother passed away last autumn, and we almost lost her legendary Sunday gravy recipe forever. She never wrote anything down. It was all in her hands, her intuition, the way she'd stir the pot and just know when it was ready. In her final weeks, I sat beside her bed with a notebook as she talked me through every step. Her voice was soft but her memory was sharp. 'The secret is the pork neck bones,' she said. 'You can't rush a good sauce.' I've made it a dozen times now. It's not quite the same, but every Sunday when that pot starts simmering, she's right there in the kitchen with me.",
    coverImage: "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBraXRjaGVuJTIwZ3JvdXB8ZW58MXx8fHwxNzczMTc3MTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    timestamp: "8h ago",
    listenerCount: 12450,
    replyCount: 478,
    category: "recipes",
    voiceReplies: [
      { id: "vr4", storyId: "story4", senderId: "stranger2", senderName: "Earl Montgomery", senderAvatar: "https://images.unsplash.com/photo-1609741200119-b292937ea2eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMG1hbiUyMGdsYXNzZXMlMjBkaXN0aW5ndWlzaGVkJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMjExNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", duration: "0:55", timestamp: "7h ago", transcription: "This hit me hard, Harold. My father had the same thing with his barbecue brisket recipe. I wish I'd written it down sooner." },
    ],
  },
  {
    id: "story5",
    authorId: "7",
    authorName: "Dorothy Miller",
    authorAvatar: "https://images.unsplash.com/photo-1641749631692-44ad83f07ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGRlciUyMHdvbWFuJTIwcmVhZGluZyUyMGdsYXNzZXMlMjBwb3J0cmFpdCUyMHdhcm18ZW58MXx8fHwxNzczMjExNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "The Jazz Record That Changed Everything",
    content: "I was 18 years old when I first heard Miles Davis play 'Kind of Blue' on my father's turntable. The needle hit the groove and the whole world went quiet. I sat on the living room floor for the full 46 minutes without moving. That album taught me that silence can be just as powerful as sound. I've been collecting vinyl records ever since. Nearly 3,000 now. My children think I'm crazy. But every evening, I pour a glass of whiskey, drop a needle, and for a little while, I'm 18 again sitting on that living room floor.",
    coverImage: "https://images.unsplash.com/photo-1764015488424-e6beaa36333a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FyJTIwdmludGFnZSUyMGF1dG9tb2JpbGUlMjByZXN0b3JhdGlvbnxlbnwxfHx8fDE3NzMyMTE3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    linkedUrl: "https://www.allmusic.com/kind-of-blue",
    linkedTitle: "AllMusic: Kind of Blue - Miles Davis",
    timestamp: "12h ago",
    listenerCount: 3890,
    replyCount: 156,
    category: "entertainment",
    voiceReplies: [],
  },
  {
    id: "story6",
    authorId: "stranger3",
    authorName: "Walter Price",
    authorAvatar: "https://images.unsplash.com/photo-1731335150363-0dcd7db3b908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRpcmVkJTIwY291cGxlJTIwbWF0dXJlJTIwbWFuJTIwcG9ydHJhaXQlMjBjYXN1YWx8ZW58MXx8fHwxNzczMjExNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Walking 10,000 Steps a Day at 72 Changed My Life",
    content: "My doctor told me I needed to move more or I'd be in a wheelchair by 75. So I started walking. Just around the block at first, huffing and puffing like an old steam engine. But I kept at it. Rain or shine, every single day. After six months, I was doing 10,000 steps without thinking about it. My blood pressure dropped, my knees stopped aching, and I lost 30 pounds. But the real change was in my head. The morning walks became my thinking time. I solved problems, made peace with old grudges, and finally figured out what I want to do with however many years I have left. All it took was putting one foot in front of the other.",
    coverImage: "https://images.unsplash.com/photo-1758798458635-f01402b40919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZml0bmVzcyUyMGV4ZXJjaXNlJTIwZ3JvdXB8ZW58MXx8fHwxNzczMjA2NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    timestamp: "1d ago",
    listenerCount: 28900,
    replyCount: 1204,
    category: "health",
    voiceReplies: [],
  },
  {
    id: "story7",
    authorId: "5",
    authorName: "Susan Chen",
    authorAvatar: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBBc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczMjExNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "The Book That Got Passed Around Our Club 47 Times",
    content: "I started our neighborhood book club fifteen years ago with just three people and a battered copy of 'To Kill a Mockingbird.' That same copy has now been read by 47 different people. Each reader leaves a little note inside the back cover. Some are just a sentence. Some are whole letters. One person wrote about how the book helped them through a divorce. Another wrote about reading it to their dying father. That dog-eared paperback with its cracked spine holds more human truth in its margins than most libraries. We're still passing it around. And every time it comes back to me, there's a new story inside the story.",
    coverImage: "https://images.unsplash.com/photo-1660805334468-1e8bf5f7621c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY2x1YiUyMHJlYWRpbmclMjBsaWJyYXJ5fGVufDF8fHx8MTc3MzIwNjQ1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    timestamp: "1d ago",
    listenerCount: 1560,
    replyCount: 67,
    category: "friends",
    voiceReplies: [],
  },
];
