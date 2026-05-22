import { faFileAudio } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import { AudioFileContext } from "./AudioContext.jsx"

import "../components/insertBtn.css"

const AudioUploader = () => {
    const { audioFile, setAudioFile } = useContext(AudioFileContext)

    const handleFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            setAudioFile(file)
        }
    }

    return (
        <>
            <div className="upload-container">
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