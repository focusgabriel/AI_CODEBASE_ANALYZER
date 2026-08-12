/** @format */

// import Button from "./Button"

const Navbar = () => {
  return (
    <nav className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap items-center justify-between gap-3 m-2 navbar">
      <div className="w-full sm:w-auto text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-violet-600">
          CodeRadar
        </h1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
        <p className="text-sm text-[#f1f1f1]">Dashboard</p>
        <button className="btnSignin text-sm px-4 py-2">Sign in</button>
        <button className="btnStarted text-sm px-4 py-2">Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;
