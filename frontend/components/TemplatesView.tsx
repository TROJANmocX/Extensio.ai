"use client";

import { motion } from "framer-motion";
import { LayoutGrid, ShieldX, Moon, VideoOff, Timer, Camera, PenTool } from "lucide-react";

interface TemplatesViewProps {
  onSelectTemplate: (prompt: string) => void;
}

export default function TemplatesView({ onSelectTemplate }: TemplatesViewProps) {
  
  const templates = [
    {
      title: "Ad Blocker",
      icon: ShieldX,
      color: "text-[#ef4444]",
      bg: "bg-[#ef4444]/10",
      desc: "Automatically removes ad banners and tracking scripts from modern websites using declarativeNetRequest.",
      prompt: "Create a Chrome extension that blocks common ad networks and hides elements with class names like 'ad-banner' or 'sponsored'."
    },
    {
      title: "Dark Mode",
      icon: Moon,
      color: "text-[#a78bfa]",
      bg: "bg-[#a78bfa]/10",
      desc: "Injects CSS to invert colors and enforce a beautiful dark mode across all web pages.",
      prompt: "Create a Chrome extension that injects CSS to turn any website into dark mode by intelligently inverting background colors and text."
    },
    {
      title: "YouTube Cleaner",
      icon: VideoOff,
      color: "text-[#ffb020]",
      bg: "bg-[#ffb020]/10",
      desc: "Hides comments, suggested videos, and shorts to provide a distraction-free viewing experience.",
      prompt: "Create a Chrome extension for YouTube that hides the comments section, removes suggested videos on the side, and hides YouTube Shorts."
    },
    {
      title: "Productivity Timer",
      icon: Timer,
      color: "text-[#10b981]",
      bg: "bg-[#10b981]/10",
      desc: "A sleek Pomodoro timer in the popup that blocks distracting websites when active.",
      prompt: "Create a Chrome extension with a popup Pomodoro timer. When the timer is active, it blocks access to twitter.com and facebook.com."
    },
    {
      title: "Screenshot Tool",
      icon: Camera,
      color: "text-[#3b82f6]",
      bg: "bg-[#3b82f6]/10",
      desc: "Captures the visible tab area and downloads the image to the user's computer instantly.",
      prompt: "Create a Chrome extension that takes a screenshot of the current visible tab and prompts the user to download it as a PNG."
    },
    {
      title: "Notes Extension",
      icon: PenTool,
      color: "text-[#b7ff4a]",
      bg: "bg-[#b7ff4a]/10",
      desc: "A minimal scratchpad in your browser popup to jot down quick notes that persist via storage.",
      prompt: "Create a Chrome extension with a popup that serves as a minimal notepad. It should save notes to chrome.storage.local automatically as I type."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto flex flex-col pt-10 px-6 pb-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-[#8b8b8b]" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#f5f5f5] tracking-wide uppercase mb-1">Templates</h1>
          <p className="text-sm text-[#8b8b8b]">Kickstart your build with pre-configured extension blueprints.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, i) => {
          const Icon = tpl.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectTemplate(tpl.prompt)}
              className="card p-6 flex flex-col items-start gap-4 hover:border-[#555555] transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl ${tpl.bg} flex items-center justify-center ${tpl.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#f5f5f5] mb-2 text-lg">{tpl.title}</h3>
                <p className="text-xs text-[#8b8b8b] leading-relaxed">{tpl.desc}</p>
              </div>
              <div className="mt-auto pt-4 w-full text-right">
                <span className="text-[10px] font-bold text-[#f5f5f5] uppercase tracking-wider group-hover:text-[#b7ff4a] transition-colors">
                  Generate Now &rarr;
                </span>
              </div>
            </button>
          )
        })}
      </div>

    </motion.div>
  );
}
