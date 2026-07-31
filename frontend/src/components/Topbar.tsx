import { Link } from "react-router-dom";
import { Bell, Settings, Sparkles, ChevronRight } from "lucide-react";
import { useAgentExecution } from "../hooks/useAgentExecution";

interface TopbarProps {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; path?: string }[];
}

export default function Topbar({ title, subtitle, crumbs }: TopbarProps) {
  const { isExecuting, selectedDomain, completedAgentIds } = useAgentExecution();

  return (
    <header className="topbar-glass h-[64px] min-h-[64px] px-7 flex items-center justify-between gap-6 sticky top-0 z-30">

      {/* Left: Breadcrumb or Title */}
      <div className="flex items-center gap-2 min-w-0">
        {crumbs && crumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                {c.path ? (
                  <Link
                    to={c.path}
                    style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: '#94A3B8' }}
                    className="hover:text-slate-700 transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.015em' }}>
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <div className="min-w-0">
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: '#0A0F1A', letterSpacing: '-0.02em', lineHeight: 1.2 }} className="truncate">
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 500, color: '#94A3B8', marginTop: 1 }} className="truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>



      {/* Right: Status + Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Pipeline pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[9px] bg-slate-50 border border-slate-200">
          <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${isExecuting ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 700, color: '#475569' }} className="whitespace-nowrap">
            {isExecuting ? "Executing…" : `${completedAgentIds.length}/7 Agents`}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-[9px] bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors group">
          <Bell className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-1 ring-white" />
        </button>

        {/* Settings */}
        <Link to="/settings">
          <div className="w-8 h-8 rounded-[9px] bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer group">
            <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700" />
          </div>
        </Link>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0B4F37] to-[#065F46] flex items-center justify-center cursor-pointer shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </header>
  );
}
