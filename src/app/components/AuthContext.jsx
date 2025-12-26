"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "../../../lib/user/verifyToken";
import { clearToken, getToken } from "../../../lib/getToken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await verifyToken();
      if (!res.valid) throw new Error();

      setUser({
        isValid: res.valid,
        isAdmin: res.is_admin,
      });
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔑 logout حقيقي
  const logoutchk = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logoutchk, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
