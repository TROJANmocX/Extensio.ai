"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HardDriveDownload, RefreshCw, Cpu, Code2, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Manifest V3 Security",
    desc: "Enforces eval-free code block compilations, declarative routing, and strict CSP validation checks."
  },
  {
    icon: HardDriveDownload,
    title: "Instant ZIP Bundle",
    desc: "Compresses manifest configs, styles, and background service worker files on the fly for fast local unpacking."
  },
  {
    icon: RefreshCw,
    title: "AI Editing Iterations",
    desc: "Refine extension logic in real-time. Simply supply follow-up prompts, and watch the system update elements."
  },
  {
    icon: Code2,
    title: "Live Code Workspace",
    desc: "Explore generated file trees, preview syntactically formatted scripts, and track active modifications."
  },
  {
    icon: Cpu,
    title: "Chrome Iframe Sandbox",
    desc: "Renders visual mock browsers that parsepopup layouts and register tab communications in real-time."
  },
  {
    icon: Sparkles,
    title: "Canvas Icon Generator",
    desc: "Automatically manufactures beautiful canvas-drawn placeholders for packaging files cleanly."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 w-full max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-display">
          Engineered for <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Seamless Creation</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Extensio.ai bridges the gap between your ideas and Google Chrome store guidelines automatically.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {FEATURES.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/25 group-hover:text-white transition-all duration-300">
                <IconComp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-200 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
