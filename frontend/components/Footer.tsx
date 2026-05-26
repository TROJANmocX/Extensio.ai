"use client";

import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#02000c] py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            Extensio<span className="text-violet-400">.ai</span>
          </span>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Extensio.ai. All rights reserved. Enforcing Manifest V3 compliance.
        </p>

        {/* Links */}
        <div className="flex gap-6 text-xs text-gray-500">
          <a href="#features" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
          <a href="#pricing" className="hover:text-violet-400 transition-colors">Terms of Service</a>
          <a href="#features" className="hover:text-violet-400 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
}
