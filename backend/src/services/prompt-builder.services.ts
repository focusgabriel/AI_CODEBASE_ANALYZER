export function buildPrompt(summary: {
  totalFiles: number;
  imports: number;
  exports: number;
  functions: number;
  classes: number;
  interfaces: number;
}) {
  return `
You are a Senior Software Architect.

Analyze the following repository statistics and produce a professional engineering report.

Repository Metrics

- Total Files: ${summary.totalFiles}
- Imports: ${summary.imports}
- Exports: ${summary.exports}
- Functions: ${summary.functions}
- Classes: ${summary.classes}
- Interfaces: ${summary.interfaces}

Generate a report with the following sections:

# Executive Summary

# Architecture Assessment

# Code Quality Observations

# Potential Risks

# Recommendations

Keep the report concise, professional, use basics words for clearer understanding of the report and in Markdown format.

after generating a report give a ratitng over 10 to the report. make the rating to be in bold text very clear to see. and also state below the rating if the project showcases a level of junior developer or intermediate junior developer, or mid-level developer.
`;
}