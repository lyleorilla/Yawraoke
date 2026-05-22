import fs from 'fs';
import path from 'path';

const apiKey = process.env.DEEPGRAM_API_KEY;
if (!apiKey) {
    console.error("No DEEPGRAM_API_KEY found in environment!");
    process.exit(1);
}

const runTest = async (model) => {
    console.log(`\n--- Testing model: ${model} ---`);
    const buffer = fs.readFileSync('./separated/htdemucs/hit_me_baby_one_more_time_short/vocals.mp3');
    const response = await fetch(`https://api.deepgram.com/v1/listen?model=${model}&smart_format=true&words=true&language=en&utterances=true`, {
        method: "POST",
        headers: {
            "Authorization": `Token ${apiKey}`,
            "Content-Type": "audio/mpeg"
        },
        body: buffer
    });

    console.log("Status:", response.status, response.statusText);
    const data = await response.json();
    console.log("Keys in response:", Object.keys(data));
    if (data.err_code) {
        console.error("Error from Deepgram:", data);
        return;
    }
    console.log("metadata:", data.metadata);
    if (data.results && data.results.channels && data.results.channels[0]) {
        const channel = data.results.channels[0];
        console.log("alternatives count:", channel.alternatives.length);
        const alt = channel.alternatives[0];
        console.log("transcript excerpt:", alt.transcript ? alt.transcript.slice(0, 100) : "no transcript");
        console.log("words array length:", alt.words ? alt.words.length : "undefined");
        if (alt.words && alt.words.length > 0) {
            console.log("First word:", alt.words[0]);
        }
    } else {
        console.log("No results or channels found. Response data:", JSON.stringify(data, null, 2));
    }
};

const main = async () => {
    try {
        await runTest("whisper-large");
        await runTest("nova-3");
        await runTest("nova-2");
    } catch (err) {
        console.error("Execution error:", err);
    }
};

main();
