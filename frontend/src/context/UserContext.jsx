import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on app start
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
      setUser(res.data);
    } catch {
      sessionStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

 const updateUser = (userData) => {
  setUser((prev) => ({ ...prev, ...userData }));
};

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
