/** @format */


interface LogoProps {
  variant?: "sidebar" | "header" | "auth";
}

const Logo = ({ variant = "sidebar" }: LogoProps) => {
  if (variant === "sidebar") {
    return (
      <div className="flex h-12 w-full items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-200/60">
        {/* Mobile: wallet icon only */}
        <svg
          className="h-5 w-5 shrink-0 lg:hidden"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="12" r="0.75" fill="currentColor" />
        </svg>

        {/* Desktop: wallet icon + full branded "Trackiu" text */}
        <span className="hidden lg:flex lg:w-full lg:items-center lg:justify-center lg:gap-2">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16.5" cy="12" r="0.75" fill="currentColor" />
          </svg>
          <div className="w-[50%] font-medium text-white">
          </div>
        </span>
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-indigo-700 text-white shadow-sm shrink-0">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12a2 2 0 00-2-2h-4a2 2 0 100 4h4a2 2 0 002-2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="12" r="0.75" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // auth variant — full logo for login/register pages
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl shadow-md">
        <img
          src="/logo.png"
          alt="trackio_logo"
          className="h-14 w-14 rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Logo;
