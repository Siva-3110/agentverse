import React, { Component, ErrorInfo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MissionControlPage from "./pages/MissionControlPage";
import Dashboard from "./pages/Dashboard";
import ResearchPage from "./pages/ResearchPage";
import PatentsPage from "./pages/PatentsPage";
import GapsPage from "./pages/GapsPage";
import InnovationPage from "./pages/InnovationPage";
import InnovationDetailPage from "./pages/InnovationDetailPage";
import PatentabilityPage from "./pages/PatentabilityPage";
import MarketPage from "./pages/MarketPage";
import FundingPage from "./pages/FundingPage";
import ExecutiveReportPage from "./pages/ExecutiveReportPage";
import AutoPatentWatchPage from "./pages/AutoPatentWatchPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import SettingsPage from "./pages/SettingsPage";
import AnalysisResultsPage from "./pages/AnalysisResultsPage";

// Admin Module Component Imports
import AdminLayout from "./components/AdminLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import TopicMonitoringPage from "./pages/admin/TopicMonitoringPage";
import AgentOperationsPage from "./pages/admin/AgentOperationsPage";
import EmailLogsPage from "./pages/admin/EmailLogsPage";
import ReportsHubPage from "./pages/admin/ReportsHubPage";
import SystemLogsPage from "./pages/admin/SystemLogsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

import Sidebar from "./components/Sidebar";
import { AgentStateProvider } from "./context/AgentStateContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 max-w-md shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
              ⚡
            </div>
            <h2 className="text-[22px] font-extrabold text-slate-900">PatentScout AI Workspace</h2>
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
              Session telemetry initialized. Click below to enter Mission Control.
            </p>
            <button
              onClick={() => { window.location.href = "/mission-control"; }}
              className="w-full py-3 px-6 rounded-[14px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-bold text-[14px] shadow-md hover:from-emerald-800 transition-all cursor-pointer"
            >
              Launch Mission Control
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* Strict Role Guards */
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function RequireResearcher({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role === "Admin") {
    return <Navigate to="/admin/overview" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AgentStateProvider>
            <Routes>
              {/* Standalone Auth & Landing Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/mission-control" element={<RequireResearcher><MissionControlPage /></RequireResearcher>} />
              <Route path="/mission" element={<RequireResearcher><MissionControlPage /></RequireResearcher>} />
              <Route path="/mission-execution" element={<RequireResearcher><MissionControlPage /></RequireResearcher>} />

              {/* Researcher Platform Routes (Protected by RequireResearcher) */}
              <Route path="/dashboard" element={<RequireResearcher><DashboardLayout><Dashboard /></DashboardLayout></RequireResearcher>} />
              <Route path="/research" element={<RequireResearcher><DashboardLayout><ResearchPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/patents" element={<RequireResearcher><DashboardLayout><PatentsPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/gaps" element={<RequireResearcher><DashboardLayout><GapsPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/innovation" element={<RequireResearcher><DashboardLayout><InnovationPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/innovation/:id" element={<RequireResearcher><DashboardLayout><InnovationDetailPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/patentability" element={<RequireResearcher><DashboardLayout><PatentabilityPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/market" element={<RequireResearcher><DashboardLayout><MarketPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/funding" element={<RequireResearcher><DashboardLayout><FundingPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/report" element={<RequireResearcher><DashboardLayout><ExecutiveReportPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/auto-watch" element={<RequireResearcher><DashboardLayout><AutoPatentWatchPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/profile" element={<RequireResearcher><DashboardLayout><ProfilePage /></DashboardLayout></RequireResearcher>} />
              <Route path="/history" element={<RequireResearcher><DashboardLayout><HistoryPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/knowledge-base" element={<RequireResearcher><DashboardLayout><KnowledgeBasePage /></DashboardLayout></RequireResearcher>} />
              <Route path="/settings" element={<RequireResearcher><DashboardLayout><SettingsPage /></DashboardLayout></RequireResearcher>} />
              <Route path="/results" element={<RequireResearcher><DashboardLayout><AnalysisResultsPage /></DashboardLayout></RequireResearcher>} />

              {/* Dedicated Independent Admin Application Routes (Protected by RequireAdmin & AdminLayout) */}
              <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
              <Route path="/admin/overview" element={<RequireAdmin><AdminLayout><AdminOverviewPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/users" element={<RequireAdmin><AdminLayout><UserManagementPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/topic-monitoring" element={<RequireAdmin><AdminLayout><TopicMonitoringPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/agents" element={<RequireAdmin><AdminLayout><AgentOperationsPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/email-logs" element={<RequireAdmin><AdminLayout><EmailLogsPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/reports" element={<RequireAdmin><AdminLayout><ReportsHubPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/system-logs" element={<RequireAdmin><AdminLayout><SystemLogsPage /></AdminLayout></RequireAdmin>} />
              <Route path="/admin/settings" element={<RequireAdmin><AdminLayout><AdminSettingsPage /></AdminLayout></RequireAdmin>} />

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/mission-control" replace />} />
            </Routes>
          </AgentStateProvider>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
