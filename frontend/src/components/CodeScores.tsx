import {
  BookOpenCheck,
  Code,
  FlaskConical,
  Gauge,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { ScoreCards } from "./CodeQuality";

interface CodeInfo {
  codeQuality?: string,
  maintainability?: string,
  security?: string,
  performance?: string,
  goodPractice?: string,
  technologies?: string,
}
const CodeScores = ({codeQuality, security,maintainability,technologies }: CodeInfo) => {
  return (
    <section className="w-full">
      {/* Section title */}
      <h2 className="mb-4 px-1 text-[15px] font-semibold text-[#202033]">
        Code Scores
      </h2>

      {/* Main card */}
      <div className="w-full grid-cols-2 lg:flex rounded-2xl border border-[#ECECF4] bg-white p-3">
        <div className="grid min-h-[228px] w-full grid-cols-2 gap-3 rounded-[14px] border border-[#F0F0F6] bg-white p-4 lg:grid-cols-3">
          <ScoreCards
            icon={Code}
            overview="Code Quality"
            score={codeQuality}
            color="#7C3AED"
            lightColor="#F3E8FF"
          />
          <ScoreCards
            icon={Wrench}
            overview="Maintainability"
            score={maintainability}
            color="#3B82F6"
            lightColor="#EFF6FF"
          />
          <ScoreCards
            icon={ShieldCheck}
            overview="Security"
            score={security}
            color="#16B86A"
            lightColor="#ECFAF3"
          />
          <ScoreCards
            icon={Gauge}
            overview="Performance"
            score="60"
            color="#F58220"
            lightColor="#FFF4E8"
          />
          <ScoreCards
            icon={BookOpenCheck}
            overview="Good Practice"
            score="60"
            color="#14B8A6"
            lightColor="#F0FDFA"
          />
          <ScoreCards
            icon={FlaskConical}
            overview="Technologies"
            score={technologies}
            color="#EC4899"
            lightColor="#FDF2F8"
          />
        </div>
      </div>
    </section>
  );
};

export default CodeScores;