import React, { useEffect, useRef, useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { useAgentExecution } from "../../hooks/useAgentExecution";

const AGENT_COLORS: Record<string, string> = {
  RESEARCH:      "#60A5FA",
  PATENT:        "#A78BFA",
  GAP:           "#FBBF24",
  INNOVATION:    "#F472B6",
  PATENTABILITY: "#F87171",
  MARKET:        "#34D399",
  FUNDING:       "#FB923C",
  SYSTEM:        "#94A3B8"
};

const AGENT_PREFIXES: Record<string, string> = {
  RESEARCH:      "RESEARCH",
  PATENT:        "PATENT",
  GAP:           "GAP_ANALYSIS",
  INNOVATION:    "INNOVATION",
  PATENTABILITY: "PATENT_SCORE",
  MARKET:        "MARKET_INTEL",
  FUNDING:       "FUNDING_AI",
  SYSTEM:        "SYSTEM"
};

export default function LiveTerminalBox() {
  const { logs, isExecuting } = useAgentExecution();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.agent}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="terminal-console">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] font-semibold text-emerald-300 tracking-wider uppercase">
            swarm.engine — agent.stdout
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isExecuting && (
            <div className="flex items-center gap-1.5">
              <span className="status-dot-live scale-75" />
              <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wider">LIVE</span>
            </div>
          )}
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 transition-colors">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] font-mono font-semibold">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="terminal-body">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2 font-mono">
            <span className="text-slate-600 flex-shrink-0 text-[11px] mt-0.5">
              {log.timestamp}
            </span>
            <span
              className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider mt-0.5 px-1.5 py-0.5 rounded-sm"
              style={{
                color: AGENT_COLORS[log.agent] || "#94A3B8",
                backgroundColor: `${AGENT_COLORS[log.agent] || "#94A3B8"}18`
              }}
            >
              {AGENT_PREFIXES[log.agent] || log.agent}
            </span>
            <span className="text-[12px] leading-relaxed" style={{ color: "#B8D4C8" }}>
              {log.message}
            </span>
          </div>
        ))}

        {/* Blinking cursor */}
        {isExecuting && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-600 text-[11px]">—</span>
            <span className="inline-block w-1.5 h-3.5 bg-emerald-400 animate-pulse rounded-[1px]" />
          </div>
        )}
      </div>
    </div>
  );
}
