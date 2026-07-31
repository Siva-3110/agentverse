import { motion } from "framer-motion";
import { BookMarked, Search, Sparkles, BookOpen } from "lucide-react";
import Topbar from "../components/Topbar";

const KNOWLEDGE_ITEMS = [
  { title: "Research Ingestion & OpenAlex Clustering", category: "Agent 01", desc: "How PatentScout AI ingests academic publications, calculates publication velocity, and extracts normalized citation indices." },
  { title: "Patent Vector Embedding & Prior Art Saturation", category: "Agent 02", desc: "Vector similarity search algorithms querying USPTO and EPO patent filings in ChromaDB to quantify prior-art density." },
  { title: "Unpatented White-Space Detection Matrix", category: "Agent 03", desc: "Cross-referencing research literature velocity against patent density to pinpoint unpatented high-potential white spaces." },
  { title: "Innovation Concept Synthesis & Architecture Specs", category: "Agent 04", desc: "Generating patent-ready commercial invention concepts complete with block diagrams, micro-controller specs, and target user profiles." },
  { title: "35 U.S.C. § 102/103 Novelty Scoring & Claim Drafting", category: "Agent 05", desc: "Evaluating statutory novelty, non-obviousness, and industrial applicability under USPTO legal standards." },
  { title: "Google Trends, GitHub Stars & Enterprise RSS Intelligence", category: "Agent 06", desc: "Multi-source market commercial opportunity scoring using search volume, open-source repositories, and enterprise press releases." },
  { title: "Non-Dilutive Grants & Accelerator Pathfinder", category: "Agent 07", desc: "Matching validated innovations with official government grants (Startup India, BIRAC), incubators, and VC accelerators." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Dashboard", path: "/dashboard" }, { label: "Knowledge Base" }]}
        title="Knowledge Base"
        subtitle="Agent documentation & patent intelligence methodology"
      />

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="icon-box bg-purple-50">
              <BookMarked className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-overline text-purple-600">Documentation</span>
          </div>
          <h1 className="text-page-title">Swarm Knowledge Base</h1>
          <p className="text-body mt-2 max-w-2xl">
            Architectural documentation, statutory patentability rules, and multi-agent workflow specifications.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="premium-card flex items-center gap-3 px-5 py-3.5 max-w-xl">
          <Search className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Knowledge Base & Documentation..."
            className="flex-1 bg-transparent text-[14px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {KNOWLEDGE_ITEMS.map((item, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className="premium-card p-5 h-full group hover-lift cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-emerald">{item.category}</span>
                  <Sparkles className="w-4 h-4 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="icon-box-sm bg-slate-100 flex-shrink-0">
                    <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 leading-tight">{item.title}</h3>
                </div>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">{item.desc}</p>
                <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-emerald-300 to-teal-400 group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
