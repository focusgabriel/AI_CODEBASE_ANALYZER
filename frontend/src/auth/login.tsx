/** @format */

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, LogIn } from "lucide-react";
// import Logo from "../../components/Logo";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../lib/useAuth";
import api from "../api/fetch";

const Login = () => {
  const { checkAuth } = useAuth();
  const [signin, setSignin] = useState(false)
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentials = {
      email: emailRef.current?.value.toLowerCase(),
      password: passwordRef.current?.value,
    };

    try {
      setSignin(true);
      await api.post("/auth/login", credentials);

      toast.success("Login successful!", {
        position: "top-right",
        duration: 3000,
      });
      await checkAuth();
      navigate("/overview");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            "Login failed. Please verify your account.",
          {
            position: "top-right",
            duration: 3000,
          },
        );
      } else {
        toast.error("Login failed. Please try again.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } finally {
      setSignin(false);
    }
  };

  return (
    <>
      <section className="md:auth-shell min-h-screen sm:px-4 sm:py-10 text-slate-900">
        <div className="md:auth-shell-bg" />
        <div className="relative mx-auto w-full flex md:min-h-[calc(100vh-5rem)] min-h-screen items-center justify-center">
          <div className="w-full max-w-none sm:max-w-md sm:mx-auto overflow-hidden sm:rounded-[1.25rem] sm:border sm:border-slate-200 sm:bg-white p-4 sm:p-8 md:auth-card shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)]">
            <div className="mb-8 space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">
                Sign in
              </div>
              {/* <Logo variant="auth" /> */}
            </div>

            <form onSubmit={submitForm} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="email" className="labelClass">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
                  placeholder="you@example.com"
                  className="fieldClass"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="labelClass">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordRef}
                  placeholder="Enter your password"
                  className="fieldClass"
                  required
                />
              </div>

              <button type="submit" className="auth-action-btn">
                {signin ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} strokeWidth={2} />
                    Login
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/register" className="auth-footer-link">
                Create one
              </Link>
              <Link
                to="/forgotPassword"
                className="auth-footer-link block mt-4"
              >
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
