import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="h-screen w-screen bg-[#111b21] flex items-center justify-center">
      {/* Phone frame */}
      <div className="relative w-[390px] h-[844px] bg-white rounded-[50px] shadow-2xl overflow-hidden border-[10px] border-[#1a1a1a]">
        {/* Status bar */}
        <div className="h-[54px] bg-[#008069] flex items-end justify-between px-8 pb-1 pt-3">
          <span className="text-white text-[15px]" style={{ fontWeight: 600 }}>9:41</span>
          <div className="flex items-center gap-[5px]">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
              <path d="M1 8.5h2.5v3H1zM5 6h2.5v5.5H5zM9 3.5h2.5V12H9zM13 1h2.5v10.5H13z" opacity="0.9"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <path d="M8 2.4C5.6 2.4 3.4 3.3 1.8 4.8L0 3C2 1.1 4.9 0 8 0s6 1.1 8 3l-1.8 1.8C12.6 3.3 10.4 2.4 8 2.4zM8 7.2c-1.5 0-2.8.6-3.8 1.5L2.4 6.9C3.8 5.6 5.8 4.8 8 4.8s4.2.8 5.6 2.1l-1.8 1.8C10.8 7.8 9.5 7.2 8 7.2zM8 12l-2.4-2.4C6.2 9 7.1 8.6 8 8.6s1.8.4 2.4 1L8 12z"/>
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="white" strokeOpacity="0.35"/>
              <rect x="2" y="2" width="18" height="9" rx="1.5" fill="white"/>
              <path d="M24 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* App content */}
        <div className="h-[calc(100%-54px)] flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
