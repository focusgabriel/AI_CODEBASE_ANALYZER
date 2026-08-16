/** @format */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Plus,
  // Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CalendarDays,
} from "lucide-react";
// import refreshClient from "../api/fetch";
// import { useNavigate } from "react-router-dom";
// import type { DashboardResponse } from "../types/dashboard";
import { useAuth } from "../lib/useAuth";
import { toast } from "react-hot-toast";
import Logo from "./Logo";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/overview": { title: "Welcome back", subtitle: "Here's an overview of your codebase analyses" },
  "/reports": { title: "Reports", subtitle: "A Review of your Codebase" },
  "/analytics": {
    title: "Analytics",
    subtitle: "All your Analysis in one place",
  },
  // "/transaction": { title: "Transactions", subtitle: "All your records" },
  // "/task": { title: "Add Transaction", subtitle: "Record a new entry" },
  // "/success": { title: "Success", subtitle: "Transaction completed" },
};

const Header = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const profileRef = useRef<HTMLDivElement>(null);
  // const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const { user, logout } = useAuth();

  const pageInfo =
    PAGE_TITLES[location.pathname] 
    // || (location.pathname.startsWith("/edit/")
    //   ? { title: "Edit Transaction", subtitle: "Update your record" }
    //   : { title: "Dashboard", subtitle: "Welcome back" });

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Track scroll for glass effect
  useEffect(() => {
    const main = document.querySelector("main");
    const target = main || window;
    const handleScroll = () => {
      const scrollY = main ? main.scrollTop : window.scrollY;
      setScrolled(scrollY > 6);
    };
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile on outside click — always mounted to avoid StrictMode / mobile race conditions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  let userName = user?.name;
  let userEmail = user?.email ?? "";

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
      toast.success("Logged out successfully", {
        position: "top-right",
        duration: 3000,
      });
    } catch {
      toast.error("Failed to log out", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const userInitial =
    userName?.split(" ")[1]?.charAt(0).toUpperCase() ??
    userName?.split(" ")[0]?.charAt(0).toUpperCase();

  // Format today's date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <header
        className={`sticky top-0 z-30 mb-5 borderBottom px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.02)] backdrop-blur-xl"
            : "bg-transparent"
            
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* ── Left: Logo (mobile) + Title ── */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="lg:hidden shrink-0">
              <Logo variant="header" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                {pageInfo?.title}
              </h1>
              <p className="hidden lg:inline text-[14px] text-slate-400 tracking-wide">{pageInfo?.subtitle}</p>
              <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                <CalendarDays size={12} strokeWidth={1.5} />
                <span>{dateStr}</span>
              </div>
              <p className="truncate text-[11px] text-slate-400 sm:hidden">
                {greeting}, {userName?.split(" ")[1] ?? userName?.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="upload"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-linear-to-br from-indigo-600 to-indigo-700 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md hover:shadow-indigo-200 active:scale-[0.97]"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>New</span>
            </Link>

            {/* Add Transaction — mobile FAB */}
            <Link
              to="/upload"
              className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all duration-200 active:scale-90"
            >
              <Plus size={18} strokeWidth={2.5} />
            </Link>

            {/* Divider */}
            <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />

            {/* ── User Avatar ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="group flex items-center gap-2 rounded-xl px-1.5 py-1 transition-all duration-200 hover:bg-slate-100 active:scale-95 sm:px-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-white transition-all duration-200 group-hover:ring-indigo-200 sm:h-9 sm:w-9">
                  {userInitial?.split("")[1] ?? userInitial?.split("")[0]}
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {userName}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden text-slate-400 transition-all duration-200 lg:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ── Desktop dropdown ── */}
              {profileOpen && (
                <div className="hidden sm:block absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-fade-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
                  <div className="border-b border-slate-100 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-sm font-bold text-white">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {userName}
                        </p>
                        {userEmail && (
                          <p className="truncate text-xs text-slate-400">
                            {userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5">
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50">
                      <User size={15} strokeWidth={1.5} />
                      Profile
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50">
                      <Settings size={15} strokeWidth={1.5} />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-slate-100 p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut size={15} strokeWidth={1.5} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}

              {/* ── Mobile bottom sheet (stops above bottom nav bar) ── */}
              {profileOpen && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 z-9999 bg-black/20 backdrop-blur-sm animate-fade-in sm:hidden"
                    onClick={() => setProfileOpen(false)}
                  />

                  {/* Sheet */}
                  <div className="fixed left-0 right-0 bottom-15 z-9999 flex items-end justify-center sm:hidden pointer-events-none">
                    <div
                      className="w-full animate-slide-up rounded-t-3xl border-t border-slate-200 bg-white shadow-2xl pointer-events-auto"
                      style={{ maxHeight: "calc(100dvh - 80px)" }}
                    >
                      {/* Handle bar */}
                      <div className="mx-auto pt-2.5 pb-1">
                        <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-300" />
                      </div>

                      {/* Scrollable content */}
                      <div
                        className="overflow-y-auto px-2 pb-6"
                        style={{ maxHeight: "calc(100dvh - 130px)" }}
                      >
                        {/* User info */}
                        <div className="flex items-center gap-3 px-4 pb-4 border-b border-slate-100">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-base font-bold text-white shadow-sm">
                            {userInitial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-slate-800 truncate">
                              {userName}
                            </p>
                            {userEmail && (
                              <p className="text-sm text-slate-400 truncate">
                                {userEmail}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Profile */}
                        <div className="border-b border-slate-100">
                          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                            <User
                              size={17}
                              strokeWidth={1.5}
                              className="text-slate-400 shrink-0"
                            />
                            Profile
                          </button>
                        </div>

                        {/* Settings + Sign out side by side */}
                        <div className="grid grid-cols-2 gap-2 py-2">
                          <button className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 border border-slate-100">
                            <Settings
                              size={16}
                              strokeWidth={1.5}
                              className="text-slate-400 shrink-0"
                            />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 border border-red-100"
                          >
                            <LogOut
                              size={16}
                              strokeWidth={1.5}
                              className="shrink-0"
                            />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default Header;
