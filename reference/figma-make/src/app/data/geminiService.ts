import type { Contact, Chat, Message, Status, Call } from "./mockData";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzczMDgxMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsfGVufDF8fHx8MTc3MzA3MzE1NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1768508948256-8724339ab704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwd29tYW4lMjBwcm9mZXNzaW9uYWwlMjBwaG90b3xlbnwxfHx8fDE3NzMxNzc0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1627397370714-e19ace8b3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBiZWFyZCUyMHBvcnRyYWl0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzMwNTg2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1646198008289-41e33db7a209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGdsYXNzZXMlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzMwNzA5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1543132220-7bc04a0e790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdWl0JTIwcG9ydHJhaXQlMjBidXNpbmVzc3xlbnwxfHx8fDE3NzMxNzc0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1632147893081-c034e57f76d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGN1cmx5JTIwaGFpciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzE0MzY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1667063160344-58a0f325715a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjYXN1YWwlMjBwb3J0cmFpdCUyMHVyYmFufGVufDF8fHx8MTc3MzE3NzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1757347398206-7425300ef990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG91dGRvb3IlMjBwb3J0cmFpdCUyMG5hdHVyYWx8ZW58MXx8fHwxNzczMTc3NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const SELF_AVATAR =
  "https://images.unsplash.com/photo-1628619488063-fdbe60bc376d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHNtaWxpbmclMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzMxNDM2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

export interface GeneratedData {
  currentUser: Contact;
  contacts: Contact[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  statuses: Status[];
  calls: Call[];
}

const GENERATION_PROMPT = `You are a creative writer generating fictional WhatsApp chat data. Generate UNIQUE, diverse characters with distinct personalities and realistic conversations.

Generate exactly 9 fictional contacts and their chat conversations. Each contact must have a strong, distinct personality that shows in their messages.

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "contacts": [
    {
      "id": "1",
      "name": "Full Name",
      "about": "WhatsApp about status (with emoji)",
      "phone": "+1 (555) XXX-XXXX",
      "online": true/false,
      "lastSeen": "Today at X:XX PM" (only if offline),
      "personality": "Brief personality description for context"
    }
  ],
  "chats": [
    {
      "id": "chat1",
      "contactId": "1",
      "isGroup": false,
      "groupName": null,
      "groupMembers": null,
      "pinned": false,
      "muted": false,
      "typing": false,
      "unreadCount": 0
    }
  ],
  "conversations": {
    "chat1": [
      { "senderId": "1" or "me", "text": "message text", "minutesAgo": 45 }
    ]
  }
}

RULES:
- Make 9 contacts with ids "1" through "9"
- Make 11 chats: 9 individual (chat1-chat9) + 2 group chats (chat10, chat11)
- Group chats need: isGroup=true, groupName (creative with emoji), groupMembers (array of 3-4 contact ids)
- Each conversation should have 4-10 messages, alternating between "me" and the contact
- Make 2 chats pinned, 2 chats muted, 1 chat with typing=true
- Give 4 chats unread counts (1-12)
- Messages should reflect each person's unique personality, slang, emoji usage, and interests
- Include a variety: some techy, some artsy, some sporty, some chill, different ages/backgrounds
- minutesAgo: the number of minutes ago the message was sent (0=now, 60=1hr ago, etc)
- Conversations should feel natural and mid-flow, not start with "hi"
- Use casual language, abbreviations, emojis naturally
- Make at least one conversation about making plans, one about sharing something exciting, one about work/school
- 3-4 contacts should be online=true, rest offline with varying lastSeen times`;

async function callGemini(apiKey: string, prompt: string, systemPrompt?: string): Promise<string> {
  const contents: any[] = [];

  if (systemPrompt) {
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({ role: "model", parts: [{ text: "Understood. I'll follow these instructions." }] });
  }

  contents.push({ role: "user", parts: [{ text: prompt }] });

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function buildTimestamp(minutesAgo: number): string {
  const now = new Date();
  const time = new Date(now.getTime() - minutesAgo * 60000);

  if (minutesAgo < 24 * 60) {
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (minutesAgo < 48 * 60) {
    return "Yesterday";
  }
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[time.getDay()];
}

export async function generateAllData(apiKey: string): Promise<GeneratedData> {
  const raw = await callGemini(apiKey, GENERATION_PROMPT);

  let parsed: any;
  try {
    // Try to extract JSON from potential markdown fences
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : raw.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response:", raw);
    throw new Error("Failed to parse AI response. Please try again.");
  }

  // Build contacts with avatars
  const contacts: Contact[] = (parsed.contacts || []).map((c: any, i: number) => ({
    id: c.id || String(i + 1),
    name: c.name,
    avatar: AVATAR_URLS[i % AVATAR_URLS.length],
    about: c.about || "Hey there! I am using WhatsApp.",
    phone: c.phone || `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(1000 + i * 111).slice(0, 4)}`,
    online: !!c.online,
    lastSeen: c.lastSeen,
  }));

  const getContactById = (id: string) => contacts.find((c) => c.id === id);

  // Build chats
  const chats: Chat[] = (parsed.chats || []).map((ch: any) => {
    const convMessages = parsed.conversations?.[ch.id] || [];
    const lastMsg = convMessages[convMessages.length - 1];
    const lastMinutesAgo = lastMsg?.minutesAgo ?? 60;

    return {
      id: ch.id,
      contactId: ch.isGroup ? (ch.groupMembers?.[0] || "1") : ch.contactId,
      lastMessage: lastMsg?.text?.slice(0, 60) || "...",
      lastMessageTime: buildTimestamp(lastMinutesAgo),
      unreadCount: ch.unreadCount || 0,
      pinned: !!ch.pinned,
      muted: !!ch.muted,
      typing: !!ch.typing,
      isGroup: !!ch.isGroup,
      groupName: ch.groupName || undefined,
      groupMembers: ch.groupMembers || undefined,
    };
  });

  // Build messages
  const messages: Record<string, Message[]> = {};
  for (const chatId of Object.keys(parsed.conversations || {})) {
    const conv = parsed.conversations[chatId];
    messages[chatId] = (conv || []).map((m: any, i: number) => ({
      id: `${chatId}-m${i}`,
      chatId,
      senderId: m.senderId,
      text: m.text,
      timestamp: buildTimestamp(m.minutesAgo ?? 60 - i * 5),
      status: m.senderId === "me" ? (i === conv.length - 1 ? "delivered" : "read") : "read",
      type: "text" as const,
    }));
  }

  // Build statuses from first 5 contacts
  const statuses: Status[] = contacts.slice(0, 5).map((c, i) => ({
    id: `s${i + 1}`,
    contactId: c.id,
    timestamp: i < 2 ? `Today, ${12 - i}:${30 - i * 15} PM` : `Yesterday, ${9 - i}:00 PM`,
    viewed: i >= 2,
  }));

  // Build calls
  const callTypes: Array<{ type: "audio" | "video"; direction: "incoming" | "outgoing" | "missed" }> = [
    { type: "video", direction: "incoming" },
    { type: "audio", direction: "outgoing" },
    { type: "video", direction: "missed" },
    { type: "audio", direction: "incoming" },
    { type: "video", direction: "outgoing" },
    { type: "audio", direction: "missed" },
    { type: "audio", direction: "incoming" },
    { type: "video", direction: "outgoing" },
  ];

  const calls: Call[] = contacts.slice(0, 8).map((c, i) => ({
    id: `c${i + 1}`,
    contactId: c.id,
    type: callTypes[i].type,
    direction: callTypes[i].direction,
    timestamp: i < 3 ? `Today, ${5 - i}:00 PM` : i < 5 ? `Yesterday, ${9 - i}:00 PM` : `Monday, ${11 - i}:00 AM`,
    duration: callTypes[i].direction !== "missed" ? `${Math.floor(Math.random() * 45 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` : undefined,
  }));

  const currentUser: Contact = {
    id: "me",
    name: "You",
    avatar: SELF_AVATAR,
    about: "Hey there! I am using WhatsApp.",
    phone: "+1 (555) 000-0000",
    online: true,
  };

  return { currentUser, contacts, chats, messages, statuses, calls };
}

export async function generateReply(
  apiKey: string,
  contact: Contact,
  personality: string,
  recentMessages: Message[],
  contacts: Contact[]
): Promise<string> {
  const history = recentMessages
    .slice(-8)
    .map((m) => {
      const name = m.senderId === "me" ? "You" : (contacts.find((c) => c.id === m.senderId)?.name || "Unknown");
      return `${name}: ${m.text}`;
    })
    .join("\n");

  const prompt = `You are ${contact.name}. Your personality: ${personality}

Recent chat:
${history}

Reply as ${contact.name} in 1-2 short sentences. Stay in character. Use their texting style, slang, and emoji patterns naturally. Just return the message text, nothing else.`;

  const reply = await callGemini(apiKey, prompt);
  // Clean up any quotes the model might add
  return reply.replace(/^["']|["']$/g, "").trim();
}