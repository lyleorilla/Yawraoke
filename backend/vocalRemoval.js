import express from 'express'
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';

const app = express();

// 1. Tell Multer to save files in "uploads" using their real names
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// 2. Expose the output folder so you can access the split audio files via URL
app.use('/separated', express.static('separated'));

// 3. The API Route
app.post('/separate', upload.single('music'), (req, res) => {
    const fileName = req.file.originalname;                  // e.g., "song.mp3"
    const folderName = path.parse(fileName).name;             // e.g., "song"

    // The exact terminal command Node will run
    const command = `demucs --two-stems=vocals -o ./separated ./uploads/${fileName}`;

    console.log(`Processing ${fileName}... Please wait.`);

    exec(command, (error) => {
        if (error) {
            return res.status(500).json({ error: 'AI processing failed.' });
        }

        // Demucs saves the results inside: ./separated/htdemucs/[song_name]/
        res.json({
            vocalsUrl: `http://localhost:3000/separated/htdemucs/${folderName}/vocals.wav`,
            backgroundUrl: `http://localhost:3000/separated/htdemucs/${folderName}/accompaniment.wav`
        });
    });
});

app.post("/api/transcribe", upload.single("audioFile"), async (req, res) => {
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

app.listen(3000, () => console.log('Server live on http://localhost:3000'));