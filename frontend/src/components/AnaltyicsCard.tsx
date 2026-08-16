import { FileArchive } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface analytics {
  title: string,
  language?: string,
  status: string,
  date: string,
  score?: JSX.Element
}
export const AnaltyicsCard = ({title, language, status, date, score}: analytics) => {
  return (
    <div className="group flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-white px-2 py-2.5 transition-all duration-200 hover:border-slate-100 hover:bg-slate-50/70">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
          <FileArchive className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-[11px] text-gray-500">analyzed at {date}</p>
        </div>
      </div>

      <div className="max-w-2/5">
        {language}
      </div>

      <div className={`${status === "COMPLETED" ? "bg-green-300 text-green-600" : "bg-red-300 text-red-600"} text-[10px] px-2 py-1 rounded-full font-extralight`}>
        {status}
      </div>

      <div className="flex shrink-0 items-center justify-end">
        {score}
      </div>
    </div>
  )
}


