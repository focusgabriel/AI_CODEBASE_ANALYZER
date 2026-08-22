// // import Footer from "../components/Footer"
// // import Hero from "../components/Hero"
// // import Navbar from "../components/Navbar"

// // const LandingPage = () => {
// //   return (
// //     <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-[#0a0a1a] text-white">
// //       <Navbar />
// //       <Hero />
// //       <Footer />
// //     </div>
// //   )
// // }

// // export default LandingPage



// import {
//   ArrowRight,
//   BarChart3,
//   BrainCircuit,
//   CheckCircle2,
//   ChevronRight,
//   Code2,
//   FileCode2,
//   FileDown,
//   GitBranch,
//   Layers3,
//   Lock,
//   ScanSearch,
//   ShieldCheck,
//   Sparkles,
//   Upload,
// } from "lucide-react";

// const metrics = [
//   {
//     label: "Overall Score",
//     value: "82.4",
//     change: "+6.2%",
//   },
//   {
//     label: "Code Quality",
//     value: "78",
//     change: "+4.8%",
//   },
//   {
//     label: "Security",
//     value: "91",
//     change: "+8.1%",
//   },
//   {
//     label: "Architecture",
//     value: "84",
//     change: "+5.4%",
//   },
// ];

// const findings = [
//   {
//     type: "Architecture",
//     title: "Legacy Redux pattern detected",
//     description:
//       "State management uses the legacy createStore pattern instead of Redux Toolkit.",
//     severity: "Medium",
//   },
//   {
//     type: "Code Quality",
//     title: "Broken localStorage persistence",
//     description:
//       "Objects are being persisted without JSON serialization.",
//     severity: "High",
//   },
//   {
//     type: "Security",
//     title: "Client-side storage requires validation",
//     description:
//       "Data read from localStorage should be validated before being passed into components.",
//     severity: "Low",
//   },
// ];

// function ScoreBar({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) {
//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between text-sm">
//         <span className="text-slate-400">{label}</span>
//         <span className="font-medium text-white">{value}</span>
//       </div>

//       <div className="h-2 overflow-hidden rounded-full bg-slate-800">
//         <div
//           className="h-full rounded-full bg-blue-500"
//           style={{ width: `${value}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function DashboardPreview() {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-10 bg-blue-500/10 blur-3xl" />

//       <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40">
//         {/* Browser header */}
//         <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
//           <div className="flex gap-2">
//             <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
//             <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
//             <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
//           </div>

//           <div className="rounded-md border border-slate-800 bg-slate-900 px-4 py-1 text-xs text-slate-500">
//             plainsight.local/analysis/todo
//           </div>

//           <div className="w-12" />
//         </div>

//         {/* Dashboard */}
//         <div className="grid min-h-[480px] grid-cols-[190px_1fr]">
//           {/* Sidebar */}
//           <aside className="border-r border-slate-800 bg-slate-950 p-4">
//             <div className="mb-8 flex items-center gap-2">
//               <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500">
//                 <Code2 size={15} className="text-white" />
//               </div>

//               <span className="text-sm font-semibold text-white">
//                 PlainSight
//               </span>
//             </div>

//             <div className="space-y-1 text-xs">
//               {[
//                 ["Overview", BarChart3],
//                 ["Metrics", Layers3],
//                 ["Files", FileCode2],
//                 ["Report", FileDown],
//               ].map(([name, Icon], index) => (
//                 <div
//                   key={String(name)}
//                   className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
//                     index === 0
//                       ? "bg-blue-500/10 text-blue-400"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   <Icon size={14} />
//                   {String(name)}
//                 </div>
//               ))}
//             </div>
//           </aside>

//           {/* Main */}
//           <main className="bg-slate-900/60 p-6">
//             <div className="mb-6 flex items-start justify-between">
//               <div>
//                 <p className="text-xs text-slate-500">
//                   Repository analysis
//                 </p>

//                 <h3 className="mt-1 text-xl font-semibold text-white">
//                   Todo Application
//                 </h3>

//                 <p className="mt-1 text-xs text-slate-500">
//                   React · Redux · JavaScript
//                 </p>
//               </div>

//               <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
//                 Completed
//               </div>
//             </div>

//             {/* Metrics */}
//             <div className="grid grid-cols-2 gap-3">
//               {metrics.map((metric) => (
//                 <div
//                   key={metric.label}
//                   className="rounded-xl border border-slate-800 bg-slate-950 p-4"
//                 >
//                   <p className="text-[11px] text-slate-500">
//                     {metric.label}
//                   </p>

//                   <div className="mt-2 flex items-end justify-between">
//                     <span className="text-2xl font-semibold text-white">
//                       {metric.value}
//                     </span>

//                     <span className="text-[10px] text-emerald-400">
//                       {metric.change}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Analysis */}
//             <div className="mt-4 grid grid-cols-2 gap-3">
//               <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
//                 <p className="mb-4 text-xs font-medium text-white">
//                   Repository metrics
//                 </p>

//                 <div className="space-y-4">
//                   <ScoreBar label="Architecture" value={84} />
//                   <ScoreBar label="Code Quality" value={78} />
//                   <ScoreBar label="Security" value={91} />
//                 </div>
//               </div>

//               <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
//                 <p className="mb-3 text-xs font-medium text-white">
//                   AI findings
//                 </p>

//                 <div className="space-y-2">
//                   {findings.slice(0, 2).map((finding) => (
//                     <div
//                       key={finding.title}
//                       className="rounded-lg border border-slate-800 p-3"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="text-[10px] text-blue-400">
//                           {finding.type}
//                         </span>

//                         <span className="text-[9px] text-amber-400">
//                           {finding.severity}
//                         </span>
//                       </div>

//                       <p className="mt-1 text-[11px] font-medium text-slate-200">
//                         {finding.title}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* NAVBAR */}
//       <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
//           <a href="#" className="flex items-center gap-2.5">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
//               <ScanSearch size={17} />
//             </div>

//             <span className="text-lg font-semibold tracking-tight">
//               PlainSight
//             </span>
//           </a>

//           <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
//             <a href="#how-it-works" className="transition hover:text-white">
//               How it works
//             </a>

//             <a href="#features" className="transition hover:text-white">
//               Features
//             </a>

//             <a href="#technology" className="transition hover:text-white">
//               Technology
//             </a>
//           </nav>

//           <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200">
//             Analyze codebase
//             <ArrowRight size={15} />
//           </button>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative overflow-hidden">
//         <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-blue-600/10 blur-[140px]" />

//         <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
//           <div className="mx-auto max-w-4xl text-center">
//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400">
//               <Sparkles size={13} className="text-blue-400" />
//               AI-powered codebase intelligence
//             </div>

//             <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
//               Understand your
//               <span className="block text-blue-400">
//                 codebase at a glance.
//               </span>
//             </h1>

//             <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
//               PlainSight analyzes your repository, measures its structure and
//               quality, identifies risks, and turns the findings into a clear
//               engineering report.
//             </p>

//             <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
//               <button className="group flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400">
//                 <Upload size={17} />
//                 Analyze a repository
//                 <ArrowRight
//                   size={16}
//                   className="transition group-hover:translate-x-1"
//                 />
//               </button>

//               <button className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white">
//                 View sample analysis
//               </button>
//             </div>
//           </div>

//           {/* Dashboard */}
//           <div className="mx-auto mt-20 max-w-6xl">
//             <DashboardPreview />
//           </div>
//         </div>
//       </section>

//       {/* VALUE STRIP */}
//       <section className="border-y border-slate-800 bg-slate-900/40">
//         <div className="mx-auto grid max-w-7xl divide-y divide-slate-800 px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
//           {[
//             {
//               icon: BarChart3,
//               title: "Measure",
//               text: "Turn repository structure into useful metrics.",
//             },
//             {
//               icon: BrainCircuit,
//               title: "Understand",
//               text: "Use AI to interpret architecture and code quality.",
//             },
//             {
//               icon: FileDown,
//               title: "Report",
//               text: "Export findings into a portable technical report.",
//             },
//           ].map(({ icon: Icon, title, text }) => (
//             <div
//               key={title}
//               className="flex items-center gap-4 px-6 py-8 md:px-10"
//             >
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
//                 <Icon size={18} className="text-blue-400" />
//               </div>

//               <div>
//                 <h3 className="font-semibold">{title}</h3>
//                 <p className="mt-1 text-sm text-slate-500">{text}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section id="features" className="mx-auto max-w-7xl px-6 py-28">
//         <div className="max-w-2xl">
//           <p className="text-sm font-medium text-blue-400">
//             CODEBASE INTELLIGENCE
//           </p>

//           <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//             From repository files to engineering insight.
//           </h2>

//           <p className="mt-5 text-slate-400">
//             The system combines deterministic code analysis with AI-assisted
//             interpretation instead of relying on AI alone.
//           </p>
//         </div>

//         <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {[
//             {
//               icon: GitBranch,
//               title: "Repository analysis",
//               text: "Scan the repository structure and identify relevant source files.",
//             },
//             {
//               icon: BarChart3,
//               title: "Code metrics",
//               text: "Calculate imports, exports, functions, classes, interfaces and line statistics.",
//             },
//             {
//               icon: Layers3,
//               title: "Architecture analysis",
//               text: "Identify architectural patterns, concerns and structural weaknesses.",
//             },
//             {
//               icon: ShieldCheck,
//               title: "Security findings",
//               text: "Surface security-related concerns and practical recommendations.",
//             },
//             {
//               icon: BrainCircuit,
//               title: "AI interpretation",
//               text: "Convert measured repository context into understandable technical findings.",
//             },
//             {
//               icon: FileDown,
//               title: "PDF reporting",
//               text: "Export the completed analysis as a shareable technical report.",
//             },
//           ].map(({ icon: Icon, title, text }) => (
//             <div
//               key={title}
//               className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900"
//             >
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
//                 <Icon size={19} />
//               </div>

//               <h3 className="mt-5 font-semibold">{title}</h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 {text}
//               </p>

//               <div className="mt-5 flex items-center gap-1 text-xs font-medium text-slate-600 transition group-hover:text-blue-400">
//                 Explore
//                 <ChevronRight size={13} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section
//         id="how-it-works"
//         className="border-y border-slate-800 bg-slate-900/30"
//       >
//         <div className="mx-auto max-w-7xl px-6 py-28">
//           <div className="text-center">
//             <p className="text-sm font-medium text-blue-400">
//               HOW IT WORKS
//             </p>

//             <h2 className="mt-3 text-3xl font-bold">
//               A simple analysis pipeline.
//             </h2>
//           </div>

//           <div className="mt-16 grid gap-8 md:grid-cols-4">
//             {[
//               {
//                 number: "01",
//                 title: "Upload",
//                 text: "Provide a repository archive for analysis.",
//               },
//               {
//                 number: "02",
//                 title: "Scan",
//                 text: "Discover files and analyze supported source code.",
//               },
//               {
//                 number: "03",
//                 title: "Interpret",
//                 text: "Combine metrics and selected source context with AI.",
//               },
//               {
//                 number: "04",
//                 title: "Report",
//                 text: "Review the findings and export the analysis.",
//               },
//             ].map((step) => (
//               <div key={step.number} className="relative">
//                 <span className="text-4xl font-bold text-slate-800">
//                   {step.number}
//                 </span>

//                 <h3 className="mt-5 font-semibold">{step.title}</h3>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   {step.text}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TECHNOLOGY */}
//       <section id="technology" className="mx-auto max-w-7xl px-6 py-28">
//         <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
//           <div>
//             <p className="text-sm font-medium text-blue-400">
//               BUILT AS A REAL SYSTEM
//             </p>

//             <h2 className="mt-3 text-3xl font-bold">
//               Deterministic analysis first. AI interpretation second.
//             </h2>

//             <p className="mt-5 leading-7 text-slate-400">
//               PlainSight doesn't simply send an entire repository to an LLM.
//               The backend discovers the repository, calculates measurable
//               metrics, detects technologies, builds analysis context and
//               prioritizes source files before requesting AI interpretation.
//             </p>

//             <div className="mt-8 space-y-4">
//               {[
//                 "React + TypeScript frontend",
//                 "Node.js + Express backend",
//                 "MongoDB + Mongoose persistence",
//                 "AST-based source analysis",
//                 "Gemini-powered technical interpretation",
//                 "PDF report generation",
//               ].map((item) => (
//                 <div
//                   key={item}
//                   className="flex items-center gap-3 text-sm text-slate-300"
//                 >
//                   <CheckCircle2
//                     size={17}
//                     className="shrink-0 text-emerald-400"
//                   />
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
//             <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
//               <div className="mb-5 flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
//                   <Code2 size={18} />
//                 </div>

//                 <div>
//                   <p className="text-sm font-medium">Analysis pipeline</p>
//                   <p className="text-xs text-slate-600">
//                     repository → evidence → intelligence
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-2 font-mono text-xs">
//                 {[
//                   "prepareAnalysis()",
//                   "analyzeRepositoryStructure()",
//                   "extractMetrics()",
//                   "detectTechnologies()",
//                   "prioritizeSourceFiles()",
//                   "buildRepositoryAnalysisContext()",
//                   "analyzeWithLlm()",
//                   "saveAnalysisReport()",
//                 ].map((step, index) => (
//                   <div
//                     key={step}
//                     className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5"
//                   >
//                     <span className="text-slate-700">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="text-slate-400">{step}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SECURITY */}
//       <section className="border-y border-slate-800 bg-slate-900/30">
//         <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between">
//           <div className="flex gap-5">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
//               <Lock size={20} className="text-emerald-400" />
//             </div>

//             <div>
//               <h3 className="font-semibold">
//                 Built around controlled analysis
//               </h3>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                 Repository processing is bounded, analysis state is tracked,
//                 and temporary repository files are cleaned after processing.
//               </p>
//             </div>
//           </div>

//           <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium transition hover:border-slate-500">
//             See how it works
//             <ArrowRight size={15} />
//           </button>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-blue-600/5" />

//         <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
//           <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
//             Stop guessing what's inside your codebase.
//           </h2>

//           <p className="mx-auto mt-5 max-w-2xl text-slate-400">
//             Upload a repository, let PlainSight analyze it, and get a clear
//             picture of its structure, quality, technologies and risks.
//           </p>

//           <button className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-semibold transition hover:bg-blue-400">
//             Start an analysis
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="border-t border-slate-800">
//         <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-2 text-slate-400">
//             <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500">
//               <Code2 size={14} />
//             </div>

//             PlainSight
//           </div>

//           <p>
//             AI-powered codebase analysis and engineering intelligence.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }




// function AnalysisPreview() {
//   return (
//     <div className="mx-auto mt-20 max-w-6xl">
//       <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0f] shadow-2xl">

//         {/* Fake browser bar */}
//         <div className="flex h-11 items-center border-b border-zinc-800 px-4">
//           <div className="flex gap-1.5">
//             <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
//             <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
//             <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
//           </div>

//           <div className="mx-auto rounded-md bg-zinc-900 px-20 py-1.5 text-[10px] text-zinc-600">
//             coderadar.app/analysis
//           </div>
//         </div>

//         <div className="grid min-h-[500px] grid-cols-[190px_1fr]">

//           {/* Sidebar */}
//           <aside className="border-r border-zinc-800 p-5">

//             <div className="mb-10 flex items-center gap-2">
//               <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black">
//                 <span className="text-xs font-bold">C</span>
//               </div>

//               <span className="text-sm font-semibold">
//                 CodeRadar
//               </span>
//             </div>

//             <div className="space-y-1 text-xs">
//               <div className="rounded-md bg-zinc-800 px-3 py-2 text-zinc-100">
//                 Overview
//               </div>

//               <div className="px-3 py-2 text-zinc-600">
//                 Metrics
//               </div>

//               <div className="px-3 py-2 text-zinc-600">
//                 Files
//               </div>

//               <div className="px-3 py-2 text-zinc-600">
//                 Report
//               </div>
//             </div>
//           </aside>

//           {/* Dashboard */}
//           <main className="p-7">

//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-[11px] text-zinc-600">
//                   CODEBASE ANALYSIS
//                 </p>

//                 <h3 className="mt-2 text-xl font-semibold">
//                   todo
//                 </h3>

//                 <p className="mt-1 text-xs text-zinc-600">
//                   React · Redux · JavaScript
//                 </p>
//               </div>

//               <span className="rounded-full border border-emerald-900 bg-emerald-950/40 px-3 py-1 text-[10px] text-emerald-400">
//                 COMPLETED
//               </span>
//             </div>

//             {/* Scores */}
//             <div className="mt-8 grid grid-cols-4 gap-3">

//               <Score
//                 label="Overall"
//                 value="58.5"
//                 highlight
//               />

//               <Score
//                 label="Architecture"
//                 value="65"
//               />

//               <Score
//                 label="Code quality"
//                 value="35"
//               />

//               <Score
//                 label="Security"
//                 value="75"
//               />

//             </div>

//             {/* Content */}
//             <div className="mt-5 grid grid-cols-2 gap-4">

//               <div className="rounded-xl border border-zinc-800 bg-[#101012] p-5">

//                 <p className="text-xs font-medium">
//                   Architecture
//                 </p>

//                 <p className="mt-4 text-xs leading-6 text-zinc-500">
//                   Standard React-Redux application split into
//                   action creators, reducers, constants, store
//                   configuration, and a component layer.
//                 </p>

//                 <div className="mt-5">
//                   <p className="text-[10px] uppercase tracking-wide text-zinc-700">
//                     Patterns
//                   </p>

//                   <div className="mt-3 space-y-2">
//                     <Tag>
//                       Redux Pattern
//                     </Tag>

//                     <Tag>
//                       Component-Based Architecture
//                     </Tag>
//                   </div>
//                 </div>

//               </div>

//               <div className="rounded-xl border border-zinc-800 bg-[#101012] p-5">

//                 <p className="text-xs font-medium">
//                   Findings
//                 </p>

//                 <div className="mt-4 space-y-3">

//                   <Finding
//                     title="Legacy Redux pattern"
//                     severity="Medium"
//                   />

//                   <Finding
//                     title="Broken localStorage persistence"
//                     severity="High"
//                   />

//                   <Finding
//                     title="Deprecated event handler"
//                     severity="Low"
//                   />

//                 </div>

//               </div>

//             </div>

//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }



// function Score({
//   label,
//   value,
//   highlight = false,
// }: {
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div
//       className={`rounded-xl border p-4 ${
//         highlight
//           ? "border-zinc-600 bg-zinc-900"
//           : "border-zinc-800 bg-[#101012]"
//       }`}
//     >
//       <p className="text-[10px] text-zinc-600">
//         {label}
//       </p>

//       <p className="mt-2 text-2xl font-semibold tracking-tight">
//         {value}
//       </p>
//     </div>
//   );
// }

// function Tag({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-md bg-zinc-900 px-3 py-2 text-[10px] text-zinc-500">
//       {children}
//     </div>
//   );
// }

// function Finding({
//   title,
//   severity,
// }: {
//   title: string;
//   severity: "Low" | "Medium" | "High";
// }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-3">
//       <div className="flex items-center gap-3">
//         <span
//           className={`h-1.5 w-1.5 rounded-full ${
//             severity === "High"
//               ? "bg-red-400"
//               : severity === "Medium"
//                 ? "bg-yellow-400"
//                 : "bg-blue-400"
//           }`}
//         />

//         <span className="text-[11px] text-zinc-400">
//           {title}
//         </span>
//       </div>

//       <span className="text-[9px] text-zinc-700">
//         {severity}
//       </span>
//     </div>
//   );
// }

const Dashboard = ({
  dashboardData,
}: {
  dashboardData: DashboardResponse | null;
}) => {
  const metric = dashboardData?.metrics ?? []; 
}




import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Code2,
  FileDown,
  GitBranch,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import Metrics from "./MetricsPage";
import ScoreTrend from "../components/ScoreTrend";
import RepositoryMetrics, {
  type RepositoryMetricsData,
} from "../components/LandingPageMetrics";
import type { DashboardResponse } from "../types/dashboard";
import { Link } from "react-router-dom";

const sampleMetrics: RepositoryMetricsData = {
  totalLines: 12480,
  codeLines: 9865,
  commentLines: 1420,
  blankLines: 1195,
  imports: 342,
  exports: 186,
  functions: 512,
  classes: 48,
  interfaces: 67,
};

type DemoSlotProps = {
  children?: ReactNode;
};

/**
 * Replace this component with your actual dashboard preview,
 * screenshot, iframe, external component, etc.
 *
 * Example:
 *
 * <LandingPage
 *   dashboardSlot={<MyDashboardPreview />}
 * />
 */
function DashboardSlot({ children }: DemoSlotProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[430px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
      <div className="max-w-sm px-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <BarChart3 size={22} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          Analysis dashboard preview
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Replace this area with your actual CodeRadar dashboard,
          screenshot, or interactive preview.
        </p>
      </div>
    </div>
  );
}

type LandingPageProps = {
  dashboardSlot?: ReactNode;
};

export default function LandingPage({
  dashboardSlot,
}: LandingPageProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ------------------------------------------------
          NAVIGATION
      ------------------------------------------------ */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          <a
            href="#"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Code2 size={17} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              CodeRadar
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-500 md:flex">
            <a
              href="#features"
              className="transition hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="transition hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#about"
              className="transition hover:text-slate-900"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Register
            </Link>
          </div>

        </div>
      </header>


      {/* ------------------------------------------------
          HERO
      ------------------------------------------------ */}

      <section className="relative overflow-hidden">

        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:pb-24 lg:pt-28">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
              <Search size={13} />
              Codebase analysis tool
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
              Understand your codebase
              <span className="block text-indigo-600">
                before you change it.
              </span>
            </h1>

            <p className="mt-4 text-lg font-medium text-indigo-600">
              Get clear, actionable feedback that helps you grow as a developer.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              CodeRadar analyzes your repository and gives you a
              clearer picture of its structure, code quality,
              technologies, security concerns, and areas that need
              attention.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="#analyze"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Analyze a repository
                <ArrowRight size={16} />
              </a>

              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                See how it works
              </a>

            </div>

          </div>


          {/* Small supporting line */}

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-slate-400">

            <span className="flex items-center gap-2">
              <Check size={14} className="text-indigo-500" />
              Repository structure
            </span>

            <span className="flex items-center gap-2">
              <Check size={14} className="text-indigo-500" />
              Code metrics
            </span>

            <span className="flex items-center gap-2">
              <Check size={14} className="text-indigo-500" />
              AI-assisted analysis
            </span>

            <span className="flex items-center gap-2">
              <Check size={14} className="text-indigo-500" />
              PDF reports
            </span>

          </div>

        </div>

      </section>


      {/* ------------------------------------------------
          DASHBOARD / DEMO SLOT
      ------------------------------------------------ */}

      <section className="border-y border-slate-200 bg-slate-50/70">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                See the result
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                A clearer view of your repository.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              The analysis dashboard brings the important findings
              together without making you dig through the entire
              repository yourself.
            </p>

          </div>

          {/* 
             This is intentionally replaceable.

             Put your actual dashboard here:

             dashboardSlot={
               <ActualDashboard />
             }

             You can also put:
               - an image
               - iframe
               - video
               - screenshot
               - external component
          */}

          <DashboardSlot>
            <RepositoryMetrics
              repositoryName="Task Manager"
              metrics={sampleMetrics}
            />
          </DashboardSlot>

        </div>

      </section>


      {/* ------------------------------------------------
          WHAT IT DOES
      ------------------------------------------------ */}

      <section
        id="features"
        className="mx-auto max-w-6xl px-6 py-24"
      >

        <div className="max-w-2xl">

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            What CodeRadar does
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            It turns a repository into something easier to understand.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Instead of treating the codebase as a collection of
            unrelated files, CodeRadar looks at the repository as a
            whole and produces useful technical information from it.
          </p>

        </div>


        <div className="mt-12 grid gap-5 md:grid-cols-2">

          <Feature
            icon={GitBranch}
            title="Repository structure"
            description="Identify the structure of the project, important files, entry points, configurations, and relevant source code."
          />

          <Feature
            icon={BarChart3}
            title="Code metrics"
            description="Calculate useful measurements such as lines of code, imports, exports, functions, classes, interfaces, comments, and blank lines."
          />

          <Feature
            icon={ShieldCheck}
            title="Quality and security"
            description="Highlight code quality problems, architectural concerns, potential security issues, and practical recommendations."
          />

          <Feature
            icon={FileDown}
            title="Technical report"
            description="Turn the completed analysis into a readable report that can be reviewed or exported as a PDF."
          />

        </div>

      </section>


      {/* ------------------------------------------------
          HOW IT WORKS
      ------------------------------------------------ */}

      <section
        id="workflow"
        className="border-y border-slate-200 bg-slate-50"
      >

        <div className="mx-auto max-w-6xl px-6 py-24">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              From repository to report.
            </h2>

            <p className="mt-4 text-slate-500">
              CodeRadar follows a simple analysis pipeline.
            </p>

          </div>


          <div className="mt-14 grid gap-8 md:grid-cols-4">

            <Step
              number="01"
              icon={Upload}
              title="Upload"
              text="Upload a repository archive to begin the analysis."
            />

            <Step
              number="02"
              icon={Search}
              title="Scan"
              text="The system discovers and processes the relevant project files."
            />

            <Step
              number="03"
              icon={BarChart3}
              title="Analyze"
              text="Metrics, technologies, architecture, risks and AI findings are generated."
            />

            <Step
              number="04"
              icon={FileDown}
              title="Report"
              text="Review the results and export the completed technical report."
            />

          </div>

        </div>

      </section>


      {/* ------------------------------------------------
          SIMPLE ABOUT SECTION
      ------------------------------------------------ */}

      <section
        id="about"
        className="mx-auto max-w-6xl px-6 py-24"
      >

        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Why it exists
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Large codebases become difficult to understand quickly.
            </h2>

          </div>

          <div className="space-y-5 text-sm leading-7 text-slate-500">

            <p>
              When joining an unfamiliar project, reviewing an old
              repository, or trying to understand what needs
              improvement, the first problem is usually not writing
              code.
            </p>

            <p>
              It is figuring out what is already there.
            </p>

            <p>
              CodeRadar was built to make that first stage easier by
              combining measurable repository information with
              AI-assisted technical interpretation.
            </p>

          </div>

        </div>

      </section>


      {/* ------------------------------------------------
          CTA
      ------------------------------------------------ */}

      <section
        id="analyze"
        className="border-t border-slate-200 bg-slate-950"
      >

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Code2 size={21} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See what's inside your codebase.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Upload a repository and let CodeRadar give you a clearer
            technical picture of the project.
          </p>

          <Link
            to="/overview"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Start an analysis
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>


      {/* ------------------------------------------------
          FOOTER
      ------------------------------------------------ */}

      <footer className="border-t border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-slate-300">

            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
              <Code2 size={12} />
            </div>

            CodeRadar

          </div>

          <span>
            Codebase analysis for developers.
          </span>

        </div>

      </footer>

    </main>
  );
}


/* ====================================================
   SMALL REUSABLE COMPONENTS
==================================================== */

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Code2;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


function Step({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: typeof Code2;
  title: string;
  text: string;
}) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs font-semibold text-indigo-600">
          {number}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600">
          <Icon size={16} />
        </div>

      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}