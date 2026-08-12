/** @format */

import { footerLinks } from "../constants";

const Footer = () => {
  return (
    <footer className="flex flex-col lg:flex-row justify-between items-start gap-4 text-[#94a3b8] lg:mt-10 my-10">
      <div className="w-full lg:w-[60%]">
        <p className="text-[14px]">
          &copy; 2026 CodeRadar · AI-Powered Codebase Intelligence
        </p>
      </div>

      <div className="w-full lg:w-[40%]">
        <ul className="flex flex-wrap gap-4 justify-start sm:justify-end items-center">
          {footerLinks.map((item, index) => (
            <li className="text-[13px] cursor-pointer" key={index}>
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
