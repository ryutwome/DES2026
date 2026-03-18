import {
  Key,
  Lock,
  Bell,
  Globe,
  HelpCircle,
  Heart,
  User,
  MessageSquare,
  CircleDot,
  Database,
  Sparkles,
} from "lucide-react";
import { useAppData } from "../data/AppContext";

interface SettingsTabProps {
  onOpenAiSetup?: () => void;
}

const settingsSections = [
  { icon: Key, label: "Account", desc: "Security notifications, change number", color: "#008069" },
  { icon: Lock, label: "Privacy", desc: "Block contacts, disappearing messages", color: "#008069" },
  { icon: User, label: "Avatar", desc: "Create, edit, profile photo", color: "#008069" },
  { icon: MessageSquare, label: "Chats", desc: "Theme, wallpapers, chat history", color: "#008069" },
  { icon: Bell, label: "Notifications", desc: "Message, group & call tones", color: "#008069" },
  { icon: Database, label: "Storage and data", desc: "Network usage, auto-download", color: "#008069" },
  { icon: Globe, label: "App language", desc: "English (device's language)", color: "#008069" },
  { icon: HelpCircle, label: "Help", desc: "Help center, contact us, privacy policy", color: "#008069" },
  { icon: Heart, label: "Invite a friend", desc: "", color: "#e74060" },
];

export function SettingsTab({ onOpenAiSetup }: SettingsTabProps) {
  const { currentUser, isAiMode } = useAppData();

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Profile card */}
      <div className="flex items-center px-4 py-[18px] active:bg-[#f5f6f6]">
        <img src={currentUser.avatar} alt="Profile" className="w-[65px] h-[65px] rounded-full object-cover" />
        <div className="ml-[16px] flex-1">
          <div className="text-[#111b21] text-[19px]" style={{ fontWeight: 400 }}>{currentUser.name}</div>
          <div className="text-[#667781] text-[14px]">{currentUser.about}</div>
        </div>
        <div className="flex items-center gap-5">
          <CircleDot className="w-[22px] h-[22px] text-[#008069]" />
        </div>
      </div>

      <div className="h-[1px] bg-[#e9edef] mx-4" />

      {/* AI Generator option */}
      {onOpenAiSetup && (
        <>
          <button
            onClick={onOpenAiSetup}
            className="flex items-center px-4 py-[15px] active:bg-[#f5f6f6] w-full text-left"
          >
            <Sparkles className="w-[22px] h-[22px] shrink-0 text-[#25D366]" />
            <div className="ml-[22px] flex-1">
              <div className="text-[#111b21] text-[16px]">AI Chat Generator</div>
              <div className="text-[#667781] text-[13.5px]">
                {isAiMode ? "✅ Active — Tap to regenerate" : "Generate AI personas & conversations"}
              </div>
            </div>
          </button>
          <div className="h-[1px] bg-[#e9edef] mx-4" />
        </>
      )}

      {/* Settings list */}
      <div className="py-2">
        {settingsSections.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center px-4 py-[15px] active:bg-[#f5f6f6]">
              <Icon className="w-[22px] h-[22px] shrink-0" style={{ color: item.color }} />
              <div className="ml-[22px] flex-1">
                <div className="text-[#111b21] text-[16px]">{item.label}</div>
                {item.desc && <div className="text-[#667781] text-[13.5px]">{item.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta logo footer */}
      <div className="flex flex-col items-center py-6 text-[#667781] text-[12.5px]">
        <span>from</span>
        <span className="text-[#667781] text-[14px]" style={{ fontWeight: 500, letterSpacing: "2px" }}>Meta</span>
      </div>
    </div>
  );
}
