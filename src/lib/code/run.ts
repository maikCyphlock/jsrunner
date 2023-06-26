import { registerPlugins, transform } from "@babel/standalone";
import logPlugin from "../babel/log-babel";
import strayExpression from "../babel/stray-expression";
import { Colors, stringify, type ColoredElement } from "../elementParser";

const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor;

interface unparsedResult {
  lineNumber?: number;
  content: ColoredElement;
}
interface Result {
  lineNumber?: number;
  element: ColoredElement;
  type: "execution" | "error";
}
registerPlugins({
  "stray-expression-babel": strayExpression,
  "log-transform": logPlugin,
});

export function transformCode(code: string): string {
  // const RegexToDetectNewLines = /\\n/g;
  // const RenderWhitespaces = ' debug(-1,"__newline__");';
  const result = transform(code, {
    filename: "index.ts",
    presets: ["typescript"],
    parserOpts: {
      allowAwaitOutsideFunction: true,
    },
    sourceMaps: true,
    retainLines: true,
    compact: true,
    plugins: ["log-transform", "stray-expression-babel"],
  })

  console.log(result)

  return result.code
  // .replaceAll(RegexToDetectNewLines, RenderWhitespaces)
}

export async function run(string: string): Promise<Result[] | Error> {
  if (string == "") return [];
  try {
    let unparsedResults: unparsedResult[] = [];

    const asyncFunction = AsyncFunction("debug", string);

    await asyncFunction((lineNumber: number, content?: any) => {
      unparsedResults = [...unparsedResults, { lineNumber, content }];
    });

    if (unparsedResults.length === 0) return [];

    const promises = unparsedResults.map(async result => {
      const stringifiedContent = await stringify(result.content);
      if (!stringifiedContent) throw new Error('Unable to stringify content');
      return { lineNumber: result.lineNumber, element: stringifiedContent, type: 'execution' };
    });
    let parsedResults = await Promise.all(promises);
    let results = Promise.race(promises).then(result => console.log(result))


    return parsedResults;
  } catch (e: unknown) {

    return [{ element: { content: e.message, color: Colors.ERROR }, type: "error" }];
  }
}
