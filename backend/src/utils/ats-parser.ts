import parser, {
  type ParserPlugin,
} from "@babel/parser";

export function parseSource(
  content: string,
  extension: string,
) {
  const plugins = getParserPlugins(extension);

  return parser.parse(content, {
    sourceType: "unambiguous",
    plugins,
  });
}

function getParserPlugins(
  extension: string,
): ParserPlugin[] {
  switch (extension.toLowerCase()) {
    case ".js":
    case ".jsx":
      return ["jsx"];

    case ".ts":
      return ["typescript"];

    case ".tsx":
      return ["typescript", "jsx"];

    default:
      return [];
  }
}