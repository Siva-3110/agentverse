import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Trophy, Inbox, ArrowRight } from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { TechnologyGapChart } from "../components/Visualizations";

export default function GapsPage() {
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
          <h3 className="text-lg font-bold text-white tracking-tight">No Opportunity Matrix Yet</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Analyze a domain on the dashboard to calculate gaps between academic publications and commercial patents.
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
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Technology Opportunity Matrix</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain} Gaps</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Ranked Gaps: {data.gap_matrix.length}
        </Badge>
      </div>

      {/* Gap Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gap Score Priority Matrix</h4>
            <p className="text-[9px] text-zinc-500">Comparing academic velocity with patent saturation indexes</p>
          </div>
          <TechnologyGapChart gaps={data.gap_matrix} />
        </Card>

        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">How We Calculate Gaps</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our Opportunity Agent compares the velocity of research publications (academic energy) with patent filing densities (commercial clustering).
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A high score identifies a space characterized by robust research growth and citation index increases, yet lacking patent protection.
            </p>
          </div>
          <div className="p-4.5 rounded-xl bg-[#080B14] border border-darkBorder/60 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Top Priority Score</span>
            <span className="text-2xl font-extrabold text-purple-400">
              {data.gap_matrix[0]?.opportunity_score || 0}%
            </span>
          </div>
        </Card>
      </div>

      {/* List of Gaps */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-purple-400" />
          Ranked Technology Gaps
        </h3>
        
        <div className="space-y-3">
          {data.gap_matrix.map((gap, index) => {
            const isTop = index === 0;
            return (
              <Card 
                key={gap.area} 
                className={`p-5 transition-all duration-300 relative overflow-hidden ${
                  isTop 
                    ? "border-purple-500/40 bg-[#0D1117]/60 shadow-lg shadow-purple-500/5 timeline-glow" 
                    : "hover:border-darkBorder/80 bg-[#0D1117]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {isTop ? (
                        <Badge variant="success" className="gap-1 py-0.5 text-[9px]">
                          <Trophy className="w-3 h-3" />
                          <span>Top Gap Candidate</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] py-0">#{index + 1} Gap</Badge>
                      )}
                      <h4 className="text-sm font-bold text-white">{gap.area}</h4>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed mt-1">{gap.rationale}</p>
                    
                    <div className="flex items-center gap-4 pt-2 text-[10px] text-zinc-500">
                      <span>Research Activity: <strong className="text-emerald-400">{gap.research_activity}</strong></span>
                      <span>Patent Saturation: <strong className="text-rose-400">{gap.patent_activity}</strong></span>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 rounded-xl bg-[#080B14] border border-darkBorder flex flex-col justify-center min-w-[70px]">
                    <span className="text-lg font-bold text-purple-400">{gap.opportunity_score}</span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">Priority</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
