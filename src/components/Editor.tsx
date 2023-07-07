import { useRef, useContext, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { CodeContext, CodeResultContext } from '../context/CodeContext';
import { useWindowSize } from '../hooks/useWindowSize'
import { useDebouncedFunction } from '../hooks/useDebouce';
import { run, transformCode, transformCodeAsync } from '../lib/code/run';

function EDITOR() {
    const { code, setCode } = useContext(CodeContext);
    const { setResult } = useContext(CodeResultContext)
    const monacoRef = useRef(null);
    const { debounce } = useDebouncedFunction(1000);

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

    function handleEditorDidMount(editor, monaco) {
        // here is another way to get monaco instance
        // you can also store it in `useRef` for further usage
        monacoRef.current = monaco;
    }
    async function RunCode(e) {
        setResult("")
        try {
            const tranformed = transformCode(e)
            console.log(tranformed)

            const element = await run(tranformed)

            setResult(element);

        } catch (e) {
            console.log(e)
            setResult([{ element: { content: e.message }, type: "error" }])
        }
        setCode(e)
    }
    const debouncedRunner = useDebouncedFunction(RunCode, 500);
    function handler(e) {
        debouncedRunner(e)
    }
    return (
        <div>
            <Editor

                defaultLanguage="typescript"
                theme='vs-dark'
                options={
                    {
                        dragAndDrop: true,
                        minimap: {
                            enabled: false
                        },
                        overviewRulerLanes: 0,
                        scrollbar: {
                            vertical: 'hidden'
                        }, fontSize: 19,
                        wordWrap: 'on',

                    }
                }
                onChange={handler}
                defaultValue={code}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
            />
        </div>
    );
}

export default EDITOR;
