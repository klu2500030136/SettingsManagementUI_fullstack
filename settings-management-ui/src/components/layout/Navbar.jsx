import { Menu, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";

function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="h-[72px] glass-panel dark:glass-panel-dark border-b-border-goldLight flex items-center justify-between px-8 sticky top-0 z-40 transition-all shadow-glass">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-surface-500 hover:text-brand transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight hidden sm:block">
          Config<span className="gold-text-gradient">UI</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="relative w-14 h-8 flex items-center rounded-full bg-surface-200 dark:bg-surface-800 border border-border-goldLight p-1 cursor-pointer transition-colors duration-300 shadow-inner"
          aria-label="Toggle Theme"
        >
          <div className="absolute left-2 flex items-center justify-center">
            <Moon size={14} className="text-surface-400" />
          </div>
          <div className="absolute right-2 flex items-center justify-center">
            <Sun size={14} className="text-brand" />
          </div>
          <div 
            className={`w-6 h-6 rounded-full bg-gold-gradient shadow-gold-btn transform transition-transform duration-300 z-10 flex items-center justify-center ${
              theme === 'dark' ? 'translate-x-0' : 'translate-x-6'
            }`}
          >
            {theme === 'dark' ? (
              <Moon size={12} className="text-surface-900" />
            ) : (
              <Sun size={12} className="text-surface-900" />
            )}
          </div>
        </button>

        {(user?.username || user?.fullName) && (
          <div className="flex items-center gap-3 border-r border-border-goldLight pr-6 hidden sm:flex">
            <div className="w-9 h-9 rounded-full bg-gold-gradient text-surface-900 flex items-center justify-center font-bold text-sm shadow-gold-btn">
              {(user?.fullName || user?.username).charAt(0).toUpperCase()}
            </div>
            <span className="text-surface-700 dark:text-text-main font-semibold text-sm">
              {user?.fullName || user?.username}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-text-secondary hover:text-brand px-4 py-2 rounded-xl transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;