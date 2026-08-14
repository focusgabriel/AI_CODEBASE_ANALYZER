/** @format */

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Logo from "../../components/Logo";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import api from "../api/fetch";

const Register = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser = {
      name: nameRef.current?.value,
      email: emailRef.current?.value.toLowerCase(),
      password: passwordRef.current?.value,
      confirm_password: confirmPasswordRef.current?.value,
    };

    try {
      setIsRegistering(true);
      await api.post("/auth/register", newUser);

      toast.success("Registration successful! You can now sign in.", {
        position: "top-right",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Registration failed.", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("Registration failed.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <section className="md:auth-shell min-h-screen sm:px-4 sm:py-10 text-slate-900">
        <div className="md:auth-shell-bg" />

        <div className="relative mx-auto flex md:min-h-[calc(100vh-5rem)] min-h-screen items-center justify-center">
          <div className="w-full max-w-none sm:max-w-md sm:mx-auto overflow-hidden sm:rounded-[1.25rem] sm:border sm:border-slate-200 sm:bg-white p-3 sm:p-8 md:auth-card shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)]">
            <div className="mb-8 space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">
                Register
              </div>
              {/* <Logo variant="auth" /> */}
            </div>

            <form onSubmit={submitForm} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="name" className="labelClass">
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  ref={nameRef}
                  className="fieldClass"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="labelClass">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
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
                  className="fieldClass"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="confirm_password" className="labelClass">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  ref={confirmPasswordRef}
                  className="fieldClass"
                  required
                />
              </div>

            <button type="submit" className="auth-action-btn">
              {isRegistering ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Registering
                </>
              ) : (
                <>
                  Register
                </>
              )}
            </button>
            </form>


            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="auth-footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;