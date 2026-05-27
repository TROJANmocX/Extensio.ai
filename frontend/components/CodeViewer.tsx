"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileCode } from "lucide-react";
import { useEffect } from "react";

interface CodeViewerProps {
  isOpen: boolean;
  filename: string;
  content: string;
  onClose: () => void;
}

export default function CodeViewer({ isOpen, filename, content, onClose }: CodeViewerProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // Simple syntax highlighter for display
  const highlightCode = (code: string, file: string) => {
    if (!code) return "";
    let highlighted = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (file.endsWith('.json')) {
      highlighted = highlighted.replace(/(".*?")(:)/g, '<span class="token-attr">$1</span>$2');
      highlighted = highlighted.replace(/:\s*(".*?")/g, ': <span class="token-string">$1</span>');
      highlighted = highlighted.replace(/:\s*(\d+|true|false|null)/g, ': <span class="token-number">$1</span>');
    } else if (file.endsWith('.html')) {
      highlighted = highlighted.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="token-tag">$2</span>');
      highlighted = highlighted.replace(/([a-zA-Z-]+)=(".*?")/g, '<span class="token-attr">$1</span>=<span class="token-string">$2</span>');
    } else {
      // JS/CSS simple
      highlighted = highlighted.replace(/(const|let|var|function|return|import|export|if|else|for|while|class|new)\b/g, '<span class="token-keyword">$1</span>');
      highlighted = highlighted.replace(/('.*?'|".*?"|`.*?`)/g, '<span class="token-string">$1</span>');
      highlighted = highlighted.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>');
    }
    return highlighted;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[85vh] card flex flex-col overflow-hidden shadow-2xl shadow-[#b7ff4a]/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#8b8b8b]" />
                <span className="font-mono text-sm text-[#f5f5f5]">{filename}</span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#555555] hover:text-[#f5f5f5] hover:bg-[#181818] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 bg-[#0a0a0a] code-block border-none rounded-none m-0">
              <pre className="font-mono text-[13px] leading-relaxed text-[#d4d4d4]">
                <code dangerouslySetInnerHTML={{ __html: highlightCode(content, filename) }} />
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
