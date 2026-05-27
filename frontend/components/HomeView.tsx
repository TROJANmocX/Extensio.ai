"use client";

import { motion } from "framer-motion";
import { Zap, Activity, Clock, FolderOpen, Wand2 } from "lucide-react";

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto flex flex-col pt-10 px-6 pb-20"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display text-[#f5f5f5] tracking-wide uppercase mb-2">Welcome Back, Developer</h1>
        <p className="text-sm text-[#8b8b8b]">Here's your Extensio AI workspace overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Quick Action */}
        <button 
          onClick={() => onNavigate("generate")}
          className="card p-6 flex flex-col items-start gap-4 hover:border-[#b7ff4a]/50 hover:bg-[#b7ff4a]/5 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#b7ff4a]/10 flex items-center justify-center text-[#b7ff4a] group-hover:scale-110 transition-transform">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#f5f5f5] mb-1 text-lg">Generate Extension</h3>
            <p className="text-xs text-[#8b8b8b]">Jump into the AI editor and synthesize a new Chrome extension.</p>
          </div>
        </button>

        {/* Quick Action */}
        <button 
          onClick={() => onNavigate("projects")}
          className="card p-6 flex flex-col items-start gap-4 hover:border-[#ffb020]/50 hover:bg-[#ffb020]/5 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#ffb020]/10 flex items-center justify-center text-[#ffb020] group-hover:scale-110 transition-transform">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#f5f5f5] mb-1 text-lg">My Projects</h3>
            <p className="text-xs text-[#8b8b8b]">Browse your saved extensions and version history.</p>
          </div>
        </button>

        {/* Stats Card */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#8b8b8b] mb-4">
            <Activity className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs font-bold uppercase tracking-wider">Usage Stats</span>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-display text-[#f5f5f5]">14</span>
              <span className="text-sm text-[#8b8b8b] mb-1">generations</span>
            </div>
            <p className="text-[10px] text-[#555555]">This month</p>
          </div>
          <div className="w-full bg-[#121212] h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#3b82f6] w-[45%] h-full rounded-full" />
          </div>
        </div>

      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 text-[#8b8b8b] border-b border-[#1f1f1f] pb-4 mb-4">
          <Clock className="w-4 h-4 text-[#f5f5f5]" />
          <span className="text-sm font-bold uppercase tracking-wider text-[#f5f5f5]">Recent AI Activity</span>
        </div>
        
        <div className="flex flex-col gap-3">
          {[
            { name: "YouTube Cleaner v2", time: "2 hours ago", status: "Compiled" },
            { name: "Minimal Pomodoro Timer", time: "Yesterday", status: "Modified" },
            { name: "Dark Mode Injector", time: "3 days ago", status: "Compiled" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#b7ff4a]" />
                <span className="text-sm font-semibold text-[#f5f5f5]">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase font-bold text-[#555555] bg-[#121212] px-2 py-0.5 rounded border border-[#1f1f1f]">{item.status}</span>
                <span className="text-xs text-[#8b8b8b] w-20 text-right">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
