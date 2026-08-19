/** @format */

const steps = [
  {
    number: "1",
    title: "Upload your codebase",
    description: <>Upload a ZIP file of your project</>,
  },
  {
    number: "2",
    title: "AI Analysis",
    description: (
      <>
        Our AI analyzes code quality,
        <br />
        structure, security, and more
      </>
    ),
  },
  {
    number: "3",
    title: "Get Insights",
    description: (
      <>
        Receive detailed reports and
        <br />
        actionable recommendations
      </>
    ),
  },
  {
    number: "4",
    title: "Clean up",
    description: (
      <>
        Your files are automatically deleted from our servers,
        <br />
        ensuring complete privacy and security
      </>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h2 className="text-[16px] font-bold leading-tight text-[#17172a]">
          How it works
        </h2>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex min-h-[76px]">
            {/* Number */}
            <div
              className="
                relative z-10
                mr-[18px]
                flex h-7 w-7 min-w-7
                items-center justify-center
                rounded-full
                bg-[#f0edff]
                text-[13px]
                font-bold
                text-[#7357e8]
              "
            >
              {step.number}
            </div>

            {/* Content */}
            <div className="pt-px">
              <h3 className="mb-1.5 text-[14px] font-bold leading-[1.3] text-[#202033]">
                {step.title}
              </h3>

              <p className="text-[12px] font-normal leading-[1.45] text-[#777791]">
                {step.description}
              </p>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className="
                  absolute
                  left-[13px]
                  top-7
                  bottom-0
                  w-px
                  bg-[#ddd8f8]
                "
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
