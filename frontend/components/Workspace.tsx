"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, FileJson, FileType, FileText, 
  ArrowRight, Download, RefreshCw, AlertTriangle, CheckCircle, Sparkles
} from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface WorkspaceProps {
  files: Record<string, string>;
  validation?: ValidationResult;
  isLoading: boolean;
  onModify: (editRequest: string) => void;
  onDownload: () => void;
  originalPrompt: string;
}

export default function Workspace({ 
  files, 
  validation, 
  isLoading, 
  onModify, 
  onDownload, 
  originalPrompt 
}: WorkspaceProps) {
  
  const fileNames = Object.keys(files);
  const [currentFile, setCurrentFile] = useState<string>(fileNames[0] || "manifest.json");
  const [editRequest, setEditRequest] = useState("");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRequest.trim() && !isLoading) {
      onModify(editRequest.trim());
      setEditRequest("");
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith(".json")) return <FileJson className="w-4 h-4 text-amber-400" />;
    if (name.endsWith(".js") || name.endsWith(".ts")) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (name.endsWith(".html")) return <FileType className="w-4 h-4 text-emerald-400" />;
    if (name.endsWith(".css")) return <FileText className="w-4 h-4 text-fuchsia-400" />;
    return <FileCode className="w-4 h-4 text-gray-400" />;
  };

  // High-fidelity custom syntax highlighter
  const highlight = (code: string, filename: string): string => {
    // Escape HTML to prevent shell injections / rendering crashes
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (filename.endsWith(".json")) {
      // Color strings
      escaped = escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, '<span class="token-string">$1</span>');
      // Color numbers
      escaped = escaped.replace(/\b(-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\b/g, '<span class="token-number">$1</span>');
      // Color booleans
      escaped = escaped.replace(/\b(true|false|null)\b/g, '<span class="token-keyword">$1</span>');
      // Color keys
      escaped = escaped.replace(/(&quot;[a-zA-Z0-9_-]+&quot;)\s*:/g, '<span class="token-tag">$1</span>:');
    } else if (filename.endsWith(".js") || filename.endsWith(".ts")) {
      // Color keywords
      escaped = escaped.replace(/\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|let|package|private|protected|public|static|await|async)\b/g, '<span class="token-keyword">$1</span>');
      // Color comments
      escaped = escaped.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');
      // Color strings
      escaped = escaped.replace(/(&quot;.*?&quot;|'.*?'|`[\s\S]*?`)/g, '<span class="token-string">$1</span>');
      // Color numbers
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
    } else if (filename.endsWith(".html")) {
      // Color comments
      escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>');
      // Color tags
      escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9\-:]+)/g, '<span class="token-tag">$1</span>');
      // Color attributes
      escaped = escaped.replace(/\b([a-zA-Z0-9\-:]+)=/g, '<span class="token-attr">$1</span>=');
      // Color strings
      escaped = escaped.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="token-string">$1</span>');
    } else if (filename.endsWith(".css")) {
      // Color comments
      escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');
      // Color selectors and properties
      escaped = escaped.replace(/([a-zA-Z\-]+)\s*:/g, '<span class="token-attr">$1</span>:');
      // Color values
      escaped = escaped.replace(/:\s*([^;]+);/g, ': <span class="token-string">$1</span>;');
    }

    return escaped;
  };

  const currentCode = files[currentFile] || "// File not found";

  return (
    <div className="w-full h-full min-h-[580px] grid grid-cols-1 lg:grid-cols-4 gap-6 bg-[#030014]">
      
      {/* 1. Left Sidebar File Explorer */}
      <div className="lg:col-span-1 glass-panel rounded-2xl border border-white/5 p-4 flex flex-col gap-4 bg-[#0a071d]/30 h-full max-h-[620px] overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-white/5 pb-2">Extension Files</h3>
        <nav className="flex flex-col gap-1">
          {fileNames.map((name) => (
            <button
              key={name}
              onClick={() => setCurrentFile(name)}
              id={`file_item_${name.replace(/\./g, "_")}`}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                currentFile === name
                  ? "bg-violet-600/10 border border-violet-500/20 text-white shadow-sm"
                  : "text-gray-400 hover:bg-white/5 border border-transparent hover:text-white"
              }`}
            >
              {getFileIcon(name)}
              <span className="truncate">{name}</span>
            </button>
          ))}
        </nav>

        {/* Original Prompt Summary Card */}
        <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-gray-500 font-mono">
          <span className="text-gray-400 block font-bold mb-1 uppercase tracking-wider">Prompt Base:</span>
          <p className="line-clamp-4 leading-normal">"{originalPrompt}"</p>
        </div>
      </div>

      {/* 2. Center Code Previewer Panel */}
      <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 flex flex-col overflow-hidden bg-black/60 shadow-xl h-full max-h-[620px]">
        {/* Editor Tab bar */}
        <div className="bg-[#0b0821] px-4 py-2.5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {getFileIcon(currentFile)}
            <span className="text-xs font-bold text-gray-200">{currentFile}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">READONLY PREVIEW</span>
        </div>

        {/* Syntax Highlight Window */}
        <div className="flex-1 overflow-auto py-4 select-text">
          <pre className="font-mono text-xs md:text-sm leading-relaxed text-gray-300">
            <code>
              {currentCode.split("\n").map((line, idx) => (
                <div key={idx} className="flex hover:bg-white/2 py-0.5 px-4">
                  <span className="w-10 text-gray-600 text-right select-none pr-5 font-mono shrink-0 text-[10px] md:text-xs">{idx + 1}</span>
                  <span 
                    className="flex-1 whitespace-pre-wrap font-mono"
                    dangerouslySetInnerHTML={{ __html: highlight(line, currentFile) }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* 3. Right Sidebar AI Copilot & Compiler */}
      <div className="lg:col-span-1 flex flex-col gap-6 h-full max-h-[620px]">
        
        {/* AI Iterations Form */}
        <div className="glass-panel rounded-2xl border border-white/5 p-4 bg-[#0a071d]/30 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">AI Edit & Regrow</h4>
          </div>
          <p className="text-[10px] text-gray-400 leading-normal">
            Refine design, modify layouts, or insert active functions. Describe modifications in natural language.
          </p>

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-2.5">
            <textarea
              value={editRequest}
              onChange={(e) => setEditRequest(e.target.value)}
              placeholder="e.g. 'Add a reset button to popup popup.html' or 'make headers blue'"
              rows={3}
              id="ai_edit_textarea"
              disabled={isLoading}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/8 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={isLoading || !editRequest.trim()}
              id="ai_modify_submit_btn"
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isLoading || !editRequest.trim()
                  ? "bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Regenerating..." : "Apply Modification"}
            </button>
          </form>
        </div>

        {/* Validation Audits Display */}
        <div className="glass-panel rounded-2xl border border-white/5 p-4 bg-[#0a071d]/30 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[160px]">
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-white/5 pb-2">Manifest Audits</h4>
          
          {validation ? (
            <div className="flex flex-col gap-2.5 font-mono text-[9px]">
              {validation.isValid ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Manifest V3 Compliant</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-red-400 font-bold bg-red-500/5 p-2 rounded border border-red-500/10">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Manifest Violations!</span>
                </div>
              )}

              {/* Errors list */}
              {validation.errors.map((err, i) => (
                <div key={`err-${i}`} className="text-red-400 bg-red-500/3 p-2 rounded border border-red-500/5 leading-normal">
                  [Error] {err}
                </div>
              ))}

              {/* Warnings list */}
              {validation.warnings.map((warn, i) => (
                <div key={`warn-${i}`} className="text-amber-400 bg-amber-500/3 p-2 rounded border border-amber-500/5 leading-normal">
                  [Warn] {warn}
                </div>
              ))}

              {validation.isValid && validation.warnings.length === 0 && (
                <p className="text-gray-500 leading-normal">No security or syntactic compliance warnings detected in current manifest configurations.</p>
              )}
            </div>
          ) : (
            <p className="text-[10px] text-gray-500 leading-normal font-mono">&gt; Waiting for active generation audits report...</p>
          )}
        </div>

        {/* Compiler Button Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            disabled={isLoading || fileNames.length === 0}
            id="download_zip_btn"
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Download ZIP
          </button>
          
          <button
            onClick={() => alert("Direct Export to GitHub successfully mapped (Mock flow). See README for CI/CD setup.")}
            disabled={isLoading}
            className="px-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            title="Export Repository to GitHub"
          >
            <Github className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
