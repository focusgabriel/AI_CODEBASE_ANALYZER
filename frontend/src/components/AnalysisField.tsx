import { AnalysisCard } from "./AnalysisCard"
import ScoreCircle from "./Score"

const AnalysisField = () => {
  return (
    <div className="bg-white border border-gray-700 rounded-xl p-2 w-[300px] h-[400px]">

      <div className="flex justify-between items-center px-2 mb-4">
        <p className="text-shadow-black font-semibold text-[14px]">Recent Analysis</p>
        <p className="text-gray-700 font-light text-[14px]">View All  </p>
      </div>
      <AnalysisCard icon="/image/py.png" alt="python" title="E-Commerce" content="analyzed May 4" score={<ScoreCircle score={60}/>} />
      
    </div>
  )
}

export default AnalysisField
