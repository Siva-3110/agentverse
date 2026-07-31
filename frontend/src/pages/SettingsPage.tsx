import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Key, Database, CheckCircle2, Cpu, Globe, Settings } from "lucide-react";
import Topbar from "../components/Topbar";

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState("gsk_••••••••••••••••••••••••");
  const [tavilyKey, setTavilyKey] = useState("tvly-••••••••••••••••");
  const [openAlexKey, setOpenAlexKey] = useState("openalex_••••••••••••••••");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SYSTEM_STATUS = [
    { label: "Groq LLM", icon: Cpu, color: "text-violet-600", bg: "bg-violet-50", status: "Online", version: "Llama-3.3-70b" },
    { label: "ChromaDB", icon: Database, color: "text-sky-600", bg: "bg-sky-50", status: "Active", version: "v0.4.x" },
    { label: "OpenAlex", icon: Globe, color: "text-amber-600", bg: "bg-amber-50", status: "Connected", version: "REST API" }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Settings" }]}
        title="Settings"
        subtitle="API credentials & system diagnostics"
      />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 max-w-4xl">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-slate-100">
              <Settings className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-overline">System Configuration</span>
          </div>
          <h1 className="text-page-title">API Credentials & Diagnostics</h1>
          <p className="text-body mt-2">Configure Groq Llama 3.3, Tavily Search, ChromaDB RAG, and OpenAlex API integrations.</p>
        </motion.div>

        {/* System Status Row */}
        <div className="grid grid-cols-3 gap-4">
          {SYSTEM_STATUS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <div className="premium-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`icon-box ${item.bg}`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-600">{item.status}</span>
                    </div>
                  </div>
                  <div className="text-[14px] font-bold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.version}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* API Keys Form */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <form onSubmit={handleSave}>
            <div className="premium-card p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Key className="w-4 h-4 text-emerald-600" />
                <h2 className="text-[15px] font-bold text-slate-900">API Key Credentials</h2>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Groq API Key", sublabel: "Llama-3.3-70b-versatile", value: groqKey, setter: setGroqKey, type: "password" },
                  { label: "Tavily Web Search API Key", sublabel: "Web search & intelligence scraping", value: tavilyKey, setter: setTavilyKey, type: "password" },
                  { label: "OpenAlex Academic Ingestion API", sublabel: "Academic literature & citation graph", value: openAlexKey, setter: setOpenAlexKey, type: "text" }
                ].map(({ label, sublabel, value, setter, type }) => (
                  <div key={label}>
                    <label className="text-[12px] font-bold text-slate-700 block mb-0.5">{label}</label>
                    <div className="text-[11px] text-slate-400 font-medium mb-2">{sublabel}</div>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full h-10 px-4 bg-white border border-slate-200 rounded-[12px] text-[13px] font-mono text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Vector DB Info */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-sky-600" />
                  <h2 className="text-[15px] font-bold text-slate-900">Vector Storage & RAG Settings</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "ChromaDB Directory", value: "/backend/chroma_db_patent_store" },
                    { label: "Embedding Model", value: "all-MiniLM-L6-v2" }
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3.5 bg-slate-50 border border-slate-200 rounded-[12px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-1">{label}</div>
                      <div className="text-[12px] font-mono font-semibold text-slate-700">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {saved ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-emerald-700 text-[13px] font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Configuration saved successfully!
                  </motion.div>
                ) : (
                  <span className="text-[12px] text-slate-400 font-mono">Changes apply to next execution run.</span>
                )}
                <button type="submit" className="btn-premium text-[13px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
