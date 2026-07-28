import { useState, useEffect } from "react";
import { 
  Database, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import { healthCheck } from "../services/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function SettingsPage() {
  const [health, setHealth] = useState<{ status: string; database: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const runHealthCheck = async () => {
    setChecking(true);
    try {
      const status = await healthCheck();
      setHealth(status);
    } catch (err) {
      setHealth({ status: "error", database: "disconnected" });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-darkBorder/30 pb-4">
        <div>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Configuration Panel</span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">System Settings</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={runHealthCheck} 
          disabled={checking}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
          <span>Refresh Health</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* API Status Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-indigo-400" />
            Core API & Integrations
          </h3>
          <div className="space-y-4 pt-2">
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Google Gemini API</h4>
                <p className="text-[10px] text-zinc-500">Key: configured in backend environment</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Vite Dev Server</h4>
                <p className="text-[10px] text-zinc-500">Environment: Localhost development</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Online</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Backend Server API</h4>
                <p className="text-[10px] text-zinc-500">Endpoint: /api/health</p>
              </div>
              <Badge variant={!health ? "default" : health.status === "healthy" ? "success" : "destructive"} className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{!health ? "Checking..." : health.status === "healthy" ? "Healthy" : "Offline"}</span>
              </Badge>
            </div>

          </div>
        </Card>

        {/* Database Metrics Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-purple-400" />
            Vector DB & Ingestions
          </h3>
          <div className="space-y-4 pt-2">
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Persistent ChromaDB</h4>
                <p className="text-[10px] text-zinc-500">Collection: `patent_global` (10,791 patents)</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Academic Search APIs</h4>
                <p className="text-[10px] text-zinc-500">Sources: arXiv, OpenAlex, Semantic Scholar</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enabled</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">PostgreSQL Database</h4>
                <p className="text-[10px] text-zinc-500">Status: {!health ? "Checking..." : health.database}</p>
              </div>
              <Badge variant={!health ? "default" : health.database.includes("connected") ? "success" : "warning"} className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{!health ? "Checking..." : health.database.includes("connected") ? "Connected" : "Simulated"}</span>
              </Badge>
            </div>

          </div>
        </Card>

        {/* LLM Client Settings Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            LLM Model Configurations
          </h3>
          <div className="space-y-4 pt-2">
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">LangChain Provider</h4>
                <p className="text-[10px] text-zinc-500">Model: `gemini-2.5-flash`</p>
              </div>
              <span className="text-xs font-medium text-zinc-400">Default Model</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Fallback Generator</h4>
                <p className="text-[10px] text-zinc-500">Contextual mock schema matching</p>
              </div>
              <span className="text-xs font-medium text-emerald-400">Resilient (Active)</span>
            </div>

          </div>
        </Card>

        {/* Theme customization */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Sun className="w-4.5 h-4.5 text-amber-400" />
            Appearance customization
          </h3>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-darkBorder/50">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-white">Theme Selection</h4>
                <p className="text-[10px] text-zinc-500">Currently locked to Dark Mode first</p>
              </div>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-darkBorder">
                <button type="button" className="p-1 rounded text-zinc-600 hover:text-zinc-400">
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded bg-darkBorder text-indigo-400">
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
