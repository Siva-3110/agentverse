import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, RefreshCw, Zap, ChevronRight, Cpu } from "lucide-react";
import { useAgentExecution } from "../../hooks/useAgentExecution";

const SUGGESTED_DOMAINS = [
  "Electric Vehicles", "Generative AI", "Quantum Computing",
  "mRNA Therapeutics", "Carbon Capture", "Neuromorphic Chips",
  "Fusion Energy", "Spatial Computing"
];

export default function DomainSearchBar() {
  const { selectedDomain, setSelectedDomain, runPipeline, isExecuting, resetPipeline } = useAgentExecution();
  const [inputValue, setInputValue] = useState(selectedDomain);
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim() || isExecuting) return;
    setSelectedDomain(inputValue.trim());
    runPipeline(inputValue.trim());
  };

  const handleSuggestion = (domain: string) => {
    setInputValue(domain);
    setSelectedDomain(domain);
    setFocused(false);
    runPipeline(domain);
  };

  return (
    <div className="premium-card p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-50 blur-3xl opacity-60 pointer-events-none -translate-y-12 translate-x-12" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="icon-box bg-emerald-50">
                <Cpu className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-overline">7-Agent Swarm Pipeline</span>
            </div>
            <h2 className="text-card-title">Launch Intelligence Analysis</h2>
            <p className="text-caption mt-1">
              Enter any technology domain to activate all 7 autonomous agents
            </p>
          </div>
          {!isExecuting && (
            <button onClick={resetPipeline} className="btn-ghost text-slate-400 hover:text-slate-600">
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className={`flex items-center gap-3 bg-white border-2 rounded-[16px] transition-all ${focused ? "border-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="pl-4 flex-shrink-0">
              <Search className={`w-5 h-5 transition-colors ${focused ? "text-emerald-600" : "text-slate-400"}`} />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Quantum Computing, mRNA Therapeutics..."
              className="flex-1 h-[52px] bg-transparent text-[15px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="pr-2 flex items-center gap-2">
              {isExecuting ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-[12px]">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-[12px] font-bold text-amber-700 whitespace-nowrap">Running...</span>
                </div>
              ) : (
                <button onClick={handleSubmit} disabled={!inputValue.trim()} className="btn-premium text-[13px] px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                  <Zap className="w-4 h-4" />
                  <span>Analyze</span>
                </button>
              )}
            </div>
          </div>

          {/* Dropdown Suggestions */}
          <AnimatePresence>
            {focused && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[18px] shadow-xl shadow-slate-200/80 z-50 overflow-hidden"
              >
                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Trending Domains</div>
                  <div className="grid grid-cols-2 gap-1">
                    {SUGGESTED_DOMAINS.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => handleSuggestion(domain)}
                        className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left"
                      >
                        <Sparkles className="w-3 h-3 flex-shrink-0 opacity-60" />
                        <span>{domain}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-caption text-slate-400 self-center">Quick launch:</span>
          {SUGGESTED_DOMAINS.slice(0, 5).map((domain) => (
            <button
              key={domain}
              onClick={() => handleSuggestion(domain)}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-[9999px] text-[12px] font-medium text-slate-600 hover:text-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {domain}
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
