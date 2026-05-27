import { useContext, useState } from "react"
import { AudioFileContext } from "./AudioContext"
import { useDispatch, useSelector } from "react-redux"
import { audioSeparator, setName } from "../features/audioSeparator/yawSlice"
import "./audioController.css"

const AudioFiltering = () => {
    const { audioFile } = useContext(AudioFileContext)
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.yawraoke)

    const runSeperate = async () => {
        const formData = new FormData()
        formData.append("audioFile", audioFile)
        dispatch(audioSeparator(formData))
        dispatch(setName(audioFile.name.replace(".mp3", "")))
    }

    return (
        <button

            onClick={runSeperate}
            className="btn-designed"
            disabled={loading}
        >
            {loading ? "AI is Separating Music..." : "Separate Music"}
        </button>
    )
}

export default AudioFiltering