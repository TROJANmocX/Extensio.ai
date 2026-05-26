"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles, Terminal, ShieldAlert } from "lucide-react";

interface HeroProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  { text: "Hide YouTube comments automatically", category: "Utility" },
  { text: "Block visual banner ads on all websites", category: "Privacy" },
  { text: "Inject a floating cyberpunk notes widget", category: "Developer" },
  { text: "Track daily hydration in popup checklist", category: "Health" }
];

export default function Hero({ onGenerate, isLoading }: HeroProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center">
      {/* Background Glows */}
      <div className="purple-orb top-[-10%] left-[20%]" />
      <div className="blue-orb bottom-[-10%] right-[20%]" />

      <div className="max-w-4xl w-full text-center flex flex-col items-center z-10">
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" /> Manifest V3 Compatible
        </motion.div>

        {/* Headings */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 font-display"
        >
          Synthesize Chrome Extensions{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent block md:inline">
            Using AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mb-12 leading-relaxed"
        >
          Describe your extension idea in plain English. Our engine writes secure JavaScript, constructs HTML popups, builds robust Manifest V3 packages, and delivers a downloadable ZIP.
        </motion.p>

        {/* Prompt Input Form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-3xl glass-panel p-2 rounded-2xl border border-white/10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.8)] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Create a Chrome extension that hides YouTube comments and puts a beautiful clean dark layout..."'
              rows={4}
              id="prompt_input_textarea"
              disabled={isLoading}
              className="w-full p-4 bg-transparent text-gray-200 placeholder-gray-500 text-sm md:text-base border-none focus:outline-none focus:ring-0 resize-none font-mono"
            />
            
            <div className="flex items-center justify-between border-t border-white/5 pt-2 px-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Terminal className="w-3.5 h-3.5 text-violet-400/70" />
                <span>Format: Manifest V3 Zip Output</span>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                id="generate_btn"
                className={`relative px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                  isLoading || !prompt.trim()
                    ? "bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] active:scale-95"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isLoading ? "Synthesizing..." : "Generate Extension"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Preset Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 w-full max-w-3xl"
        >
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-4">Try these presets</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sample.text)}
                disabled={isLoading}
                id={`preset_pill_${idx}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-panel border border-white/5 text-gray-400 hover:text-white hover:border-violet-500/40 transition-all duration-300 cursor-pointer"
              >
                <span className="text-[10px] text-violet-400 font-semibold mr-1.5 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/15">
                  {sample.category}
                </span>
                {sample.text}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
