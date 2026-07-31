import { motion } from "framer-motion";
import { TrendingUp, Globe, Building, Newspaper, ArrowUpRight } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const SG = { fontFamily: "'Space Grotesk', sans-serif" } as const;
const IN = { fontFamily: "Inter, sans-serif" } as const;

const TREND_DATA = [
  { month: "Jan", trend: 42, github: 55 }, { month: "Feb", trend: 55, github: 63 },
  { month: "Mar", trend: 68, github: 72 }, { month: "Apr", trend: 72, github: 80 },
  { month: "May", trend: 80, github: 88 }, { month: "Jun", trend: 89, github: 95 },
  { month: "Jul", trend: 95, github: 100 }
];

export default function MarketPage() {
  const { analysisResults, selectedDomain } = useAgentExecution();
  const domain = selectedDomain || analysisResults?.domain || "Electric Vehicles";
  const market = analysisResults?.market_analysis ?? [];

  const m = market[0] || {
    innovation_name: analysisResults?.innovation_ideas?.[0]?.name || `${domain} Innovation`,
    trend_score: 95,
    growth_trend: "Surging (+180%)",
    research_growth: "+210%",
    patent_growth: "+190%",
    enterprise_adoption: ["Microsoft", "Tesla", "Cisco", "IBM", "Palo Alto Networks"],
    startup_count: 15,
    key_insights: [
      `Public search velocity for ${domain} is up 180% year-over-year on Google Trends.`,
      `Major enterprises are actively acquiring ${domain} intellectual property portfolios.`,
      `Open-source GitHub developer activity encompasses 300+ active repositories.`,
      `High market opportunity score driven by enterprise adoption and regulatory pressure.`
    ],
    market_opportunity_score: 95,
    summary: `High commercial opportunity backed by enterprise adoption for ${domain}.`
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#F2F5F8" }}>
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Market Intelligence" }]}
        title="Market Intelligence"
        subtitle="Google Trends, GitHub velocity & Enterprise adoption signals"
      />

      <main className="flex-1 overflow-y-auto px-7 py-5 space-y-5">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-emerald-50">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-overline text-emerald-700">Agent 06 · Market Intelligence</span>
          </div>
          <h1 className="page-title-accent">Market Intelligence</h1>
          <p className="mt-2 max-w-xl" style={{ ...IN, fontSize: 13.5, color: '#64748B', lineHeight: 1.65 }}>
            Commercial demand signals and enterprise adoption trajectory for{" "}
            <strong style={{ color: '#0A0F1A', fontWeight: 700 }}>{domain}</strong> innovations.
          </p>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        {m && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Hero hatched card */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <div className="card-hatched-hero p-5 h-full min-h-[120px] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-[10px] bg-white/15 border border-white/20 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="arrow-btn">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div style={{ ...SG, fontSize: 34, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{m.trend_score}</div>
                  <div style={{ ...IN, fontSize: 11, color: 'rgba(167,243,208,0.8)', fontWeight: 600, marginTop: 4 }}>Trend Score /100</div>
                </div>
              </div>
            </motion.div>

            {[
              { label: "Growth Trend", value: m.growth_trend, icon: TrendingUp, color: "bg-blue-50", iconColor: "text-blue-700" },
              { label: "Research Growth", value: m.research_growth, icon: ArrowUpRight, color: "bg-violet-50", iconColor: "text-violet-700" },
              { label: "Active Startups", value: `${m.startup_count}`, icon: Building, color: "bg-amber-50", iconColor: "text-amber-700" }
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx + 1) * 0.07 }}>
                  <div className="premium-card p-5 h-full flex flex-col justify-between min-h-[120px]">
                    <div className={`icon-box ${metric.color} mb-3`}>
                      <Icon className={`w-4 h-4 ${metric.iconColor}`} />
                    </div>
                    <div>
                      <div style={{ ...SG, fontSize: 22, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.025em', lineHeight: 1.1 }}>{metric.value}</div>
                      <div style={{ ...IN, fontSize: 11.5, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{metric.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── CHART + ENTERPRISE PANEL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="premium-card p-6 h-full">
              <div className="mb-4">
                <h3 style={{ ...SG, fontSize: 17, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em' }}>Market Signal Trajectory</h3>
                <p className="mt-0.5" style={{ ...IN, fontSize: 12, color: '#94A3B8' }}>Google Trends vs. GitHub developer activity (last 7 months)</p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={TREND_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "Inter, sans-serif", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "Inter, sans-serif", fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload?.length) return (
                        <div className="premium-tooltip">
                          <div style={{ ...IN, fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>{label}</div>
                          {payload.map((p: any) => (
                            <div key={p.name} style={{ ...SG, fontSize: 12, fontWeight: 700, color: p.color }}>{p.name}: {p.value}</div>
                          ))}
                        </div>
                      );
                      return null;
                    }} />
                    <Line type="monotone" dataKey="trend" stroke="#0B4F37" strokeWidth={2.5} name="Google Trends" dot={{ fill: "#0B4F37", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="github" stroke="#8B5CF6" strokeWidth={2.5} name="GitHub Activity" dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Enterprise Adoption */}
          {m && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <div className="premium-card p-5 h-full">
                <div className="mb-4">
                  <h3 style={{ ...SG, fontSize: 16, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em' }}>Enterprise Adoption</h3>
                  <p className="mt-0.5" style={{ ...IN, fontSize: 11.5, color: '#94A3B8' }}>Companies actively in this space</p>
                </div>
                <div className="space-y-2">
                  {m.enterprise_adoption?.map((company) => (
                    <div key={company} className="flex items-center gap-2.5 p-2.5 rounded-[10px] bg-slate-50 border border-slate-200">
                      <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-shrink-0">
                        <span style={{ ...SG, fontSize: 10.5, fontWeight: 700, color: '#fff' }}>{company[0]}</span>
                      </div>
                      <span style={{ ...IN, fontSize: 13, fontWeight: 600, color: '#334155' }}>{company}</span>
                      <span className="ml-auto" style={{ ...IN, fontSize: 10.5, fontWeight: 700, color: '#059669' }}>Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── KEY INSIGHTS ── */}
        {m?.key_insights && (
          <div>
            <h2 style={{ ...SG, fontSize: 20, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em', marginBottom: 12 }}>Key Market Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {m.key_insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="premium-card p-4 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Newspaper className="w-3 h-3 text-emerald-700" />
                    </div>
                    <p style={{ ...IN, fontSize: 12.5, color: '#475569', lineHeight: 1.65 }}>{insight}</p>
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
