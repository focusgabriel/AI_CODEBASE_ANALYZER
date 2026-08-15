import { Book, Code, Compass, Metronome, Shield } from "lucide-react"
import { ScoreCards } from "./CodeQuality"

const CodeScores = () => {
  return (
    <div className="bg-white h-[210px] border border-amber-400 grid grid-cols-3 gap-4 w-full">
      <ScoreCards icon={Code} overview="Code Quality" score="60" />
      <ScoreCards icon={Metronome} overview="Maintainability" score="60" />
      <ScoreCards icon={Shield} overview="Security" score="60" />
      <ScoreCards icon={Compass} overview="Performance" score="60" />
      <ScoreCards icon={Book} overview="Good Practice" score="60" />
      <ScoreCards icon={Code} overview="Code Quality" score="60" />
    </div>
  )
}

export default CodeScores
