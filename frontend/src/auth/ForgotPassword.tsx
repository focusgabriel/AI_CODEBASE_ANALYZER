import axios from "axios";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../api/fetch";
import Logo from "../components/Logo";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const resetSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const writeEmail = {
      email: emailRef.current?.value.toLowerCase()
    }

    try {
      setIsLoading(true);
      await api.post("/auth/forgot-password", writeEmail);

      toast.success("Check your email for the password reset link.", {
        position: "top-right",
        duration: 5000,
      });

    } catch (error) {
      setIsLoading(false)
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Email verification failed.", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.error("Email verification failed.", {
          position: "top-right",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    } 
  }

  
  return (
    <>
      <section className="md:auth-shell min-h-screen sm:px-4 sm:py-10 text-slate-900">
        <div className="md:auth-shell-bg" />
        <div className="relative mx-auto flex md:min-h-[calc(100vh-5rem)] min-h-screen items-center justify-center">
          <div className="w-full max-w-none sm:max-w-md mx-auto overflow-hidden sm:rounded-[1.25rem] sm:border sm:border-slate-200 sm:bg-white p-3 sm:p-8 md:auth-card shadow-[0_40px_90px_-30px_rgba(15,23,42,0.08)]">
            <div className="mb-8 space-y-5">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">
                Reset Password
              </div>
              <Logo variant="auth" />
            </div>

            <form onSubmit={resetSubmit} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="email" className="labelClass">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  ref={emailRef}
                  placeholder="enter your email"
                  className="fieldClass"
                  required
                />
              </div>

              <button type="submit" className="auth-action-btn">
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default ForgotPassword