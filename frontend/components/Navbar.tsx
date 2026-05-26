"use client";

import { motion } from "framer-motion";
import { Cpu, Layers } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface NavbarProps {
  onDashboardClick: () => void;
  isDashboardActive: boolean;
}

export default function Navbar({ onDashboardClick, isDashboardActive }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.location.reload()}
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <Cpu className="w-4.5 h-4.5 text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-white/60 bg-clip-text text-transparent">
            Extensio<span className="text-violet-400">.ai</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <GithubIcon className="w-4 h-4" /> Docs
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-gray-400 hover:text-white transition-colors"
            id="nav_github_btn"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <button
            onClick={onDashboardClick}
            className={`relative group px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 overflow-hidden cursor-pointer ${
              isDashboardActive
                ? "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                : "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            }`}
            id="nav_dashboard_toggle"
          >
            {isDashboardActive ? (
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Back to Landing
              </span>
            ) : (
              "Launch Workspace"
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
