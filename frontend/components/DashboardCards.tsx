"use client";

import { motion } from "framer-motion";
import { 
  FileCode, CheckCircle, AlertTriangle, Download, 
  Activity, History, Zap, Cpu, FileJson, FileText,
  Clock, ShieldAlert
} from "lucide-react";
import Simulator from "./Simulator";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface DashboardCardsProps {
  files: Record<string, string>;
  validation?: ValidationResult;
  isLoading: boolean;
  prompt: string;
  onModify: (req: string) => void;
  onDownload: () => void;
  onOpenFile: (filename: string, content: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function DashboardCards({
  files,
  validation,
  isLoading,
  prompt,
  onModify,
  onDownload,
  onOpenFile
}: DashboardCardsProps) {
  const fileKeys = Object.keys(files);
  const hasFiles = fileKeys.length > 0;

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.json')) return <FileJson className="w-5 h-5 text-[#ffb020]" />;
    if (filename.endsWith('.html')) return <FileCode className="w-5 h-5 text-[#6ec6ff]" />;
    if (filename.endsWith('.css')) return <FileCode className="w-5 h-5 text-[#c084fc]" />;
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode className="w-5 h-5 text-[#b7ff4a]" />;
    return <FileText className="w-5 h-5 text-[#8b8b8b]" />;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-20"
    >
      {/* 1. AI Generation Status */}
      <motion.div variants={itemVariants} className="card card-hover-lime p-6 flex flex-col gap-4 col-span-1 md:col-span-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#b7ff4a]" />
            <h3 className="font-bold text-[#f5f5f5]">Generation Status</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-[#181818] px-3 py-1 rounded-full border border-[#1f1f1f]">
            <div className={`w-2 h-2 rounded-full ${hasFiles ? 'bg-[#b7ff4a]' : 'bg-[#555555]'}`} />
            <span className={hasFiles ? "text-[#b7ff4a]" : "text-[#555555]"}>
              {hasFiles ? "Active" : "Idle"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#8b8b8b] mb-2">Current Prompt</p>
          <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#1f1f1f] text-sm text-[#f5f5f5] min-h-[60px]">
            {prompt || "No prompt provided yet."}
          </div>
        </div>
        <div className="text-xs text-[#555555] flex justify-between">
          <span>Model: Gemini 1.5 Flash</span>
          <span>Target: Manifest V3</span>
        </div>
      </motion.div>

      {/* 2. Generated Files */}
      <motion.div variants={itemVariants} className="card card-hover p-6 flex flex-col gap-4 col-span-1 md:col-span-2">
        <div className="flex items-center gap-2">
          <FolderOpenIcon className="w-5 h-5 text-[#8b8b8b]" />
          <h3 className="font-bold text-[#f5f5f5]">Generated Files</h3>
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[160px]">
          {hasFiles ? (
            fileKeys.map((filename) => (
              <button 
                key={filename}
                onClick={() => onOpenFile(filename, files[filename])}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#181818] transition-colors text-left"
              >
                {getFileIcon(filename)}
                <span className="text-sm text-[#f5f5f5] font-mono">{filename}</span>
                <span className="text-xs text-[#555555] ml-auto">{(files[filename].length / 1024).toFixed(1)} KB</span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#555555]">
              <FileCode className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No files generated yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Live Chrome Simulator (Takes up 2 columns, 2 rows if possible, or just spans large) */}
      <motion.div variants={itemVariants} className="card card-hover p-6 flex flex-col gap-4 col-span-1 md:col-span-2 lg:col-span-2 xl:row-span-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#f5f5f5]" />
          <h3 className="font-bold text-[#f5f5f5]">Live Simulator</h3>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden border border-[#1f1f1f]">
          <Simulator files={files} isLoading={isLoading} prompt={prompt} />
        </div>
      </motion.div>

      {/* 3. Extension Analytics */}
      <motion.div variants={itemVariants} className="card card-hover p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ffb020]" />
          <h3 className="font-bold text-[#f5f5f5]">Analytics</h3>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="flex justify-between items-end border-b border-[#1f1f1f] pb-2">
            <span className="text-sm text-[#8b8b8b]">Total Files</span>
            <span className="text-2xl font-display text-[#f5f5f5]">{fileKeys.length}</span>
          </div>
          <div className="flex justify-between items-end border-b border-[#1f1f1f] pb-2">
            <span className="text-sm text-[#8b8b8b]">Lines of Code</span>
            <span className="text-2xl font-display text-[#f5f5f5]">
              {fileKeys.reduce((acc, k) => acc + files[k].split('\n').length, 0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 7. Validation Warnings */}
      <motion.div variants={itemVariants} className="card card-hover p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#f5f5f5]" />
            <h3 className="font-bold text-[#f5f5f5]">Security</h3>
          </div>
          {validation && (
            <div className={`w-2 h-2 rounded-full ${validation.isValid && validation.warnings.length === 0 ? 'bg-[#b7ff4a]' : validation.isValid ? 'bg-[#ffb020]' : 'bg-[#ef4444]'}`} />
          )}
        </div>
        <div className="flex-1 overflow-y-auto max-h-[120px] text-xs">
          {!validation ? (
            <p className="text-[#555555] italic">Awaiting generation...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {validation.isValid && validation.warnings.length === 0 && (
                <div className="flex items-center gap-2 text-[#b7ff4a]">
                  <CheckCircle className="w-4 h-4" /> All checks passed
                </div>
              )}
              {validation.errors.map((e, i) => (
                <div key={`e-${i}`} className="text-[#ef4444] bg-[#ef4444]/10 p-2 rounded flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {e}
                </div>
              ))}
              {validation.warnings.map((w, i) => (
                <div key={`w-${i}`} className="text-[#ffb020] bg-[#ffb020]/10 p-2 rounded flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {w}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* 6. AI Modification */}
      <motion.div variants={itemVariants} className="card card-hover p-6 flex flex-col gap-4 col-span-1 md:col-span-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#8b8b8b]" />
          <h3 className="font-bold text-[#f5f5f5]">AI Modification</h3>
        </div>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('modReq') as HTMLInputElement;
            if (input.value.trim() && !isLoading && hasFiles) {
              onModify(input.value.trim());
              input.value = '';
            }
          }}
          className="flex-1 flex flex-col gap-3"
        >
          <input 
            type="text"
            name="modReq"
            disabled={!hasFiles || isLoading}
            placeholder="e.g. Change the background color to red..."
            className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3 text-sm text-[#f5f5f5] placeholder:text-[#555555] focus:border-[#b7ff4a]/50 outline-none"
          />
          <button 
            type="submit"
            disabled={!hasFiles || isLoading}
            className="btn-ghost self-end"
          >
            Apply Modification
          </button>
        </form>
      </motion.div>

      {/* 8. Download ZIP */}
      <motion.div variants={itemVariants} className="card card-hover-lime p-6 flex flex-col gap-4 items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#1f1f1f] flex items-center justify-center mb-2">
          <Download className="w-6 h-6 text-[#b7ff4a]" />
        </div>
        <h3 className="font-bold text-[#f5f5f5]">Export Package</h3>
        <p className="text-xs text-[#8b8b8b] mb-4">Download your production-ready Manifest V3 extension.</p>
        <button 
          onClick={onDownload}
          disabled={!hasFiles || isLoading}
          className="btn-lime w-full"
        >
          Download ZIP
        </button>
      </motion.div>

    </motion.div>
  );
}

// Inline Folder icon since it wasn't imported from lucide-react above
function FolderOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
