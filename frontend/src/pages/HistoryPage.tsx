import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Calendar, FileText, Scroll, AlertCircle, Lightbulb, Play, CheckCircle2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

// Import mock data to let users load these states back into localStorage
import { startAnalysis, pollAnalysis } from "../services/api";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [loadingDomain, setLoadingDomain] = useState<string | null>(null);

  const historyItems = [
    {
      domain: "Smart Cities",
      date: "2026-06-11",
      papers: 64,
      patents: 950,
      gaps: 6,
      ideas: 3,
      status: "completed"
    },
    {
      domain: "Cybersecurity",
      date: "2026-06-10",
      papers: 71,
      patents: 1180,
      gaps: 5,
      ideas: 3,
      status: "completed"
    },
    {
      domain: "Biotechnology",
      date: "2026-06-08",
      papers: 90,
      patents: 870,
      gaps: 8,
      ideas: 4,
      status: "completed"
    },
    {
      domain: "Renewable Energy",
      date: "2026-06-05",
      papers: 85,
      patents: 1120,
      gaps: 7,
      ideas: 3,
      status: "completed"
    }
  ];

  const handleLoadHistory = async (domain: string) => {
    setLoadingDomain(domain);
    try {
      // Trigger API / simulated call to generate session
      const res = await startAnalysis(domain);
      // Fast forward polling simulation for history items
      const state = await pollAnalysis(res.session_id);
      
      // Override status to completed instantly
      state.status = "completed";
      state.activeAgent = "completed";
      state.progress = 100;
      
      localStorage.setItem("latest_results", JSON.stringify(state));
      localStorage.setItem("active_domain", domain);
      
      setTimeout(() => {
        setLoadingDomain(null);
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      setLoadingDomain(null);
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Analysis History</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Total Sessions Saved: {historyItems.length}
        </Badge>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 gap-4">
        {historyItems.map((item) => (
          <Card key={item.domain} className="p-5 bg-[#0D1117]/50 border border-darkBorder/40 hover:border-darkBorder/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white tracking-tight">{item.domain}</h3>
                <Badge variant="success" className="gap-1 text-[9px] py-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{item.status}</span>
                </Badge>
              </div>

              {/* Grid of stats */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.papers} papers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{item.patents} patents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.gaps} gaps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.ideas} ideas</span>
                </div>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleLoadHistory(item.domain)}
              disabled={loadingDomain !== null}
              className="gap-2 text-xs font-semibold px-4 min-w-[130px] h-9"
            >
              {loadingDomain === item.domain ? (
                <span>Loading...</span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Load Workspace</span>
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
