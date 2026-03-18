import { useState } from "react";
import { Sparkles, Key, ArrowRight, Loader2 } from "lucide-react";
import { useAppData } from "../data/AppContext";

export function ApiKeyScreen() {
  const { apiKey, setApiKey, generateData, isLoading, error } = useAppData();
  const [inputKey, setInputKey] = useState(apiKey);

  const handleGenerate = async () => {
    if (!inputKey.trim()) return;
    const key = inputKey.trim();
    setApiKey(key);
    await generateData(key);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#008069] px-4 py-[14px]">
        <span className="text-white text-[19px]" style={{ fontWeight: 500 }}>
          AI Chat Generator
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-10">
        {/* Icon */}
        <div className="w-[80px] h-[80px] rounded-full bg-[#e7fce3] flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-[#25D366]" />
        </div>

        <h2 className="text-[#111b21] text-[20px] text-center mb-2" style={{ fontWeight: 500 }}>
          Generate AI Chatters
        </h2>
        <p className="text-[#667781] text-[14px] text-center mb-8" style={{ lineHeight: "20px" }}>
          Enter your Gemini API key to generate unique AI personas with distinct personalities and realistic conversations. Powered by Gemma 3.
        </p>

        {/* API Key input */}
        <div className="w-full mb-4">
          <label className="text-[#667781] text-[13px] mb-1 block">Gemini API Key</label>
          <div className="flex items-center border border-[#e9edef] rounded-xl px-3 py-[10px] focus-within:border-[#25D366] transition-colors">
            <Key className="w-[18px] h-[18px] text-[#8696a0] mr-2 shrink-0" />
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              placeholder="AIzaSy..."
              className="flex-1 text-[15px] text-[#111b21] outline-none bg-transparent placeholder:text-[#8696a0]"
            />
          </div>
          <p className="text-[#8696a0] text-[11.5px] mt-1">
            Free tier works! Get one at{" "}
            <span className="text-[#008069]">aistudio.google.com</span>
          </p>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-[13px]">{error}</p>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!inputKey.trim() || isLoading}
          className="w-full bg-[#25D366] text-white py-[12px] rounded-full text-[16px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:bg-[#1da851] mb-4"
          style={{ fontWeight: 500 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating personas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Chatters
            </>
          )}
        </button>

        {/* Skip option */}
        <button
          onClick={() => {
            // Just skip and use fallback data
            window.dispatchEvent(new CustomEvent("skip-ai-setup"));
          }}
          className="text-[#008069] text-[14px] flex items-center gap-1"
          style={{ fontWeight: 500 }}
        >
          Skip, use demo data
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-[#8696a0] text-[11.5px]" style={{ lineHeight: "16px" }}>
          Your API key is stored locally in your browser and never sent anywhere except Google's Gemini API.
        </p>
      </div>
    </div>
  );
}