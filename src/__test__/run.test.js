import { describe, expect, it } from "vitest";
import { transformCode, run } from "../lib/code/run";
import { Colors } from "../lib/elementParser";
// Tests that the function returns a string
describe("transformCode fn", () => {
  it("test_returns_string", () => {
    const code = 'console.log("Hello, world!");';
    const result = transformCode(code);
    expect(typeof result).toBe("string");
  });

  // Tests that the function transforms the code correctly
  it("test_transforms_code_correctly", () => {
    const code = "const a = 1";
    const result = transformCode(code);
    expect(result).toContain("const a = 1;");
  });

  // Tests that the function replaces new lines with debug statements
  it("test_replaces_new_lines_with_debug_statements", () => {
    const code = "const a = 1;\n\nconst b = 2;";
    const result = transformCode(code);
    expect(result).toContain('debug(-1,"__newline__");');
  });

  // Tests that the function handles empty input
  it("test_handles_empty_input", () => {
    const code = "";
    const result = transformCode(code);
    expect(result).toBe("");
  });
  // Tests that the function handles input with no new lines
  it("test_handles_input_with_no_new_lines", () => {
    const code = "const a = 1; console.log(a);";
    const result = transformCode(code);

    expect(result).toBe("const a = 1;debug(1, a);");
  });

  // Tests that the function handles input with no semicolons
  it("test_handles_input_with_no_semicolons", () => {
    const code = "const a = 1\nconsole.log(a)";
    const result = transformCode(code);

    expect(result).toBe("const a = 1;\ndebug(2, a);");
  });
});

describe("run fn", () => {
  // Tests that an empty string returns an empty array
  it("test_empty_string", async () => {
    const result = await run("");
    expect(result).toEqual([]);
  });

  // Tests that a string containing a single line of code returns an array with one execution result
  it("test_single_line_of_code", async () => {
    const result = await run("const a = 1;debug(2, a);");

    expect(result).toEqual([
      {
        lineNumber: 2,
        element: { content: "1", color: Colors.NUMBER },
        type: "execution",
      },
    ]);
  });

  // Tests that a string containing a syntax error returns an array with one error result
  it("test_syntax_error", async () => {
    const result = await run("const a = 1;\nconst b = ;");

    expect(result).toEqual([
      {
        element: { content: "Unexpected token ';'", color: Colors.ERROR },
        type: "error",
      },
    ]);
  });
});
