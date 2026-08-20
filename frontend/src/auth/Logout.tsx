/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "../lib/useAuth";
import api from "../api/fetch";
// import type { DashboardResponse } from "../../types/dashboard";

const Logout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useAuth();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // proceed anyway
    }
    // Small delay so the spinner shows
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 400);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          {/* Top accent bar */}
          <div className="h-2 bg-linear-to-r from-rose-400 via-rose-500 to-rose-600" />

          {/* Content */}
          <div className="px-6 pb-8 pt-8 sm:px-8">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 ring-8 ring-rose-50/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-200">
                <LogOut size={26} strokeWidth={2} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-2 text-center">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Sign out
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Are you sure you want to sign out,{" "}
                <span className="font-semibold text-slate-700">
                  {user?.name.split(" ")[1] ?? user?.name.split(" ")[0]}
                </span>
                ? You'll need to sign in again to access your dashboard.
              </p>
            </div>

            {/* Warning box */}
            {/* <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200/70 bg-amber-50 px-4 py-3.5">
              <AlertTriangle
                size={17}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-amber-500"
              />
              <p className="text-xs leading-relaxed text-amber-700">
                Make sure you've saved any pending changes. Your data is
                securely stored and will be here when you return.
              </p>
            </div> */}

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row-reverse">
              {/* Confirm logout */}
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition-all duration-200 hover:from-rose-600 hover:to-rose-700 hover:shadow-md hover:shadow-rose-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-35"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing out…
                  </>
                ) : (
                  <>
                    <LogOut size={16} strokeWidth={2} />
                    Sign out
                  </>
                )}
              </button>

              {/* Cancel */}
              <button
                onClick={handleCancel}
                disabled={isLoggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-30"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
                Go back
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="mt-5 text-center text-xs text-slate-400">
          You can always sign back in anytime.
        </p>
      </div>
    </div>
  );
};

export default Logout;
