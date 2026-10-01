import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((data) => {
        setUser(data.user);
        setProfile(data.profile);
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setProfile(data.profile);
  };

  const signUp = async (formData) => {
    const data = await api.post("/auth/register", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setProfile(data.profile);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    const data = await api.get("/auth/me");
    setProfile(data.profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
