/** @format */

import { process } from "../constants";
import { images } from "../constants/imageGallery";
import IconButton from "./IconButton";
import Read from "./Read";

const Hero = () => {
  return (
    <section className="mx-auto w-full max-w-300 sectionBorder">
      <div className="mx-auto w-full lg:max-w-[70%] mt-12 px-2 sm:px-4">
        <h1 className="text-4xl font-semibold text-center">
          Analyze{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-violet-600">
            Any Codebase
          </span>{" "}
          in Seconds
        </h1>
        <p className="text-[#94a3b8] text-center mt-8 mx-auto mb-0 text-[18px] max-w-[180]">
          Upload your project ZIP and get instant insights on languages,
          frameworks, code quality, security, and more.
        </p>
        <div className="border-4 border-dotted border-gray-800 rounded-xl mt-12 max-w-3xl mx-auto p-8 sm:p-12 hover:border-[#00d4ff] hover:bg-[#ffffff0d] text-center">
          <span className="text-4xl block text-[52px] mb-4">📁</span>
          <p className="text-2xl font-semibold">Drop your project ZIP here</p>
          <p className="text-lg mt-8 font-medium">or click to browse files</p>
          <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 gap-3 mt-12">
            <button className="bg-[#ffffff0d] rounded-full px-6 py-2 font-light text-[13px] w-full sm:w-auto">
              Supported:.zip | Max size: 200Mb
            </button>
            <button className="btnStarted w-full sm:w-auto py-2">
              Analyze Now
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-evenly gap-4 mt-12 rounded-xl p-4">
          <Read title="15k+" content="projects Analyzed" />
          <Read title="2.3s" content="Avg. Scan Time" />
          <Read title="100%" content="private & secured" />
        </div>
      </div>

      <div className="mt-12 overflow-x-auto scrollbar-none">
        <ul className="flex flex-wrap gap-3 p-4 lg:flex-nowrap">
          {images.map((item, index) => (
            <li key={index} className="shrink-0">
              <IconButton
                icon={item.icon}
                alternate={item.alternate}
                content={item.content}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl mx-auto">
          {process.map((item, index) => (
            <li key={index} className="inline-block">
              <span className="flex items-center justify-center sm:justify-start text-[14px] font-light text-[#94a3b8]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffffff0d] border border-gray-800 text-[#f1f1f1] mr-3">
                  {index + 1}
                </span>
                {item.title}
                <span className="text-[18px] text-[#64748b] px-4">→</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
