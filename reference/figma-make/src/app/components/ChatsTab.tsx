import { CheckCheck, ImageIcon, Volume2, Pin, MessageCirclePlus } from "lucide-react";
import { useAppData } from "../data/AppContext";
import type { Chat } from "../data/mockData";

interface ChatsTabProps {
  onSelectChat: (chat: Chat) => void;
}

export function ChatsTab({ onSelectChat }: ChatsTabProps) {
  const { chats, getContact } = useAppData();

  const sortedChats = [...chats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-2 bg-white">
        <span className="px-3 py-[5px] rounded-full text-[13px] bg-[#e7fce3] text-[#008069]">All</span>
        <span className="px-3 py-[5px] rounded-full text-[13px] bg-[#f0f2f5] text-[#54656f]">Unread</span>
        <span className="px-3 py-[5px] rounded-full text-[13px] bg-[#f0f2f5] text-[#54656f]">Favorites</span>
        <span className="px-3 py-[5px] rounded-full text-[13px] bg-[#f0f2f5] text-[#54656f]">Groups</span>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto bg-white">
        {sortedChats.map((chat) => {
          const contact = getContact(chat.contactId);
          if (!contact) return null;
          const displayName = chat.isGroup ? chat.groupName : contact.name;

          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="flex items-center px-4 py-[6px] active:bg-[#f0f2f5] cursor-pointer"
            >
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  src={contact.avatar}
                  alt={displayName}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="ml-[13px] flex-1 min-w-0 border-b border-[#e9edef] py-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#111b21] text-[16.5px] truncate" style={{ fontWeight: 400 }}>
                    {displayName}
                  </span>
                  <span className={`text-[12px] shrink-0 ml-2 ${chat.unreadCount > 0 ? "text-[#25D366]" : "text-[#667781]"}`}>
                    {chat.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-[2px]">
                  <div className="flex items-center flex-1 min-w-0">
                    {chat.typing ? (
                      <span className="text-[#25D366] text-[14px]">typing...</span>
                    ) : (
                      <>
                        {!chat.isGroup && chat.lastMessage !== "Photo" && (
                          <CheckCheck className="w-[18px] h-[18px] text-[#53bdeb] mr-[3px] shrink-0" />
                        )}
                        {chat.lastMessage === "Photo" && (
                          <ImageIcon className="w-[16px] h-[16px] text-[#667781] mr-1 shrink-0" />
                        )}
                        <span className="text-[#667781] text-[14px] truncate">{chat.lastMessage}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-[6px] ml-2 shrink-0">
                    {chat.muted && <Volume2 className="w-[15px] h-[15px] text-[#8696a0]" />}
                    {chat.pinned && <Pin className="w-[15px] h-[15px] text-[#8696a0] rotate-45" />}
                    {chat.unreadCount > 0 && (
                      <span className={`min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] text-white px-[5px] ${chat.muted ? "bg-[#8696a0]" : "bg-[#25D366]"}`}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg active:bg-[#1da851]">
        <MessageCirclePlus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
