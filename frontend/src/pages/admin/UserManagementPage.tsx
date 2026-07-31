import React, { useState, useEffect } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import Topbar from "../../components/Topbar";

export default function UserManagementPage() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsersList(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleUserStatus = (id: string, currentStatus: boolean) => {
    fetch(`http://localhost:8000/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentStatus })
    })
      .then(res => res.json())
      .then(() => fetchUsers())
      .catch(err => console.error("Error toggling status:", err));
  };

  const handleDeleteUser = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user from the database?")) return;
    fetch(`http://localhost:8000/api/admin/users/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => fetchUsers())
      .catch(err => console.error("Error deleting user:", err));
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Topbar
        crumbs={[{ label: "Admin Operations" }, { label: "User Management" }]}
        title="User Management Directory"
        subtitle="Manage live platform users, roles, access permissions, and session statuses from PostgreSQL/SQLite"
      />

      <main className="flex-1 overflow-y-auto px-8 py-7 space-y-8 max-w-[1440px] mx-auto w-full font-['Inter',sans-serif]">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                Registered User Directory ({usersList.length})
              </h3>
              <p className="text-[12px] font-medium text-slate-500">
                Live platform accounts fetched directly from database. Manage roles and access statuses.
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Users
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                Loading live user directory...
              </div>
            ) : usersList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-semibold text-[13px]">
                No users found in database.
              </div>
            ) : (
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Name / Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : u.username || 'User'}
                        <div className="text-[11px] font-normal text-slate-400">@{u.username}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.organization || 'PatentScout AI'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${u.role === "Admin" ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900'}`}>
                          {u.role || "Researcher"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {u.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className="px-2.5 py-1 rounded-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11.5px] hover:bg-slate-200 cursor-pointer"
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-2.5 py-1 rounded-[10px] bg-red-50 text-red-700 font-bold text-[11.5px] hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
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
