import { useContext } from "react";
import { CodeResultContext } from "../context/CodeContext";
import Editor from "@monaco-editor/react";

function Result() {
  const { result: elements } = useContext(CodeResultContext);

  function handleEditorWillMount(monaco) {
    // here is the monaco instance
    import("./onedark.json")

      .then((data) => {
        monaco.editor.defineTheme("vs-dark", data);
      })
      .catch((e) => console.log(e));
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  console.log(elements);

  const LastLineNumber = elements ? elements.at(-1)?.lineNumber : 0;
  const AllResults = Array.from({ length: LastLineNumber }).fill("\n");
  elements &&
    elements.forEach((data) => {
      const { element, lineNumber } = data;
      const codeResult = element.content;

      DiffResult({ codeResult, lineNumber });
    });
  function DiffResult({ codeResult, lineNumber }) {
    AllResults.splice(lineNumber - 1, 1, codeResult + "\n");
  }

  return (
    <div className=" text-cyan-50 bg-[#1e1e1e]">
      <Editor
        theme="vs-dark"
        options={{
          domReadOnly: true,
          experimentalWhitespaceRendering: "svg",
          dragAndDrop: true,
          minimap: {
            enabled: false,
          },
          overviewRulerLanes: 0,
          scrollbar: {
            vertical: "hidden",
          },
          fontSize: 19,
          wordWrap: "on",
          readOnly: true,
          lineNumbers: "off",
          renderLineHighlight: "none",
          showUnused: false,
          suggest: {
            selectionMode: "never",
            previewMode: "prefix",
          },
        }}
        defaultLanguage="javascript"
        value={AllResults.join("")}
      ></Editor>
    </div>
  );
}

export default Result;
