import Navbar from "../components/layout/Navbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import Categories from "../components/Home/Categories";
import PopularMedicines from "../components/Home/PopularMedicines";
import Pharmacies from "../components/Home/Pharmacies";
import HowItWorks from "../components/Home/HowItWorks";
import CTA from "../components/Home/CTA";
import Footer from "../components/layout/Footer";

function Home() {
    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Categories />
                <PopularMedicines />
                <Pharmacies />
                <HowItWorks />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}

export default Home;