import { useContext, useState } from "react"
import { AudioFileContext } from "./AudioContext"
import { useDispatch, useSelector } from "react-redux"
import { audioSeparator } from "../features/audioSeparator/yawSlice"

const AudioFiltering = () => {
    const { audioFile } = useContext(AudioFileContext)
    const dispatch = useDispatch()
    const loading = useSelector((state) => state.yawraoke.loading)

    const runSeperate = async () => {
        const formData = new FormData()
        formData.append("audioFile", audioFile)
        dispatch(audioSeparator(formData))
    }

    return (
        <button
            onClick={runSeperate}
            className="transcribe-btn"
            disabled={loading}
        >
            {loading ? "AI is Separating Music..." : "Separate Music"}
        </button>
    )
}

export default AudioFiltering