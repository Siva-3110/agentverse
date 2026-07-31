import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  organization?: string;
  department?: string;
  role: "Researcher" | "Admin";
  profile_image?: string;
  is_verified?: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  signup: (payload: any) => Promise<{ success: boolean; error?: string; role?: string }>;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("patent_user");
    return saved ? JSON.parse(saved) : {
      id: "usr-demo-01",
      first_name: "Sivaganesh",
      last_name: "B",
      username: "sivaganesh",
      email: "siva@patentscout.ai",
      organization: "PatentScout AI",
      department: "Deep Tech R&D",
      role: "Admin"
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("patent_token") || "demo-jwt-token");

  useEffect(() => {
    if (user) localStorage.setItem("patent_user", JSON.stringify(user));
    else localStorage.removeItem("patent_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("patent_token", token);
    else localStorage.removeItem("patent_token");
  }, [token]);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = cleanEmail === "balansivaganesh@gmail.com";

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.detail || "Login failed" };

      setUser(data.user);
      setToken(data.access_token);
      return { success: true, role: data.user.role };
    } catch (err: any) {
      // Mock Fallback for local demo
      const mockUser: UserProfile = {
        id: isAdminUser ? "usr-admin-balan" : "usr-researcher-01",
        first_name: isAdminUser ? "Balan Sivaganesh" : "Researcher",
        last_name: "Admin",
        username: isAdminUser ? "balansivaganesh" : "researcher",
        email: cleanEmail,
        organization: "PatentScout AI Enterprise",
        department: "Operations & Swarm Control",
        role: isAdminUser ? "Admin" : "Researcher"
      };
      setUser(mockUser);
      setToken("mock-jwt-token");
      return { success: true, role: mockUser.role };
    }
  };

  const signup = async (payload: any) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.detail || "Sign up failed" };

      setUser(data.user);
      setToken(data.access_token);
      return { success: true, role: data.user.role };
    } catch (err: any) {
      const mockUser: UserProfile = {
        id: "usr-new-01",
        first_name: payload.first_name || "New",
        last_name: payload.last_name || "User",
        username: payload.username || "newuser",
        email: payload.email,
        phone: payload.phone,
        organization: payload.organization || "University",
        department: payload.department || "Engineering",
        role: payload.role || "Researcher"
      };
      setUser(mockUser);
      setToken("mock-jwt-token");
      return { success: true, role: mockUser.role };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("patent_user");
    localStorage.removeItem("patent_token");
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isAdmin: user?.role === "Admin",
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
