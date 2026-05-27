"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PlaceholderViewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  id: string;
}

export default function PlaceholderView({ title, description, icon: Icon, id }: PlaceholderViewProps) {
  return (
    <motion.div 
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-[#121212] border border-[#1f1f1f] flex items-center justify-center mb-6 shadow-2xl relative">
        <Icon className="w-10 h-10 text-[#8b8b8b]" />
        <div className="absolute -top-2 -right-2 bg-[#b7ff4a] text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(183,255,74,0.4)]">
          SOON
        </div>
      </div>
      
      <h1 className="text-3xl font-display text-[#f5f5f5] tracking-wide uppercase mb-3">{title}</h1>
      <p className="text-[#8b8b8b] max-w-md text-sm leading-relaxed">
        {description}
      </p>
      
      <button className="mt-8 px-6 py-2 rounded-full border border-[#1f1f1f] text-[#8b8b8b] text-sm hover:text-[#f5f5f5] hover:border-[#555555] transition-all bg-[#0a0a0a]">
        Notify Me
      </button>
    </motion.div>
  );
}
