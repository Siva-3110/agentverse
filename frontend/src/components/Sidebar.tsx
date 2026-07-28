import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Scroll, 
  AlertCircle, 
  Lightbulb, 
  ShieldCheck, 
  History,
  Settings,
  Atom
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Research", path: "/research", icon: FlaskConical },
    { name: "Patents", path: "/patents", icon: Scroll },
    { name: "Gaps", path: "/gaps", icon: AlertCircle },
    { name: "Innovation", path: "/innovation", icon: Lightbulb },
    { name: "Patentability", path: "/patentability", icon: ShieldCheck },
    { name: "History", path: "/history", icon: History },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-56 border-r border-white/5 bg-[#030408] flex flex-col h-full z-20", className)}>
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5 gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Atom className="w-4 h-4 text-white animate-pulse-slow" />
        </div>
        <span className="font-semibold text-[14px] bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent tracking-tight font-sans">
          PatentScout AI
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border",
                isActive
                  ? "bg-indigo-500/10 border-indigo-500/35 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                  : "border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5 hover:border-white/5"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 transition-transform duration-200", isActive ? "text-indigo-400 scale-105" : "text-zinc-500")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile summary */}
      <div className="p-4 border-t border-white/5 bg-[#020204]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-semibold text-xs text-white shadow-md">
            PS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-200 truncate">Analyst Mode</p>
            <p className="text-[9px] text-zinc-500 truncate">demo@patentscout.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
