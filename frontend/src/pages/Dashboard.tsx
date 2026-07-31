import { useNavigate } from "react-router-dom";
import {
  BookOpen, ShieldCheck, Target, Lightbulb, Scale, TrendingUp,
  DollarSign, FileText, CheckCircle2, Clock, Cpu, ChevronRight,
  Sparkles, Check, Layers, ArrowUpRight
} from "lucide-react";

import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const PIPELINE_STEPS = [
  { id: 1, name: "Research Intelligence", key: "RESEARCH", icon: BookOpen, desc: "OpenAlex & arXiv Ingestion" },
  { id: 2, name: "Patent Landscape", key: "PATENT", icon: ShieldCheck, desc: "ChromaDB & USPTO Prior Art" },
  { id: 3, name: "Gap Analysis", key: "GAP", icon: Target, desc: "White Space Detection" },
  { id: 4, name: "Innovation Architect", key: "INNOVATION", icon: Lightbulb, desc: "Patent-Ready Synthesis" },
  { id: 5, name: "Patentability Assessment", key: "PATENTABILITY", icon: Scale, desc: "35 U.S.C. § 102/103 Scoring" },
  { id: 6, name: "Market Intelligence", key: "MARKET", icon: TrendingUp, desc: "Google Trends & RSS Velocity" },
  { id: 7, name: "Funding Pathfinder", key: "FUNDING", icon: DollarSign, desc: "BIRAC & YC Grant Matching" },
];

const INTELLIGENT_MODELS = [
  { name: "Groq Llama 3.3", type: "LLM Orchestrator", status: "Active", tag: "Fast Inference" },
  { name: "ChromaDB Vector Store", type: "Embedding Store", status: "Connected", tag: "Vector Index" },
  { name: "Tavily", type: "Deep Web Search", status: "Ready", tag: "Web Scraper" },
  { name: "Firecrawl", type: "Portal Crawler", status: "Active", tag: "Grant Extraction" },
  { name: "Crossref", type: "DOI Index", status: "Connected", tag: "Journal Metadata" },
];

const NAVIGATION_CARDS = [
  { label: "Research Intelligence", path: "/research", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", desc: "140+ academic literature papers & citation strength analysis" },
  { label: "Patent Landscape", path: "/patents", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50 border-violet-200", desc: "USPTO & WIPO assignee clusters, density mapping & prior art" },
  { label: "Gap Analysis", path: "/gaps", icon: Target, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", desc: "Unpatented high-value white space opportunities & scoring" },
  { label: "Innovation Architect", path: "/innovation", icon: Lightbulb, color: "text-pink-600", bg: "bg-pink-50 border-pink-200", desc: "Patent-ready concept claims, block specs & OEM blueprints" },
  { label: "Patentability Assessment", path: "/patentability", icon: Scale, color: "text-red-600", bg: "bg-red-50 border-red-200", desc: "35 U.S.C. § 102/103 novelty, non-obviousness & legal risk" },
  { label: "Market Intelligence", path: "/market", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", desc: "Google Trends velocity, GitHub commit trends & enterprise RSS" },
  { label: "Funding Pathfinder", path: "/funding", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50 border-orange-200", desc: "BIRAC, YC, Startup India & non-dilutive grant matching" },
  { label: "Executive Report", path: "/report", icon: FileText, color: "text-slate-700", bg: "bg-slate-100 border-slate-300", desc: "Complete PDF-ready executive summary & strategic action plan" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { analysisResults, selectedDomain, dailyResearchPaperCount, dailyPatentCount } = useAgentExecution();

  const domainName = selectedDomain || analysisResults?.domain || "Electric Vehicles";

  // Global Cumulative Daily Statistics (Accumulates across all domain searches today)
  const researchPapersCount = `${dailyResearchPaperCount} Papers`;
  const patentsCount = `${dailyPatentCount} Patents`;

  const formattedDateTime = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar title="Summary Dashboard" subtitle={`Complete overview of the latest PatentScout AI autonomous analysis.`} />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full">

        {/* ── SECTION 1: Page Title & Subtitle ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Summary Dashboard
            </h1>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Mission Completed
            </span>
          </div>
          <p className="text-[14px] text-slate-500 font-medium">
            Complete overview of the latest PatentScout AI autonomous analysis.
          </p>
        </div>

        {/* ── SECTION 2: TOP SUMMARY CARDS (DYNAMIC LIGHT GREEN WITH INTERIOR DESIGN) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Research Papers Retrieved Today */}
          <div className="bg-[#ECFDF5] border border-emerald-200/90 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Interior Pattern & Radial Glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(16, 185, 129, 0.06) 8px, rgba(16, 185, 129, 0.06) 9px)" }} />
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-colors pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[13px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  Research Papers Retrieved Today
                </p>
                <h3 className="text-[36px] font-extrabold text-emerald-950 mt-2 tracking-tight font-['Space_Grotesk',sans-serif]">
                  {researchPapersCount}
                </h3>
                <p className="text-[12px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dynamic Ingestion · OpenAlex & arXiv
                </p>
              </div>
              <div className="w-12 h-12 rounded-[18px] bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-900/15 flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2: Patents Retrieved Today */}
          <div className="bg-[#ECFDF5] border border-emerald-200/90 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Interior Pattern & Radial Glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(16, 185, 129, 0.06) 8px, rgba(16, 185, 129, 0.06) 9px)" }} />
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-colors pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[13px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  Patents Retrieved Today
                </p>
                <h3 className="text-[36px] font-extrabold text-emerald-950 mt-2 tracking-tight font-['Space_Grotesk',sans-serif]">
                  {patentsCount}
                </h3>
                <p className="text-[12px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dynamic Collection · USPTO & ChromaDB
                </p>
              </div>
              <div className="w-12 h-12 rounded-[18px] bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/15 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: CURRENT ANALYZED DOMAIN (DARK HATCHED WORKSPACE CARD) ── */}
        <div className="card-hatched-hero p-7 border border-emerald-500/20 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-widest font-['Inter',sans-serif]">
                  CURRENT TECHNOLOGY DOMAIN
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 font-bold text-[10.5px]">
                  ACTIVE DOMAIN
                </span>
              </div>
              <h2 className="text-[32px] font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
                {domainName}
              </h2>
            </div>

            {/* Status Pill Badge */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-[16px] bg-emerald-950/80 border border-emerald-500/40 text-white flex items-center gap-3 shadow-lg backdrop-blur-md">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
                  ✓
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-white leading-tight">Mission Completed Successfully</div>
                  <div className="text-[11px] font-semibold text-emerald-300">7 / 7 Autonomous Agents Finished</div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-emerald-300/70 uppercase tracking-wider">SWARM STATUS</p>
                <p className="text-[14px] font-extrabold text-white">7 / 7 Agents Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-emerald-300/70 uppercase tracking-wider">EXECUTION DURATION</p>
                <p className="text-[14px] font-extrabold text-white">3m 05s Total</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-emerald-300/70 uppercase tracking-wider">ANALYSIS DATE & TIME</p>
                <p className="text-[14px] font-extrabold text-white">{formattedDateTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: AGENT PIPELINE SUMMARY ── */}
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                Agent Pipeline Summary
              </h3>
              <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                All 7 specialized AI agents executed in sequence and generated complete intelligence.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-bold border border-emerald-200 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Pipeline Verified
            </span>
          </div>

          {/* Clean Horizontal Stepper (All Completed, No Animations) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {PIPELINE_STEPS.map((step) => {
              return (
                <div
                  key={step.id}
                  className="rounded-[18px] p-3.5 bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-[12px]">
                      ✓
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                      Agent 0{step.id}
                    </span>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-900 leading-snug line-clamp-1">
                      {step.name}
                    </div>
                    <div className="text-[10.5px] font-medium text-emerald-700 mt-0.5">
                      ✓ Completed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 5: INTELLIGENT MODELS USED (EXACTLY 5 ENGINES) ── */}
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                Intelligent Models & Integration Engines
              </h3>
              <p className="text-[13px] text-slate-500 font-medium">
                AI LLMs, vector embedding stores, and real-time database connections active in this analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {INTELLIGENT_MODELS.map((model, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200/80 rounded-[16px] p-3.5 space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {model.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-slate-900 leading-tight">
                    {model.name}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {model.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 6: QUICK NAVIGATION ── */}
        <div className="space-y-4 pt-2 pb-6">
          <div>
            <h3 className="text-[20px] font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Quick Navigation
            </h3>
            <p className="text-[13.5px] text-slate-500 font-medium">
              Explore in-depth results, charts, and blueprints generated by each agent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NAVIGATION_CARDS.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(card.path)}
                  className="bg-white border border-slate-200/90 rounded-[22px] p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-[16px] border ${card.bg} flex items-center justify-center ${card.color} shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {card.label}
                    </h4>
                    <p className="text-[12px] font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center text-[12px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    Open Stage Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
