"use client";

import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";

interface DashboardHeroProps {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: (p: string) => void;
  isLoading: boolean;
}

export default function DashboardHero({
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
}: DashboardHeroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <section className="w-full flex flex-col items-center text-center pt-8 pb-12">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="font-display text-5xl md:text-7xl tracking-wide text-[#f5f5f5] mb-4 uppercase"
      >
        Build Chrome Extensions with <span className="text-[#b7ff4a]">AI</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[#8b8b8b] text-base md:text-lg max-w-2xl mb-8"
      >
        Describe your idea and instantly generate production ready Chrome extensions.
      </motion.p>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-3xl card p-2 relative group flex flex-col"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Create a Chrome extension that blocks YouTube Shorts."
          rows={3}
          disabled={isLoading}
          className="w-full p-4 bg-transparent text-[#f5f5f5] placeholder:text-[#555555] border-none focus:outline-none focus:ring-0 resize-none font-sans text-base"
        />
        <div className="flex justify-end pt-2 border-t border-[#1f1f1f] px-2 pb-1">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`btn-lime flex items-center gap-2 ${isLoading || !prompt.trim() ? "opacity-50" : "glow-lime"}`}
          >
            <Wand2 className="w-4 h-4" />
            {isLoading ? "Synthesizing..." : "Generate Extension"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}
