import { useState } from "react"
import { Link } from "react-router"
import "../assets/layout.css"

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="header-container">
                <nav className="navbar">
                    <Link to="/" className="logo">Yawraoke</Link>
                    <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                        ☰
                    </button>
                    {/* Overlay to close menu when clicking outside */}
                    <div className={`nav-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)}></div>

                    <div className={`nav-link ${isOpen ? "open" : ""}`}>
                        <Link className="nav-btn" to="/" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link className="nav-btn" to="/about" onClick={() => setIsOpen(false)}>About</Link>
                        <Link className="nav-btn" to="/how-it-works" onClick={() => setIsOpen(false)}>How it works</Link>
                        <Link className="nav-btn" to="/download" onClick={() => setIsOpen(false)}>Download</Link>
                        <Link className="nav-btn" to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                    </div>
                </nav>
            </div>
        </>
    )
}
export default Header