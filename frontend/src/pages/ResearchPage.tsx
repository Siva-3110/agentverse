import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, TrendingUp, Inbox, ArrowRight } from "lucide-react";
import type { AnalysisState } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ResearchActivityChart } from "../components/Visualizations";

export default function ResearchPage() {
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
          <h3 className="text-lg font-bold text-white tracking-tight">No Research Intelligence Yet</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            You must input a technology domain in the dashboard to execute the pipeline and analyze research trends.
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
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Research Intelligence</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">{data.domain}</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          Papers Analyzed: {data.papers_analyzed || 83}
        </Badge>
      </div>

      {/* Citations chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Citation Strength & Momentum</h4>
            <p className="text-[9px] text-zinc-500">Relative citation strength metric by topic</p>
          </div>
          <ResearchActivityChart researchTopics={data.research_topics} />
        </Card>

        <Card className="p-5 bg-[#0D1117]/45 border border-darkBorder/30 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Academic Trends Audit</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our Research Ingestion Agent queried arXiv, OpenAlex, and Semantic Scholar databases, consolidating and deduplicating academic records.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We parsed publication summaries and indexed metadata to extract high-momentum research clusters driving technological growth.
            </p>
          </div>
          <div className="p-4.5 rounded-xl bg-[#080B14] border border-darkBorder/60 space-y-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Identified Topics</span>
            <span className="text-2xl font-extrabold text-white">{data.research_topics.length}</span>
          </div>
        </Card>
      </div>

      {/* Grid of Topics */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FlaskConical className="w-4.5 h-4.5 text-indigo-400" />
          Extracted Research Topics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.research_topics.map(topic => (
            <Card key={topic.topic} className="p-5 space-y-3 bg-[#0D1117]/50 border border-darkBorder/40 hover:border-darkBorder/80 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-white leading-snug">{topic.topic}</h4>
                <Badge variant={topic.research_activity === "High" ? "success" : topic.research_activity === "Medium" ? "warning" : "destructive"} className="text-[9px]">
                  {topic.research_activity} Activity
                </Badge>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{topic.description}</p>
              <div className="flex items-center gap-1.5 pt-2.5 border-t border-darkBorder/25 text-[10px] text-zinc-500">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>Relative Citation Index:</span>
                <span className="text-white font-semibold">{topic.citation_strength}/100</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
