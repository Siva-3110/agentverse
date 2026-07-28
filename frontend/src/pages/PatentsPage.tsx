import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scroll, Building2, Inbox, ArrowRight } from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PatentSaturationChart } from "../components/Visualizations";

export default function PatentsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalysisState | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem("latest_results");
    if (cached) {
      try {
        setData(JSON.parse(cached));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#0D1117] border border-darkBorder flex items-center justify-center text-zinc-600">
          <Inbox className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">No Patent Intelligence Yet</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Run a domain discovery search from the dashboard first to embed and cluster commercial patent documents.
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="gap-2">
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Patent Intelligence</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain}</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Patents Searched: {data.patents_analyzed || 1450}
        </Badge>
      </div>

      {/* Saturation Donut & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Patent Saturation Ratios</h4>
              <p className="text-[9px] text-zinc-500">Clustering distribution by category density</p>
            </div>
            <div className="flex gap-4 text-[10px]">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> <span>High</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span>Medium</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> <span>Low</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> <span>None</span></div>
            </div>
          </div>
          <PatentSaturationChart patentClusters={data.patent_clusters} />
        </Card>

        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Landscape Analysis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The Patent Landscape Agent maps patent entries dynamically inside ChromaDB. It indexes active patents to isolate commercial monopolies.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We group patents using semantic proximity models to visualize saturation points and identify major enterprise assignees.
            </p>
          </div>
          <div className="p-4.5 rounded-xl bg-[#080B14] border border-darkBorder/60 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Formed Clusters</span>
            <span className="text-2xl font-extrabold text-white">{data.patent_clusters.length}</span>
          </div>
        </Card>
      </div>

      {/* Grid of Clusters */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scroll className="w-4.5 h-4.5 text-indigo-400" />
          Patent Clusters & Assignees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.patent_clusters.map(cluster => (
            <Card key={cluster.category} className="p-5 space-y-3 bg-[#0D1117]/50 border border-darkBorder/40 hover:border-darkBorder/80 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-white leading-snug">{cluster.category}</h4>
                <Badge variant={cluster.saturation === "High" ? "destructive" : cluster.saturation === "Medium" ? "warning" : "success"} className="text-[9px]">
                  {cluster.saturation} Saturation
                </Badge>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{cluster.description}</p>
              
              <div className="pt-3 border-t border-darkBorder/25 space-y-1.5">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Key Corporate Assignees
                </span>
                <div className="flex flex-wrap gap-1">
                  {cluster.major_assignees.map(a => (
                    <span key={a} className="text-[9px] bg-[#080B14] border border-darkBorder/80 text-zinc-300 px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
