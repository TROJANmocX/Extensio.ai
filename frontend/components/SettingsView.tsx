"use client";

import { useState, useEffect } from "react";
import { Key, ExternalLink, Check, Trash2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsView() {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing key from localStorage
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto flex flex-col pt-10 px-6 pb-20"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display text-[#f5f5f5] tracking-wide uppercase mb-2">Platform Settings</h1>
        <p className="text-sm text-[#8b8b8b]">Configure your API connections and developer preferences.</p>
      </div>

      <div className="card p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-[#1f1f1f] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#b7ff4a]/10 border border-[#b7ff4a]/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-[#b7ff4a]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#f5f5f5]">Google Gemini API Key</h2>
            <p className="text-xs text-[#8b8b8b]">Required to synthesize live extensions. Your key is stored locally in your browser.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-[#f5f5f5] flex justify-between items-center">
            <span>API Key</span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs flex items-center gap-1 text-[#b7ff4a] hover:underline"
            >
              Get a free key <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-[#f5f5f5] placeholder:text-[#555555] focus:border-[#b7ff4a]/50 outline-none transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="btn-lime flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved Locally
              </>
            ) : (
              "Save API Key"
            )}
          </button>
          
          {apiKey && (
            <button 
              onClick={handleClear}
              className="btn-ghost flex items-center gap-2 text-[#ef4444] hover:border-[#ef4444] hover:text-[#ef4444]"
            >
              <Trash2 className="w-4 h-4" />
              Clear Key
            </button>
          )}
        </div>

        <div className="mt-4 p-4 bg-[#ffb020]/10 border border-[#ffb020]/20 rounded-xl flex gap-3 text-sm text-[#ffb020]">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Privacy Notice</p>
            <p className="text-xs text-[#ffb020]/80 mt-1">
              Extensio.ai does not store your API key on our servers. It is securely saved in your browser's local storage and only transmitted to the generation backend during active synthesis requests.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
