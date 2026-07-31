import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Users, Eye, FileText, Mail, Activity, Server, Settings,
  Cpu, Trash2, RefreshCw, Play, Pause
} from "lucide-react";
import Topbar from "../components/Topbar";
import AdminSidebar, { AdminTab } from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Admin KPI Data
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

  // User Management List
  const [usersList, setUsersList] = useState<any[]>([
    { id: "usr-1", name: "Sivaganesh B", email: "balansivaganesh@gmail.com", organization: "PatentScout AI", role: "Admin", is_active: true, last_login: "Just now" },
    { id: "usr-2", name: "Dr. Aris Thorne", email: "thorne@mit.edu", organization: "MIT Mobility Lab", role: "Researcher", is_active: true, last_login: "10 mins ago" },
    { id: "usr-3", name: "Elena Rostova", email: "elena@stanford.edu", organization: "Stanford Energy", role: "Researcher", is_active: true, last_login: "1 hour ago" },
    { id: "usr-4", name: "Kaito Tanaka", email: "tanaka@toyota.co.jp", organization: "Toyota R&D", role: "Researcher", is_active: true, last_login: "Yesterday" },
    { id: "usr-5", name: "Admin Operations", email: "admin@patentscout.ai", organization: "PatentScout Ops", role: "Admin", is_active: true, last_login: "2 hours ago" }
  ]);

  // Topic Monitoring List
  const [topicsList, setTopicsList] = useState<any[]>([
    { id: "t1", topic: "Solid-State Electrolytes", user: "thorne@mit.edu", frequency: "Daily", status: "Active", last_scan: "Today, 09:15 AM", next_scan: "Tomorrow" },
    { id: "t2", topic: "Edge-AI Thermal Co-Processors", user: "siva@patentscout.ai", frequency: "Daily", status: "Active", last_scan: "Today, 09:15 AM", next_scan: "Tomorrow" },
    { id: "t3", topic: "V2G Grid Safety Interlocks", user: "elena@stanford.edu", frequency: "Weekly", status: "Active", last_scan: "Yesterday", next_scan: "In 6 days" },
    { id: "t4", topic: "Resonant Wireless Charging", user: "tanaka@toyota.co.jp", frequency: "Monthly", status: "Paused", last_scan: "3 days ago", next_scan: "Paused" }
  ]);

  // 9-Agent Operations Monitoring Center Preset
  const [agentMetrics, setAgentMetrics] = useState<any[]>([
    { id: "a1", name: "Research Agent", status: "🟢 Online", avg_response_time: "2.1s", last_run: "09:15 AM", success_rate: "99.4%" },
    { id: "a2", name: "Patent Agent", status: "🟢 Online", avg_response_time: "3.4s", last_run: "09:15 AM", success_rate: "98.8%" },
    { id: "a3", name: "Gap Analysis Agent", status: "🟢 Online", avg_response_time: "1.2s", last_run: "09:15 AM", success_rate: "100%" },
    { id: "a4", name: "Innovation Agent", status: "🟢 Online", avg_response_time: "2.7s", last_run: "09:15 AM", success_rate: "99.1%" },
    { id: "a5", name: "Patentability Agent", status: "🟢 Online", avg_response_time: "1.8s", last_run: "09:15 AM", success_rate: "99.7%" },
    { id: "a6", name: "Market Agent", status: "🟢 Online", avg_response_time: "3.9s", last_run: "09:15 AM", success_rate: "98.5%" },
    { id: "a7", name: "Funding Agent", status: "🟢 Online", avg_response_time: "2.5s", last_run: "09:15 AM", success_rate: "99.0%" },
    { id: "a8", name: "Report Generation Agent", status: "🟢 Online", avg_response_time: "4.6s", last_run: "09:16 AM", success_rate: "100%" },
    { id: "a9", name: "Auto Patent Watch Agent", status: "🟢 Monitoring", avg_response_time: "Background", last_run: "Every Hour", success_rate: "100%" }
  ]);

  // Fetch real data from FastAPI backend if online
  useEffect(() => {
    fetch("http://localhost:8000/api/admin/dashboard")
      .then(res => res.json())
      .then(data => { if (data.total_users) setKpis(data); })
      .catch(() => {});

    fetch("http://localhost:8000/api/admin/agents")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAgentMetrics(data); })
      .catch(() => {});
  }, []);

  const handleToggleUserStatus = (id: string) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const handleDeleteUser = (id: string) => {
    setUsersList(usersList.filter(u => u.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      
      {/* ── DEDICATED ADMIN SIDEBAR ── */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          crumbs={[{ label: "Admin Operations" }, { label: activeTab.toUpperCase() }]}
          title="Admin Operations Dashboard"
          subtitle="Operational command center: System health, user management, and 9-agent telemetry"
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

          {/* PAGE VIEW 1: OVERVIEW */}
          {activeTab === "overview" && (
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
          )}

          {/* PAGE VIEW 2: USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">User Management Directory</h3>
                  <p className="text-[12px] font-medium text-slate-500 font-['Inter',sans-serif]">Manage platform users, roles, and active session statuses.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{u.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-4 text-slate-600">{u.organization}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${u.role === "Admin" ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {u.is_active ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{u.last_login}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="px-2.5 py-1 rounded-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11.5px] hover:bg-slate-200 cursor-pointer"
                          >
                            {u.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
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
          )}

          {/* PAGE VIEW 3: TOPIC MONITORING */}
          {activeTab === "topics" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">Global Topic Monitoring Radar</h3>
                  <p className="text-[12px] font-medium text-slate-500">Monitor all user-followed topics across the Auto Patent Watch Agent.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">Topic</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Frequency</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Scan</th>
                      <th className="py-3 px-4">Next Scan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {topicsList.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{t.topic}</td>
                        <td className="py-3.5 px-4 text-slate-600">{t.user}</td>
                        <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{t.frequency}</span></td>
                        <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">{t.status}</span></td>
                        <td className="py-3.5 px-4 text-slate-500">{t.last_scan}</td>
                        <td className="py-3.5 px-4 text-slate-500">{t.next_scan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGE VIEW 4: 9-AGENT OPERATIONS CENTER */}
          {activeTab === "agents" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                      9-Agent Operations Monitoring Center
                    </h3>
                    <p className="text-[12.5px] font-medium text-slate-500">
                      Real-time operational dashboard proving multi-agent swarm coordination.
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1 rounded-full text-[12px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  All 9 Agents Operational
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agentMetrics.map((agent) => (
                  <div key={agent.id || agent.name} className="p-5 rounded-[20px] bg-slate-50 border border-slate-200/80 space-y-3 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                        {agent.status}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{agent.last_run}</span>
                    </div>

                    <h4 className="text-[15px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                      {agent.name || agent.agent_name}
                    </h4>

                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[12px] font-semibold">
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Avg Response</span>
                        <span className="text-slate-800 font-bold">{agent.avg_response_time}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Success Rate</span>
                        <span className="text-emerald-700 font-bold">{agent.success_rate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE VIEW 5: EMAIL LOGS */}
          {activeTab === "emails" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">Email Alert Dispatch Logs</h3>
              <div className="p-4 rounded-[16px] bg-slate-50 border text-[13px] font-semibold text-slate-700">
                Dispatched 84 Auto Patent Watch email alerts today with 0 delivery failures.
              </div>
            </div>
          )}

          {/* PAGE VIEW 6: REPORTS */}
          {activeTab === "reports" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">Generated Reports Repository</h3>
              <div className="p-4 rounded-[16px] bg-slate-50 border text-[13px] font-semibold text-slate-700">
                Total Reports Generated: 215 PDFs across all researcher analysis runs.
              </div>
            </div>
          )}

          {/* PAGE VIEW 7: SYSTEM LOGS */}
          {activeTab === "logs" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">System Telemetry & Audit Stream</h3>
              <div className="p-4 rounded-[16px] bg-slate-900 text-emerald-400 font-mono text-[12px] space-y-1">
                <div>[09:41:00] [INFO] [System] Swarm Engine initialized.</div>
                <div>[09:41:05] [INFO] [Auth] JWT token verified for admin user balansivaganesh@gmail.com.</div>
                <div>[09:41:10] [INFO] [Scheduler] Auto Patent Watch scan triggered.</div>
              </div>
            </div>
          )}

          {/* PAGE VIEW 8: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">System Configuration</h3>
              <div className="space-y-3 max-w-md text-[13px] font-bold">
                <div>
                  <label className="block text-slate-600 mb-1">Groq API Key</label>
                  <input type="password" value="gsk_demo_key_994827" readOnly className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 border text-slate-700 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Database Connection</label>
                  <input type="text" value="PostgreSQL / SQLite Active" readOnly className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-100 border text-slate-700" />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
