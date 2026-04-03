import api from "../restAPI/api";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const API = "/api"; // Relative path works with proxy
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const register = async (formData) => {
    try {
      const res = await api.post(`/auth/register`, formData);
      return res.data;
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      throw err;
    }
  };
  

  const login = async (formData) => {
    try {
      const res = await api.post(`/auth/login`, formData, { withCredentials: true });
      setCurrentUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post(`/auth/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
    } catch {
      setError("Logout failed");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(`/auth/me`, { withCredentials: true });
      setCurrentUser(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // No user is logged in — this is expected, so don't treat it as an error
        setCurrentUser(null);
      } else {
        // Unexpected error — log it or handle it
        console.error("Error fetching user:", err);
        setError("Failed to fetch user");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout,register, error, setError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
