// Global authentication state shared across the whole app.
// Keeps track of the logged-in user and the login token (saved in localStorage
// so the user stays logged in after refreshing the page).
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On first load, restore the user from localStorage if present.
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  function saveSession({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const data = await api.login({ email, password });
    saveSession(data);
  }

  async function register(username, email, password) {
    const data = await api.register({ username, email, password });
    saveSession(data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so components can do: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
