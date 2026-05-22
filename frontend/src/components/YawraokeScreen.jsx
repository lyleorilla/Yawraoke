import { useSelector } from "react-redux"
import "./yawraokeScreen.css"

const YawraokeScreen = () => {
    const { paragraphs } = useSelector((state) => state.yawraoke)
    return (
        <>
            <div className="container">
                {paragraphs.map((paragraph, index) => (
                    <div className="word-box" key={index} word-index={index}>
                        <p time-index={(paragraph.start - 0.1).toFixed(2)} time-animate={paragraph.duration.toFixed(2)} style={{ transition: `background-position ${Math.max(0.10, (paragraph.end - paragraph.start) * 0.6).toFixed(2)}s linear` }}>{paragraph.word}</p>
                    </div>
                ))}
            </div>
        </>
    )
}
export default YawraokeScreen