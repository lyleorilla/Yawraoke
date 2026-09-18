import "../assets/layout.css"
import Header from "../layouts/Header"
import Footer from "../layouts/Footer"

const NotFound = () => {
    return (
        <>
            <Header />
            <h1 className="notFound">404 NOT FOUND</h1>
            <Footer />
        </>
    )
}
export default NotFound