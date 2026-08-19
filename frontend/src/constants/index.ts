import { BarChart3, BookCheck, FileText, LayoutDashboard, Lightbulb, Settings } from "lucide-react";

export const process = [
  {title:"Upload ZIP"},
  {title:"AI Analyzes"},
  {title:"Get Report"},
  {title:"Share"},
]

export const footerLinks = [
  {name:"Privacy", href:"#"},
  {name:"Terms", href:"#"},
  {name:"Github", href:"#"},
  {name:"Twitter", href:"#"},
]

export const navItems = [
  { name: "Overview", icon: LayoutDashboard, href:"/overview"},
  { name: "Reports", icon: FileText, href:"/reports" },
  { name: "Analytics", icon: BarChart3, href:"/analyses" },
  { name: "Metrics", icon: BookCheck, href:"/metrics"  },
  { name: "Settings", icon: Settings , href:"#" },
];


export type Registration = {
  name: string,
  email: string,
  password: string,
  confirm_password:string
}

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  // "/forgotPassword",
  // "/verify-email",
  // "/reset-password",
];