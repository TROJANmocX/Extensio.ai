"use client";

import { Cpu, Search, User, ChevronDown, Wand2 } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#000000]/80 backdrop-blur-md border-b border-[#1f1f1f] flex items-center justify-between px-6 pl-24">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-center">
          <Cpu className="w-4 h-4 text-[#b7ff4a]" />
        </div>
        <span className="font-display text-2xl tracking-wide text-white translate-y-[2px]">
          EXTENSIO.AI
        </span>
      </div>

      {/* Center - Workspace & Search */}
      <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
        <button className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#f5f5f5] bg-[#121212] border border-[#1f1f1f] px-4 py-1.5 rounded-lg transition-colors">
          <span>Personal Workspace</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className="relative group">
          <Search className="w-4 h-4 text-[#555555] absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#8b8b8b] transition-colors" />
          <input
            type="text"
            placeholder="Search commands..."
            className="w-64 bg-[#121212] border border-[#1f1f1f] rounded-lg pl-9 pr-4 py-1.5 text-sm text-[#f5f5f5] placeholder:text-[#555555] focus:outline-none focus:border-[#b7ff4a]/50 transition-colors"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        <button className="btn-lime flex items-center gap-1.5 shadow-[0_0_20px_rgba(183,255,74,0.15)]">
          <Wand2 className="w-4 h-4" />
          <span>Generate</span>
        </button>
        <button className="w-9 h-9 rounded-full bg-[#121212] border border-[#1f1f1f] flex items-center justify-center hover:border-[#8b8b8b] transition-colors">
          <User className="w-4 h-4 text-[#8b8b8b]" />
        </button>
      </div>
    </header>
  );
}
