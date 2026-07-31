import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ShieldCheck, Target, Lightbulb,
  Scale, TrendingUp, DollarSign, FileText, Clock, Settings,
  Cpu, Sparkles, User, Eye, LogOut, ShieldAlert
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isUserAdmin = user?.role === "Admin";

  const NAV_SECTIONS = [
    {
      category: "MENU",
      items: [
        { path: "/mission-control", label: "Mission Control", icon: Cpu },
        { path: "/dashboard", label: "Summary Dashboard", icon: LayoutDashboard }
      ]
    },
    {
      category: "AGENT SWARM",
      items: [
        { path: "/research", label: "01 Research Intelligence", icon: BookOpen },
        { path: "/patents", label: "02 Patent Landscape", icon: ShieldCheck },
        { path: "/gaps", label: "03 Gap Analysis", icon: Target },
        { path: "/innovation", label: "04 Innovation Architect", icon: Lightbulb },
        { path: "/patentability", label: "05 Patentability Score", icon: Scale },
        { path: "/market", label: "06 Market Intelligence", icon: TrendingUp },
        { path: "/funding", label: "07 Funding Pathfinder", icon: DollarSign },
        { path: "/report", label: "08 Executive Report", icon: FileText },
        { path: "/auto-watch", label: "09 Auto Patent Watch", icon: Eye }
      ]
    },
    {
      category: "GENERAL",
      items: [
        { path: "/profile", label: "Profile", icon: User },
        { path: "/history", label: "Mission History", icon: Clock },
        { path: "/settings", label: "Settings", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-[264px] bg-[#CBE7D9] border-r border-emerald-300/70 flex flex-col h-full overflow-hidden select-none">

      {/* ── LOGO ── */}
      <div className="px-5 pt-5 pb-4 border-b border-emerald-300/60 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#0B4F37] to-[#065F46] flex items-center justify-center shadow-md shadow-emerald-900/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              PatentScout AI
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600, color: '#046A4E', lineHeight: 1.3, marginTop: 1 }}>
              Autonomous Swarm
            </div>
          </div>
        </Link>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-3.5 py-4 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            <div
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 700, color: '#046A4E', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              className="px-2.5 mb-2"
            >
              {section.category}
            </div>
            <div className="space-y-1">
              {section.items.map((item, iIdx) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" && item.path !== "/settings" && location.pathname.startsWith(item.path)) ||
                  (item.path === "/mission-control" && (location.pathname === "/mission" || location.pathname === "/mission-execution"));

                const Icon = item.icon;
                return (
                  <Link key={`${sIdx}-${iIdx}`} to={item.path}>
                    <motion.div
                      whileHover={{ x: isActive ? 0 : 2 }}
                      transition={{ duration: 0.15 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13px] font-semibold transition-all duration-250 cursor-pointer ${
                        isActive
                          ? "bg-[#065F46] text-white shadow-md shadow-emerald-900/15 font-bold"
                          : "text-slate-900 hover:bg-[#B2DEC8] hover:text-[#033B2B]"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-[#05845C]"}`} />
                      <span className="truncate">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── USER FOOTER CARD ── */}
      <div className="p-3 border-t border-emerald-300/60 bg-[#BFDFCE]">
        <div className="flex items-center justify-between p-2 rounded-[14px] bg-white/70 border border-emerald-300/40">
          <div className="min-w-0 pr-2">
            <div className="text-[12px] font-extrabold text-slate-900 truncate">
              {user ? `${user.first_name} ${user.last_name}` : "Sivaganesh B"}
            </div>
            <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {user?.role || "Admin"}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
