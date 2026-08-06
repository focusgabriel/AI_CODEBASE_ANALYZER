import { parse } from "@babel/parser";

export function parseSource(code: string, language:string) {
  
  if(language === "Typescript") {
    return parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"]
    })
  }

    return parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });
}