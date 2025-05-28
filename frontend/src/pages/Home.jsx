import CallToAction from "../components/CallToAction";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SkillSection from "../components/SkillSection";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <SkillSection />
            <CallToAction />
            <ContactSection />
            <Footer />
        </>
    )
}