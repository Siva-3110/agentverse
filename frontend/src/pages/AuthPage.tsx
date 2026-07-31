import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign Up Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    organization: "",
    department: "",
    role: "Researcher" as const,
    password: "",
    confirm_password: "",
    terms: true
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.username) {
      setErrorMsg("Please fill in all required personal information fields.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const res = await signup(formData);
    setLoading(false);

    if (res.success) {
      if (res.role === "Admin") navigate("/admin/overview");
      else navigate("/mission-control");
    } else {
      setErrorMsg(res.error || "Sign up failed.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      if (res.role === "Admin") navigate("/admin/overview");
      else navigate("/mission-control");
    } else {
      setErrorMsg(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      
      {/* BRAND HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>PatentScout AI Swarm Platform</span>
        </div>
        <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
          {isSignUp ? "Create Your Account" : "Sign In to PatentScout AI"}
        </h1>
        <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto">
          {isSignUp
            ? "Join as a Researcher or Admin to access 9-agent autonomous patent intelligence."
            : "Enter your credentials to access your discovery workspace or admin dashboard."}
        </p>
      </div>

      {/* FORM CONTAINER CARD */}
      <div className={`mt-8 sm:mx-auto ${isSignUp ? 'sm:max-w-2xl' : 'sm:max-w-md'} w-full`}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/90 rounded-[28px] p-8 shadow-xl space-y-6"
        >

          {/* TOGGLE TAB */}
          <div className="flex bg-slate-100 p-1 rounded-[16px] text-[13px] font-bold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
              className={`flex-1 py-2.5 rounded-[12px] transition-all cursor-pointer ${!isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
              className={`flex-1 py-2.5 rounded-[12px] transition-all cursor-pointer ${isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign Up
            </button>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-4 rounded-[14px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-slate-50 border border-slate-200 text-slate-900 text-[14px] font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                    placeholder="name@organization.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[12.5px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Email verification link resent."); }} className="text-[12px] font-bold text-emerald-700 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-slate-50 border border-slate-200 text-slate-900 text-[14px] font-medium focus:bg-white focus:border-emerald-600 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-[14px] bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-900 text-white font-extrabold text-[14px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM (RESEARCHER REGISTRATION) */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">

              {/* NAME FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="Sivaganesh"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="B"
                  />
                </div>
              </div>

              {/* USERNAME & PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="sivaganesh"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                  placeholder="siva@patentscout.ai"
                />
              </div>

              {/* ORG & DEPT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Organization / University</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="IIT Madras / PatentScout"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="Deep Tech R&D"
                  />
                </div>
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[12px] font-medium text-slate-600">
                  I accept the Terms of Service & Privacy Policy
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-[14px] bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-900 text-white font-extrabold text-[14px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? "Creating Account..." : "Create Researcher Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
}
