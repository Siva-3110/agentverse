import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Search, Zap, ChevronRight, CheckCircle2,
  Clock, BookOpen, ShieldCheck, Target, Lightbulb,
  Scale, TrendingUp, DollarSign, Terminal, ArrowRight,
  ChevronDown, RotateCcw
} from "lucide-react";
import { useAgentExecution } from "../hooks/useAgentExecution";
import { useAuth } from "../context/AuthContext";

/* ─────────────────────────────────────────────────────────── */
/* Agent definitions                                           */
/* ─────────────────────────────────────────────────────────── */
const AGENTS = [
  { id: 1, key: "RESEARCH",      label: "Research Intelligence",    desc: "OpenAlex, arXiv & Semantic Scholar academic literature ingestion", icon: BookOpen,   iconBg: "bg-blue-100",    iconColor: "text-blue-600"    },
  { id: 2, key: "PATENT",        label: "Patent Landscape",         desc: "Google Patents deep-search & ChromaDB vector clustering",          icon: ShieldCheck, iconBg: "bg-violet-100",  iconColor: "text-violet-600"  },
  { id: 3, key: "GAP",           label: "Gap Analysis",             desc: "Unpatented white-space detection & opportunity scoring",           icon: Target,      iconBg: "bg-amber-100",   iconColor: "text-amber-600"   },
  { id: 4, key: "INNOVATION",    label: "Innovation Architect",      desc: "Patent-ready concept synthesis & architecture specs",             icon: Lightbulb,   iconBg: "bg-pink-100",    iconColor: "text-pink-600"    },
  { id: 5, key: "PATENTABILITY", label: "Patentability Assessment",  desc: "35 U.S.C. § 102/103 legal novelty & claims scoring",              icon: Scale,       iconBg: "bg-red-100",     iconColor: "text-red-600"     },
  { id: 6, key: "MARKET",        label: "Market Intelligence",       desc: "Google Trends, GitHub growth & Enterprise RSS signals",            icon: TrendingUp,  iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  { id: 7, key: "FUNDING",       label: "Funding Pathfinder",        desc: "BIRAC, YC, Startup India & Grant auto-matching",                  icon: DollarSign,  iconBg: "bg-orange-100",  iconColor: "text-orange-600"  },
];

const SUGGESTIONS = [
  "Electric Vehicles", "Quantum Computing", "AI in Healthcare",
  "Hydrogen Storage", "Solid State Batteries", "Robotics",
];

/* ─────────────────────────────────────────────────────────── */
/* Page Component                                              */
/* ─────────────────────────────────────────────────────────── */
export default function MissionControlPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentAgentId, isExecuting, completedAgentIds,
    logs, selectedDomain, setSelectedDomain,
    runPipeline, resetPipeline,
  } = useAgentExecution();

  const [domain, setDomain]           = useState(selectedDomain || "");
  const [hasStarted, setHasStarted]   = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [hasRun, setHasRun]           = useState(false);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  /* track "isExecuting ever became true" so redirect doesn't fire on mount */
  useEffect(() => { if (isExecuting) setHasRun(true); }, [isExecuting]);

  /* auto-scroll terminal */
  useEffect(() => {
    if (terminalRef.current) {
      try {
        terminalRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (e) {
        // Ignore scroll errors if DOM element is unmounting
      }
    }
  }, [logs]);

  /* mission complete → redirect */
  useEffect(() => {
    if (completedAgentIds.length === 7 && !isExecuting && !missionDone) {
      setMissionDone(true);
      const t = setTimeout(() => navigate("/dashboard"), 1500);
      return () => clearTimeout(t);
    }
  }, [completedAgentIds, isExecuting, missionDone, navigate]);

  /* ── handle Analyze ── */
  const handleAnalyze = () => {
    const d = domain.trim();
    if (!d) return;
    setSelectedDomain(d);
    setHasStarted(true);
    setMissionDone(false);
    runPipeline(d);
    // smooth scroll after brief paint tick
    setTimeout(() => {
      pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  /* ── helpers ── */
  const statusOf = (id: number) => {
    if (completedAgentIds.includes(id)) return "completed";
    if (currentAgentId === id && isExecuting) return "running";
    return "waiting";
  };

  const progressPct = (completedAgentIds.length / 7) * 100;

  /* logs for the currently running agent */
  const agentLogs = (key: string) =>
    logs.filter((l) => l.agent === key || l.agent === "SYSTEM");

  /* ─────────────────────────────────────────────────────────── */
  /* Render                                                      */
  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] landing-grid-bg flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">

      {/* ── Minimal Top Bar ── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-900/15">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-none">PatentScout AI</div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-0.5">Mission Control</div>
          </div>
        </div>

        {hasStarted && !isExecuting && (
          <button
            onClick={() => { resetPipeline(); setHasStarted(false); setMissionDone(false); setHasRun(false); setDomain(""); }}
            className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-[10px] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Analysis
          </button>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  WELCOME / HERO SECTION                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full space-y-8"
        >
          {/* Greeting */}
          <div className="space-y-4">
            <h1 className="text-[40px] sm:text-[52px] font-[800] text-slate-900 tracking-[-0.03em] leading-[1.12]">
              Welcome, {user?.first_name || "Researcher"} 👋
            </h1>
            <p className="text-[17px] text-slate-600 font-[500] leading-[1.65] max-w-2xl mx-auto">
              Enter a technology domain and PatentScout AI will autonomously execute its complete multi-agent patent intelligence pipeline to discover research, patents, white spaces, innovation opportunities, commercialization pathways, funding opportunities, and executive insights.
            </p>
          </div>

          {/* Search + Analyze */}
          <div className="space-y-3 w-full">
            <div
              className="flex items-center gap-2 bg-white border-2 rounded-[20px] p-2 shadow-lg shadow-slate-200/60 transition-all"
              style={{ borderColor: domain ? "#059669" : "#E5E7EB" }}
            >
              <div className="pl-3">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isExecuting) handleAnalyze(); }}
                placeholder="Search Technology Domain..."
                className="flex-1 bg-transparent text-[16px] font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none px-2 py-1"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAnalyze}
                disabled={isExecuting || !domain.trim()}
                className="flex items-center gap-2 px-7 py-3 rounded-[14px] text-[15px] font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-md shadow-emerald-900/20 hover:from-emerald-800 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                <span>{isExecuting ? "Executing…" : "Analyze"}</span>
              </motion.button>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  disabled={isExecuting}
                  onClick={() => { setDomain(s); }}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-all disabled:opacity-40"
                >
                  {s}
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  LIVE PIPELINE SECTION  (only after Analyze clicked)   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {hasStarted && (
          <motion.section
            ref={pipelineRef}
            id="live-pipeline-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-4xl mx-auto w-full px-6 pb-24 space-y-8"
          >
            {/* ── Section Header ── */}
            <div className="flex items-end justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Real-Time Telemetry</div>
                <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight">Live AI Swarm Execution</h2>
              </div>
              <div className="text-right space-y-1">
                <div className="text-[12px] font-bold text-slate-500">
                  Mission Progress &nbsp;
                  <span className="text-emerald-700">Agent {completedAgentIds.length} / 7</span>
                </div>
                <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>

            {/* ── Mission Complete Banner ── */}
            <AnimatePresence>
              {missionDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[24px] p-6 flex items-center justify-between border border-emerald-400/40 shadow-xl shadow-emerald-900/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-[20px] font-extrabold text-white">Mission Completed Successfully ✅</div>
                      <div className="text-[14px] text-emerald-100 mt-0.5">
                        All 7 Agents executed for <strong>{selectedDomain}</strong>. Redirecting to Dashboard…
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-[14px] font-extrabold text-white bg-white/20 hover:bg-white/35 px-6 py-2.5 rounded-full border border-white/30 cursor-pointer shadow-md transition-all hover:scale-105 flex-shrink-0"
                  >
                    <span>Launch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Agent Cards ── */}
            <div className="space-y-3">
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                const status = statusOf(agent.id);
                const isExpanded = status === "running" || (status === "completed" && completedAgentIds[completedAgentIds.length - 1] === agent.id);
                // Show logs for this agent + SYSTEM logs
                const thisLogs = logs.filter(
                  (l) => l.agent === agent.key || l.agent === "SYSTEM"
                );

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: agent.id * 0.04 }}
                    className={`rounded-[20px] bg-white border transition-all duration-300 overflow-hidden ${
                      status === "running"
                        ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/15"
                        : status === "completed"
                        ? "border border-emerald-200"
                        : "border border-slate-200 opacity-65"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-[12px] ${agent.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${agent.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold text-slate-400 tracking-widest">
                              AGENT 0{agent.id}
                            </span>
                            <span className="text-[17px] font-bold text-slate-900">{agent.label}</span>
                          </div>
                          <p className="text-[13px] text-slate-500 font-medium mt-0.5">{agent.desc}</p>
                        </div>
                      </div>

                      {/* Status pill */}
                      <div className="flex-shrink-0 flex items-center gap-3">
                        {status === "completed" && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                        {status === "running" && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
                            Running…
                          </span>
                        )}
                        {status === "waiting" && (
                          <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            Waiting
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {/* Live Terminal (only for running agent) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-100 overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-4">
                            {/* Terminal Label */}
                            <div className="flex items-center gap-2 mb-3">
                              <Terminal className="w-4 h-4 text-emerald-600" />
                              <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Live Terminal</span>
                              <span className="text-[11px] font-mono text-slate-400 ml-auto">
                                {agent.key}_AGENT_STREAM
                              </span>
                            </div>

                            {/* Black terminal box */}
                            <div className="bg-[#0D1117] rounded-[14px] p-5 font-mono text-[13px] border border-slate-800 shadow-inner max-h-72 overflow-y-auto space-y-1.5">
                              {thisLogs.length === 0 ? (
                                <div className="text-slate-500 italic">Connecting to agent stream…</div>
                              ) : (
                                thisLogs.map((log, idx) => (
                                  <div key={idx} className="flex items-start gap-3 leading-relaxed">
                                    <span className="text-slate-600 text-[11px] flex-shrink-0 select-none">[{log.timestamp}]</span>
                                    <span className="text-purple-400 font-semibold flex-shrink-0">[{log.agent}]</span>
                                    <span className="text-emerald-300">{log.message}</span>
                                  </div>
                                ))
                              )}
                              {/* blinking cursor */}
                              <div className="flex items-center gap-2 pt-1 text-emerald-400 text-[13px] font-bold">
                                <span className="animate-pulse">▶</span>
                                <span className="animate-pulse">Streaming agent telemetry…</span>
                                <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
                              </div>
                              <div ref={terminalRef} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
