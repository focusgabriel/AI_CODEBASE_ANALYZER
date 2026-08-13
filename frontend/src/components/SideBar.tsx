/** @format */

import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import Logo from "./Logo";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/useAuth";

const SideBar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // State is cleared in AuthProvider even if the request fails
    }
  };

  return (
    <aside className="sidebar-xs-bottom group/sidebar flex h-screen w-16 shrink-0 flex-col border-r border-slate-100 bg-white px-1.5 py-4 transition-[width,box-shadow] duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:hover:w-54 lg:hover:shadow-xl lg:focus-within:w-54 lg:focus-within:shadow-xl">
      {/* Logo - hidden on small screens since it's in the header */}
      <div className="hidden lg:block mb-6">
        <Logo variant="sidebar" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-1 w-full">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              title={name}
              className={`group/item flex h-11 items-center justify-center gap-3 overflow-hidden rounded-lg px-3 text-sm font-medium transition-all duration-200 lg:group-hover/sidebar:justify-start lg:group-focus-within/sidebar:justify-start ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon
                size={20}
                className="shrink-0 transition-transform duration-200 group-hover/item:scale-105"
              />
              <span className="hidden truncate lg:group-hover/sidebar:inline lg:group-focus-within/sidebar:inline">
                {name}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Logout - always visible on mobile in bottom nav */}
      <div className="flex justify-center lg:mt-auto lg:border-t lg:border-slate-100 lg:pt-3">
        <button
          onClick={handleLogout}
          title="Logout"
          className="hidden w-full items-center justify-center gap-3 rounded-lg px-3 py-2 text-lg font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 sm:flex lg:group-hover/sidebar:justify-start lg:group-focus-within/sidebar:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="hidden text-sm lg:group-hover/sidebar:inline lg:group-focus-within/sidebar:inline">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
