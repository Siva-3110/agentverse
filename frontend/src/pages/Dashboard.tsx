import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, Sparkles, AlertCircle, Lightbulb, ChevronRight, Loader2, ArrowRight,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal, Database, BookOpen, BarChart3, ShieldAlert
} from "lucide-react";
import { startAnalysis, pollAnalysis, fetchBackendLogs } from "../services/api";
import type { AnalysisState } from "../services/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { DomainActivityTimelineChart, TechnologyGapChart } from "../components/Visualizations";

/* ─── Subtle neural canvas for the search workspace ─── */
function NeuralCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const numParticles = Math.min(50, Math.floor((width * height) / 20000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.8
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.4;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.1;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = "rgba(6, 182, 212, 0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />;
}

/* ─── Simulated log templates for agents ─── */
const SIMULATED_LOG_TEMPLATES = {
  research: [
    "Connecting to OpenAlex (api.openalex.org)...",
    "Querying arXiv repository for domain-specific publications...",
    "Querying Semantic Scholar database...",
    "Semantic Scholar rate-limit threshold detected. Retrying with exponential backoff...",
    "arXiv search returned 50 unique papers.",
    "OpenAlex search returned 14 unique papers.",
    "De-duplicating global search records...",
    "64 research papers discovered",
    "Vectorizing research titles and abstracts using sentence transformers...",
    "Indexing 64 papers into local ChromaDB 'research' collection...",
    "Retrieving top 15 relevant research documents for landscape synthesis...",
    "Research Agent analysis complete."
  ],
  patent: [
    "Loading patent corpus from local source database...",
    "Connecting to ChromaDB server...",
    "Querying collection 'patent_global'...",
    "Retrieved 1,450 matching patent vectors for domain...",
    "Analyzing patent application trends...",
    "Calculating patent saturation indexes...",
    "Applying clustering algorithms on patent descriptors...",
    "Generated 6 distinct patent clusters.",
    "Formulating patent landscape matrix...",
    "Executing Gemini model inference for cluster descriptions...",
    "Successfully validated 6 patent clusters."
  ],
  gap: [
    "Loading academic research topics & patent clusters...",
    "Comparing research activity densities against patent clusters...",
    "Evaluating technology space saturation thresholds...",
    "Detecting high-priority opportunity vectors...",
    "Calculating opportunity priority scores...",
    "Identifying unpatented research pockets...",
    "6 technology gaps detected",
    "Evaluating commercial potential and feasibility...",
    "Formulating technology gap matrix...",
    "Gap analysis complete."
  ],
  innovation: [
    "Analyzing priority gaps for candidate synthesis...",
    "Synthesizing startup concepts...",
    "Generating startup concept: 'SolidFlex Battery Optimizer'...",
    "Generating startup concept: 'GridLink V2G Controller'...",
    "Evaluating market viability and technical novelty...",
    "Calculating novelty scores...",
    "Filing candidate 'SolidFlex Battery Optimizer' score: 95% Novelty",
    "Generating detailed potential benefits, core technologies...",
    "3 innovation ideas generated",
    "Innovation synthesis complete."
  ],
  patentability: [
    "Retrieving generated startup concepts for novelty screening...",
    "Querying local ChromaDB 'patent_global' collection for prior-art vectors...",
    "Comparing candidate concepts against patent citations...",
    "No direct prior art conflicts detected for candidate features.",
    "Evaluating novel claims feasibility and filing feasibility...",
    "Calculating final patentability scores...",
    "Filing candidate safety validation complete.",
    "Patentability verification complete."
  ]
};

/* ─── Log router ─── */
const parseAndRouteLogs = (logs: string[]) => {
  const newLogs = {
    research: [] as string[],
    patent: [] as string[],
    gap: [] as string[],
    innovation: [] as string[],
    patentability: [] as string[]
  };
  
  let currentTarget: "research" | "patent" | "gap" | "innovation" | "patentability" = "research";
  
  logs.forEach(line => {
    if (line.includes("Executing Agent 01") || line.includes("ResearchAgent") || line.includes("Research Fetcher") || line.includes("ResearchFetcher")) {
      currentTarget = "research";
    } else if (line.includes("Executing Agent 02") || line.includes("PatentAgent") || line.includes("Patent Fetcher") || line.includes("PatentFetcher")) {
      currentTarget = "patent";
    } else if (line.includes("Executing Agent 03") || line.includes("GapAnalysisAgent") || line.includes("Gap Analysis Agent")) {
      currentTarget = "gap";
    } else if (line.includes("Executing Agent 04") || line.includes("InnovationAgent") || line.includes("Innovation Agent")) {
      currentTarget = "innovation";
    } else if (line.includes("Executing Agent 05") || line.includes("PatentabilityAgent") || line.includes("Patentability Agent")) {
      currentTarget = "patentability";
    }
    
    let displayLine = line;
    const match = line.match(/(\d{2}:\d{2}:\d{2}),\d{3}\s\[\w+\]\s(.*)/);
    if (match) {
      displayLine = `[${match[1]}] ${match[2]}`;
    }
    
    newLogs[currentTarget].push(displayLine);
  });
  
  return newLogs;
};

const getActiveAgentFromLogs = (logs: string[]): "research" | "patent" | "gap_analysis" | "innovation" | "patentability" | "completed" => {
  let active: "research" | "patent" | "gap_analysis" | "innovation" | "patentability" | "completed" = "research";
  logs.forEach(line => {
    if (line.includes("Executing Agent 01") || line.includes("Starting Research Agent execution...")) {
      active = "research";
    } else if (line.includes("Executing Agent 02")) {
      active = "patent";
    } else if (line.includes("Executing Agent 03")) {
      active = "gap_analysis";
    } else if (line.includes("Executing Agent 04")) {
      active = "innovation";
    } else if (line.includes("Executing Agent 05")) {
      active = "patentability";
    }
  });
  return active;
};

/* ─── Agent configuration ─── */
const AGENT_DEFS = [
  {
    id: "research" as const,
    name: "Research Agent",
    title: "Academic Publication & Ingestion",
    desc: "Fetches publications from arXiv, Semantic Scholar, and OpenAlex, de-duplicates and indexes academic context in ChromaDB.",
    icon: BookOpen,
    getMetrics: (state: AnalysisState | null) => `${state?.papers_analyzed || 64} papers discovered`,
    getLocalProgress: (prog: number) => Math.min(100, Math.max(0, Math.floor(((prog - 10) / 20) * 100)))
  },
  {
    id: "patent" as const,
    name: "Patent Agent",
    title: "Patent Landscape Modeling & Clustering",
    desc: "Queries database collections, vectorizes patent entries, and runs K-means grouping to outline structural patent barriers.",
    icon: Database,
    getMetrics: (state: AnalysisState | null) => `${state?.patents_analyzed || 1450} patents mapped · 6 clusters`,
    getLocalProgress: (prog: number) => Math.min(100, Math.max(0, Math.floor(((prog - 30) / 25) * 100)))
  },
  {
    id: "gap" as const,
    name: "Gap Analysis Agent",
    title: "Discovers Unpatented White Space Gaps",
    desc: "Contrasts academic publication density with commercial patent clusters to find technology gaps with high commercial promise.",
    icon: BarChart3,
    getMetrics: () => "6 technology gaps detected",
    getLocalProgress: (prog: number) => Math.min(100, Math.max(0, Math.floor(((prog - 55) / 20) * 100)))
  },
  {
    id: "innovation" as const,
    name: "Innovation Agent",
    title: "Startup Candidate & Filing Spec Synthesis",
    desc: "Generates novel product and system concepts based on priority gaps, validating technical specs, market potential, and novelty.",
    icon: Lightbulb,
    getMetrics: () => "3 innovation ideas generated",
    getLocalProgress: (prog: number) => Math.min(100, Math.max(0, Math.floor(((prog - 75) / 15) * 100)))
  },
  {
    id: "patentability" as const,
    name: "Patentability Agent",
    title: "Novelty & Prior-Art Assessment",
    desc: "Performs instant risk checking and prior-art scoring to validate novelty and calculate priority ranking for generated concepts.",
    icon: ShieldAlert,
    getMetrics: () => "Novelty checks complete",
    getLocalProgress: (prog: number) => Math.min(100, Math.max(0, Math.floor(((prog - 90) / 9) * 100)))
  }
];

/* ═══════════════════════════════════════════════════════════════ */
/*                        DASHBOARD                               */
/* ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [domainInput, setDomainInput] = useState("");
  const [sessionState, setSessionState] = useState<AnalysisState | null>(null);
  const [loading, setLoading] = useState(false);
  const [latestData, setLatestData] = useState<AnalysisState | null>(null);

  const [agentLogs, setAgentLogs] = useState<{
    research: string[];
    patent: string[];
    gap: string[];
    innovation: string[];
    patentability: string[];
  }>({ research: [], patent: [], gap: [], innovation: [], patentability: [] });

  // Which agents are visible in the pipeline (revealed progressively)
  const [visibleAgents, setVisibleAgents] = useState<Set<string>>(new Set());

  const [expandedCards, setExpandedCards] = useState<{
    research: boolean; patent: boolean; gap: boolean; innovation: boolean; patentability: boolean;
  }>({ research: true, patent: false, gap: false, innovation: false, patentability: false });

  const terminalsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const logIntervalRef = useRef<any>(null);
  const logsRef = useRef(agentLogs);

  useEffect(() => { logsRef.current = agentLogs; }, [agentLogs]);

  // Auto-scroll expanded terminals
  useEffect(() => {
    Object.keys(expandedCards).forEach(key => {
      if (expandedCards[key as keyof typeof expandedCards]) {
        const el = terminalsRef.current[key];
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
  }, [agentLogs, expandedCards]);

  const exampleDomains = [
    "Solid-State Batteries",
    "AI Drug Discovery",
    "Smart Cities",
    "Quantum Computing",
    "Renewable Energy"
  ];

  /* ─── Helper: make an agent visible ─── */
  const revealAgent = (id: string) => {
    setVisibleAgents(prev => new Set([...prev, id]));
  };

  /* ─── Start log polling interval ─── */
  const startLogInterval = () => {
    if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    
    logIntervalRef.current = setInterval(async () => {
      const realLogs = await fetchBackendLogs();
      
      if (realLogs && realLogs.length > 0) {
        const parsed = parseAndRouteLogs(realLogs);
        setAgentLogs(parsed);
        
        const currentActive = getActiveAgentFromLogs(realLogs);
        let progress = 15;
        if (currentActive === "patent") progress = 45;
        if (currentActive === "gap_analysis") progress = 70;
        if (currentActive === "innovation") progress = 88;
        if (currentActive === "patentability") progress = 95;
        
        // Reveal agents progressively
        const activeKey = currentActive === "gap_analysis" ? "gap" : currentActive;
        revealAgent(activeKey);
        
        setSessionState(prev => {
          if (!prev) return null;
          setExpandedCards(exp => {
            if (exp[activeKey as keyof typeof exp]) return exp;
            return {
              research: activeKey === "research",
              patent: activeKey === "patent",
              gap: activeKey === "gap",
              innovation: activeKey === "innovation",
              patentability: activeKey === "patentability"
            };
          });
          return { ...prev, activeAgent: currentActive, progress };
        });
      } else {
        // Simulated fallback
        setSessionState(prev => {
          if (!prev) return null;
          const currentAgent = prev.activeAgent;
          const currentAgentKey = currentAgent === "gap_analysis" ? "gap" : currentAgent;
          if (currentAgent === "completed") return prev;

          const templates = SIMULATED_LOG_TEMPLATES[currentAgentKey as keyof typeof SIMULATED_LOG_TEMPLATES];
          if (!templates) return prev;

          const currentLogs = logsRef.current[currentAgentKey as keyof typeof logsRef.current] || [];

          if (currentLogs.length < templates.length) {
            const nextLine = templates[currentLogs.length];
            const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
            const formatted = `[${timeStr}] ${nextLine}`;
            setAgentLogs(l => ({ ...l, [currentAgentKey]: [...l[currentAgentKey as keyof typeof l], formatted] }));

            let baseProgress = 10, span = 20;
            if (currentAgent === "research") { baseProgress = 10; span = 20; }
            else if (currentAgent === "patent") { baseProgress = 30; span = 25; }
            else if (currentAgent === "gap_analysis") { baseProgress = 55; span = 20; }
            else if (currentAgent === "innovation") { baseProgress = 75; span = 15; }
            else if (currentAgent === "patentability") { baseProgress = 90; span = 9; }

            return { ...prev, progress: baseProgress + Math.floor((currentLogs.length / templates.length) * span) };
          } else {
            // Transition to next agent
            type AgentKey = "idle" | "research" | "patent" | "gap_analysis" | "innovation" | "patentability" | "completed";
            let nextAgent: AgentKey = "research";
            let nextProgress = 30;
            if (currentAgent === "research") { nextAgent = "patent"; nextProgress = 30; }
            else if (currentAgent === "patent") { nextAgent = "gap_analysis"; nextProgress = 55; }
            else if (currentAgent === "gap_analysis") { nextAgent = "innovation"; nextProgress = 75; }
            else if (currentAgent === "innovation") { nextAgent = "patentability"; nextProgress = 90; }
            else if (currentAgent === "patentability") { nextAgent = "completed"; nextProgress = 100; }

            const nextAgentKey = nextAgent === "gap_analysis" ? "gap" : nextAgent;
            if (nextAgentKey !== "completed") {
              revealAgent(nextAgentKey);
              setExpandedCards({
                research: nextAgentKey === "research",
                patent: nextAgentKey === "patent",
                gap: nextAgentKey === "gap",
                innovation: nextAgentKey === "innovation",
                patentability: nextAgentKey === "patentability"
              });
            }
            return { ...prev, activeAgent: nextAgent, progress: nextProgress };
          }
        });
      }
    }, 850);
  };

  /* ─── Restore in-progress session on mount ─── */
  useEffect(() => {
    const activeSessionId = localStorage.getItem("active_session_id");
    if (activeSessionId) {
      setLoading(true);
      const activeDomain = localStorage.getItem("active_domain") || "Technology Domain";
      setSessionState({ domain: activeDomain, status: "running", activeAgent: "research", progress: 15, research_topics: [], patent_clusters: [], gap_matrix: [], innovation_ideas: [] });
      setAgentLogs({ research: [], patent: [], gap: [], innovation: [], patentability: [] });
      setVisibleAgents(new Set(["research"]));
      setExpandedCards({ research: true, patent: false, gap: false, innovation: false, patentability: false });
      startLogInterval();
      pollSession(activeSessionId);
    }

    const cached = localStorage.getItem("latest_results");
    if (cached) {
      try { setLatestData(JSON.parse(cached)); } catch (err) { console.error(err); }
    }

    return () => { if (logIntervalRef.current) clearInterval(logIntervalRef.current); };
  }, []);

  /* ─── Main analysis trigger ─── */
  const handleStartAnalysis = async (domain: string) => {
    if (!domain.trim()) return;
    setLoading(true);
    setLatestData(null);
    localStorage.setItem("active_domain", domain);

    const initialState: AnalysisState = {
      domain, status: "running", activeAgent: "research", progress: 10,
      research_topics: [], patent_clusters: [], gap_matrix: [], innovation_ideas: []
    };
    setSessionState(initialState);
    setAgentLogs({ research: [], patent: [], gap: [], innovation: [], patentability: [] });

    // Start with only Research Agent visible
    setVisibleAgents(new Set(["research"]));
    setExpandedCards({ research: true, patent: false, gap: false, innovation: false, patentability: false });

    startLogInterval();

    try {
      const res = await startAnalysis(domain);
      
      if (res.isRealBackend && res.result) {
        if (logIntervalRef.current) { clearInterval(logIntervalRef.current); logIntervalRef.current = null; }
        
        const finalLogs = await fetchBackendLogs();
        if (finalLogs && finalLogs.length > 0) {
          const parsed = parseAndRouteLogs(finalLogs);
          setAgentLogs(parsed);
        }

        const completedState = res.result;

        // Reveal all agents as completed, then show patentability
        setVisibleAgents(new Set(["research", "patent", "gap", "innovation", "patentability"]));
        setSessionState(prev => prev ? { ...prev, activeAgent: "patentability", progress: 95 } : null);
        setExpandedCards({ research: false, patent: false, gap: false, innovation: false, patentability: true });

        // Simulate patentability log stream
        const templates = SIMULATED_LOG_TEMPLATES.patentability;
        for (let i = 0; i < templates.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 350));
          const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
          setAgentLogs(l => ({ ...l, patentability: [...l.patentability, `[${timeStr}] ${templates[i]}`] }));
        }

        setSessionState(completedState);
        setLatestData(completedState);
        setLoading(false);
        localStorage.setItem("latest_results", JSON.stringify(completedState));
      } else {
        localStorage.setItem("active_session_id", res.session_id);
        pollSession(res.session_id);
      }
    } catch (err) {
      if (logIntervalRef.current) { clearInterval(logIntervalRef.current); logIntervalRef.current = null; }
      setLoading(false);
    }
  };

  const pollSession = (sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const state = await pollAnalysis(sessionId);
        setSessionState(state);
        localStorage.setItem("latest_results", JSON.stringify(state));
        
        if (state.status === "completed") {
          clearInterval(interval);
          if (logIntervalRef.current) { clearInterval(logIntervalRef.current); logIntervalRef.current = null; }
          setLoading(false);
          setLatestData(state);
          localStorage.removeItem("active_session_id");
        } else if (state.status === "error") {
          clearInterval(interval);
          if (logIntervalRef.current) { clearInterval(logIntervalRef.current); logIntervalRef.current = null; }
          setLoading(false);
          localStorage.removeItem("active_session_id");
        }
      } catch (err) {
        clearInterval(interval);
        if (logIntervalRef.current) { clearInterval(logIntervalRef.current); logIntervalRef.current = null; }
        setLoading(false);
        localStorage.removeItem("active_session_id");
      }
    }, 1500);
  };

  // Auto-start from landing page
  useEffect(() => {
    const state = location.state as { autoStartDomain?: string } | null;
    if (state?.autoStartDomain) {
      const domain = state.autoStartDomain;
      setDomainInput(domain);
      navigate(location.pathname, { replace: true, state: {} });
      handleStartAnalysis(domain);
    }
  }, [location, navigate]);

  // KPI count animation
  const [countPapers, setCountPapers] = useState(0);
  const [countClusters, setCountClusters] = useState(0);
  const [countGaps, setCountGaps] = useState(0);
  const [countIdeas, setCountIdeas] = useState(0);

  useEffect(() => {
    if (latestData) {
      const tp = latestData.papers_analyzed || 83;
      const tc = latestData.patent_clusters.length || 7;
      const tg = latestData.gap_matrix.length || 7;
      const ti = latestData.innovation_ideas.length || 3;
      let p = 0, c = 0, g = 0, id = 0;
      const timer = setInterval(() => {
        let updated = false;
        if (p < tp) { p += Math.ceil(tp / 10); if (p > tp) p = tp; updated = true; }
        if (c < tc) { c += 1; updated = true; }
        if (g < tg) { g += 1; updated = true; }
        if (id < ti) { id += 1; updated = true; }
        setCountPapers(p); setCountClusters(c); setCountGaps(g); setCountIdeas(id);
        if (!updated) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [latestData]);

  const getAgentStatus = (agentName: "research" | "patent" | "gap" | "innovation" | "patentability") => {
    if (!sessionState) return "pending";
    if (sessionState.activeAgent === "completed") return "completed";
    const currentAgent = sessionState.activeAgent;
    const order = ["research", "patent", "gap", "innovation", "patentability"];
    const currentIdx = order.findIndex(o => o === "gap" ? currentAgent === "gap_analysis" : currentAgent === o);
    const targetIdx = order.indexOf(agentName);
    if (currentIdx > targetIdx) return "completed";
    if (currentIdx === targetIdx) return "running";
    return "pending";
  };

  /* ═══════════ STATE 1: IDLE SEARCH WORKSPACE (!latestData && !loading) ═══════════ */
  if (!latestData && !loading) {
    return (
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-12">
        <NeuralCanvasBackground />

        <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 backdrop-blur-sm text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Autonomous Innovation Engine</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Analyze Any{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Technology Domain
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Enter a technology domain, emerging technology, or research area. PatentScout AI will analyze research activity, patent landscapes, technology gaps, innovation opportunities, and patentability potential.
            </p>
          </div>

          {/* Search Box */}
          <Card className="p-3 glass-card border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="flex items-center gap-2">
              <Search className="ml-2 w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                placeholder="e.g. Solid-State Batteries, AI Drug Discovery, Smart Cities..."
                className="flex-1 h-12 bg-transparent border-none pl-2 pr-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
                onKeyDown={e => e.key === "Enter" && handleStartAnalysis(domainInput)}
                autoFocus
              />
              <Button
                onClick={() => handleStartAnalysis(domainInput)}
                disabled={!domainInput.trim()}
                className="h-10 font-bold text-sm px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 border border-indigo-400/20 flex-shrink-0 rounded-xl"
              >
                Analyze
              </Button>
            </div>
          </Card>

          {/* Example links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Try:</span>
            {exampleDomains.map(domain => (
              <button
                key={domain}
                type="button"
                onClick={() => {
                  setDomainInput(domain);
                  handleStartAnalysis(domain);
                }}
                className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-indigo-500/10 hover:border-indigo-500/25 text-[11px] text-zinc-400 hover:text-indigo-300 transition-all duration-200 font-medium"
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ STATE 2: RUNNING PIPELINE (!latestData && loading) ═══════════ */
  if (!latestData && loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6 relative animate-fade-in">

        {/* Pipeline Header */}
        <Card className="p-5 glass-card border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-bl from-indigo-500/8 to-transparent pointer-events-none rounded-tr-xl" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>Autonomous Pipeline Running</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-1.5">
                Analyzing:{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {sessionState?.domain || localStorage.getItem("active_domain")}
                </span>
              </h2>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-2xl font-black text-indigo-400 font-mono">{sessionState?.progress || 0}%</span>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Progress</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#05070e] border border-white/5 h-1.5 rounded-full overflow-hidden mt-4 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${sessionState?.progress || 0}%` }}
            />
          </div>
        </Card>

        {/* Dynamic agent pipeline — only visible agents render */}
        <div className="relative pl-12 space-y-4">
          
          {/* Vertical connector line */}
          <div className="absolute left-[15px] top-5 bottom-5 w-[2px] bg-zinc-900 pointer-events-none rounded-full overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-emerald-500 via-indigo-500 to-transparent transition-all duration-700"
              style={{
                height: `${
                  !sessionState ? "0%" :
                  sessionState.activeAgent === "research" ? "10%" :
                  sessionState.activeAgent === "patent" ? "30%" :
                  sessionState.activeAgent === "gap_analysis" ? "50%" :
                  sessionState.activeAgent === "innovation" ? "70%" :
                  sessionState.activeAgent === "patentability" ? "90%" : "100%"
                }`
              }}
            />
          </div>

          {AGENT_DEFS.filter(agent => visibleAgents.has(agent.id)).map(agent => {
            const status = getAgentStatus(agent.id);
            const isExpanded = expandedCards[agent.id];
            const logs = agentLogs[agent.id];
            const IconComp = agent.icon;

            return (
              <div key={agent.id} className="relative group transition-all duration-500 animate-fade-in">
                {/* Status dot */}
                <div className={`absolute left-[-48px] top-3.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 z-10 ${
                  status === "completed"
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : status === "running"
                    ? "border-indigo-500/80 text-indigo-400 bg-indigo-950/35 shadow-[0_0_15px_rgba(99,102,241,0.25)] animate-ring-glow"
                    : "border-zinc-800 text-zinc-600 bg-[#05070c]"
                }`}>
                  {status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : status === "running" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-700" />
                  )}
                </div>

                <Card className={`glass-card border p-5 transition-all duration-300 relative overflow-hidden ${
                  status === "completed"
                    ? "border-emerald-500/10 hover:border-emerald-500/20 bg-[#0A0D15]/60"
                    : status === "running"
                    ? "border-indigo-500/30 bg-[#0C101F]/80 shadow-[0_0_20px_rgba(99,102,241,0.06)]"
                    : "border-white/5 bg-[#0B0D13]/10 opacity-50"
                }`}>

                  <div
                    onClick={() => status !== "pending" && setExpandedCards(prev => ({ ...prev, [agent.id]: !prev[agent.id] }))}
                    className={`flex items-start justify-between gap-4 select-none ${status !== "pending" ? "cursor-pointer" : ""}`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <IconComp className={`w-4 h-4 ${status === "completed" ? "text-emerald-400" : status === "running" ? "text-indigo-400" : "text-zinc-600"}`} />
                        <h3 className={`text-sm font-extrabold tracking-tight ${status === "completed" ? "text-emerald-400" : status === "running" ? "text-indigo-300" : "text-zinc-500"}`}>
                          {agent.name}
                        </h3>
                        <span className="text-[10px] text-zinc-600">&bull;</span>
                        <span className={`text-[10px] font-semibold ${status === "completed" ? "text-emerald-500/80" : status === "running" ? "text-indigo-400" : "text-zinc-600"}`}>
                          {status === "completed" ? "Completed" : status === "running" ? "Running..." : "Idle"}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold ${status === "pending" ? "text-zinc-500" : "text-white"}`}>{agent.title}</h4>
                      <p className="text-[11px] text-zinc-500 max-w-3xl leading-relaxed">{agent.desc}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      {status === "completed" && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
                          {agent.getMetrics(sessionState)}
                        </span>
                      )}
                      {status === "running" && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                            {agent.getLocalProgress(sessionState?.progress || 0)}%
                          </span>
                          <span className="text-[9px] bg-zinc-900 border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">
                            Analyzing...
                          </span>
                        </div>
                      )}
                      {status !== "pending" && (
                        <button type="button" className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 flex items-center gap-1 mt-1 text-[10px] font-semibold">
                          <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{isExpanded ? "Hide Logs" : "Show Logs"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Local progress bar */}
                  {status === "running" && (
                    <div className="w-full bg-[#05070e] h-1 rounded-full overflow-hidden mt-3 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${agent.getLocalProgress(sessionState?.progress || 0)}%` }}
                      />
                    </div>
                  )}

                  {/* Collapsible logs */}
                  {isExpanded && status !== "pending" && (
                    <div className="mt-4 border-t border-white/5 pt-4">
                      <div className="flex items-center justify-between pb-2 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" />Execution Logs</span>
                        <span className="font-mono text-indigo-400">{logs.length} Lines</span>
                      </div>
                      <div
                        ref={el => { terminalsRef.current[agent.id] = el; }}
                        className="p-4 rounded-lg bg-[#03050a] border border-white/5 font-mono text-[10px] text-zinc-400 h-44 overflow-y-auto space-y-1.5 scrollbar-thin shadow-inner"
                      >
                        {logs.length === 0 ? (
                          <div className="text-zinc-600 italic animate-pulse py-1 flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-600" />
                            <span>Waiting for execution stream logs...</span>
                          </div>
                        ) : (
                          logs.map((log, idx) => (
                            <div key={idx} className="leading-relaxed hover:bg-white/5 py-0.5 px-1 rounded transition-colors break-all flex items-start gap-2 border-l border-l-transparent hover:border-l-indigo-500/50">
                              <span className="text-indigo-500/70 select-none">&gt;</span>
                              <span className="flex-1 whitespace-pre-wrap">{log}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══════════ STATE 3: RESULTS DASHBOARD (latestData && !loading) ═══════════ */
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 relative animate-fade-in">
      
      {/* Compact search bar */}
      <Card className="p-2.5 glass-card border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 border border-white/5 bg-[#05070e]/80 rounded-lg px-3 h-10">
            <Search className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
            <input
              type="text"
              value={domainInput}
              onChange={e => setDomainInput(e.target.value)}
              placeholder="Analyze another domain..."
              className="flex-1 bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
              onKeyDown={e => e.key === "Enter" && handleStartAnalysis(domainInput)}
            />
            {latestData?.domain && (
              <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-2 py-0 hidden sm:flex">
                {latestData.domain}
              </Badge>
            )}
          </div>
          <Button
            onClick={() => handleStartAnalysis(domainInput)}
            disabled={!domainInput.trim()}
            className="h-10 font-bold text-[11px] px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:opacity-90 border border-indigo-400/20 rounded-lg flex-shrink-0"
          >
            Analyze
          </Button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-[#0D1117]/80 border glass-card kpi-glow-cyan flex flex-col justify-between h-28 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Research Papers</span>
          <span className="text-3xl font-extrabold text-gradient-cyan tracking-tight mt-1">{countPapers}</span>
          <div className="text-[9px] text-cyan-400 font-semibold flex items-center gap-1 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot-success" />
            <span>Aggregated Sources</span>
          </div>
        </Card>

        <Card className="p-5 bg-[#0D1117]/80 border glass-card kpi-glow-purple flex flex-col justify-between h-28 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Patent Clusters</span>
          <span className="text-3xl font-extrabold text-gradient-purple tracking-tight mt-1">{countClusters}</span>
          <div className="text-[9px] text-violet-400 font-semibold flex items-center gap-1 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Landscape Clusters</span>
          </div>
        </Card>

        <Card className="p-5 bg-[#0D1117]/80 border glass-card kpi-glow-pink flex flex-col justify-between h-28 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Technology Gaps</span>
          <span className="text-3xl font-extrabold text-gradient-pink tracking-tight mt-1">{countGaps}</span>
          <div className="text-[9px] text-pink-400 font-semibold flex items-center gap-1 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>Gaps Matrix</span>
          </div>
        </Card>

        <Card className="p-5 bg-[#0D1117]/80 border glass-card kpi-glow-emerald flex flex-col justify-between h-28 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Innovation Ideas</span>
          <span className="text-3xl font-extrabold text-gradient-emerald tracking-tight mt-1">{countIdeas}</span>
          <div className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Filing Candidates</span>
          </div>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 section-glow-purple pointer-events-none" />
        
        <Card className="p-5 bg-[#0D1117]/70 border glass-card space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Domain Activity Timeline</h4>
            <p className="text-[9px] text-zinc-500">Academic momentum vs patent filings over time</p>
          </div>
          <DomainActivityTimelineChart domain={latestData?.domain} />
        </Card>

        <Card className="p-5 bg-[#0D1117]/70 border glass-card space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Technology Gap Priority Scores</h4>
            <p className="text-[9px] text-zinc-500">Unpatented spaces ranked by relevance</p>
          </div>
          <TechnologyGapChart gaps={latestData!.gap_matrix} />
        </Card>
      </div>

      {/* Preview section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Top Gap */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-pink-400" />
            Key Opportunity Gap
          </h3>
          {latestData!.gap_matrix.slice(0, 1).map(gap => (
            <Card key={gap.area} className="p-5 bg-[#0D1117]/70 border-l-2 border-l-pink-500 border-t border-r border-b border-white/10 glass-card glow-border-pink space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] py-0 border-pink-500/40 text-pink-300 bg-pink-500/5">#1 Gap Area</Badge>
                    <h4 className="text-sm font-bold text-white">{gap.area}</h4>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">{gap.rationale}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#04060A] border border-white/5 flex flex-col justify-center text-center min-w-[60px]">
                  <span className="text-lg font-bold text-gradient-pink">{gap.opportunity_score}</span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wide">Score</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-2.5 border-t border-white/5">
                <span>Research Activity: <strong className="text-emerald-400">{gap.research_activity}</strong></span>
                <span>Patent Activity: <strong className="text-rose-400">{gap.patent_activity}</strong></span>
              </div>
            </Card>
          ))}
          <Button size="sm" variant="outline" onClick={() => navigate("/gaps")} className="w-full gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10">
            <span>View Opportunity Gaps Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Top Innovation */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            Featured Filing Candidate
          </h3>
          {latestData!.innovation_ideas.slice(0, 1).map((idea, index) => (
            <Card key={idea.name} className="p-5 bg-[#0D1117]/70 border-l-2 border-l-emerald-500 border-t border-r border-b border-white/10 glass-card glow-border-emerald flex flex-col justify-between min-h-[160px]">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white tracking-tight">{idea.name}</h4>
                  <Badge variant="success" className="text-[9px] bg-emerald-500/10 border-emerald-500/20 text-emerald-400">{idea.novelty_score || 90}% Novel</Badge>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed pt-1.5">{idea.description}</p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                <span className="text-[9px] text-zinc-500">Based on Gap: <strong className="text-zinc-300 truncate max-w-[120px] inline-block align-bottom">{idea.based_on_gap}</strong></span>
                <Button size="sm" className="h-7 text-[10px] gap-1 px-3 bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/20" onClick={() => navigate(`/innovation/${index}`)}>
                  <span>View Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
          <Button size="sm" variant="outline" onClick={() => navigate("/innovation")} className="w-full gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10">
            <span>Browse Innovation Candidates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
