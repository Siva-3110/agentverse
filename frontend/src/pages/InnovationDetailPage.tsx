import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, CheckCircle2, Lightbulb, User, Target, Code2, ArrowRight } from "lucide-react";
import { useAgentExecution } from "../hooks/useAgentExecution";
import Topbar from "../components/Topbar";

const TABS = [
  { id: "overview", label: "Overview & Persona" },
  { id: "architecture", label: "System Architecture" },
  { id: "benefits", label: "Commercial Benefits" }
];

export default function InnovationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysisResults, selectedDomain } = useAgentExecution();
  const [activeTab, setActiveTab] = useState("overview");

  const idx = parseInt(id || "0", 10);
  const ideas = analysisResults.innovation_ideas || [];
  const idea = ideas[idx] || ideas[0] || {
    name: "AI-Powered Battery Health Prediction Co-Processor",
    type: "HARDWARE & SOFTWARE",
    description: "An edge-AI hardware micro-controller implementing real-time high-frequency electrochemical impedance spectroscopy (EIS) to detect thermal runaway dendrites 15 minutes before thermal propagation.",
    target_user: "EV OEMs, Battery Pack Manufacturers, and Fleet Operations",
    based_on_gap: "Edge-AI Hardware Thermal Runaway Co-Processor"
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Innovation", path: "/innovation" },
          { label: idea.name }
        ]}
        title="Innovation Detail"
        subtitle={`Innovation Blueprint #0${idx + 1}`}
      />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        {/* Back + Actions */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button onClick={() => navigate(-1)} className="btn-ghost text-slate-500">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Innovation Architect</span>
          </button>
          <Link to="/patentability" className="btn-premium text-[13px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Evaluate Patentability</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="premium-card overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-200/50 px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="icon-box bg-gradient-to-br from-[#0B4F37] to-[#065F46] shadow-md shadow-emerald-900/20">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Innovation Blueprint #{String(idx + 1).padStart(2, "0")}</div>
                    <h1 className="text-[20px] font-extrabold text-slate-900 leading-tight">{idea.name}</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge-emerald">{idea.type}</span>
                  <span className="badge-slate">{selectedDomain}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 pt-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-[13px] font-semibold border-b-2 transition-all mr-1 ${activeTab === tab.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Executive Summary</div>
                    <p className="text-[14px] text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-[14px] border border-slate-200">
                      {idea.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-[14px] bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Target User</span>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800">{idea.target_user}</p>
                    </div>

                    <div className="p-4 rounded-[14px] bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-amber-600" />
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Research Gap Solved</span>
                      </div>
                      <p className="text-[13px] font-semibold text-slate-800">{idea.based_on_gap}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Architecture */}
              {activeTab === "architecture" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-slate-500" />
                    <h3 className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Hardware & Software System Architecture</h3>
                  </div>
                  <div className="terminal-console">
                    <div className="terminal-header">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">architecture.spec</span>
                    </div>
                    <div className="p-5 font-mono text-[12.5px] space-y-2 text-emerald-200/80">
                      <div className="text-emerald-400 font-bold">// SYSTEM ARCHITECTURE BLOCK DIAGRAM</div>
                      <div>[Layer 1] Internal Resistance Impedance Sensors → ADC High-Frequency Sampler</div>
                      <div>[Layer 2] Edge Neuromorphic Co-Processor (Multiphysics Neural Model)</div>
                      <div>[Layer 3] Real-Time Thermal Anomaly Warning Logic (15-min Lead Window)</div>
                      <div>[Layer 4] CAN-Bus Gateway → EV VCU Shutdown Signal</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Benefits */}
              {activeTab === "benefits" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">Commercial Benefits</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "Lifecycle Extension", desc: "Extends battery cell pack lifecycle by 40% under fast-charging cycles." },
                      { title: "Thermal Safety", desc: "Prevents micro-dendrite structural short circuits before thermal surges." },
                      { title: "BMS Plug-and-Play", desc: "Integrates directly into Tier-1 EV Battery Management Systems." }
                    ].map((b, bidx) => (
                      <div key={bidx} className="p-4 rounded-[14px] bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                        <h4 className="text-[13px] font-bold text-slate-800 mb-1">{b.title}</h4>
                        <p className="text-[12px] text-slate-500 leading-relaxed">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
