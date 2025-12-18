import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginFormData } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Form submitted with data:", formData);

    try {
      await login(formData);
      console.log("Login successful, navigating to /home");
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center pt-4">
        <Navbar variant="login" />
      </div>

      {/* Main content area */}
      <div className="h-[calc(100vh-5rem)] flex items-start justify-center px-4 pt-16">
        <div className="w-[416px] h-[410px] flex flex-col items-center space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="font-inter font-semibold text-[30px] leading-[36px] tracking-[-0.75%] text-center text-black">
              Log in now and start creating
            </h1>
            <p className="font-inter font-normal text-[14px] leading-[24px] tracking-[0%] text-center text-accent">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card Section */}
          <div className="w-[416px] gap-6 opacity-100 p-6 rounded-md border border-border bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-black mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-inter text-[14px] leading-[20px] placeholder:font-inter placeholder:font-normal placeholder:text-[14px] placeholder:leading-[20px] placeholder:text-placeholder focus:placeholder-transparent"
                  placeholder="jdoe@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-black mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-inter text-[14px] leading-[20px] placeholder:font-inter placeholder:font-normal placeholder:text-[30px] placeholder:leading-[20px] placeholder:text-placeholder focus:placeholder-transparent"
                  placeholder="........"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              {/* Login Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-[40px] gap-[10px] opacity-100 py-2 px-4 rounded-md bg-indigo-500 text-white"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center">
                <a
                  href="#"
                  className="font-inter font-medium text-[14px] leading-[24px] tracking-[0%] text-black"
                >
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
