import { useState, useEffect } from "react";
import {
  Search,
  Camera,
  MoreVertical,
  MessageCircle,
  BookOpen,
  Users,
  Phone as PhoneIcon,
  Radio,
  Loader2,
} from "lucide-react";
import { MobileFrame } from "./MobileFrame";
import { ChatsTab } from "./ChatsTab";
import { StoriesTab } from "./StoriesTab";
import { CommunitiesTab } from "./CommunitiesTab";
import { CallsTab } from "./CallsTab";
import { RadioTab } from "./RadioTab";
import { SettingsTab } from "./SettingsTab";
import { ChatScreen } from "./ChatScreen";
import { ApiKeyScreen } from "./ApiKeyScreen";
import { AppProvider, useAppData } from "../data/AppContext";
import type { Chat } from "../data/mockData";

type Tab = "chats" | "stories" | "radio" | "communities" | "calls";

function WhatsAppMobileInner() {
  const { getContact, isLoading, isAiMode, generateData, apiKey } = useAppData();
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAiSetup, setShowAiSetup] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(() => localStorage.getItem("whatsapp_skipped") === "true");

  useEffect(() => {
    const handler = () => {
      setHasSkipped(true);
      setShowAiSetup(false);
      localStorage.setItem("whatsapp_skipped", "true");
    };
    window.addEventListener("skip-ai-setup", handler);
    return () => window.removeEventListener("skip-ai-setup", handler);
  }, []);

  const shouldShowSetup = showAiSetup || (!hasSkipped && !isAiMode);
  const activeContact = activeChat ? getContact(activeChat.contactId) : null;

  if (isLoading) {
    return (
      <MobileFrame>
        <div className="flex flex-col h-full bg-[#008069] items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <div className="text-white text-[18px] mb-1" style={{ fontWeight: 500 }}>Generating AI Chatters</div>
          <div className="text-white/70 text-[14px] text-center px-8">
            Creating unique personas and conversations...
          </div>
        </div>
      </MobileFrame>
    );
  }

  if (shouldShowSetup) {
    return (
      <MobileFrame>
        <ApiKeyScreen />
      </MobileFrame>
    );
  }

  if (activeChat && activeContact) {
    return (
      <MobileFrame>
        <ChatScreen chat={activeChat} contact={activeContact} onBack={() => setActiveChat(null)} />
      </MobileFrame>
    );
  }

  if (showSettings) {
    return (
      <MobileFrame>
        <div className="flex flex-col h-full">
          <div className="bg-[#008069] px-4 py-[12px] flex items-center gap-6">
            <button onClick={() => setShowSettings(false)} className="text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-white text-[19px]" style={{ fontWeight: 500 }}>Settings</span>
          </div>
          <SettingsTab
            onOpenAiSetup={() => {
              setShowSettings(false);
              setShowAiSetup(true);
            }}
          />
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex flex-col h-full">
        <div className="bg-[#008069] px-4 pb-0 pt-[2px]">
          <div className="flex items-center justify-between py-[8px]">
            <span className="text-white text-[22px]" style={{ fontWeight: 600, letterSpacing: "0.2px" }}>
              WhatsApp
            </span>
            <div className="flex items-center gap-2">
              <button className="p-[6px] text-white">
                <Camera className="w-[22px] h-[22px]" />
              </button>
              <button className="p-[6px] text-white">
                <Search className="w-[22px] h-[22px]" />
              </button>
              <button className="p-[6px] text-white" onClick={() => setShowSettings(true)}>
                <MoreVertical className="w-[22px] h-[22px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "chats" && <ChatsTab onSelectChat={(chat) => setActiveChat(chat)} />}
          {activeTab === "stories" && <StoriesTab />}
          {activeTab === "communities" && <CommunitiesTab />}
          {activeTab === "calls" && <CallsTab />}
          {activeTab === "radio" && <RadioTab />}
        </div>

        <div className="bg-white border-t border-[#e9edef] flex items-center justify-around py-[4px] shrink-0 pb-[6px]">
          {([
            { tab: "chats" as Tab, icon: MessageCircle, label: "Chats", badge: 23 },
            { tab: "stories" as Tab, icon: BookOpen, label: "Stories", badge: 0 },
            { tab: "radio" as Tab, icon: Radio, label: "Radio", badge: 0 },
            { tab: "communities" as Tab, icon: Users, label: "Communities", badge: 0 },
            { tab: "calls" as Tab, icon: PhoneIcon, label: "Calls", badge: 0 },
          ]).map(({ tab, icon: Icon, label, badge }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex flex-col items-center pt-[6px] pb-[2px] px-1 min-w-0 flex-1 transition-colors"
            >
              <div className="relative">
                <div className={`px-3 py-[2px] rounded-full ${activeTab === tab ? "bg-[#d8fdd2]" : ""}`}>
                  <Icon
                    className="w-[24px] h-[24px]"
                    style={{ color: activeTab === tab ? "#008069" : "#54656f" }}
                    strokeWidth={1.8}
                  />
                </div>
                {badge > 0 && tab === "chats" && (
                  <span className="absolute -top-[2px] right-[6px] min-w-[18px] h-[18px] rounded-full bg-[#25D366] text-white text-[11px] flex items-center justify-center px-[4px]">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className="text-[11px] mt-[1px]"
                style={{
                  fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? "#008069" : "#54656f",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}

// Export with provider wrapper built-in so it works regardless of parent context
export function WhatsAppMobile() {
  return (
    <AppProvider>
      <WhatsAppMobileInner />
    </AppProvider>
  );
}