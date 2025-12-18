import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  AuthUser,
  AuthContextType,
  LoginFormData,
  SignupFormData,
  AuthResponse,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth service functions (simulate API calls)
const authService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "test123"
    ) {
      const user: AuthUser = {
        id: "1",
        name: "Demo User",
        email: credentials.email,
      };
      const token = "mock_jwt_token_" + Date.now();
      return { user, token };
    } else {
      throw new Error("Invalid email or password");
    }
  },

  async signup(
    userData: Omit<SignupFormData, "confirmPassword">
  ): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock user creation
    const user: AuthUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
    };
    const token = "mock_jwt_token_" + Date.now();
    return { user, token };
  },

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  getCurrentUser(): AuthUser | null {
    try {
      const userJson = localStorage.getItem("auth_user");
      const tokenJson = localStorage.getItem("auth_token");

      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  setAuthData(user: AuthUser, token: string): void {
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
  },
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = authService.getCurrentUser();
      const token = authService.getToken();

      if (savedUser && token) {
        setUser(savedUser);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", credentials);
      const { user: authUser, token } = await authService.login(credentials);
      console.log("Login successful, user:", authUser);
      authService.setAuthData(authUser, token);
      setUser(authUser);
      console.log("User set in context");
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to let components handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    userData: Omit<SignupFormData, "confirmPassword">
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: authUser, token } = await authService.signup(userData);
      authService.setAuthData(authUser, token);
      setUser(authUser);
    } catch (error) {
      throw error; // Re-throw to let components handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
