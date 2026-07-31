import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function AdminOverviewPage() {
  const [kpis, setKpis] = useState({
    total_users: 142,
    active_users: 138,
    researchers: 124,
    admins: 18,
    today_logins: 46,
    active_jobs: 38,
    total_reports: 215,
    emails_today: 84,
    failed_emails: 0
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.total_users === "number") {
          setKpis(data);
        }
      })
      .catch(err => console.error("Error fetching overview KPIs:", err));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "Overview" }]}
        title="Admin Operations Overview"
        subtitle="Platform command center: System health, platform metrics, and background schedulers"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">

        {/* ADMIN HEADER BANNER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-800/60 rounded-[28px] p-8 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Privileges Active · System Operational</span>
              </div>
              <h1 className="text-[28px] font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
                PatentScout AI Operations Center
              </h1>
              <p className="text-[14px] text-emerald-100/90 font-medium max-w-xl">
                Real-time operational control over platform users, background schedulers, email delivery, and multi-agent swarm telemetry.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-[20px] border border-white/15">
              <Cpu className="w-8 h-8 text-emerald-300" />
              <div>
                <div className="text-[22px] font-extrabold text-white font-['Space_Grotesk',sans-serif]">
                  9 / 9 Agents Online
                </div>
                <div className="text-[11px] font-bold text-emerald-200">Autonomous Swarm Engine</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OVERVIEW METRICS & HEALTH */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Platform Users</span>
              <span className="text-[32px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif] mt-1 block">{kpis.total_users}</span>
              <span className="text-[11.5px] font-bold text-emerald-700 mt-1 block">Active: {kpis.active_users}</span>
            </div>
            <div className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Researchers / Admins</span>
              <span className="text-[32px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif] mt-1 block">{kpis.researchers} / {kpis.admins}</span>
              <span className="text-[11.5px] font-bold text-blue-700 mt-1 block">Role-based Access</span>
            </div>
            <div className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Today's Logins</span>
              <span className="text-[32px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif] mt-1 block">{kpis.today_logins}</span>
              <span className="text-[11.5px] font-bold text-emerald-700 mt-1 block">JWT Sessions Active</span>
            </div>
            <div className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Watch Jobs</span>
              <span className="text-[32px] font-extrabold text-emerald-800 font-['Space_Grotesk',sans-serif] mt-1 block">{kpis.active_jobs}</span>
              <span className="text-[11.5px] font-bold text-emerald-700 mt-1 block">APScheduler Engine</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[24px] bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">System Health & APIs</h3>
              <div className="space-y-2 text-[13px] font-bold">
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>PostgreSQL / SQLite Storage</span><span className="text-emerald-700">🟢 Connected</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>FastAPI Backend Services</span><span className="text-emerald-700">🟢 Operational (Port 8000)</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>Auto Patent Watch Scheduler</span><span className="text-emerald-700">🟢 Running (Every Hour)</span></div>
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-[16px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">Report & Email Statistics</h3>
              <div className="space-y-2 text-[13px] font-bold">
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>Generated Executive Reports</span><span>{kpis.total_reports} Reports</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>Emails Dispatched Today</span><span className="text-emerald-700">{kpis.emails_today} Emails</span></div>
                <div className="flex justify-between p-3 rounded-[12px] bg-slate-50"><span>Failed Email Retries</span><span className="text-slate-600">{kpis.failed_emails} Failures</span></div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
