import { useContext, useRef, useState, useEffect } from 'react'
import Editor from './components/Editor'
import { CodeContext, CodeResultContext } from './context/CodeContext'
import Result from './components/Result'

function App() {

  const { result } = useContext(CodeResultContext)
  const render = useRef(null)
  const container = useRef(null)

  return (
    <>

      <div className='flex overflow-auto max-h-screen'>
        <div className='basis-6/12'>
          <Editor />
        </div>

        <div className='bg-[#1b2b34] basis-6/12 w-full h-screen overflow-hidden '>
          <div className='bg-[#1b2b34] h-screen overflow-auto break-all text-[17px] font-bold'>
            <Result results={result} />

          </div>
        </div>
      </div>

    </>
  )
}

export default App
