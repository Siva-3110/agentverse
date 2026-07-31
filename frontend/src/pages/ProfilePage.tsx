import { motion } from "framer-motion";
import { User, Shield, Sparkles, Key, CheckCircle2, Cpu, Database, Award, Zap, Mail, Globe, MapPin, Building2 } from "lucide-react";
import Topbar from "../components/Topbar";
import { useAgentExecution } from "../hooks/useAgentExecution";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { selectedDomain } = useAgentExecution();
  const { user } = useAuth();

  const fullName = user ? `${user.first_name} ${user.last_name}` : "Sivaganesh B";
  const userRole = user?.role || "Admin";
  const userOrg = user?.organization || "PatentScout AI";
  const userEmail = user?.email || "siva@patentscout.ai";

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Profile" }]}
        title="User Profile & Credentials"
        subtitle="Enterprise Swarm Commander & System Authentication"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-7 max-w-[1440px] mx-auto w-full">

        {/* ── HEADER USER CARD ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-hatched-hero p-8 rounded-[28px] border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-lg shadow-emerald-950/40">
                  <div className="w-full h-full bg-[#064E3B] rounded-[18px] flex items-center justify-center text-white text-2xl font-extrabold font-['Space_Grotesk',sans-serif]">
                    {fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-[26px] font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
                      {fullName} 👋
                    </h1>
                    <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
                      {userRole}
                    </span>
                  </div>
                  <p className="text-[13.5px] font-medium text-emerald-200/90 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    {userEmail}
                    <span className="text-emerald-500">•</span>
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    {userOrg}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-[20px] backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {userRole} Account Verified
                </div>
                <div className="text-[15px] font-extrabold text-white font-['Space_Grotesk',sans-serif]">
                  9-Agent Swarm Orchestrator Tier
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* ── PROFILE DETAILS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Account Info */}
          <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-[14px] bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  Account Details
                </h3>
                <p className="text-[12px] font-medium text-slate-500">
                  Organization credentials & access levels
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-[13px]">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Role:</span>
                <span className="font-extrabold text-slate-900">Lead AI Patent Strategist</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Organization:</span>
                <span className="font-extrabold text-slate-900">PatentScout AI Enterprise</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Active Domain:</span>
                <span className="font-extrabold text-emerald-700">{selectedDomain || "Electric Vehicles"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">2FA Security:</span>
                <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Active Swarm Integrations */}
          <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  AI Swarm Engine Status
                </h3>
                <p className="text-[12px] font-medium text-slate-500">
                  Real-time connected AI services
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Groq Llama 3.3", role: "LLM Orchestration", status: "Connected" },
                { name: "ChromaDB Store", role: "Vector Embeddings", status: "Active" },
                { name: "USPTO & WIPO", role: "Patent Prior Art Claims", status: "Connected" },
                { name: "Tavily & Firecrawl", role: "Grant Extraction Web Scraper", status: "Active" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[14px] bg-slate-50 border border-slate-200/70">
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] font-medium text-slate-500">{item.role}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ✓ {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Key Metrics */}
          <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-[14px] bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  Mission Analytics
                </h3>
                <p className="text-[12px] font-medium text-slate-500">
                  Lifetime analysis execution statistics
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-[16px] bg-emerald-50/70 border border-emerald-200/80 text-center">
                <div className="text-[26px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  42
                </div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase mt-0.5">Missions Executed</div>
              </div>

              <div className="p-4 rounded-[16px] bg-emerald-50/70 border border-emerald-200/80 text-center">
                <div className="text-[26px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                  100%
                </div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase mt-0.5">Swarm Accuracy</div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
