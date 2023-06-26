import { useContext } from "react";
import { CodeResultContext } from "../context/CodeContext";

function Result() {
    const { result: elements } = useContext(CodeResultContext)


    function render(element) {
        return element.map((result, key) => {
            return (

                result.type === 'error' ? <pre>{result.element.content.message ?? result.element.content}</pre> : <pre key={key}
                    style={{
                        color: result.element?.color ?? result.color,
                        top: `${result.element?.lineNumber ?? result.lineNumber === 1 ? 0 : 26 * (result.lineNumber - 1)}px`
                    }}
                    data-line={result.element?.lineNumber ?? result.lineNumber}
                    className="flex gap-3  h-[26px] absolute">

                    {
                        <span>
                            ({result.element?.lineNumber ?? result.lineNumber})
                        </span>
                    }
                    {

                        Array.isArray(result.element?.content ?? false) ? render(result.element.content) : (
                            result.element?.content ?? result?.content
                        )
                    }
                </pre>
            )
        })
    }


    return (
        <div className="view-lines relative px-2 min-h-full text-cyan-50">
            {
                elements && render(elements)
            }
        </div >
    );
}

export default Result