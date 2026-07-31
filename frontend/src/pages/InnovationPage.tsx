import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, Tag, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const SG = { fontFamily: "'Space Grotesk', sans-serif" } as const;
const IN = { fontFamily: "Inter, sans-serif" } as const;

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "HARDWARE & SOFTWARE": { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "SOFTWARE PLATFORM": { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
  "HARDWARE": { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  "SOFTWARE": { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" }
};

export default function InnovationPage() {
  const { analysisResults, selectedDomain, setSelectedIdeaIndex } = useAgentExecution();
  const ideas = analysisResults?.innovation_ideas ?? [];
  const domain = selectedDomain || analysisResults?.domain || "Electric Vehicles";

  return (
    <div className="flex flex-col h-full" style={{ background: "#F2F5F8" }}>
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Innovation Architect" }]}
        title="Innovation Architect"
        subtitle="Patent-ready concept synthesis & architecture specs"
      />

      <main className="flex-1 overflow-y-auto px-7 py-5 space-y-5">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-pink-50">
              <Lightbulb className="w-4 h-4 text-pink-600" />
            </div>
            <span className="text-overline text-pink-600">Agent 04 · Innovation Architect</span>
          </div>
          <h1 className="page-title-accent">Innovation Blueprints</h1>
          <p className="mt-2 max-w-xl" style={{ ...IN, fontSize: 13.5, color: '#64748B', lineHeight: 1.65 }}>
            Patent-ready innovation concepts synthesized from research gaps in{" "}
            <strong style={{ color: '#0A0F1A', fontWeight: 700 }}>{domain}</strong>.
          </p>
        </motion.div>

        {/* ── IDEA CARDS ── */}
        <div className="space-y-4">
          {ideas.map((idea, idx) => {
            const typeStyle = TYPE_COLORS[idea.type] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0" };
            const isTop = idx === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
              >
                {isTop ? (
                  /* ── HERO HATCHED TOP IDEA ── */
                  <div className="card-hatched-hero p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span style={{ ...IN, fontSize: 10.5, fontWeight: 700, color: 'rgba(167,243,208,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Highest Scoring Innovation
                      </span>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-2">
                          <h2 style={{ ...SG, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.25 }}>{idea.name}</h2>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/25 bg-white/12 text-emerald-200" style={{ ...IN }}>
                            {idea.type}
                          </span>
                        </div>
                        <p className="mb-4" style={{ ...IN, fontSize: 13.5, color: 'rgba(209,250,229,0.75)', lineHeight: 1.65 }}>{idea.description}</p>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <div>
                              <div style={{ ...IN, fontSize: 9.5, fontWeight: 700, color: 'rgba(167,243,208,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Target User</div>
                              <div style={{ ...IN, fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{idea.target_user}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <div>
                              <div style={{ ...IN, fontSize: 9.5, fontWeight: 700, color: 'rgba(167,243,208,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Based on Gap</div>
                              <div style={{ ...IN, fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{idea.based_on_gap}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link to={`/innovation/${idx}`} onClick={() => setSelectedIdeaIndex(idx)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white text-[#0B4F37] text-[12.5px] font-bold transition-all hover:bg-emerald-50 cursor-pointer"
                          style={SG}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>View Architecture</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link to="/patentability"
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] bg-white/12 border border-white/20 text-white text-[12px] font-semibold hover:bg-white/20 transition-all cursor-pointer"
                          style={IN}>
                          Check Patentability
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── STANDARD IDEA CARD ── */
                  <div className="premium-card p-5 hover-lift">
                    <div className="flex flex-col lg:flex-row items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0 bg-slate-100">
                            <Lightbulb className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h2 style={{ ...SG, fontSize: 15, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em', lineHeight: 1.3 }}>{idea.name}</h2>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ color: typeStyle.color, background: typeStyle.bg, borderColor: typeStyle.border, fontFamily: "Inter, sans-serif" }}>
                                {idea.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mb-3.5" style={{ ...IN, fontSize: 13, color: '#64748B', lineHeight: 1.65 }}>{idea.description}</p>
                        <div className="flex flex-wrap gap-3">
                          <div>
                            <div style={{ ...IN, fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Target User</div>
                            <div style={{ ...IN, fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{idea.target_user}</div>
                          </div>
                          <div>
                            <div style={{ ...IN, fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Based on Gap</div>
                            <div style={{ ...IN, fontSize: 12.5, fontWeight: 600, color: '#334155' }}>{idea.based_on_gap}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link to={`/innovation/${idx}`} onClick={() => setSelectedIdeaIndex(idx)} className="btn-premium text-[12.5px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>View Architecture</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link to="/patentability" className="btn-secondary text-[12px] justify-center">Check Patentability</Link>
                        <Link to="/market" className="btn-secondary text-[12px] justify-center">View Market Data</Link>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
