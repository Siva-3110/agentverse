import { motion } from "framer-motion";
import { ShieldCheck, Database, ArrowUpRight, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const SG = { fontFamily: "'Space Grotesk', sans-serif" } as const;
const IN = { fontFamily: "Inter, sans-serif" } as const;

const SATURATION_SCORE: Record<string, number> = {
  High: 85, Medium: 55, Low: 25, None: 5
};

const SATURATION_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: "#9F1239", bg: "#FFF1F2", border: "#FECDD3" },
  Medium: { color: "#92400E", bg: "#FFFBEB", border: "#FCD34D" },
  Low: { color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  None: { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" }
};

export default function PatentsPage() {
  const { analysisResults, selectedDomain } = useAgentExecution();

  // Correct field names from PatentCluster type: category, description, saturation, major_assignees
  const clusters = analysisResults?.patent_clusters ?? [];
  const domain = selectedDomain || analysisResults?.domain || "Electric Vehicles";

  const barData = clusters.map((c) => ({
    name: (c.category ?? "Unknown").split(" ").slice(0, 2).join(" "),
    score: SATURATION_SCORE[c.saturation] ?? 50
  }));

  const radarData = clusters.slice(0, 5).map((c) => ({
    subject: (c.category ?? "?").split(" ").slice(0, 2).join(" "),
    saturation: SATURATION_SCORE[c.saturation] ?? 50
  }));

  const highCount = clusters.filter(c => c.saturation === "High").length;
  const mediumCount = clusters.filter(c => c.saturation === "Medium").length;
  const lowCount = clusters.filter(c => c.saturation === "Low" || c.saturation === "None").length;

  return (
    <div className="flex flex-col h-full" style={{ background: "#F2F5F8" }}>
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Patent Landscape" }]}
        title="Patent Landscape"
        subtitle="Google Patents & ChromaDB vector embeddings"
      />

      <main className="flex-1 overflow-y-auto px-7 py-5 space-y-5">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-violet-50">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-overline text-violet-600">Agent 02 · Patent Landscape</span>
          </div>
          <h1 className="page-title-accent">Patent Landscape</h1>
          <p className="mt-2 max-w-xl" style={{ ...IN, fontSize: 13.5, color: '#64748B', lineHeight: 1.65 }}>
            Prior-art vector search across{" "}
            <strong style={{ color: '#0A0F1A', fontWeight: 700 }}>{domain}</strong>{" "}
            patent clusters. Saturation scored via ChromaDB semantic similarity.
          </p>
        </motion.div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hero hatched */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card-hatched-hero p-5 flex flex-col justify-between min-h-[130px]">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-[10px] bg-white/15 border border-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="arrow-btn">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div style={{ ...SG, fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {clusters.length}
                </div>
                <div style={{ ...IN, fontSize: 11.5, color: 'rgba(167,243,208,0.85)', fontWeight: 600, marginTop: 5 }}>
                  Patent Clusters
                </div>
              </div>
            </div>
          </motion.div>

          {[
            { label: "High Saturation", value: highCount, icon: Database, color: "bg-red-50", ic: "text-red-600" },
            { label: "Medium Saturation", value: mediumCount, icon: ShieldCheck, color: "bg-amber-50", ic: "text-amber-700" },
            { label: "Low / Open", value: lowCount, icon: ArrowUpRight, color: "bg-emerald-50", ic: "text-emerald-700" }
          ].map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx + 1) * 0.07 }}>
                <div className="premium-card p-5 flex flex-col justify-between min-h-[130px]">
                  <div className={`icon-box ${m.color}`}>
                    <Icon className={`w-4 h-4 ${m.ic}`} />
                  </div>
                  <div>
                    <div style={{ ...SG, fontSize: 32, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {m.value}
                    </div>
                    <div style={{ ...IN, fontSize: 11.5, color: '#64748B', fontWeight: 600, marginTop: 5 }}>
                      {m.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="lg:col-span-2">
            <div className="premium-card p-6 h-full">
              <div className="mb-4">
                <h3 style={{ ...SG, fontSize: 17, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em' }}>
                  Patent Saturation by Cluster
                </h3>
                <p className="mt-1" style={{ ...IN, fontSize: 12, color: '#94A3B8' }}>
                  Prior-art density per technology category
                </p>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10.5, fill: "#94A3B8", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                      axisLine={false} tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload?.length) return (
                          <div className="premium-tooltip">
                            <div style={{ ...IN, fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>{label}</div>
                            <div style={{ ...SG, fontSize: 13, fontWeight: 700, color: '#0B4F37' }}>
                              {payload[0].value}% saturation
                            </div>
                          </div>
                        );
                        return null;
                      }}
                    />
                    <Bar dataKey="score" fill="#0B4F37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div className="premium-card p-6 h-full">
              <div className="mb-3">
                <h3 style={{ ...SG, fontSize: 16, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em' }}>
                  Coverage Radar
                </h3>
                <p className="mt-0.5" style={{ ...IN, fontSize: 11.5, color: '#94A3B8' }}>
                  Prior-art coverage by area
                </p>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#F1F5F9" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: "#64748B", fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                    />
                    <Radar dataKey="saturation" stroke="#0B4F37" fill="#0B4F37" fillOpacity={0.13} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── CLUSTER CARDS ── */}
        <div>
          <h2 style={{ ...SG, fontSize: 20, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em', marginBottom: 14 }}>
            Patent Clusters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {clusters.map((cluster, idx) => {
              const satStyle = SATURATION_STYLE[cluster.saturation] ?? SATURATION_STYLE["Low"];
              const satScore = SATURATION_SCORE[cluster.saturation] ?? 50;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <div className="premium-card p-5 h-full hover-lift">

                    {/* Header row */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Hatched rank badge */}
                      <div
                        className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0"
                        style={{
                          background: '#07291E',
                          backgroundImage: `repeating-linear-gradient(-45deg,
                            transparent 0px, transparent 3px,
                            rgba(255,255,255,0.07) 3px, rgba(255,255,255,0.07) 4px)`
                        }}
                      >
                        <span style={{ ...SG, fontSize: 10, fontWeight: 700, color: '#6EE7B7' }}>
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 style={{ ...SG, fontSize: 14, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                          {cluster.category}
                        </h3>
                      </div>

                      {/* Saturation badge */}
                      <span
                        className="text-[10.5px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{
                          color: satStyle.color,
                          background: satStyle.bg,
                          borderColor: satStyle.border,
                          fontFamily: "Inter, sans-serif"
                        }}
                      >
                        {cluster.saturation} Sat.
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-3.5" style={{ ...IN, fontSize: 12.5, color: '#64748B', lineHeight: 1.65 }}>
                      {cluster.description}
                    </p>

                    {/* Saturation progress bar */}
                    <div className="flex items-center gap-3 mb-3.5">
                      <span style={{ ...IN, fontSize: 11.5, fontWeight: 700, color: '#0A0F1A' }}>
                        {satScore}%
                      </span>
                      <div className="flex-1 progress-bar">
                        <motion.div
                          className="progress-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${satScore}%` }}
                          transition={{ delay: 0.5 + idx * 0.08, duration: 0.75 }}
                          style={{
                            background: satScore >= 75
                              ? "linear-gradient(90deg, #7F1D1D, #EF4444)"
                              : "linear-gradient(90deg, #0B4F37, #10B981)"
                          }}
                        />
                      </div>
                      <span style={{ ...IN, fontSize: 10.5, color: '#94A3B8', fontWeight: 600 }}>saturated</span>
                    </div>

                    {/* Major Assignees */}
                    {cluster.major_assignees && cluster.major_assignees.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span style={{ ...IN, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Major Assignees
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.major_assignees.slice(0, 4).map((assignee) => (
                            <span key={assignee} className="badge-slate text-[10.5px]">
                              {assignee}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
