import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import kartikLogo from "../assets/kartik_logo.png";

interface NavbarProps {
  variant?: "login" | "signup" | "home" | "default";
  className?: string;
}

const Navbar = ({ variant = "default", className = "" }: NavbarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderRightSection = () => {
    switch (variant) {
      case "login":
        return (
          <div className="flex gap-4">
            <button
              onClick={() => handleNavigation("/signup")}
              className="text-black font-inter font-medium text-[15px] leading-[20px] bg-transparent border-none hover:bg-gray-50 px-4 py-2 rounded transition-colors duration-200 w-[100px]"
            >
              Sign Up
            </button>
          </div>
        );

      case "signup":
        return (
          <div className="flex gap-4">
            <button
              onClick={() => handleNavigation("/login")}
              className="text-black font-inter font-medium text-[15px] leading-[20px] bg-transparent border-none hover:bg-gray-50 px-4 py-2 rounded transition-colors duration-200 w-[100px]"
            >
              Login
            </button>
          </div>
        );

      case "home":
        return (
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLogout}
              className="text-black font-inter font-medium text-[15px] leading-[20px] bg-transparent border-none hover:bg-gray-50 px-4 py-2 rounded transition-colors duration-200 w-[100px]"
            >
              Logout
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <nav
      className={`bg-white h-16 px-6 rounded-md shadow-md flex justify-between items-center w-full max-w-[1424px] ${className}`}
    >
      {/* Left side - Logo/Brand (consistent across all pages) */}
      <div className="flex items-center">
        <img
          src={kartikLogo}
          alt="Kartik Logo"
          className="w-16 h-16 opacity-100 rotate-0"
        />
      </div>

      {/* Right side - Dynamic content based on page */}
      {renderRightSection()}
    </nav>
  );
};

export default Navbar;
