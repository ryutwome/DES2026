import { Plus, Pencil } from "lucide-react";
import { useAppData } from "../data/AppContext";

export function UpdatesTab() {
  const { statuses, getContact, currentUser } = useAppData();
  const recentStatuses = statuses.filter((s) => !s.viewed);
  const viewedStatuses = statuses.filter((s) => s.viewed);

  return (
    <div className="flex-1 overflow-y-auto bg-white relative">
      {/* Status section */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[#111b21] text-[16px]" style={{ fontWeight: 500 }}>Status</span>
      </div>

      {/* My status */}
      <div className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6]">
        <div className="relative">
          <img src={currentUser.avatar} alt="My status" className="w-[52px] h-[52px] rounded-full object-cover" />
          <div className="absolute -bottom-[2px] -right-[2px] w-[22px] h-[22px] bg-[#25D366] rounded-full flex items-center justify-center border-2 border-white">
            <Plus className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="ml-[14px] flex-1">
          <div className="text-[#111b21] text-[16px]" style={{ fontWeight: 400 }}>My Status</div>
          <div className="text-[#667781] text-[13.5px]">Tap to add status update</div>
        </div>
      </div>

      {/* Recent updates */}
      {recentStatuses.length > 0 && (
        <>
          <div className="px-4 pt-4 pb-1">
            <span className="text-[#667781] text-[13.5px]" style={{ fontWeight: 500 }}>RECENT UPDATES</span>
          </div>
          {recentStatuses.map((status) => {
            const contact = getContact(status.contactId);
            if (!contact) return null;
            return (
              <div key={status.id} className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6]">
                <div className="p-[2px] rounded-full" style={{ background: "conic-gradient(#25D366 0deg, #25D366 360deg)" }}>
                  <div className="p-[2px] rounded-full bg-white">
                    <img src={contact.avatar} alt={contact.name} className="w-[48px] h-[48px] rounded-full object-cover" />
                  </div>
                </div>
                <div className="ml-[14px] flex-1">
                  <div className="text-[#111b21] text-[16px]">{contact.name}</div>
                  <div className="text-[#667781] text-[13.5px]">{status.timestamp}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Viewed updates */}
      {viewedStatuses.length > 0 && (
        <>
          <div className="px-4 pt-4 pb-1">
            <span className="text-[#667781] text-[13.5px]" style={{ fontWeight: 500 }}>VIEWED UPDATES</span>
          </div>
          {viewedStatuses.map((status) => {
            const contact = getContact(status.contactId);
            if (!contact) return null;
            return (
              <div key={status.id} className="flex items-center px-4 py-[10px] active:bg-[#f5f6f6]">
                <div className="p-[2px] rounded-full" style={{ border: "2.5px solid #8696a0" }}>
                  <img src={contact.avatar} alt={contact.name} className="w-[48px] h-[48px] rounded-full object-cover" />
                </div>
                <div className="ml-[14px] flex-1">
                  <div className="text-[#111b21] text-[16px]">{contact.name}</div>
                  <div className="text-[#667781] text-[13.5px]">{status.timestamp}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Channels section */}
      <div className="mt-2 border-t border-[#e9edef]">
        <div className="px-4 pt-4 pb-2">
          <span className="text-[#111b21] text-[16px]" style={{ fontWeight: 500 }}>Channels</span>
        </div>
        <div className="px-4 py-3 text-[#667781] text-[14px]">
          Stay updated on topics that matter to you. Find channels to follow below.
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <div className="flex flex-col items-center p-3 border border-[#e9edef] rounded-2xl w-[105px]">
            <div className="w-[52px] h-[52px] rounded-full bg-[#25D366] flex items-center justify-center mb-2">
              <span className="text-white text-[20px]">📰</span>
            </div>
            <span className="text-[#111b21] text-[13px] text-center">News</span>
            <button className="mt-2 text-[#008069] text-[12.5px] border border-[#008069] rounded-full px-3 py-1">Follow</button>
          </div>
          <div className="flex flex-col items-center p-3 border border-[#e9edef] rounded-2xl w-[105px]">
            <div className="w-[52px] h-[52px] rounded-full bg-[#667781] flex items-center justify-center mb-2">
              <span className="text-white text-[20px]">⚽</span>
            </div>
            <span className="text-[#111b21] text-[13px] text-center">Sports</span>
            <button className="mt-2 text-[#008069] text-[12.5px] border border-[#008069] rounded-full px-3 py-1">Follow</button>
          </div>
          <div className="flex flex-col items-center p-3 border border-[#e9edef] rounded-2xl w-[105px]">
            <div className="w-[52px] h-[52px] rounded-full bg-[#e8a23a] flex items-center justify-center mb-2">
              <span className="text-white text-[20px]">🎬</span>
            </div>
            <span className="text-[#111b21] text-[13px] text-center">Movies</span>
            <button className="mt-2 text-[#008069] text-[12.5px] border border-[#008069] rounded-full px-3 py-1">Follow</button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="absolute bottom-5 right-4 w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
        <Pencil className="w-[22px] h-[22px] text-white" />
      </button>
    </div>
  );
}
