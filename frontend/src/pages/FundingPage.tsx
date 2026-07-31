import { motion } from "framer-motion";
import { DollarSign, CheckCircle2, ExternalLink, ArrowRight, Globe, Layers, Target, Sparkles } from "lucide-react";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const SG = { fontFamily: "'Space Grotesk', sans-serif" } as const;
const IN = { fontFamily: "Inter, sans-serif" } as const;

const CATEGORY_STYLES: Record<string, { bg: string; color: string; border: string; icon: any }> = {
  "Government Grant": { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", icon: Globe },
  "Accelerator": { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", icon: Target },
  "Incubator": { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA", icon: Layers }
};

const PHASE_COLORS = ["#0B4F37", "#7C3AED", "#F59E0B", "#EF4444"];

const MatchScore = ({ score }: { score: number }) => {
  const color = score >= 90 ? "#10B981" : score >= 75 ? "#F59E0B" : "#64748B";
  return (
    <div className="flex flex-col items-center gap-0">
      <div style={{ ...SG, fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</div>
      <div style={{ ...IN, fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>/100 Match</div>
    </div>
  );
};

export default function FundingPage() {
  const { analysisResults, selectedDomain } = useAgentExecution();
  const domain = selectedDomain || analysisResults?.domain || "Electric Vehicles";

  const funding = analysisResults?.funding_analysis || {
    innovation_name: analysisResults?.innovation_ideas?.[0]?.name || `${domain} Innovation`,
    domain: domain,
    country: "Global",
    startup_stage: "Prototype",
    top_opportunities: [
      {
        name: `${domain} Deep-Tech Seed Grant`,
        organization: "Government & Enterprise Innovation Fund",
        category: "Government Grant",
        funding_amount: "$250,000 Non-Dilutive Grant",
        country: "Global",
        eligibility: `Startups developing novel physical/software products in ${domain}`,
        technology_focus: `${domain}, AI, Hardware, CleanTech, SaaS`,
        startup_stage: "Prototype",
        benefits: ["Non-Dilutive Grant", "Incubation Support", "Market Mentorship"],
        deadline: "Rolling / Open Application",
        official_website: "https://seedfund.startupindia.gov.in",
        match_score: 95,
        reason_for_recommendation: `High keyword and technology relevance for ${domain} prototype applications.`
      },
      {
        name: "Y Combinator S24 / W25 Batch",
        organization: "Y Combinator",
        category: "Accelerator",
        funding_amount: "$500,000 for 7% equity",
        country: "Global / US",
        eligibility: `Early-stage tech startups building breakthrough ${domain} solutions`,
        technology_focus: `${domain}, Developer Tools, AI, B2B SaaS`,
        startup_stage: "Prototype",
        benefits: ["$500k Investment", "YC Partner Mentorship", "Demo Day Access"],
        deadline: "Open Application",
        official_website: "https://www.ycombinator.com",
        match_score: 92,
        reason_for_recommendation: `Top-tier global seed accelerator program matching high growth tech in ${domain}.`
      },
      {
        name: "Forge Forward Deep-Tech Innovation Accelerator",
        organization: "Forge Innovation & Ventures",
        category: "Incubator",
        funding_amount: "$75,000 Prototype Grant & Seed Capital",
        country: "India",
        eligibility: `Deep-Tech startups developing physical/AI products in ${domain}`,
        technology_focus: `${domain}, Clean Energy, Sensors, AI Systems`,
        startup_stage: "Prototype",
        benefits: ["Prototyping Grants", "Hardware Lab Access", "Corporate Pilot Connects"],
        deadline: "Rolling / Open Application",
        official_website: "https://www.forgeforward.in",
        match_score: 90,
        reason_for_recommendation: `Direct alignment with target technology domain (${domain}) and hardware lab access.`
      }
    ],
    funding_strategy: [
      { phase: "Phase 1: Non-Dilutive Grant", program_name: `${domain} Deep-Tech Seed Grant`, action: "Submit grant proposal for prototype development and sensor testing." },
      { phase: "Phase 2: Tech Acceleration", program_name: "Y Combinator Batch", action: "Apply to accelerator for funding, cloud credits & partner advisory." },
      { phase: "Phase 3: Deep-Tech Incubation", program_name: "Forge Forward Accelerator", action: "Join incubator cell for prototyping grants & pilot deployment." }
    ],
    summary: `Phased non-dilutive grant and top accelerator trajectory for ${domain}.`
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#F2F5F8" }}>
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Funding Pathfinder" }]}
        title="Funding Pathfinder"
        subtitle="Grant, VC & incubator auto-matching engine"
      />

      <main className="flex-1 overflow-y-auto px-7 py-5 space-y-5">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-orange-50">
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-overline text-orange-600">Agent 07 · Funding Pathfinder</span>
          </div>
          <h1 className="page-title-accent">Funding Opportunities</h1>
          <p className="mt-2 max-w-xl" style={{ ...IN, fontSize: 13.5, color: '#64748B', lineHeight: 1.65 }}>
            AI-matched grants, accelerators & incubators for{" "}
            <strong style={{ color: '#0A0F1A', fontWeight: 700 }}>{domain}</strong> innovations.
          </p>
        </motion.div>

        {/* ── HERO HATCHED SUMMARY BANNER ── */}
        {funding && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="card-hatched-hero p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span style={{ ...IN, fontSize: 10.5, fontWeight: 700, color: 'rgba(167,243,208,0.85)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Funding Summary
                    </span>
                  </div>
                  <div style={{ ...SG, fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>
                    {funding.innovation_name}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[funding.domain, funding.country, funding.startup_stage].filter(Boolean).map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full border border-white/20 bg-white/10 text-white text-[11px] font-semibold" style={IN}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ ...SG, fontSize: 42, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {funding.top_opportunities?.length}
                  </div>
                  <div style={{ ...IN, fontSize: 13, color: 'rgba(167,243,208,0.75)', fontWeight: 600, marginTop: 4 }}>Matched Programs</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── OPPORTUNITY CARDS ── */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 style={{ ...SG, fontSize: 20, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em' }}>Top Matched Programs</h2>
            <span className="badge-emerald">{funding?.top_opportunities?.length ?? 0} Matches</span>
          </div>

          <div className="space-y-3.5">
            {funding?.top_opportunities?.map((opp, idx) => {
              const catStyle = CATEGORY_STYLES[opp.category] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0", icon: Globe };
              const CatIcon = catStyle.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.09 }}>
                  <div className="premium-card p-5 hover-lift">
                    <div className="flex flex-col lg:flex-row items-start gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="icon-box flex-shrink-0" style={{ background: catStyle.bg, border: `1px solid ${catStyle.border}` }}>
                            <CatIcon className="w-4 h-4" style={{ color: catStyle.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <h3 style={{ ...SG, fontSize: 14.5, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{opp.name}</h3>
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ color: catStyle.color, background: catStyle.bg, borderColor: catStyle.border, fontFamily: "Inter, sans-serif" }}>
                                {opp.category}
                              </span>
                            </div>
                            <div style={{ ...IN, fontSize: 12, fontWeight: 600, color: '#64748B' }}>{opp.organization}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3.5">
                          {[
                            { label: "Funding", value: opp.funding_amount },
                            { label: "Eligibility", value: opp.eligibility },
                            { label: "Deadline", value: opp.deadline },
                            { label: "Country", value: opp.country }
                          ].map(({ label, value }) => (
                            <div key={label} className="p-2.5 bg-slate-50 rounded-[10px] border border-slate-200">
                              <div style={{ ...IN, fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{label}</div>
                              <div style={{ ...IN, fontSize: 11.5, fontWeight: 700, color: '#334155' }}>{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {opp.benefits?.map((b) => (
                            <div key={b} className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span style={{ ...IN, fontSize: 11, fontWeight: 600, color: '#065F46' }}>{b}</span>
                            </div>
                          ))}
                        </div>

                        <p style={{ ...IN, fontSize: 12, color: '#94A3B8', fontStyle: 'italic', lineHeight: 1.5 }}>{opp.reason_for_recommendation}</p>
                      </div>

                      <div className="flex flex-col items-center gap-3 flex-shrink-0">
                        <MatchScore score={opp.match_score} />
                        <a href={opp.official_website} target="_blank" rel="noreferrer" className="btn-premium text-[12px] px-4 py-2">
                          <span>Apply Now</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── FUNDING STRATEGY ROADMAP ── */}
        {funding?.funding_strategy && (
          <div>
            <h2 style={{ ...SG, fontSize: 20, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em', marginBottom: 12 }}>Strategic Funding Roadmap</h2>
            <div className="space-y-3">
              {funding.funding_strategy.map((phase, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.09 }}>
                  <div className="premium-card p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 text-white text-[14px] font-bold"
                      style={{ ...SG, background: PHASE_COLORS[idx % PHASE_COLORS.length] }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ ...IN, fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{phase.phase}</div>
                      <div style={{ ...SG, fontSize: 14, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.01em', marginBottom: 3 }}>{phase.program_name}</div>
                      <p style={{ ...IN, fontSize: 12.5, color: '#64748B', lineHeight: 1.6 }}>{phase.action}</p>
                    </div>
                    {idx < (funding.funding_strategy?.length ?? 0) - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-3 hidden lg:block" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
