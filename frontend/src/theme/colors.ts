// Centralized theme configuration
export const colors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    900: "#1e3a8a",
  },
  secondary: {
    500: "#6366f1",
    600: "#4f46e5",
  },
  auth: {
    gradientStart: "#ffffff",
    gradientEnd: "#f5f7ff",
  },
  text: {
    primary: "#1f2937",
    secondary: "#6b7280",
    muted: "#9ca3af",
  },
  surface: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    tertiary: "#f1f5f9",
  },
  status: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
} as const;

// Utility functions
export const getAuthGradient = () =>
  `linear-gradient(180deg, ${colors.auth.gradientStart} 0%, ${colors.auth.gradientEnd} 100%)`;

export type ColorTheme = typeof colors;
