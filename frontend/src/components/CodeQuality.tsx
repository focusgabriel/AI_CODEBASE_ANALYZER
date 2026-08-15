import type { LucideIcon } from "lucide-react";
import type { JSX } from "react/jsx-runtime";

interface CardsProps {
  overview: string,
  score: string,
  icon: LucideIcon,
}

export const ScoreCards: React.FC<CardsProps> = ({ overview, score,icon:Icon}) => {
  return(
    <section className="flex justify-around">
      <Icon className="w-[40px] rounded-xl object-contain " />

      <div>
        <h2 className="text-[14px] font-light">{overview}</h2>
        <p className="text-[18px] font-semibold">{score} <span className="text-[12px] text-gray-400 font-light">/ 100</span></p>
      </div>
    </section>
  )
}