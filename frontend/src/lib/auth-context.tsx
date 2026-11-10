"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api, ApiError } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  role?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    companyName?: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      // If user explicitly logged out in this session, do not restore
      if (typeof window !== "undefined" && sessionStorage.getItem("user_logged_out") === "true") {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

      // Ordinary visitors without a stored token remain unauthenticated
      if (!storedToken) {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      try {
        // Validate existing token with the server
        const { data } = await api.get<User>("/api/auth/me");
        setState({
          user: data,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        // Token is invalid/expired - clear credentials and remain unauthenticated
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("user_logged_out");
      }
      const { data } = await api.post<{
        access_token: string;
        token_type: string;
        user: User;
      }>("/api/auth/login", { email, password });

      const { access_token, user } = data;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || "Login failed. Please try again.");
    }
  }, []);

  const loginDemo = useCallback(async () => {
    return login("demo@supplymind.ai", "Demo@2024!");
  }, [login]);

  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      companyName?: string
    ) => {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("user_logged_out");
        }
        const { data } = await api.post<{
          access_token: string;
          token_type: string;
          user: User;
        }>("/api/auth/register", {
          email,
          password,
          full_name: fullName,
          company_name: companyName,
        });

        const { access_token, user } = data;

        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        setState({
          user,
          token: access_token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        const apiError = error as ApiError;
        throw new Error(
          apiError.message || "Registration failed. Please try again."
        );
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user_logged_out", "true");
    }
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    window.location.href = "/auth/signin";
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      login,
      loginDemo,
      register,
      logout,
      updateUser,
    }),
    [state, login, loginDemo, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
