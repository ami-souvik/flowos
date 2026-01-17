import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Container({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main id="root" className="relative z-10">
            <Navbar />
            {children}
            <Footer />
        </main>
    )
}