import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Eye, Play, Pause, RefreshCw, Trash2, Plus, CheckCircle2, ShieldCheck, BookOpen, DollarSign, TrendingUp, Sparkles, Filter, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";

export default function AutoPatentWatchPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<any[]>([
    { id: "top-1", topic: "Solid-State Battery Electrolytes", frequency: "Daily", status: "Active", last_checked: "Today, 09:15 AM", next_check: "Tomorrow, 09:15 AM" },
    { id: "top-2", topic: "V2G Smart Grid AI Interlocks", frequency: "Weekly", status: "Active", last_checked: "Yesterday, 04:30 PM", next_check: "In 6 days" },
    { id: "top-3", topic: "Wireless Resonant EV Charging Coils", frequency: "Monthly", status: "Paused", last_checked: "3 days ago", next_check: "Paused" }
  ]);

  const [notifications, setNotifications] = useState<any[]>([
    { id: "n1", topic: "Solid-State Battery Electrolytes", title: "4 New Research Papers Discovered", summary: "OpenAlex & arXiv ingested 4 new publications on sulfide ceramic separators.", type: "Paper", is_read: false, created_at: "10 mins ago" },
    { id: "n2", topic: "Solid-State Battery Electrolytes", title: "USPTO Patent Prior-Art Similarity Match", summary: "New claim disclosure matching high-voltage interface stability detected.", type: "Patent", is_read: false, created_at: "1 hour ago" },
    { id: "n3", topic: "V2G Smart Grid AI Interlocks", title: "Government Grant Pathway Matched", summary: "Startup India Seed Fund Scheme matched with 95% eligibility.", type: "Funding", is_read: true, created_at: "Yesterday" }
  ]);

  const [newTopic, setNewTopic] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [scanningId, setScanningId] = useState<string | null>(null);

  const handleFollowTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const created = {
      id: `top-${Date.now()}`,
      topic: newTopic.trim(),
      frequency,
      status: "Active",
      last_checked: "Just now",
      next_check: frequency === "Daily" ? "Tomorrow" : frequency === "Weekly" ? "In 7 days" : "In 30 days"
    };

    setTopics([created, ...topics]);
    setNewTopic("");
  };

  const handleToggleStatus = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, status: t.status === "Active" ? "Paused" : "Active" } : t));
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const handleForceScan = (id: string, topicName: string) => {
    setScanningId(id);
    setTimeout(() => {
      setScanningId(null);
      const newNotif = {
        id: `n-${Date.now()}`,
        topic: topicName,
        title: `Instant Watch Scan Completed for '${topicName}'`,
        summary: `Auto Patent Watch Agent completed deep scan across OpenAlex, arXiv, USPTO & ChromaDB.`,
        type: "Patent",
        is_read: false,
        created_at: "Just now"
      };
      setNotifications([newNotif, ...notifications]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Auto Patent Watch Agent" }]}
        title="Auto Patent Watch Agent"
        subtitle="Agent 09 · Continuous background monitoring for literature, patents, grants & market trends"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">

        {/* HERO BANNER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-hatched-hero p-8 rounded-[28px] border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Agent 09 · Auto Patent Watch Active</span>
              </div>
              <h1 className="text-[28px] font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
                Automated Innovation & Patent Radar
              </h1>
              <p className="text-[14px] text-emerald-100/90 font-medium max-w-xl">
                Configure technology domains to continuously scan OpenAlex, arXiv, USPTO, and ChromaDB vector store.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[20px] border border-white/15">
              <Eye className="w-8 h-8 text-emerald-300" />
              <div>
                <div className="text-[22px] font-extrabold text-white font-['Space_Grotesk',sans-serif]">
                  {topics.filter(t => t.status === "Active").length} Active Topics
                </div>
                <div className="text-[11px] font-bold text-emerald-200">Continuous Background Monitoring</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FOLLOW NEW TOPIC FORM */}
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-sm space-y-4">
          <h3 className="text-[16px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
            Follow New Innovation Domain
          </h3>
          <form onSubmit={handleFollowTopic} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g., Solid-State Electrolytes, Edge-AI Thermal Co-Processor"
                className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-slate-50 border border-slate-200 text-slate-900 text-[13.5px] font-medium focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="px-4 py-3 rounded-[14px] bg-slate-50 border border-slate-200 text-slate-900 text-[13.5px] font-bold outline-none cursor-pointer"
            >
              <option value="Daily">Daily Scan</option>
              <option value="Weekly">Weekly Scan</option>
              <option value="Monthly">Monthly Scan</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-[14px] bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[13.5px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Follow Topic</span>
            </button>
          </form>
        </div>

        {/* FOLLOWED TOPICS TABLE */}
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Followed Topics Radar
              </h3>
              <p className="text-[12px] font-medium text-slate-500">Manage active automated scanning frequencies and job triggers.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Technology Topic</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Checked</th>
                  <th className="py-3 px-4">Next Scheduled Scan</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {topics.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{t.topic}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {t.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${t.status === "Active" ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.status === "Active" ? "🟢 Active" : "⏸️ Paused"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{t.last_checked}</td>
                    <td className="py-3.5 px-4 text-slate-500">{t.next_check}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleForceScan(t.id, t.topic)}
                        disabled={scanningId === t.id}
                        className="px-2.5 py-1 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11.5px] hover:bg-emerald-100 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${scanningId === t.id ? 'animate-spin' : ''}`} />
                        Scan
                      </button>
                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        className="px-2.5 py-1 rounded-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11.5px] hover:bg-slate-200 cursor-pointer"
                      >
                        {t.status === "Active" ? <Pause className="w-3.5 h-3.5 inline mr-1" /> : <Play className="w-3.5 h-3.5 inline mr-1" />}
                        {t.status === "Active" ? "Pause" : "Resume"}
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(t.id)}
                        className="px-2.5 py-1 rounded-[10px] bg-red-50 text-red-700 font-bold text-[11.5px] hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NOTIFICATION FEED */}
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Auto Watch Detection Alerts ({notifications.filter(n => !n.is_read).length} Unread)
              </h3>
            </div>
            <button
              onClick={() => setNotifications(notifications.map(n => ({ ...n, is_read: true })))}
              className="text-[12px] font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Mark All Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-[18px] border flex items-start gap-3.5 transition-all ${n.is_read ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/60 border-emerald-200/80 shadow-xs'}`}>
                <div className="w-8 h-8 rounded-[12px] bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {n.type === "Paper" ? <BookOpen className="w-4 h-4 text-blue-600" /> : n.type === "Patent" ? <ShieldCheck className="w-4 h-4 text-violet-600" /> : <DollarSign className="w-4 h-4 text-orange-600" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13.5px] font-extrabold text-slate-900">{n.title}</h4>
                    <span className="text-[11px] font-medium text-slate-400">{n.created_at}</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-600 leading-relaxed">{n.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
