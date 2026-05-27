import { faFileAudio } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import { AudioFileContext } from "./AudioContext.jsx"
import { useSelector } from "react-redux"
import "./audioController.css"

const AudioUploader = () => {
    const { musicName, songIndex, totalPlaylist } = useSelector((state) => state.yawraoke)
    const { audioFile, setAudioFile } = useContext(AudioFileContext)

    const handleFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            setAudioFile(file)
        }
    }

    return (
        <>
            <div className="audio-uploader">
                <label htmlFor="file-upload" className="file-upload">
                    <FontAwesomeIcon icon={faFileAudio} />
                    <span className="insert-text">insert mp3</span>
                </label>
                <input type="file" id="file-upload" accept=".mp3, audio/mpeg" onChange={handleFileChange} hidden />
            </div>
        </>
    )
}
export default AudioUploader