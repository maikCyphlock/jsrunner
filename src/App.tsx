import { useContext, useRef, useState, useEffect } from 'react'
import Editor from './components/Editor'
import { CodeContext, CodeResultContext } from './context/CodeContext'
import Result from './components/Result'
import Split from 'react-split'
import { useWindowSize } from './hooks/useWindowSize'
function App() {
  const size = useWindowSize()
  const { result } = useContext(CodeResultContext)
  const render = useRef(null)
  const container = useRef(null)

  const [direction, setDirection] = useState(() => {
    const direction = window.localStorage.getItem('split-direction')
    if (direction) return direction
    return 'horizontal'
  })

  function changeDirection() {
    const newDirection = direction === 'horizontal' ? 'vertical' : 'horizontal'
    setDirection(newDirection)
    window.localStorage.setItem('split-direction', newDirection)
    setSizes([50, 50])
  }

  const [sizes, setSizes] = useState(() => {
    const sizes = window.localStorage.getItem('split-sizes')
    if (sizes) return JSON.parse(sizes)
    return [50, 50]
  })

  function handleDragEnd(e) {
    const [left, right] = e
    setSizes([left, right])
    window.localStorage.setItem('split-sizes', JSON.stringify([left, right]))
  }


  const onChange = async ({ code = '', language = 'javascript' }) => {
    const setCodeToURLresult = setCodeToURL(code)
    setLengthLimit(!setCodeToURLresult)

    const result = await getResult({ code, language })

    setResult(result)
  }
  return (
    <>

      <Split
        className={`flex ${direction} h-full overflow-hidden`}

        sizes={sizes}
        gutterSize={4}
        cursor="col-resize"
        onDragEnd={handleDragEnd}
      >
        <Editor />
        <Result results={result} />
      </Split>






    </>
  )
}

export default App
