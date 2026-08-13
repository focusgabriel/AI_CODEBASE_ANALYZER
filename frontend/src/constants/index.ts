import { BarChart3, FileText, LayoutDashboard, Lightbulb, Settings } from "lucide-react";

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
  { name: "Reports", icon: FileText, href:"#" },
  { name: "Analytics", icon: BarChart3, href:"#" },
  { name: "Insights", icon: Lightbulb, href:"#"  },
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
