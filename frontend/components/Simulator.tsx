"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCw, Globe, Play, User, MessageSquare, ShieldAlert, Cpu } from "lucide-react";

interface SimulatorProps {
  files: Record<string, string>;
  isLoading: boolean;
  prompt: string;
}

export default function Simulator({ files, isLoading, prompt }: SimulatorProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [simulatedPreset, setSimulatedPreset] = useState<"youtube" | "adblock" | "custom">("youtube");
  
  // Simulated webpage states
  const [commentsHidden, setCommentsHidden] = useState(true);
  const [adsBlocked, setAdsBlocked] = useState(true);
  const [blockedCount, setBlockedCount] = useState(142);
  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [customMsg, setCustomMsg] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Identify which preset page to display inside the mock browser based on prompt/files content
  useEffect(() => {
    const p = prompt.toLowerCase();
    const manifestStr = files["manifest.json"] || "";
    
    if (p.includes("youtube") || p.includes("comment") || manifestStr.includes("youtube")) {
      setSimulatedPreset("youtube");
      setCurrentUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      setCommentsHidden(true); // Default matching manifest storage
    } else if (p.includes("ad") || p.includes("block") || manifestStr.includes("adblock")) {
      setSimulatedPreset("adblock");
      setCurrentUrl("https://www.tech-news.org/articles/ai-trends");
      setAdsBlocked(true);
    } else {
      setSimulatedPreset("custom");
      setCurrentUrl("https://extensio-sandboxed-testing.dev");
    }
  }, [files, prompt]);

  // Handle messages sent from the popup iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      
      const { type, action, hide, enabled, data } = event.data;

      // Handle raw simulated actions sent via mock chrome messaging
      if (type === "EXTENSION_MSG") {
        if (action === "toggleComments") {
          setCommentsHidden(hide !== false);
        }
        if (action === "adBlockToggle") {
          setAdsBlocked(enabled !== false);
        }
        if (action === "changeTheme") {
          if (data && data.color) setThemeColor(data.color);
        }
      }

      // Handle storage changes directly
      if (type === "STORAGE_CHANGE" && data) {
        if (data.hasOwnProperty("hideComments")) {
          setCommentsHidden(data.hideComments);
        }
        if (data.hasOwnProperty("adBlockEnabled")) {
          setAdsBlocked(data.adBlockEnabled);
        }
        if (data.hasOwnProperty("commentsHidden")) {
          setCommentsHidden(data.commentsHidden);
        }
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  // Assemble the iframe content dynamically. Injecting mock chrome APIs!
  const getPopupSrcDoc = () => {
    const html = files["popup.html"] || "<h3>Popup preview unavailable</h3>";
    const css = files["styles.css"] || "";
    const js = files["popup.js"] || "";

    // We build a container document that binds global chrome.* triggers so that the popup scripts function natively!
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            ${css}
            /* Override scrollbars inside popup for clean view */
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
          </style>
        </head>
        <body>
          ${html}
          
          <script>
            // Mock Chrome Extensions APIs
            window.mockStorage = {
              hideComments: ${commentsHidden},
              adBlockEnabled: ${adsBlocked}
            };

            window.chrome = {
              runtime: {
                sendMessage: (msg) => {
                  window.parent.postMessage({ type: "EXTENSION_MSG", ...msg }, "*");
                },
                onMessage: {
                  addListener: () => {}
                }
              },
              storage: {
                local: {
                  set: (obj, cb) => {
                    window.mockStorage = { ...window.mockStorage, ...obj };
                    window.parent.postMessage({ type: "STORAGE_CHANGE", data: window.mockStorage }, "*");
                    if (cb) cb();
                  },
                  get: (keys, cb) => {
                    if (typeof keys === 'string') {
                      cb({ [keys]: window.mockStorage[keys] });
                    } else if (Array.isArray(keys)) {
                      const res = {};
                      keys.forEach(k => res[k] = window.mockStorage[k]);
                      cb(res);
                    } else {
                      cb(window.mockStorage);
                    }
                  }
                }
              },
              tabs: {
                query: (info, cb) => {
                  cb([{ id: 1234, active: true }]);
                },
                sendMessage: (tabId, msg) => {
                  window.parent.postMessage({ type: "EXTENSION_MSG", ...msg }, "*");
                }
              }
            };

            // Capture custom triggers or clicks in popup and pass it up
            document.addEventListener('click', (e) => {
              const target = e.target;
              if (target && target.tagName === 'BUTTON') {
                window.parent.postMessage({ 
                  type: "EXTENSION_MSG", 
                  action: "customClick", 
                  text: target.innerText || target.id 
                }, "*");
              }
            });

            // Execute popup JS safely
            try {
              ${js}
            } catch (err) {
              console.error("Error in generated extension popup JS:", err);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel rounded-2xl border border-white/8 overflow-hidden bg-[#0a071d]/60 relative min-h-[480px]">
      
      {/* 1. Chrome Mock Browser Titlebar */}
      <div className="bg-[#120f2b] px-4 py-2 flex items-center gap-3 border-b border-white/5 shrink-0">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>

        {/* Back / Forward Controls */}
        <div className="flex gap-2 text-gray-500">
          <ArrowLeft className="w-3.5 h-3.5" />
          <ArrowRight className="w-3.5 h-3.5" />
          <RotateCw className="w-3.5 h-3.5" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 bg-black/40 rounded-md border border-white/5 px-3 py-1 flex items-center gap-1.5 text-[11px] text-gray-400 select-none">
          <Globe className="w-3 h-3 text-gray-500" />
          <span className="truncate">{currentUrl}</span>
        </div>

        {/* Toolbar Extension Action Item */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            id="toolbar_extension_icon"
            className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
              isPopupOpen 
                ? "bg-violet-600/30 border border-violet-500 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                : "text-gray-400 hover:bg-white/5 border border-transparent hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping" />
          </button>

          {/* 2. Chrome Extension Dropdown Iframe Panel */}
          <AnimatePresence>
            {isPopupOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-7 w-[270px] bg-[#0d0e15] border border-white/10 rounded-xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-50 p-0"
              >
                <div className="bg-[#181922] px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                  <span>SANDBOX PREVIEW</span>
                  <span className="text-violet-400">popup.html</span>
                </div>
                <iframe
                  ref={iframeRef}
                  title="Extension Popup Simulator"
                  srcDoc={getPopupSrcDoc()}
                  className="w-full border-none"
                  style={{ height: simulatedPreset === "adblock" ? "170px" : "210px" }}
                  sandbox="allow-scripts"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Mock Simulated Tab Page Content */}
      <div className="flex-1 overflow-y-auto relative bg-[#04020a] select-none p-4">
        
        {/* Presets Rendering */}
        {simulatedPreset === "youtube" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 font-sans">
            {/* Mock Player */}
            <div className="w-full aspect-video rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <span className="text-xs text-red-500 font-semibold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> LIVE STREAMING
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Lofi Beats for Coding / AI Synthesizing 💫</h4>
              </div>
              <Play className="w-12 h-12 text-white/50 group-hover:text-white/80 transition-all duration-300" />
            </div>

            {/* Video Meta Info */}
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <h2 className="text-xs font-bold text-gray-200">Lofi Coding Station</h2>
                <p className="text-[10px] text-gray-500">14K Watching Now &bull; Lofi Records</p>
              </div>
              <button className="px-3 py-1 bg-white text-black font-semibold rounded-full text-[10px]">Subscribe</button>
            </div>

            {/* Simulated Dynamic Comments Area */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-400" /> Comments
                </span>
                <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {commentsHidden ? "Shield Active: Hidden" : "Visible"}
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {commentsHidden ? (
                  <motion.div
                    key="shield"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full py-10 rounded-xl border border-dashed border-violet-500/20 bg-violet-950/5 flex flex-col items-center justify-center text-center gap-2"
                  >
                    <ShieldAlert className="w-8 h-8 text-violet-400/80 animate-pulse" />
                    <div>
                      <p className="text-[11px] font-bold text-violet-300">Comments Shielded</p>
                      <p className="text-[9px] text-gray-500 max-w-xs mt-1">Your synthesized extension content.js swept the DOM comments container.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="comments"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2.5"
                  >
                    {[
                      { user: "dev_alex", comment: "Wow, coding chrome extensions using this AI is so cool!" },
                      { user: "crypto_guy", comment: "Is there a token for Extensio.ai? Buying now!" },
                      { user: "antigravity", comment: "This live simulator is absolutely perfect." }
                    ].map((c, i) => (
                      <div key={i} className="flex gap-2 p-2 rounded-lg bg-white/3 border border-white/5 items-start">
                        <div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-[9px] font-bold">
                          <User className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-violet-400">{c.user}</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">{c.comment}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {simulatedPreset === "adblock" && (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 font-sans text-xs">
            {/* Tech News Title */}
            <div className="py-2 border-b border-white/5 flex justify-between items-center">
              <span className="font-extrabold tracking-widest text-[9px] uppercase text-emerald-400">TECHNEWS DAILY</span>
              <span className="text-[9px] text-gray-500">May 26, 2026</span>
            </div>

            {/* Ads blocked indicator card */}
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Ad Shield Status
              </span>
              <span className="text-gray-400 font-mono">
                {adsBlocked ? `Active: Swept ${blockedCount} trackers` : "Suspended"}
              </span>
            </div>

            {/* Mock Article Content */}
            <h1 className="text-sm font-bold text-gray-200">The Rise of Generative Extensions APIs</h1>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Google Chrome's transition to Manifest V3 mandates strict script parsing...
            </p>

            {/* Simulated Banner Ads */}
            <AnimatePresence mode="popLayout">
              {!adsBlocked && (
                <motion.div
                  key="ad-banners"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full flex flex-col gap-2 overflow-hidden"
                >
                  <div className="w-full py-8 bg-red-950/20 border border-red-500/20 rounded-xl flex flex-col items-center justify-center text-center gap-1 shadow-inner relative animate-shake">
                    <span className="absolute top-1.5 right-2 text-[8px] bg-red-500/20 text-red-400 px-1 py-0.2 rounded border border-red-500/20">SPONSORED AD</span>
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <p className="text-[10px] font-bold text-red-400">Win Free Cruise Trips Instantly!!!</p>
                    <p className="text-[8px] text-gray-500">Click to collect your reward tokens!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Our generators analyze permissions, sanitize standard inputs, and bundle scripts without manual scripts configuration...
            </p>
          </div>
        )}

        {simulatedPreset === "custom" && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center gap-4 py-8">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-200">Custom Extension Testing Node</h3>
              <p className="text-[10px] text-gray-500 max-w-sm mt-1 leading-relaxed">
                Click the extension icon in the mock browser toolbar to display your generated popup popup.html.
              </p>
            </div>

            {/* Event logger display */}
            <div className="w-full max-w-sm bg-black/60 border border-white/5 rounded-xl p-3 text-left font-mono text-[9px] text-gray-400 min-h-24">
              <p className="text-violet-400 border-b border-white/5 pb-1 mb-2 font-bold flex justify-between items-center">
                <span>SIMULATOR CONSOLE LOGS</span>
                <span className="text-[8px] bg-violet-500/10 text-violet-400 px-1 py-0.2 rounded border border-violet-500/20">ACTIVE</span>
              </p>
              <p className="text-gray-500">&gt; Extension simulator listening on channels...</p>
              <p className="text-emerald-400 mt-1">&gt; Loaded manifest.json version 3 successfully</p>
              
              {commentsHidden && simulatedPreset === "youtube" && (
                <p className="text-violet-400 mt-1">&gt; [Event] commentsShield toggled: hide comments</p>
              )}
              {adsBlocked && simulatedPreset === "adblock" && (
                <p className="text-emerald-400 mt-1">&gt; [Event] adBlockEnabled toggled: block active banners</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
