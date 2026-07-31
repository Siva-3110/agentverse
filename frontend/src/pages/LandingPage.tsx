import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, BookOpen, ShieldCheck, Target, Lightbulb,
  Scale, TrendingUp, DollarSign, ChevronRight
} from "lucide-react";

const AGENTS = [
  { num: "01", label: "Research Intelligence", desc: "OpenAlex, arXiv & Semantic Scholar academic literature ingestion", icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { num: "02", label: "Patent Landscape", desc: "Google Patents deep-search & ChromaDB vector clustering", icon: ShieldCheck, color: "from-violet-500 to-violet-600" },
  { num: "03", label: "Gap Analysis", desc: "Unpatented white-space detection & opportunity scoring", icon: Target, color: "from-amber-500 to-orange-500" },
  { num: "04", label: "Innovation Architect", desc: "Patent-ready concept synthesis & architecture specs", icon: Lightbulb, color: "from-pink-500 to-rose-500" },
  { num: "05", label: "Patentability Score", desc: "35 U.S.C. § 102/103 legal novelty & claims scoring", icon: Scale, color: "from-red-500 to-red-600" },
  { num: "06", label: "Market Intelligence", desc: "Google Trends, GitHub growth & Enterprise RSS signals", icon: TrendingUp, color: "from-emerald-500 to-emerald-600" },
  { num: "07", label: "Funding Pathfinder", desc: "BIRAC, YC, Startup India & Grant auto-matching", icon: DollarSign, color: "from-orange-400 to-amber-500" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-700">
      
      {/* Light Box-Grid Pattern & Micro Radial Glow */}
      <div className="fixed inset-0 landing-grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-200/40 via-teal-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#059669] to-[#065F46] flex items-center justify-center shadow-md shadow-emerald-900/15">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-slate-900 tracking-tight leading-none">PatentScout AI</div>
            <div className="text-[11px] font-bold text-emerald-700 mt-1 uppercase tracking-wider">Multi-Agent AI Platform</div>
          </div>
        </div>

        {/* 2 Navigation Buttons: Sign In & Sign Up */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <button className="px-5 py-2 text-[14px] font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Sign In
            </button>
          </Link>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="btn-launch-nav"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Centered Hero Section */}
      <section className="relative z-10 min-h-[calc(100vh-90px)] flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Main Centered Headline */}
          <h1 className="text-[42px] sm:text-[56px] lg:text-[64px] font-[800] text-slate-900 tracking-[-0.035em] leading-[1.12] mb-8 max-w-4xl">
            Transform Research Literature <br className="hidden sm:block" />
            into Patent-Ready Commercial <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Startups in Minutes.
            </span>
          </h1>

          {/* Description (Strictly 2 lines) */}
          <p className="text-[17px] sm:text-[19px] text-slate-600 font-[500] leading-[1.6] max-w-3xl mb-10 text-center">
            PatentScout AI is an autonomous multi-agent intelligence platform that transforms academic research into patent-ready innovations, validates novelty, analyzes market opportunities, discovers funding opportunities, and generates executive intelligence reports.
          </p>

          {/* Primary CTA Button: Rich Emerald Fill + White Text */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => navigate("/auth")}
              className="btn-launch-hero"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Launch Platform Workspace</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Existing Agent Showcase Section */}
      <section className="relative z-10 px-6 py-24 border-t border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="badge-pill-emerald text-[12px] uppercase tracking-wider">
              Autonomous Swarm Architecture
            </span>
            <h2 className="text-[32px] sm:text-[38px] font-[800] text-slate-900 tracking-tight">
              The 7-Agent Intelligence Swarm
            </h2>
            <p className="text-[16px] text-slate-600 font-medium max-w-xl mx-auto">
              Each specialized AI agent executes targeted research, legal, market, and financial workflows in full autonomy.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              return (
                <motion.div key={agent.num} variants={itemVariants}>
                  <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 h-full flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/60 transition-all duration-300 group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${agent.color} flex items-center justify-center text-white shadow-md`}>
                          <Icon className="w-5.5 h-5.5" />
                        </div>
                        <span className="text-[12px] font-extrabold text-slate-400 tracking-widest">{agent.num}</span>
                      </div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{agent.label}</h3>
                      <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{agent.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[12px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore Agent Pipeline</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Final Showcase CTA Card: HIGH CONTRAST RICH FOREST EMERALD CARD */}
            <motion.div variants={itemVariants}>
              <div
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-br from-[#065F46] via-[#047857] to-[#0F172A] p-6 rounded-[24px] h-full flex flex-col justify-between cursor-pointer group shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-emerald-500/30 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                      All 7 Active
                    </span>
                  </div>
                  <h3 className="text-[20px] font-extrabold text-white mb-2 leading-tight">Launch Innovation Workspace</h3>
                  <p className="text-[14px] text-emerald-100 font-medium leading-relaxed">
                    Authenticate to enter the platform and activate all 7 agents on your target research domain.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-white font-extrabold text-[14px] relative z-10 group-hover:translate-x-1 transition-transform">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#059669] to-[#065F46] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[14px] font-extrabold text-slate-900">PatentScout AI</span>
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            Autonomous Multi-Agent Commercialization Engine
          </p>
        </div>
      </footer>

    </div>
  );
}
