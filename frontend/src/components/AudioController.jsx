import { useSelector, useDispatch } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faPause, faMicrophoneSlash, faMicrophone, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { prevSong, nextSong } from "../features/audioSeparator/yawSlice"


const AudioController = () => {
    const dispatch = useDispatch()
    const { vocals, instrumentals, songIndex } = useSelector((state) => state.yawraoke)
    const vocalRef = useRef(null)
    const instrumentalRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMute, setIsMute] = useState(false)

    const handleVocal = () => {
        if (isMute) {
            vocalRef.current.muted = false
            setIsMute(false)
            return
        }
        vocalRef.current.muted = true
        setIsMute(true)
    }

    const handleEnd = () => {
        if (vocalRef.current) vocalRef.current.currentTime = 0
        if (instrumentalRef.current) instrumentalRef.current.currentTime = 0
        dispatch(nextSong())

    }

    const handlePrevSong = () => {
        dispatch(prevSong())
        setIsPlaying(true)
    }

    const handleNextSong = () => {
        dispatch(nextSong())
        setIsPlaying(true)
    }

    useEffect(() => {
        if (songIndex === null) return

        if (isPlaying) {
            const playVocal = vocalRef.current?.play()
            const playInstrumental = instrumentalRef.current?.play()

            if (playVocal) {
                playVocal.catch((err) => console.log("Playback error for vocal:", err))
            }
            if (playInstrumental) {
                playInstrumental.catch((err) => console.log("Playback error for instrumental:", err))
            }
        } else {
            vocalRef.current?.pause()
            instrumentalRef.current?.pause()
        }
    }, [songIndex, isPlaying])

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
                const wordBox = e.parentElement

                if (currentSec === 0 && wordBox) {
                    wordBox.classList.remove("hidden")
                }

                if (currentSec >= startTime && currentSec < startTime + duration) {
                    e.style.backgroundPosition = "0% 0"
                    e.classList.add("active")
                    if (wordBox) wordBox.classList.remove("hidden")
                } else if (currentSec >= startTime + duration) {
                    e.style.backgroundPosition = "0% 0"
                    e.classList.remove("active")
                } else {
                    e.style.backgroundPosition = "100% 0"
                    e.classList.remove("active")
                    if (wordBox) wordBox.classList.remove("hidden")
                }
            })

            syncLoopId = requestAnimationFrame(updateLyricsSync)
        }

        const handlePlay = () => {
            cancelAnimationFrame(syncLoopId)
            syncLoopId = requestAnimationFrame(updateLyricsSync)
        }

        const handlePause = () => {
            cancelAnimationFrame(syncLoopId)
        }

        instrumentalEl.addEventListener("play", handlePlay)
        instrumentalEl.addEventListener("pause", handlePause)

        // If the audio is already playing when this effect runs/re-runs, start the sync loop immediately
        if (!instrumentalEl.paused) {
            handlePlay()
        }

        return () => {
            instrumentalEl.removeEventListener("play", handlePlay)
            instrumentalEl.removeEventListener("pause", handlePause)
            cancelAnimationFrame(syncLoopId)
        }
    }, [songIndex])

    const handleSound = () => {
        if (songIndex === null) return
        setIsPlaying(!isPlaying)
    }




    return (
        <>
            <audio src={vocals[songIndex]} ref={vocalRef} onEnded={handleEnd} ></audio>
            <audio src={instrumentals[songIndex]} ref={instrumentalRef} onEnded={handleEnd} ></audio>
            <button className="btn-designed" onClick={handleSound} disabled={songIndex === null ? true : false}>{isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
            <button className="btn-designed" onClick={handleVocal} disabled={songIndex === null ? true : false}>{isMute ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}</button>
            <button className="btn-designed" onClick={handlePrevSong} disabled={songIndex === null ? true : false}>{<FontAwesomeIcon icon={faAngleLeft} disabled={songIndex === null ? true : false} />}</button>
            <button className="btn-designed" onClick={handleNextSong} disabled={songIndex === null ? true : false}>{<FontAwesomeIcon icon={faAngleRight} disabled={songIndex === null ? true : false} />}</button>

        </>
    )
}

export default AudioController