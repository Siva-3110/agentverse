import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity, Users, Eye, Cpu, Mail, FileText, Server, Settings,
  LogOut, ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ADMIN_NAV_ITEMS = [
  { path: "/admin/overview", label: "Overview", icon: Activity },
  { path: "/admin/users", label: "User Management", icon: Users },
  { path: "/admin/topic-monitoring", label: "Topic Monitoring", icon: Eye },
  { path: "/admin/agents", label: "9-Agent Operations", icon: Cpu },
  { path: "/admin/email-logs", label: "Email Logs", icon: Mail },
  { path: "/admin/reports", label: "Reports Hub", icon: FileText },
  { path: "/admin/system-logs", label: "System Logs", icon: Server },
  { path: "/admin/settings", label: "Settings", icon: Settings }
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[264px] bg-[#064E3B] border-r border-emerald-800/80 flex flex-col h-full overflow-hidden select-none text-white flex-shrink-0">

      {/* ── LOGO & BRANDING ── */}
      <div className="px-5 pt-5 pb-4 border-b border-emerald-800/60 flex items-center justify-between">
        <Link to="/admin/overview" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-950/40 flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-950" />
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              PatentScout Admin
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 700, color: '#34D399', lineHeight: 1.3, marginTop: 1 }}>
              Platform Operations
            </div>
          </div>
        </Link>
      </div>

      {/* ── ADMIN NAVIGATION ITEMS ── */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto font-['Inter',sans-serif]">
        <div
          style={{ fontSize: 10.5, fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          className="px-2.5 mb-2"
        >
          ADMINISTRATIVE CONTROL
        </div>

        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: isActive ? 0 : 2 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30 font-bold"
                    : "text-emerald-100 hover:bg-emerald-800/60 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-emerald-300"}`} />
                <span className="truncate">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── ADMIN FOOTER USER CARD ── */}
      <div className="p-3 border-t border-emerald-800/60 bg-emerald-950/80">
        <div className="flex items-center justify-between p-2.5 rounded-[14px] bg-emerald-900/60 border border-emerald-700/50">
          <div className="min-w-0 pr-2">
            <div className="text-[12px] font-extrabold text-white truncate">
              {user ? user.email : "balansivaganesh@gmail.com"}
            </div>
            <div className="text-[10px] font-extrabold text-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Admin Account
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-[10px] bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
