import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Search, RefreshCw, CheckCircle2, ChevronDown, ChevronRight,
  Sparkles, Terminal, BookOpen, ShieldCheck, Target, Lightbulb,
  Scale, TrendingUp, DollarSign, ArrowRight, Clock
} from "lucide-react";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const AGENT_MAP = [
  { id: 1, key: "RESEARCH", name: "Research Intelligence", desc: "OpenAlex, arXiv & Semantic Scholar literature ingestion", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { id: 2, key: "PATENT", name: "Patent Landscape", desc: "Google Patents deep-search & ChromaDB vector clustering", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  { id: 3, key: "GAP", name: "Gap Analysis", desc: "Unpatented white-space detection & opportunity scoring", icon: Target, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { id: 4, key: "INNOVATION", name: "Innovation Architect", desc: "Patent-ready concept synthesis & architecture specs", icon: Lightbulb, color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
  { id: 5, key: "PATENTABILITY", name: "Patentability Assessment", desc: "35 U.S.C. § 102/103 legal novelty & claims scoring", icon: Scale, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  { id: 6, key: "MARKET", name: "Market Intelligence", desc: "Google Trends, GitHub growth & Enterprise RSS signals", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { id: 7, key: "FUNDING", name: "Funding Pathfinder", desc: "BIRAC, YC, Startup India & Grant auto-matching", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" }
];

const SUGGESTED_DOMAINS = [
  "Electric Vehicles", "Quantum Computing", "AI in Healthcare",
  "Hydrogen Storage", "Robotics", "Generative AI", "Neuromorphic Chips"
];

export default function MissionExecutionPage() {
  const navigate = useNavigate();
  const {
    currentAgentId,
    isExecuting,
    completedAgentIds,
    logs,
    selectedDomain,
    setSelectedDomain,
    runPipeline,
    resetPipeline
  } = useAgentExecution();

  const [inputValue, setInputValue] = useState(selectedDomain || "Electric Vehicles");
  const [activeExpandedId, setActiveExpandedId] = useState<number>(1);
  const [missionComplete, setMissionComplete] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const pipelineSectionRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Track if execution has started
  useEffect(() => {
    if (isExecuting) {
      setHasRun(true);
    }
  }, [isExecuting]);

  // Synchronize expanded card with currently executing agent
  useEffect(() => {
    if (isExecuting && currentAgentId) {
      setActiveExpandedId(currentAgentId);
    }
  }, [currentAgentId, isExecuting]);

  // Auto-scroll terminal log window to bottom when new logs arrive
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Handle completion rule & 2-second auto-redirect to existing Dashboard
  useEffect(() => {
    if (hasRun && completedAgentIds.length === 7 && !isExecuting && !missionComplete) {
      setMissionComplete(true);
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [hasRun, completedAgentIds, isExecuting, missionComplete, navigate]);

  const handleAnalyze = () => {
    const domain = inputValue.trim() || "Electric Vehicles";
    setSelectedDomain(domain);
    setMissionComplete(false);

    // Smooth scroll down to live pipeline section (~600ms)
    pipelineSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // Trigger sequential 7-Agent swarm pipeline
    runPipeline(domain);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Mission Control" }]}
        title="Mission Execution Dashboard"
        subtitle="Real-Time Autonomous AI Swarm Execution"
      />

      <main className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-[1700px] mx-auto w-full">

        {/* ── WELCOME & HERO DOMAIN SEARCH BOX ── */}
        <div className="luxury-card p-8 bg-white border border-slate-200/90 shadow-xl relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge-pill-emerald text-[11px] uppercase tracking-wider">
                  Swarm Control Center
                </span>
              </div>
              <h1 className="text-[34px] font-extrabold text-slate-900 tracking-tight">
                Welcome, Siva Ganesh 👋
              </h1>
              <p className="text-[16px] font-semibold text-slate-600 max-w-2xl">
                Welcome back. Let's transform today's research into patent-ready commercial opportunities.
              </p>
            </div>

            {!isExecuting && (
              <button
                onClick={resetPipeline}
                className="btn-outline-custom text-[13px] px-4 py-2 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Reset Swarm</span>
              </button>
            )}
          </div>

          {/* Search Box & Analyze Button */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] rounded-[18px] p-2 transition-all">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Search your Technology Domain... (e.g. Electric Vehicles, Quantum Computing)"
                className="flex-1 bg-transparent text-[16px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none px-2"
              />
              <button
                onClick={handleAnalyze}
                disabled={isExecuting || !inputValue.trim()}
                className="btn-emerald px-8 py-3.5 text-[15px] rounded-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4.5 h-4.5" />
                <span>{isExecuting ? "Executing..." : "Analyze"}</span>
              </button>
            </div>

            {/* Description (max 2 lines) */}
            <p className="text-[14px] font-medium text-slate-600 leading-relaxed px-1">
              Enter any technology domain and PatentScout AI will automatically execute its autonomous 7-Agent intelligence pipeline to discover research, patents, innovation opportunities, commercialization pathways, funding opportunities and executive insights.
            </p>

            {/* Suggested Domain Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mr-1">Quick Suggestions:</span>
              {SUGGESTED_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setInputValue(domain);
                    setSelectedDomain(domain);
                    setMissionComplete(false);
                    pipelineSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    runPipeline(domain);
                  }}
                  disabled={isExecuting}
                  className="badge-pill-graphite hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer text-[12px]"
                >
                  <span>{domain}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MISSION COMPLETION BANNER ── */}
        <AnimatePresence>
          {missionComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-[22px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl flex items-center justify-between border border-emerald-400/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center text-white">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[20px] font-extrabold text-white tracking-tight">
                    Mission Completed Successfully ✅
                  </h3>
                  <p className="text-[14px] text-emerald-100 font-medium mt-0.5">
                    All 7 Agents completed execution for <strong>{selectedDomain}</strong>. Redirecting to Executive Dashboard...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-extrabold text-white bg-white/15 px-5 py-2.5 rounded-full border border-white/20">
                <span>Redirecting...</span>
                <ArrowRight className="w-4 h-4 animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PIPELINE EXECUTION SECTION ── */}
        <div ref={pipelineSectionRef} id="live-pipeline-section" className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Real-time Telemetry</span>
              <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight mt-0.5">
                Live AI Swarm Execution
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge-pill-emerald text-[12px]">
                {completedAgentIds.length}/7 Completed
              </span>
            </div>
          </div>

          {/* 7 Agent Sequential Pipeline */}
          <div className="space-y-4">
            {AGENT_MAP.map((agent) => {
              const Icon = agent.icon;
              const isCompleted = completedAgentIds.includes(agent.id);
              const isRunning = currentAgentId === agent.id && isExecuting;
              const isExpanded = activeExpandedId === agent.id;

              // Filter real logs belonging to this specific agent or system messages
              const agentLogs = logs.filter(
                (l) => l.agent === agent.key || (isRunning && l.agent === "SYSTEM")
              );

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: agent.id * 0.05 }}
                >
                  <div
                    className={`luxury-card p-6 transition-all duration-300 ${
                      isRunning
                        ? "border-2 border-emerald-500 shadow-xl shadow-emerald-500/10"
                        : isCompleted
                        ? "border border-emerald-200/80 bg-white"
                        : "border border-slate-200/80 opacity-75"
                    }`}
                  >
                    {/* Agent Header Bar */}
                    <div
                      onClick={() => setActiveExpandedId(isExpanded ? 0 : agent.id)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center border ${agent.bg}`}>
                          <Icon className={`w-5.5 h-5.5 ${agent.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[12px] font-extrabold text-slate-400 tracking-widest">
                              AGENT 0{agent.id}
                            </span>
                            <h3 className="text-[18px] font-bold text-slate-900">{agent.name}</h3>
                          </div>
                          <p className="text-[13.5px] font-medium text-slate-600 mt-0.5">{agent.desc}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-4">
                        {isCompleted ? (
                          <span className="badge-pill-emerald text-[12px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        ) : isRunning ? (
                          <span className="badge-pill-amber text-[12px]">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>Running Swarm...</span>
                          </span>
                        ) : (
                          <span className="badge-pill-graphite text-[12px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Pending</span>
                          </span>
                        )}

                        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content: Real Live Terminal Window */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-5 pt-5 border-t border-slate-100 overflow-hidden"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                                <Terminal className="w-4 h-4 text-emerald-600" />
                                <span>Live Terminal Telemetry</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400">
                                Stream: {agent.key}_AGENT_LOGS
                              </span>
                            </div>

                            {/* Black Terminal Box */}
                            <div className="bg-[#0D1117] rounded-[16px] p-5 font-mono text-[13px] text-emerald-400 border border-slate-800 shadow-inner max-h-64 overflow-y-auto space-y-2">
                              {agentLogs.length > 0 ? (
                                agentLogs.map((log, lIdx) => (
                                  <div key={lIdx} className="flex items-start gap-3 leading-relaxed">
                                    <span className="text-slate-500 text-[11px] flex-shrink-0 select-none">
                                      [{log.timestamp}]
                                    </span>
                                    <span className="text-purple-400 font-bold flex-shrink-0">
                                      [{log.agent}]
                                    </span>
                                    <span className="text-slate-200 font-medium">
                                      {log.message}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-slate-500 italic">
                                  Waiting for backend execution event stream...
                                </div>
                              )}
                              {isRunning && (
                                <div className="flex items-center gap-2 text-emerald-400 font-bold pt-1">
                                  <span className="animate-pulse">▶ Streaming agent response...</span>
                                  <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
                                </div>
                              )}
                              <div ref={terminalEndRef} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
