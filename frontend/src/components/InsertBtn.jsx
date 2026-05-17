import "./insertBtn.css";
// 1. Import the React wrapper component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 2. Import the specific audio file icon
import { faFileAudio } from '@fortawesome/free-regular-svg-icons';
import { useState } from "react";

const InsertBtn = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transcript, setTranscript] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            console.log(`File Capture, ${file.name}`)
        }
    }

    const handleTranscribe = async () => {
        if (!selectedFile) return alert("Please select an MP3 file first!");

        setLoading(true);

        // FormData is required to send raw files/binary data over HTTP
        const formData = new FormData();
        formData.append("audioFile", selectedFile); // "audioFile" must match req.file name in your backend multer settings

        try {
            console.log("Sending file to local AI server...");
            const response = await fetch("http://localhost:5000/api/transcribe", {
                method: "POST",
                body: formData, // Send the formData object directly (Do NOT wrap in JSON.stringify)
            });

            if (!response.ok) {
                throw new Error("Server responded with an error");
            }

            const data = await response.json();
            console.log(data)
            console.log("Received transcript segments:", data.segments);

            // Save the timestamped array into state to display it
            setTranscript(data.segments);

        } catch (error) {
            console.error("Failed to fetch transcription:", error);
            alert("Transcription failed. Is your backend server running on port 5000?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="upload-container">
                <label htmlFor="file-upload" className="file-upload">
                    <FontAwesomeIcon icon={faFileAudio} />
                    <span className="insert-text">insert mp3</span>
                </label>
                <input type="file" id="file-upload" accept=".mp3, audio/mpeg" onChange={handleFileChange} hidden />
            </div>
            <button
                onClick={handleTranscribe}
                className="transcribe-btn"
                disabled={loading}
            >
                {loading ? "AI is Transcribing..." : "Get Transcript"}
            </button>
        </>
    );
};

export default InsertBtn;