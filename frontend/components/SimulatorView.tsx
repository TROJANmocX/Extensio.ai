"use client";

import { motion } from "framer-motion";
import { Monitor } from "lucide-react";
import Simulator from "./Simulator";

interface SimulatorViewProps {
  files: Record<string, string>;
  prompt: string;
}

export default function SimulatorView({ files, prompt }: SimulatorViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full min-h-[calc(100vh-64px)] flex flex-col pt-10 px-6 pb-6 mx-auto max-w-7xl"
    >
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display text-[#f5f5f5] tracking-wide uppercase mb-2">Live Simulator</h1>
          <p className="text-sm text-[#8b8b8b]">A sandboxed environment running your generated extension locally.</p>
        </div>
        
        {Object.keys(files).length === 0 && (
          <div className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-[#ef4444] text-xs font-bold uppercase tracking-wider">
            No Extension Loaded
          </div>
        )}
      </div>

      <div className="flex-1 w-full rounded-2xl overflow-hidden border border-[#1f1f1f] shadow-2xl bg-[#0a0a0a]">
        <Simulator files={files} isLoading={false} prompt={prompt} />
      </div>
    </motion.div>
  );
}
