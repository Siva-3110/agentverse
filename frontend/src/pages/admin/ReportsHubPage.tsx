import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function ReportsHubPage() {
  const [reportsData, setReportsData] = useState<{ total_reports: number; reports: any[] }>({
    total_reports: 0,
    reports: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReports = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/reports")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.reports)) {
          setReportsData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "Reports Hub" }]}
        title="Executive Reports Repository"
        subtitle="Global audit center for all McKinsey/Deloitte style consulting reports generated across the platform"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Generated Reports Directory ({reportsData.total_reports})
              </h3>
              <p className="text-[12px] font-medium text-slate-500">
                Review, audit, or download enterprise consulting PDF reports created by Agent 08.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-blue-100 text-blue-800">
                {reportsData.total_reports} Reports Saved
              </span>
              <button
                onClick={fetchReports}
                className="p-1.5 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                Loading executive report archive...
              </div>
            ) : reportsData.reports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                No reports saved in database yet. Reports are generated when researchers run Agent 08.
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Domain / Topic Title</th>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Report Format</th>
                    <th className="py-3 px-4">Generated Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {reportsData.reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.topic} Executive Report</td>
                      <td className="py-3.5 px-4 text-slate-600">{r.user_id}</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900">Executive PDF</span></td>
                      <td className="py-3.5 px-4 text-slate-500">{r.generated_at ? new Date(r.generated_at).toLocaleString() : 'Recent'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
