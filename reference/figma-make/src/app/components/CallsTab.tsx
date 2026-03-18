import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus } from "lucide-react";
import { useAppData } from "../data/AppContext";

export function CallsTab() {
  const { calls, getContact } = useAppData();

  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      {/* Favorites */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[#667781] text-[13.5px]" style={{ fontWeight: 500 }}>FAVORITES</span>
      </div>
      <div className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6]">
        <div className="w-[45px] h-[45px] rounded-full bg-[#25D366] flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div className="ml-[14px]">
          <div className="text-[#111b21] text-[16px]">Add favorite</div>
        </div>
      </div>

      {/* Recent */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[#667781] text-[13.5px]" style={{ fontWeight: 500 }}>RECENT</span>
      </div>

      {calls.map((call) => {
        const contact = getContact(call.contactId);
        if (!contact) return null;
        const isMissed = call.direction === "missed";

        return (
          <div key={call.id} className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6]">
            <img src={contact.avatar} alt={contact.name} className="w-[45px] h-[45px] rounded-full object-cover" />
            <div className="ml-[14px] flex-1">
              <div className={`text-[16px] ${isMissed ? "text-[#dc3545]" : "text-[#111b21]"}`}>
                {contact.name}
              </div>
              <div className="flex items-center gap-[4px] text-[13.5px] text-[#667781]">
                {call.direction === "incoming" && <PhoneIncoming className="w-[14px] h-[14px] text-[#25D366]" />}
                {call.direction === "outgoing" && <PhoneOutgoing className="w-[14px] h-[14px] text-[#25D366]" />}
                {call.direction === "missed" && <PhoneMissed className="w-[14px] h-[14px] text-[#dc3545]" />}
                <span>{call.timestamp}</span>
              </div>
            </div>
            <button className="p-2 text-[#25D366]">
              {call.type === "video" ? <Video className="w-[22px] h-[22px]" /> : <Phone className="w-[22px] h-[22px]" />}
            </button>
          </div>
        );
      })}

      {/* FAB */}
      <button className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
        <Phone className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
