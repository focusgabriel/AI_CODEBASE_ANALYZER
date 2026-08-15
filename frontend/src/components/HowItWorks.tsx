const steps = [
  {
    number: "1",
    title: "Upload your codebase",
    description: (
      <>
        Upload a ZIP file of your project
      </>
    ),
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
];

const HowItWorks = () => {
  return (
    <section className="w-full max-w-[320px] h-80 rounded-2xl border border-[#eeeef7] bg-white px-[30px] py-7">
      <h2 className="mb-7 text-[17px] font-bold leading-tight text-[#17172a]">
        How it works
      </h2>

      <div className="flex flex-col">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex min-h-[76px]"
          >
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
}

export default HowItWorks;