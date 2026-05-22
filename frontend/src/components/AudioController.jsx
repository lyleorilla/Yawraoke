import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"

const AudioController = () => {
    const vocalAudio = useSelector((state) => state.yawraoke.vocals)
    const backgroundAudio = useSelector((state) => state.yawraoke.instrumentals)
    const vocalRef = useRef(null)
    const instrumentalRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMute, setIsMute] = useState(false)

    useEffect(() => {
        const instrumentalEl = instrumentalRef.current
        if (!instrumentalEl) return

        let syncLoopId

        const updateLyricsSync = () => {
            const currentSec = instrumentalEl.currentTime
            const words = document.querySelectorAll(".word-box p")

            words.forEach(e => {
                const startTime = parseFloat(e.getAttribute("time-index"))
                const duration = parseFloat(e.getAttribute("time-animate"))
                if (currentSec >= startTime && currentSec < startTime + duration) {
                    e.style.backgroundPosition = "0% 0"
                } else if (currentSec >= startTime + duration) {
                    e.style.backgroundPosition = "0% 0"
                } else {
                    e.style.backgroundPosition = "100% 0"
                }
            })

            syncLoopId = requestAnimationFrame(updateLyricsSync)
        }

        const handlePlay = () => {
            syncLoopId = requestAnimationFrame(updateLyricsSync)
        }

        const handlePause = () => {
            cancelAnimationFrame(syncLoopId)
        }

        instrumentalEl.addEventListener("play", handlePlay)
        instrumentalEl.addEventListener("pause", handlePause)

        return () => {
            instrumentalEl.removeEventListener("play", handlePlay)
            instrumentalEl.removeEventListener("pause", handlePause)
            cancelAnimationFrame(syncLoopId)
        }
    }, [backgroundAudio])

    const handleSound = () => {
        if (isPlaying) {
            vocalRef.current.pause()
            instrumentalRef.current.pause()
            setIsPlaying(false)
            return
        }
        vocalRef.current.play()
        instrumentalRef.current.play()
        setIsPlaying(true)
    }

    const handleVocal = () => {
        if (isMute) {
            vocalRef.current.muted = false
            setIsMute(false)
            return
        }
        vocalRef.current.muted = true
        setIsMute(true)
    }

    return (
        <>
            <audio src={vocalAudio} ref={vocalRef} controls></audio>
            <audio src={backgroundAudio} ref={instrumentalRef} controls></audio>
            <button onClick={handleSound}>Play Both</button>
            <button onClick={handleVocal}>Mute Vocal</button>
        </>
    )
}

export default AudioController