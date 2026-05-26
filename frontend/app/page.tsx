"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Workspace from "@/components/Workspace";
import Simulator from "@/components/Simulator";

const API_BASE = "http://localhost:5000";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export default function Home() {
  const [viewState, setViewState] = useState<"landing" | "workspace">("landing");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<ValidationResult | undefined>(undefined);
  
  // Loading & logs state
  const [isLoading, setIsLoading] = useState(false);
  const [loadLogs, setLoadLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // High-fidelity terminal logging hook
  const triggerLoadingLogs = async (stages: string[]) => {
    setLoadLogs([]);
    for (let i = 0; i < stages.length; i++) {
      setLoadLogs(prev => [...prev, `> ${stages[i]}`]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  // 1. Generation trigger
  const handleGenerate = async (submittedPrompt: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setPrompt(submittedPrompt);

    const stages = [
      "Booting Extensio AI synthesis model...",
      "Connecting to Google Gemini API (1.5 Flash)...",
      "Analyzing layout requirements and inject behaviors...",
      "Drafting secure Manifest V3 specifications...",
      "Compiling content.js DOM query listeners...",
      "Structuring popup.html markup layout and styles.css...",
      "Running Manifest compliance validation audits...",
      "Synthesis complete! Preparing live code workspace..."
    ];

    // Trigger log animations in parallel
    const logsPromise = triggerLoadingLogs(stages);

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: submittedPrompt })
      });

      if (!res.ok) {
        throw new Error(`Failed to compile (HTTP ${res.status})`);
      }

      const data = await res.json();
      
      // Await logging animations to finish so the developer experience is premium!
      await logsPromise;

      if (data.success && data.files) {
        setFiles(data.files);
        setValidation(data.validation);
        setViewState("workspace");
      } else {
        throw new Error(data.error || "Unknown compilation failure.");
      }

    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message || "An unexpected error occurred during extension synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Continuous Modification trigger
  const handleModify = async (editRequest: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const stages = [
      "Scanning current extension directory workspace...",
      "Comparing files differences and layout revisions...",
      "Contacting AI model to integrate edits...",
      "Re-compiling scripts and layouts safely...",
      "Executing Manifest V3 validation audit sweeps...",
      "Directories successfully updated!"
    ];

    const logsPromise = triggerLoadingLogs(stages);

    try {
      const res = await fetch(`${API_BASE}/api/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, editRequest })
      });

      if (!res.ok) {
        throw new Error(`Failed to apply modifications (HTTP ${res.status})`);
      }

      const data = await res.json();
      
      await logsPromise;

      if (data.success && data.files) {
        setFiles(data.files);
        setValidation(data.validation);
      } else {
        throw new Error(data.error || "Failed to update files mapping.");
      }

    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message || "Failed to modify extension files.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Download compiler ZIP
  const handleDownload = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files, name: prompt })
      });

      if (!res.ok) {
        throw new Error("Unable to compile ZIP archive buffer.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `extensio-${prompt.toLowerCase().replace(/[^a-z0-9]/g, "-") || "plugin"}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("ZIP compilation failed: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full bg-[#030014] text-gray-100 overflow-x-hidden">
      
      {/* Mesh Grid Backdrop */}
      <div className="absolute inset-0 bg-grid opacity-80 pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar 
        onDashboardClick={() => {
          if (viewState === "workspace") {
            setViewState("landing");
          } else if (Object.keys(files).length > 0) {
            setViewState("workspace");
          } else {
            // Boot general demo YouTube comment hider extension
            handleGenerate("Create a Chrome extension that hides YouTube comments");
          }
        }} 
        isDashboardActive={viewState === "workspace"}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col z-10 w-full relative">
        <AnimatePresence mode="wait">
          
          {/* A. Landing Page View */}
          {viewState === "landing" && (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col w-full"
            >
              <Hero onGenerate={handleGenerate} isLoading={isLoading} />
              
              {/* Highlight error message on landing if any */}
              {errorMsg && (
                <div className="max-w-2xl mx-auto w-full px-6 mb-8">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold">Synthesis Error:</span>
                      <p className="mt-1 leading-normal">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              <Features />
              <Pricing />
              <Footer />
            </motion.div>
          )}

          {/* B. Dashboard Developer Workspace View */}
          {viewState === "workspace" && (
            <motion.div
              key="workspace-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8 flex-1"
            >
              {/* Workspace Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <button
                    onClick={() => setViewState("landing")}
                    className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold mb-2 group cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Landing
                  </button>
                  <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Developer Workspace</span>
                    <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 font-mono">MANIFEST V3 READY</span>
                  </h1>
                </div>

                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => handleGenerate(prompt)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Full Regenerate
                  </button>
                </div>
              </div>

              {/* Error Callout if Workspace actions fail */}
              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold">Modification Error:</span>
                    <p className="mt-1 leading-normal">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Double Pane Layout: Editor & Live Simulator */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 items-stretch">
                
                {/* 1 & 2. Explorer and Code workspace (takes 2 of 3 grid cols on wide views) */}
                <div className="xl:col-span-2">
                  <Workspace
                    files={files}
                    validation={validation}
                    isLoading={isLoading}
                    onModify={handleModify}
                    onDownload={handleDownload}
                    originalPrompt={prompt}
                  />
                </div>

                {/* 3. High fidelity live extension simulator */}
                <div className="xl:col-span-1">
                  <Simulator
                    files={files}
                    isLoading={isLoading}
                    prompt={prompt}
                  />
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* C. Global Futuristic AI Loading Terminal Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-[#070514]"
            >
              {/* Terminal Title Bar */}
              <div className="bg-[#121024] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-violet-400 animate-pulse" />
                  <span className="text-xs font-bold text-gray-200 font-mono tracking-wide">Extensio Synthesis Terminal</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Logs Stream */}
              <div className="p-5 font-mono text-[10px] md:text-xs text-gray-400 flex flex-col gap-2 min-h-64 justify-end">
                <div className="flex-1 flex flex-col gap-1.5 justify-start text-left overflow-y-auto">
                  {loadLogs.map((log, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={index === loadLogs.length - 1 ? "text-violet-400 font-bold typing-caret" : "text-emerald-500/80"}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[9px] text-gray-500 font-semibold tracking-wider">
                  <span>COMPILING BINARIES...</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin text-violet-400" />
                    GEMINI ENGINE ACTIVE
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
