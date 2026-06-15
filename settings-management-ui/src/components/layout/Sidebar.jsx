import {
  LayoutDashboard,
  Settings,
  Folder,
  Search,
  History,
  Shield,
  SlidersHorizontal,
} from "lucide-react";

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen }) {
  const navItemClass = `
    flex items-center gap-3
    px-4 py-3
    rounded-xl
    transition-all duration-300
    text-sm font-semibold
    group
  `;

  const activeClass =
    "bg-brand/10 text-brand shadow-sm border border-border-goldLight";
    
  const inactiveClass = 
    "text-text-secondary hover:bg-white/5 dark:hover:bg-white/5 hover:text-text-main";

  const { role } = useSelector((state) => state.auth);

  return (
    <aside
      className={`
        fixed md:fixed
        top-0 left-0
        z-50
        h-screen
        w-64
        bg-white dark:bg-[#0B0B0B]
        border-r border-surface-200 dark:border-border-goldLight
        text-surface-900 dark:text-text-main
        p-5
        transition-transform
        duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        shadow-2xl md:shadow-none
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2 mt-2">
        <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-btn">
          <Settings size={18} className="text-[#0B0B0B]" />
        </div>
        <div className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-500 dark:from-white dark:to-surface-400 tracking-tight">
          ConfigUI
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5">
        <NavLink to="/" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <LayoutDashboard size={18} className="transition-transform group-hover:scale-110" />
          Dashboard
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <Settings size={18} className="transition-transform group-hover:scale-110" />
          Settings
        </NavLink>

        <NavLink to="/categories" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <Folder size={18} className="transition-transform group-hover:scale-110" />
          Categories
        </NavLink>

        <NavLink to="/preferences" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <SlidersHorizontal size={18} className="transition-transform group-hover:scale-110" />
          Preferences
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <Search size={18} className="transition-transform group-hover:scale-110" />
          Semantic Search
        </NavLink>

        <NavLink to="/logs" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
          <History size={18} className="transition-transform group-hover:scale-110" />
          Logs
        </NavLink>

        {role === "ROLE_ADMIN" && (
          <>
            <div className="my-3 h-px w-full bg-surface-200 dark:bg-border-goldLight/50" />
            <NavLink to="/admin" className={({ isActive }) => `${navItemClass} ${isActive ? activeClass : inactiveClass}`}>
              <Shield size={18} className="transition-transform group-hover:scale-110" />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;