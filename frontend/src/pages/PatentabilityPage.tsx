import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Info, HelpCircle, ArrowRight } from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/Progress";

export default function PatentabilityPage() {
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

  if (!data || !data.patentability) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#0D1117] border border-darkBorder flex items-center justify-center text-zinc-600">
          <HelpCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white tracking-tight">No Patentability Data Yet</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Patentability risks are calculated once you run a search domain analysis from the dashboard.
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
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Patentability Assessment Agent</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain} Risks</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Assessments Active
        </Badge>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-300 flex items-start gap-3">
        <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Prior Art Triangulation Audit</strong>: This panel represents structural patentability projections. It parses the corporate assets of major assignees (e.g. Tesla, Siemens, Cisco) against generated innovations to compute risks.
        </p>
      </div>

      {/* Grid of assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.patentability.map((res, index) => (
          <Card key={index} className="p-6 bg-[#0D1117]/55 border border-darkBorder/30 hover:border-darkBorder/70 transition-colors flex flex-col justify-between min-h-[340px]">
            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base leading-snug">{res.idea_name}</h3>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Filing Candidate Assessment</span>
                </div>
                
                <div className="text-center p-2 rounded-xl bg-[#080B14] border border-darkBorder flex flex-col justify-center min-w-[65px]">
                  <span className="text-base font-extrabold text-indigo-400">{res.patentability_score}%</span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wide">Filing Score</span>
                </div>
              </div>

              {/* Progress Index */}
              <div className="space-y-2 pt-4 border-t border-darkBorder/25">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Novelty Index</span>
                  <span className="text-white font-medium">{res.novelty_score}%</span>
                </div>
                <Progress value={res.novelty_score} className="h-1.5" />
              </div>

              {/* Grid of badges */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-3 bg-[#080B14] border border-darkBorder/40 rounded-xl space-y-1">
                  <span className="text-[8px] text-zinc-500 font-semibold uppercase block">Prior Art Risk</span>
                  <Badge variant={res.prior_art_risk === "Low" ? "success" : "warning"} className="text-[10px] py-0">
                    {res.prior_art_risk} Risk
                  </Badge>
                </div>
                
                <div className="p-3 bg-[#080B14] border border-darkBorder/40 rounded-xl space-y-1">
                  <span className="text-[8px] text-zinc-500 font-semibold uppercase block">Commercial Viability</span>
                  <Badge variant={res.commercial_viability === "High" ? "success" : "warning"} className="text-[10px] py-0">
                    {res.commercial_viability}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-darkBorder/60 flex items-start gap-3 mt-6">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block">Filing Strategy</span>
                <p className="text-zinc-300 text-xs leading-relaxed">{res.recommendation}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
