import { useState, createContext } from "react"

export const AudioFileContext = createContext()

export const AudioProvider = ({ children }) => {
    const [audioFile, setAudioFile] = useState(null)

    return (
        <AudioFileContext.Provider value={{ audioFile, setAudioFile }}>
            {children}
        </AudioFileContext.Provider>
    )
}
