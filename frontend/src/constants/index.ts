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
  {name:"Overview", href:"#" },
  {name:"Reports", href:"#" },
  {name:"Analytics", href:"#" },
  {name:"Uploads", href:"#" },
];

export type Registration = {
  name: string,
  email: string,
  password: string,
  confirm_password:string
}

export const PUBLIC_ROUTES = [
  "/",
  "/register",
  // "/forgotPassword",
  // "/verify-email",
  // "/reset-password",
];