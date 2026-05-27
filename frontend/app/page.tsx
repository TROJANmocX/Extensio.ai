"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, AlertCircle, RefreshCw, ArrowLeft, FolderOpen, Package, History } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import DashboardHero from "@/components/DashboardHero";
import DashboardCards from "@/components/DashboardCards";
import CodeViewer from "@/components/CodeViewer";
import SettingsView from "@/components/SettingsView";
import HomeView from "@/components/HomeView";
import TemplatesView from "@/components/TemplatesView";
import SimulatorView from "@/components/SimulatorView";
import PlaceholderView from "@/components/PlaceholderView";

const API_BASE = "http://localhost:5000";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export type ViewState = "home" | "generate" | "projects" | "templates" | "simulator" | "marketplace" | "history" | "account";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("home");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<ValidationResult | undefined>(undefined);
  
  // Loading & logs state
  const [isLoading, setIsLoading] = useState(false);
  const [loadLogs, setLoadLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File viewing state
  const [selectedFile, setSelectedFile] = useState<{name: string, content: string} | null>(null);

  // High-fidelity terminal logging hook
  const triggerLoadingLogs = async (stages: string[]) => {
    setLoadLogs([]);
    for (let i = 0; i < stages.length; i++) {
      setLoadLogs(prev => [...prev, `> ${stages[i]}`]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const handleGenerate = async (submittedPrompt: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setPrompt(submittedPrompt);
    setViewState("generate"); // Ensure we are on the generate view

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

    const logsPromise = triggerLoadingLogs(stages);

    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["x-gemini-api-key"] = apiKey;

      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: submittedPrompt })
      });

      if (!res.ok) {
        throw new Error(`Failed to compile (HTTP ${res.status})`);
      }

      const data = await res.json();
      await logsPromise;

      if (data.success && data.files) {
        setFiles(data.files);
        setValidation(data.validation);
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
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["x-gemini-api-key"] = apiKey;

      const res = await fetch(`${API_BASE}/api/modify`, {
        method: "POST",
        headers,
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

  const handleOpenFile = (filename: string, content: string) => {
    setSelectedFile({ name: filename, content });
  };

  // Helper renderer for the central main area based on viewState
  const renderMainContent = () => {
    switch (viewState) {
      case "home":
        return <HomeView key="home" onNavigate={setViewState} />;
      
      case "templates":
        return <TemplatesView key="templates" onSelectTemplate={handleGenerate} />;
      
      case "simulator":
        return <SimulatorView key="simulator" files={files} prompt={prompt} />;
      
      case "account":
        return <SettingsView key="account" />;

      case "projects":
        return <PlaceholderView key="projects" id="projects" title="Projects" description="View, manage, and clone all your previously saved Chrome extensions. Complete with version history." icon={FolderOpen} />;
      
      case "marketplace":
        return <PlaceholderView key="marketplace" id="marketplace" title="Marketplace" description="Explore, remix, and download community-driven Chrome extensions created by other developers." icon={Package} />;
      
      case "history":
        return <PlaceholderView key="history" id="history" title="AI History" description="A complete chronological log of all prompts, generation logs, and modifications made on your account." icon={History} />;

      case "generate":
        // The Generate view has two substates: no files generated (Hero), and files generated (Workspace Grid)
        if (Object.keys(files).length === 0) {
          return (
            <motion.div
              key="generate-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center -mt-16 w-full"
            >
              <DashboardHero 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
              />
              {errorMsg && (
                <div className="w-full max-w-3xl mx-auto px-6 mt-4">
                  <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl flex gap-3 text-[#ef4444] text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold">Error:</span>
                      <p className="mt-1 leading-normal">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        } else {
          return (
            <motion.div
              key="generate-workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col"
            >
              <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setFiles({});
                    setPrompt("");
                  }}
                  className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#f5f5f5] transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Start New Generation</span>
                </button>
              </div>

              {errorMsg && (
                <div className="w-full max-w-7xl mx-auto px-6 mb-8">
                  <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl flex gap-3 text-[#ef4444] text-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold">Error:</span>
                      <p className="mt-1 leading-normal">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              <DashboardCards
                files={files}
                validation={validation}
                isLoading={isLoading}
                prompt={prompt}
                onModify={handleModify}
                onDownload={handleDownload}
                onOpenFile={handleOpenFile}
              />
            </motion.div>
          );
        }
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full bg-[#000000] text-[#f5f5f5] overflow-x-hidden">
      <TopNavbar />

      <Sidebar currentTab={viewState} onNavigate={(tab) => setViewState(tab as ViewState)} />

      <main className="flex-1 ml-[88px] pt-16 flex flex-col relative z-10 w-full max-w-[calc(100%-88px)] min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          {renderMainContent()}
        </AnimatePresence>
      </main>

      <CodeViewer
        isOpen={!!selectedFile}
        filename={selectedFile?.name || ""}
        content={selectedFile?.content || ""}
        onClose={() => setSelectedFile(null)}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-6 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg card rounded-2xl overflow-hidden bg-[#121212] shadow-2xl shadow-[#b7ff4a]/10"
            >
              <div className="bg-[#0a0a0a] px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#b7ff4a] animate-pulse" />
                  <span className="text-xs font-bold text-[#f5f5f5] font-mono tracking-wide">Extensio Synthesis Terminal</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#1f1f1f]" />
                  <div className="w-2 h-2 rounded-full bg-[#1f1f1f]" />
                  <div className="w-2 h-2 rounded-full bg-[#1f1f1f]" />
                </div>
              </div>

              <div className="p-5 font-mono text-[11px] md:text-xs text-[#8b8b8b] flex flex-col gap-2 min-h-[250px] justify-end bg-[#050505]">
                <div className="flex-1 flex flex-col gap-2 justify-start text-left overflow-y-auto">
                  {loadLogs.map((log, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={index === loadLogs.length - 1 ? "text-[#b7ff4a] font-bold typing-caret" : "text-[#b7ff4a]/70"}
                    >
                      {log}
                    </motion.p>
                  ))}
                </div>

                <div className="border-t border-[#1f1f1f] pt-4 mt-4 flex items-center justify-between text-[10px] text-[#555555] font-semibold tracking-wider">
                  <span>COMPILING BINARIES...</span>
                  <span className="flex items-center gap-1 text-[#b7ff4a]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
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
