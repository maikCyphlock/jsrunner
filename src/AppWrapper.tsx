import { useState } from 'react'

import { CodeContext, CodeResultContext } from './context/CodeContext'

import App from './App'
function AppWrapper() {

    const [code, setCode] = useState("");
    const [result, setResult] = useState("");
    return (
        <>
            <CodeContext.Provider value={{ code, setCode }}>
                <CodeResultContext.Provider value={{ result, setResult }}>
                    <App />
                </CodeResultContext.Provider>
            </CodeContext.Provider>
        </>
    )
}

export default AppWrapper
