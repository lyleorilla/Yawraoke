export const getParagraph = (data) => {
    const paragraphs = []
    data.forEach(utterance => {
        const wordArray = utterance.transcript.split(' ').map((word, index) => {
            const start = utterance.words[index].start
            const end = utterance.words[index].end
            const duration = end - start
            return { "word": word, "start": start, "end": end, "duration": duration }
        })
        paragraphs.push(...wordArray)
    })
    console.log("paragraphs", paragraphs)
    return paragraphs
}