export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  signup: (userData: Omit<SignupFormData, "confirmPassword">) => Promise<void>;
  logout: () => void;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
