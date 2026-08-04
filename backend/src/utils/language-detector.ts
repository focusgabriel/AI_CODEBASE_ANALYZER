const languageMap: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",

  ".py": "Python",
  ".go": "Go",
  ".java": "Java",
  ".cs": "C#",
  ".cpp": "C++",
  ".c": "C",
  ".php": "PHP",
  ".rb": "Ruby",
  ".rs": "Rust",
  ".swift": "Swift",
  ".kt": "Kotlin",

  ".html": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",

  ".json": "JSON",
  ".xml": "XML",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".toml": "TOML",

  ".sql": "SQL",
  ".md": "Markdown",

  Dockerfile: "Docker",
  ".gitignore": "Git Ignore",
  ".env": "Environment",
  LICENSE: "License",
  Makefile: "Make",
};

export function detectLanguage(extension: string): string {
  return languageMap[extension.toLowerCase()] ?? "UNKNOWN";
}
