import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, FlaskConical, AlertCircle, Lightbulb,
  ChevronRight, TrendingUp, Inbox, FileText
} from "lucide-react";
import type { AnalysisState } from "../services/api";
import Topbar from "../components/Topbar";

export default function AnalysisResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisState | null>(null);
  const [activeTab, setActiveTab] = useState("gaps");

  useEffect(() => {
    const cached = localStorage.getItem("latest_results");
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (err) {
        console.error("Failed to parse cached results");
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <Topbar title="Analysis Results" subtitle="Run pipeline to view results" />
        <main className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-[20px] bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-section-title mb-3">No Results Yet</h2>
            <p className="text-body mb-6">Run the 7-agent pipeline from the Dashboard to generate intelligence results.</p>
            <Link to="/dashboard" className="btn-premium">
              <span>Go to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const TABS = [
    { id: "gaps", label: "Gap Analysis", icon: AlertCircle },
    { id: "innovations", label: "Innovations", icon: Lightbulb },
    { id: "market", label: "Market Intel", icon: TrendingUp },
    { id: "research", label: "Research", icon: FlaskConical }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Analysis Results" }]}
        title="Analysis Results"
        subtitle={`Domain: ${data.domain}`}
      />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(-1)} className="btn-ghost text-slate-500 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="premium-card-hero p-6 mb-5">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">Complete Analysis</div>
                <h1 className="text-[26px] font-extrabold text-white">{data.domain}</h1>
                <p className="text-[13px] text-emerald-100/70 mt-1">7-Agent swarm analysis complete</p>
              </div>
              <div className="flex gap-4 text-center flex-shrink-0">
                {[
                  { label: "Papers", value: `${(data.research_topics?.length ?? 4) * 24}+` },
                  { label: "Gaps", value: data.gap_matrix?.length ?? 0 },
                  { label: "Ideas", value: data.innovation_ideas?.length ?? 0 }
                ].map(m => (
                  <div key={m.label} className="bg-white/10 border border-white/15 rounded-[12px] px-4 py-2">
                    <div className="text-[22px] font-bold text-white">{m.value}</div>
                    <div className="text-[10px] text-emerald-200/80 font-semibold">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${activeTab === tab.id
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "gaps" && (
          <div className="space-y-4">
            {(data.gap_matrix ?? []).map((gap, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div className="premium-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-slate-900 mb-2">{gap.area}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{gap.rationale}</p>
                      <div className="flex gap-2">
                        <span className="badge-slate">Research: {gap.research_activity}</span>
                        <span className="badge-slate">Patents: {gap.patent_activity}</span>
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div className="text-[32px] font-bold text-emerald-700">{gap.opportunity_score}</div>
                      <div className="text-[10px] text-slate-400 font-bold">/100</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "innovations" && (
          <div className="space-y-4">
            {(data.innovation_ideas ?? []).map((idea, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div className="premium-card p-5">
                  <div className="flex items-start gap-3">
                    <div className="icon-box bg-pink-50 flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-bold text-slate-900">{idea.name}</h3>
                        <span className="badge-slate">{idea.type}</span>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{idea.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "market" && (
          <div className="space-y-4">
            {(data.market_analysis ?? []).map((m, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div className="premium-card p-5">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-2">{m.innovation_name}</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Trend Score", value: m.trend_score },
                      { label: "Growth", value: m.growth_trend },
                      { label: "Startups", value: m.startup_count }
                    ].map(metric => (
                      <div key={metric.label} className="bg-slate-50 border border-slate-200 rounded-[10px] p-3 text-center">
                        <div className="text-[20px] font-bold text-slate-900">{metric.value}</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {m.key_insights?.map((insight, iidx) => (
                      <div key={iidx} className="flex items-start gap-2 text-[12px] text-slate-500">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "research" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.research_topics ?? []).map((topic, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div className="premium-card p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-[14px] font-bold text-slate-900">{topic.topic}</h3>
                    <span className="badge-slate">{topic.research_activity}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed mb-3">{topic.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-slate-700">Citation: {topic.citation_strength}/100</span>
                    <div className="flex-1 progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${topic.citation_strength}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
