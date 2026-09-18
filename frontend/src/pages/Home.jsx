import Header from "../layouts/Header"
import Footer from "../layouts/Footer"
import "../assets/page.css"
const Home = () => {
    return (
        <>
            <Header />
            <section className="karaoke-container">
                <main className="lyric-stage">
                    karaoke telepormeter 70%
                </main>
                <aside className="controller-panel">
                    controler panel

                </aside>

            </section>

            <Footer />
        </>
    )
}
export default Home