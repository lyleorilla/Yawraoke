import Groq from "groq-sdk";
import express from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express()
app.use(cors(), express.json())
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname)  // saves with .mp3 extension
    }
})

const upload = multer({ storage })  // ← use storage not dest

app.post("/api/transcribe", upload.single("audioFile"), async (req, res) => {
    const audioFile = req.file
    console.log(audioFile)

    const transcript = await groq.audio.transcriptions.create({
        file: fs.createReadStream(audioFile.path),
        model: "whisper-large-v3",
        response_format: "verbose_json",
        timestamp_granularities: ["word"],
    })
    fs.unlinkSync(audioFile.path)
    console.log(transcript)
    res.json({ segments: transcript.words })

})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

