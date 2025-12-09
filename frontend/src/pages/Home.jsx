import { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SkillSection from "../components/SkillSection";
import InfScrollHome from "../components/InfScrollHome";

export default function Home() {
    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('http://127.0.0.1:8000/')
                
                const data = await response.json()
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    return (
        <>
            <Navbar />
            <Hero />
            <InfScrollHome items={["Python", "JavaScript", "ReactJS", "Flask", "Pygame", "Tinkercad", "3D Modeling", "Game Design", "Web Apps","2D Games"]} />
            <SkillSection id="courses" />
            <CallToAction />
            <ContactSection is="contact" />
            <Footer />
        </>
    )
}