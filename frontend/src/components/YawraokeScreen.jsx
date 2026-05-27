import { useSelector } from "react-redux"
import "./yawraokeScreen.css"
import { useEffect } from "react"

const YawraokeScreen = () => {
    const { paragraphs, songIndex, musicName } = useSelector((state) => state.yawraoke)
    useEffect(() => {
        let animationId;

        const clearPrev = () => {
            const container = document.querySelector(".container");
            const activeWord = container?.querySelector(".word-box p.active");

            if (activeWord && container.getBoundingClientRect().bottom < activeWord.getBoundingClientRect().bottom) {
                let prevSibling = activeWord.parentElement.previousElementSibling; // .word-box's prev sibling
                while (prevSibling) {
                    prevSibling.classList.add("hidden");
                    prevSibling = prevSibling.previousElementSibling;
                }
            }

            animationId = requestAnimationFrame(clearPrev);
        };

        animationId = requestAnimationFrame(clearPrev);

        return () => cancelAnimationFrame(animationId); // cleanup on songIndex change
    }, [songIndex]);

    return (
        <>
            <div className="title-container">
                {musicName[songIndex]}
            </div>
            <div className="container" key={songIndex}>
                {paragraphs[songIndex]?.map((paragraph, index) => (
                    <div className="word-box" key={`${songIndex}-${index}`} word-index={index}>
                        <p time-index={(paragraph.start).toFixed(2)} time-animate={(paragraph.duration * 1.3).toFixed(2)} style={{ transition: `background-position ${paragraph.duration}s linear` }}>{paragraph.word}</p>
                    </div>
                ))}
            </div>
        </>
    )
}
export default YawraokeScreen