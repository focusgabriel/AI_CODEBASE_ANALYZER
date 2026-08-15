// /** @format */

// import { useEffect, useState } from "react";
// import { Mock } from "../constants";
// import AnalysisCard from "./AnalysisCard";
// import { Card } from "./Card";
// import type {
//   Analysis,
//   Files,
//   Metrics,
//   Reports,
//   Uploads,
//   UserProps,
// } from "../types/dashboard";

// interface AuthentUser {
//   authUser?: UserProps;
//   getAnalysis?: Analysis[];
//   metrics?: Metrics[];
//   File?: Files;
//   Uploads?: Uploads[];
//   reports?: Reports[];
// }

// enum Rate {
//   GOOD = "Good",
//   POOR = "Poor",
//   EXCELLENT = "Excellent",
//   FAIR = "Fair",
//   VERYGOOD = "Very Good",
//   BELOWAVG = "Below Average",
//   NEEDS_IMPROVEMENT = "Needs Improvement",
// }

// const getRatingFromScore = (score: number): Rate => {
//   switch (true) {
//     case score >= 90:
//       return Rate.EXCELLENT;
//     case score >= 80:
//       return Rate.VERYGOOD;
//     case score >= 70:
//       return Rate.GOOD;
//     case score >= 60:
//       return Rate.FAIR;
//     case score >= 50:
//       return Rate.NEEDS_IMPROVEMENT;
//     case score >= 40:
//       return Rate.BELOWAVG;
//     default:
//       return Rate.POOR;
//   }
// };

// const MainView = ({ reports, getAnalysis }: AuthentUser) => {
//   const [rating, setRating] = useState<Rate | "">("");

//   const report: Reports[] = Array.isArray(reports) ? reports : [];
//   const totalScore = report.reduce((sum, item) => sum + item.scores.overall, 0);
//   const avgScore = report.length ? totalScore / report.length : 0;

//   useEffect(() => {
//     setRating(report.length ? getRatingFromScore(avgScore) : "");
//   }, [avgScore, report.length]);

//   const analysisReport = report.map((item) => item.risks).length
//   const analysisReport2 = report.map((item) => item.security.findings).length

//   const getIssuesFromReport = analysisReport + analysisReport2

//   // for counting the analyzes collection to get the statu with completed as project Analyzed and the total Analysis is the whole file in the collection
//   const analysis: Analysis[] = Array.isArray(getAnalysis) ? getAnalysis : [];
//   const mapAnalysis = analysis.map(item => item.status.length);
//   const analyzedFile = analysis.map(
//     item => item.status === "COMPLETED" && item.status.length,
//   );

//   return (
//     <section className="border border-red-500 h-100 ">
//       <div className="w-full grid lg:grid-cols-4">
//         <Card
//           icon="/image/js.svg"
//           alt="js"
//           title="Total Analysis"
//           content={`${mapAnalysis.length}`}
//           msg=""
//         />
//         <Card
//           icon="/image/js.svg"
//           alt="js"
//           title="Project Analyzed"
//           content={`${analyzedFile.length}`}
//           msg="this week"
//         />
//         <Card
//           icon="/image/js.svg"
//           alt="js"
//           title="Avg Code Quality"
//           content={`${Number(avgScore).toFixed(1)}`}
//           msg={rating}
//         />
//         <Card
//           icon="/image/js.svg"
//           alt="js"
//           title="Issues Found"
//           content={`${getIssuesFromReport}`}
//           msg="this week"
//         />
//       </div>

//       <div className="border-3 border-amber-300">
//         {Mock.map(
//           ({ repository, language, analysisDate, status, score }, index) => (
//             <AnalysisCard
//               key={index}
//               repository={repository}
//               language={language}
//               analysisDate={analysisDate}
//               status={status}
//               score={score}
//             />
//           ),
//         )}
//       </div>

//     </section>
//   );
// };

// export default MainView;
