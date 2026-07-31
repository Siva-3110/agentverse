import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Cpu, Wrench, ShieldCheck, ArrowRight, FileText, RefreshCw } from "lucide-react";
import { useAgentExecution } from "../hooks/useAgentExecution";

interface AgentSummaryPanelProps {
  agentNumber: string;
  agentName: string;
  confidenceScore: number;
  executionTime: string;
  toolsUsed: string[];
  quickMetrics: { label: string; value: string | number }[];
  recommendations: string[];
}

export const AgentSummaryPanel: React.FC<AgentSummaryPanelProps> = ({
  agentNumber,
  agentName,
  confidenceScore,
  executionTime,
  toolsUsed,
  quickMetrics,
  recommendations
}) => {
  const { runPipeline, selectedDomain } = useAgentExecution();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6 sticky top-6 font-sans"
    >
      {/* 1. Agent Status Card */}
      <div className="saas-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <span className="text-xs font-bold text-[#0B4F37] font-mono tracking-wider">
            AGENT {agentNumber} STATUS
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0B4F37] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            ACTIVE & READY
          </span>
        </div>

        <div>
          <h3 className="text-card-20 font-semibold mb-1">{agentName}</h3>
          <p className="text-caption-13 text-[#64748B]">
            Synchronized with Groq Llama 3.3 & ChromaDB vector store.
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className="p-4 rounded-[16px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-caption-13 uppercase font-semibold text-[#64748B] block">
              Confidence Score
            </span>
            <div className="text-2xl font-extrabold text-[#0F172A] font-mono">
              {confidenceScore}%
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B4F37] font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#0B4F37]" />
          </div>
        </div>

        {/* Execution Time */}
        <div className="flex items-center justify-between text-xs text-[#64748B] font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#64748B]" />
            Avg Execution Time:
          </span>
          <span className="font-bold text-[#0F172A] font-mono">{executionTime}</span>
        </div>
      </div>

      {/* 2. Tools & Ingestion Sources Used */}
      <div className="saas-card space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
          <Wrench className="w-4 h-4 text-[#0B4F37]" />
          Tools & Connected APIs
        </h4>

        <div className="flex flex-wrap gap-1.5">
          {toolsUsed.map((tool, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5"
            >
              <Cpu className="w-3 h-3 text-[#0B4F37]" />
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Quick Metrics Grid */}
      <div className="saas-card space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-2">
          Quick Metrics Overview
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {quickMetrics.map((m, idx) => (
            <div key={idx} className="p-3 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] text-[#64748B] font-medium block truncate">
                {m.label}
              </span>
              <span className="text-lg font-bold text-[#0F172A] font-mono mt-0.5 block">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Strategic Recommendations */}
      <div className="saas-card space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-[#E2E8F0] pb-2">
          Strategic Recommendations
        </h4>

        <div className="space-y-2 text-xs">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-[12px] bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A]">
              <CheckCircle2 className="w-4 h-4 text-[#0B4F37] shrink-0 mt-0.5" />
              <span className="leading-snug">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quick Actions */}
      <div className="saas-card space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => runPipeline(selectedDomain)}
          className="w-full btn-emerald flex items-center justify-center gap-2 text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-Run Agent Execution</span>
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="/report"
          className="w-full btn-outline-secondary flex items-center justify-center gap-2 text-xs text-center"
        >
          <FileText className="w-4 h-4 text-[#0B4F37]" />
          <span>View Executive Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      </div>
    </motion.aside>
  );
};
