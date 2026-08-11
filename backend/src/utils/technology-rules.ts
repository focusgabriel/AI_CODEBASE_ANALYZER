export const TECHNOLOGY_RULES = {
  // Frameworks
  express: {
    name: "Express",
    category: "frameworks",
  },

  react: {
    name: "React",
    category: "frameworks",
  },

  "react-dom": {
    name: "React DOM",
    category: "frameworks",
  },

  next: {
    name: "Next.js",
    category: "frameworks",
  },

  // Languages
  typescript: {
    name: "TypeScript",
    category: "languages",
  },

  // Runtime
  node: {
    name: "Node.js",
    category: "runtime",
  },

  // Libraries
  mongoose: {
    name: "Mongoose",
    category: "libraries",
  },

  zod: {
    name: "Zod",
    category: "libraries",
  },

  axios: {
    name: "Axios",
    category: "libraries",
  },

  dotenv: {
    name: "dotenv",
    category: "libraries",
  },

  // Databases
  mongodb: {
    name: "MongoDB",
    category: "databases",
  },

  // Build tools
  vite: {
    name: "Vite",
    category: "buildTools",
  },

  webpack: {
    name: "Webpack",
    category: "buildTools",
  },

  // Testing
  jest: {
    name: "Jest",
    category: "testing",
  },

  vitest: {
    name: "Vitest",
    category: "testing",
  },
} as const;