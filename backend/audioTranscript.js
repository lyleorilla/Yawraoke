import { getParagraph } from "./utils/formatWord.js"
import express from "express"
import cors from "cors"
import multer from "multer"
import { exec } from "child_process"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()
// const upload = multer({ storage: multer.memoryStorage() })  // ← use ram buffer not disk
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, file.originalname)
});
const memUpload = multer({ storage: multer.memoryStorage() });
const diskUpload = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
console.log(import.meta.url)

app.use(cors(), express.json())
app.use('/separated', express.static(path.join(__dirname, 'separated')));


app.post("/api/transcribe", memUpload.single("audioFile"), async (req, res) => {
    const buffer = req.file.buffer
    const mimeType = req.file.mimetype
    const response = await fetch("https://api.deepgram.com/v1/listen?model=whisper-large&smart_format=true&words=true&language=en&utterances=true", {
        method: "POST",
        headers: {
            "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
            "Content-Type": mimeType
        },
        body: buffer
    })
    const data = await response.json()
    const words = data.results.channels[0].alternatives[0].words

    res.json({
        segments: words,
    })

})

app.post('/api/separate', diskUpload.single("audioFile"), async (req, res) => {
    const fileName = req.file.originalname;
    const folderName = path.parse(fileName).name;

    // ✅ Sanitize: replace spaces, remove special/unicode chars
    const safeFolderName = folderName
        .replace(/\s+/g, '_')           // spaces → underscores
        .replace(/[^a-zA-Z0-9_\-]/g, ''); // remove anything not alphanumeric, _ or -

    const ext = path.extname(fileName);
    const safeFileName = safeFolderName + '.mp3';

    const oldPath = `./uploads/${fileName}`;
    const newPath = `./uploads/${safeFileName}`;

    fs.renameSync(oldPath, newPath);

    // ✅ Wrap path in quotes to handle any remaining special chars
    const command = `python3 -m demucs --two-stems=vocals --mp3 -o ./separated "./uploads/${safeFileName}"`;

    console.log(`Processing ${safeFileName}... Please wait.`);


    exec(command, async (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'AI processing failed.' });
        }

        // ✅ safeFolderName here, not safeFileName
        const buffer = fs.readFileSync(`./separated/htdemucs/${safeFolderName}/vocals.mp3`);
        const mimeType = "audio/mpeg";

        const response = await fetch("https://api.deepgram.com/v1/listen?model=whisper-large&smart_format=true&words=true&language=en&utterances=true&punctuate=true&numerals=true&paragraphs=true&", {
            method: "POST",
            headers: {
                "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": "audio/mpeg"
            },
            body: buffer
        });

        const data = await response.json();
        const words = data.results.channels[0].alternatives[0].words;
        const paragraphs = getParagraph(data.results.utterances)
        console.log("Paragraphs: ", words)

        res.json({
            data: data,
            segments: words,
            paragraphs: paragraphs,
            vocalsUrl: `http://localhost:5000/separated/htdemucs/${safeFolderName}/vocals.mp3`,
            backgroundUrl: `http://localhost:5000/separated/htdemucs/${safeFolderName}/no_vocals.mp3`,
            musicName: safeFolderName.replace(".mp3", "")

        });
    });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))

