import type { JSX } from "react/jsx-runtime";

// interface injectScoreCard {
//   score: number
// }

interface AnalysisProps {
  icon: string,
  alt: string,
  title: string,
  content: string,
  // attribute: number,
  // score?: React.ComponentType<injectScoreCard>
  score?: JSX.Element
}

export const AnalysisCard = ({icon, alt, title, content, score}: AnalysisProps) => {
  return(
    <div className="flex justify-between bg-white border border-gray-500 rounded-xl h-auto w-[260px] mx-auto px-2">
      <div className="items-center p-2">
        <img src={icon} alt={alt} width={30} height={30} className="object-contain" />
      </div>

      <div className="flex flex-col items-center ml-[-4em]">
        <h2 className="text-[14px]">{title}</h2>
        <p className="text-[12px]">{content}</p>
      </div>

      <div className=" flex justify-end items-center">
        {/* <Content score={attribute} /> */}
        {score}
      </div>
    </div>
  )
}