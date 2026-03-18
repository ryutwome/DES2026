import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Contact, Chat, Message, Status, Call } from "./mockData";
import {
  generateAllData,
  generateReply,
  type GeneratedData,
} from "./geminiService";
import * as fallback from "./mockData";

interface AppState {
  currentUser: Contact;
  contacts: Contact[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  statuses: Status[];
  calls: Call[];
  personalities: Record<string, string>; // contactId -> personality
  isLoading: boolean;
  error: string | null;
  apiKey: string;
  isAiMode: boolean;
  getContact: (id: string) => Contact | undefined;
  setApiKey: (key: string) => void;
  generateData: (key?: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => void;
  replyInProgress: Record<string, boolean>;
}

const API_KEY_STORAGE = "whatsapp_gemini_key";
const DEFAULT_API_KEY = "AIzaSyC0lif0Uu2fa7KBJelGtW-tZZ81WiENWtg";

const defaultState: AppState = {
  currentUser: fallback.currentUser,
  contacts: fallback.contacts,
  chats: fallback.chats,
  messages: fallback.messages,
  statuses: fallback.statuses,
  calls: fallback.calls,
  personalities: {},
  isLoading: false,
  error: null,
  apiKey: DEFAULT_API_KEY,
  isAiMode: false,
  getContact: (id: string) => fallback.contacts.find((c) => c.id === id),
  setApiKey: () => {},
  generateData: async () => {},
  sendMessage: () => {},
  replyInProgress: {},
};

const AppContext = createContext<AppState>(defaultState);

export function useAppData() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(API_KEY_STORAGE) || DEFAULT_API_KEY);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyInProgress, setReplyInProgress] = useState<Record<string, boolean>>({});

  // Data state - starts with fallback mock data
  const [currentUser, setCurrentUser] = useState<Contact>(fallback.currentUser);
  const [contacts, setContacts] = useState<Contact[]>(fallback.contacts);
  const [chats, setChats] = useState<Chat[]>(fallback.chats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(fallback.messages);
  const [statuses, setStatuses] = useState<Status[]>(fallback.statuses);
  const [calls, setCalls] = useState<Call[]>(fallback.calls);
  const [personalities, setPersonalities] = useState<Record<string, string>>({});

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  }, []);

  const getContact = useCallback(
    (id: string) => contacts.find((c) => c.id === id),
    [contacts]
  );

  const generateData = useCallback(async (keyOverride?: string) => {
    const key = keyOverride || apiKey;
    if (!key) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateAllData(key);
      setCurrentUser(data.currentUser);
      setContacts(data.contacts);
      setChats(data.chats);
      setMessages(data.messages);
      setStatuses(data.statuses);
      setCalls(data.calls);
      setIsAiMode(true);

      // Store personalities from the raw generation for reply context
      // We'll use the contact's "about" as a proxy personality
      const p: Record<string, string> = {};
      data.contacts.forEach((c) => {
        p[c.id] = c.about;
      });
      setPersonalities(p);
    } catch (err: any) {
      setError(err.message || "Failed to generate data");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const sendMessage = useCallback(
    (chatId: string, text: string) => {
      const newMsg: Message = {
        id: `m-${Date.now()}`,
        chatId,
        senderId: "me",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        status: "sent",
        type: "text",
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMsg],
      }));

      // Update chat's last message
      setChats((prev) =>
        prev.map((ch) =>
          ch.id === chatId
            ? { ...ch, lastMessage: text.slice(0, 60), lastMessageTime: newMsg.timestamp }
            : ch
        )
      );

      // If AI mode, get AI reply
      if (isAiMode && apiKey) {
        const chat = chats.find((c) => c.id === chatId);
        if (!chat || chat.isGroup) return;

        const contact = contacts.find((c) => c.id === chat.contactId);
        if (!contact) return;

        // Show typing indicator
        setChats((prev) =>
          prev.map((ch) => (ch.id === chatId ? { ...ch, typing: true } : ch))
        );
        setReplyInProgress((prev) => ({ ...prev, [chatId]: true }));

        // Delay to simulate typing
        const delay = 1500 + Math.random() * 2000;
        setTimeout(async () => {
          try {
            const allMsgs = [...(messages[chatId] || []), newMsg];
            const reply = await generateReply(
              apiKey,
              contact,
              personalities[contact.id] || contact.about,
              allMsgs,
              contacts
            );

            const replyMsg: Message = {
              id: `m-${Date.now()}-reply`,
              chatId,
              senderId: contact.id,
              text: reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
              status: "read",
              type: "text",
            };

            setMessages((prev) => ({
              ...prev,
              [chatId]: [...(prev[chatId] || []), replyMsg],
            }));

            setChats((prev) =>
              prev.map((ch) =>
                ch.id === chatId
                  ? { ...ch, typing: false, lastMessage: reply.slice(0, 60), lastMessageTime: replyMsg.timestamp }
                  : ch
              )
            );
          } catch (e) {
            console.error("AI reply failed:", e);
            setChats((prev) =>
              prev.map((ch) => (ch.id === chatId ? { ...ch, typing: false } : ch))
            );
          } finally {
            setReplyInProgress((prev) => ({ ...prev, [chatId]: false }));
          }
        }, delay);
      }
    },
    [apiKey, isAiMode, chats, contacts, messages, personalities]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        contacts,
        chats,
        messages,
        statuses,
        calls,
        personalities,
        isLoading,
        error,
        apiKey,
        isAiMode,
        getContact,
        setApiKey,
        generateData,
        sendMessage,
        replyInProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}