// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";
// import type { LanguageMetric } from "../types/metrics";


// interface LanguageDistributionProps {
//   languages: LanguageMetric[];
// }

// const COLORS = [
//   "#7C3AED",
//   "#2563EB",
//   "#06B6D4",
//   "#10B981",
//   "#F59E0B",
//   "#EF4444",
// ];

// export default function LanguageDistribution({
//   languages,
// }: LanguageDistributionProps) {
//   const data = languages.map((item) => ({
//     name: item.language,
//     value: item.percentage,
//     files: item.files,
//   }));

//   return (
//     <div className="rounded-2xl border border-[#ECECF4] bg-white p-6">

//       <div className="mb-6">
//         <h2 className="text-lg font-semibold text-[#202033]">
//           Language Distribution
//         </h2>

//         <p className="mt-1 text-sm text-[#777791]">
//           Languages used across the analyzed repository.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">

//         {/* CHART */}
//         <div className="h-[280px]">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={70}
//                 outerRadius={105}
//                 paddingAngle={2}
//                 stroke="none"
//               >
//                 {data.map((_, index) => (
//                   <Cell
//                     key={`language-${index}`}
//                     fill={
//                       COLORS[index % COLORS.length]
//                     }
//                   />
//                 ))}
//               </Pie>

//               <Tooltip
//                 formatter={(value, _name, props) => [
//                   `${value}%`,
//                   props.payload.name,
//                 ]}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* LEGEND */}
//         <div className="space-y-4">
//           {languages.map((language, index) => (
//             <div
//               key={language.language}
//               className="flex items-center justify-between"
//             >
//               <div className="flex items-center gap-3">

//                 <span
//                   className="h-3 w-3 rounded-full"
//                   style={{
//                     backgroundColor:
//                       COLORS[index % COLORS.length],
//                   }}
//                 />

//                 <span className="text-sm text-[#44445A]">
//                   {language.language}
//                 </span>

//               </div>

//               <div className="flex items-center gap-3">
//                 <span className="text-xs text-[#9999AA]">
//                   {language.files} files
//                 </span>

//                 <span className="min-w-[45px] text-right text-sm font-semibold text-[#202033]">
//                   {language.percentage}%
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }