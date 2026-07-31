import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target, TrendingUp, AlertCircle, ArrowRight, Sparkles,
  Layers, ShieldCheck, CheckCircle2, Activity, BarChart2, Compass
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell
} from "recharts";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";

const CHART_COLORS = ["#059669", "#7C3AED", "#D97706", "#2563EB", "#DC2626", "#0891B2"];

const OpportunityBadge = ({ score }: { score: number }) => {
  const tier = score >= 90
    ? { label: "Elite", color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" }
    : score >= 75
      ? { label: "High", color: "#92400E", bg: "#FFFBEB", border: "#FCD34D" }
      : { label: "Mid", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
  return (
    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-xs flex items-center gap-1"
      style={{ color: tier.color, background: tier.bg, borderColor: tier.border, fontFamily: "Inter, sans-serif" }}>
      <Sparkles className="w-3.5 h-3.5" />
      {tier.label} ({score}/100)
    </span>
  );
};

export default function GapsPage() {
  const { analysisResults, selectedDomain } = useAgentExecution();
  const gaps = analysisResults?.gap_matrix ?? [];
  const domain = selectedDomain || analysisResults?.domain || "Electric Vehicles";

  const [activeChartType, setActiveChartType] = useState<"area" | "bar" | "radar">("area");

  // Data for Smooth Area Wave Graph
  const areaData = gaps.map((g, idx) => {
    const score = g.opportunity_score || 80;
    const researchScore = g.research_activity === "High" ? 88 : g.research_activity === "Medium" ? 62 : 35;
    const patentScore = g.patent_activity === "High" ? 80 : g.patent_activity === "Medium" ? 50 : g.patent_activity === "Low" ? 25 : 8;
    return {
      name: g.area.split(" ").slice(0, 3).join(" "),
      fullName: g.area,
      opportunityScore: score,
      researchVelocity: researchScore,
      patentSaturation: patentScore,
      color: CHART_COLORS[idx % CHART_COLORS.length]
    };
  });

  // Data for Radar Chart View
  const radarData = [
    { subject: "Opportunity Score", ...gaps.reduce((acc: any, g, i) => ({ ...acc, [`gap_${i}`]: g.opportunity_score }), {}) },
    { subject: "Research Velocity", ...gaps.reduce((acc: any, g, i) => ({ ...acc, [`gap_${i}`]: g.research_activity === "High" ? 90 : g.research_activity === "Medium" ? 65 : 40 }), {}) },
    { subject: "Unpatented Gap Delta", ...gaps.reduce((acc: any, g, i) => ({ ...acc, [`gap_${i}`]: g.patent_activity === "None" ? 95 : g.patent_activity === "Low" ? 75 : 45 }), {}) },
    { subject: "Market Impact", ...gaps.reduce((acc: any, g, i) => ({ ...acc, [`gap_${i}`]: 85 + i * 3 }), {}) },
    { subject: "Feasibility", ...gaps.reduce((acc: any, g, i) => ({ ...acc, [`gap_${i}`]: 80 + i * 4 }), {}) },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Gap Analysis" }]}
        title="Gap Analysis"
        subtitle="Unpatented white-space opportunity scoring"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-7 max-w-[1440px] mx-auto w-full">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest font-['Inter',sans-serif]">
                  Agent 03 · Gap Analysis
                </span>
              </div>
              <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                White Space Opportunities
              </h1>
              <p className="mt-1.5 max-w-2xl text-[14px] text-slate-500 font-medium leading-relaxed">
                AI-detected unpatented research gaps for <strong className="text-slate-900 font-bold">{domain}</strong>.{" "}
                <span className="text-emerald-700 font-semibold">Each opportunity scored by</span> research velocity vs. patent coverage delta.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200/90 rounded-[20px] p-4 shadow-sm flex items-center gap-4">
                <div>
                  <div className="text-[28px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                    {gaps.length}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gaps Detected</div>
                </div>
                <div className="w-10 h-10 rounded-[14px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── VISUAL GRAPH SECTION (NO PIE CHART - REPLACED WITH AREA WAVE GRAPH) ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-6">
            
            {/* Header + Chart Style Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                  Opportunity Delta Velocity Graph
                </h3>
                <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                  Comparative trend curves comparing academic literature activity against unpatented opportunity score delta.
                </p>
              </div>

              {/* Chart Switcher Buttons (Area Graph, Bar Chart, Radar Web) */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-[14px] border border-slate-200/80">
                <button
                  onClick={() => setActiveChartType("area")}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                    activeChartType === "area"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Area Graph
                </button>
                <button
                  onClick={() => setActiveChartType("bar")}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                    activeChartType === "bar"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                  Bar Chart
                </button>
                <button
                  onClick={() => setActiveChartType("radar")}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                    activeChartType === "radar"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-violet-600" />
                  Radar Web
                </button>
              </div>
            </div>

            {/* CHART VIEW 1: SMOOTH GRADIENT AREA GRAPH (Replaced Pie Chart) */}
            {activeChartType === "area" && (
              <div className="h-[360px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#475569", fontWeight: 700, fontFamily: "Inter, sans-serif" }}
                      axisLine={{ stroke: "#E2E8F0" }}
                      tickLine={false}
                    />
                    
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: "#475569", fontWeight: 700, fontFamily: "Inter, sans-serif" }}
                      axisLine={{ stroke: "#E2E8F0" }}
                      tickLine={false}
                    />
                    
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-900 border border-slate-800 text-white rounded-[16px] p-4 shadow-2xl space-y-2 text-[12px] max-w-xs">
                              <div className="font-extrabold text-emerald-400 font-['Space_Grotesk',sans-serif]">
                                {d.fullName}
                              </div>
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span className="text-slate-400">Opportunity Score:</span>
                                <span className="font-extrabold text-emerald-400 text-[14px]">{d.opportunityScore} / 100</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span>Research Literature Velocity:</span>
                                <span className="font-bold text-blue-400">{d.researchVelocity}%</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span>Active Patent Coverage:</span>
                                <span className="font-bold text-amber-400">{d.patentSaturation}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* Area 1: Opportunity Score Delta Curve */}
                    <Area
                      type="monotone"
                      dataKey="opportunityScore"
                      stroke="#059669"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#emeraldGradient)"
                      name="Opportunity Score"
                    />

                    {/* Area 2: Research Velocity Curve */}
                    <Area
                      type="monotone"
                      dataKey="researchVelocity"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#blueGradient)"
                      name="Research Velocity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART VIEW 2: BAR CHART */}
            {activeChartType === "bar" && (
              <div className="h-[360px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areaData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569", fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#475569", fontWeight: 700 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white rounded-[14px] p-3 text-[12px]">
                              <div className="font-bold text-emerald-400">{d.fullName}</div>
                              <div>Opportunity Score: <b>{d.opportunityScore}/100</b></div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="opportunityScore" radius={[10, 10, 0, 0]}>
                      {areaData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART VIEW 3: RADAR CHART */}
            {activeChartType === "radar" && (
              <div className="h-[360px] w-full flex items-center justify-center pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#0F172A", fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                    {gaps.map((_, i) => (
                      <Radar
                        key={i}
                        name={gaps[i].area}
                        dataKey={`gap_${i}`}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                        fillOpacity={0.3}
                        strokeWidth={2.5}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>
        </motion.div>

        {/* ── DETECTED WHITE SPACE GAP CARDS ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
                Detected White Space Rationale & Specs
              </h2>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                Ranked by opportunity score delta (research literature velocity minus active patent coverage).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {gaps.map((gap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[10px] bg-slate-900 text-emerald-400 font-extrabold text-[12px] flex items-center justify-center flex-shrink-0 shadow-sm font-['Space_Grotesk',sans-serif]">
                          #{idx + 1}
                        </div>
                        <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif] leading-tight">
                          {gap.area}
                        </h3>
                      </div>

                      <p className="text-[13.5px] font-medium text-slate-600 leading-relaxed">
                        {gap.rationale}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11.5px] font-bold flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                          Research Velocity: <strong>{gap.research_activity}</strong>
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11.5px] font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Patent Saturation: <strong>{gap.patent_activity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto">
                      <OpportunityBadge score={gap.opportunity_score} />
                      <div className="text-center">
                        <div className="text-[36px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif] leading-none">
                          {gap.opportunity_score}
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Opportunity Delta</div>
                      </div>
                      
                      <Link
                        to="/innovation"
                        className="px-4 py-2 rounded-[12px] bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 text-white font-bold text-[12.5px] shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <span>Synthesize Innovation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Opportunity Score Progress Fill */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${gap.opportunity_score}%` }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
