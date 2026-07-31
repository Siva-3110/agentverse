import { motion } from "framer-motion";
import { Clock, Search, ArrowUpRight, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";

const MOCK_HISTORY = [
  {
    id: 1, domain: "Electric Vehicles", date: "2024-07-25", agents: 7, status: "Complete",
    gaps: 3, innovations: 2, topScore: 88
  },
  {
    id: 2, domain: "Generative AI", date: "2024-07-20", agents: 7, status: "Complete",
    gaps: 5, innovations: 4, topScore: 92
  },
  {
    id: 3, domain: "Quantum Computing", date: "2024-07-15", agents: 5, status: "Partial",
    gaps: 2, innovations: 1, topScore: 76
  }
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Mission History" }]}
        title="Mission History"
        subtitle="Archived intelligence runs and completed analyses"
      />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-slate-100">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-overline">Mission History</span>
          </div>
          <h1 className="text-page-title">Past Analyses</h1>
          <p className="text-body mt-2">All previous intelligence runs across technology domains.</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search domain history..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-[12px] text-[13px] font-medium text-slate-700 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* History Cards */}
        <div className="space-y-4">
          {MOCK_HISTORY.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="premium-card p-5 group hover-lift">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[16px] font-bold text-slate-900">{item.domain}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${item.status === "Complete" ? "badge-emerald" : "badge-amber"}`}>
                        {item.status === "Complete" ? <CheckCircle2 className="w-3 h-3" /> : null}
                        {item.status}
                      </span>
                    </div>
                    <p className="text-caption mb-3">{item.date}</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { label: "Agents", value: `${item.agents}/7` },
                        { label: "Gaps Found", value: item.gaps },
                        { label: "Innovations", value: item.innovations },
                        { label: "Top Score", value: `${item.topScore}/100` }
                      ].map(m => (
                        <div key={m.label} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[10px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.label}</span>
                          <div className="text-[14px] font-bold text-slate-800">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="btn-ghost text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link to="/dashboard" className="btn-premium text-[12px] px-4 py-2">
                      <span>Restore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
