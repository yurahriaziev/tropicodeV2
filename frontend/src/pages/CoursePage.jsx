import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaClipboardList, FaCloudSun, FaCalculator, FaBlogger, FaLaptopCode, FaUtensils, FaMobileAlt, FaCubes, FaChess, FaCodeBranch, FaDatabase } from "react-icons/fa";
import { useEffect } from "react";

export default function CoursePage() {
    const { courseName } = useParams();

    // dummy data
    const courseData = {
        "programming": {
          title: "Python & JavaScript Programming",
          description:
            "Master two of the most popular programming languages used in web development, data science, and more.",
          skills: ["Loops", "Functions", "APIs", "Data Types"],
          projects: ["Quiz App", "To-do List", "Weather App", "Calculator"],
          languages: ["Python", "JavaScript"],
        },
        "reactjs-web-development": {
          title: "Web Development with Flask & ReactJS",
          description:
            "Learn to build dynamic websites using modern tools and frameworks.",
          skills: ["Flask", "React", "HTML", "CSS"],
          projects: ["Blog Website", "Portfolio", "Recipe App", "Task Tracker"],
          languages: ["Python", "JavaScript"],
        },
        "3d-printing-design": {
          title: "3D Printing & Modeling",
          description:
            "Turn digital models into real-world objects and explore the world of 3D design.",
          skills: ["3D Modeling", "Design Thinking", "CAD", "Slicing"],
          projects: ["Keychain", "Phone Stand", "Chess Piece", "Toy Car"],
          languages: ["TinkerCAD", "Fusion 360"],
        }
    }
      
    const course = courseData[courseName];

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // api call to get course details
    return (
        <>
            <Navbar />
            <section className="relative bg-gradient-to-br from-purple-600 to-green-500 py-15 text-white">
                <div className="container mx-auto px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">{course.description}</p>
                <a href="#signup" className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">Sign Up for Free Lesson</a>
                </div>
            </section>

            <section className="py-14 bg-white text-center">
                <h2 className="text-3xl font-bold mb-10 text-gray-800">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Skills You'll Learn</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                    {course.skills.map((skill, idx) => (
                        <div key={idx} className="bg-purple-100 text-purple-700 px-5 py-3 rounded-xl text-sm font-medium shadow-md flex items-center gap-2">
                        <FaCodeBranch className="text-purple-500" /> {skill}
                        </div>
                    ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Languages & Tools</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                    {course.languages.map((lang, idx) => (
                        <div key={idx} className="bg-green-100 text-green-700 px-5 py-3 rounded-xl text-sm font-medium shadow-md flex items-center gap-2">
                        <FaDatabase className="text-green-500" /> {lang}
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </section>

            <section className="py-12 bg-gray-50 text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Projects You'll Build</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {course.projects.map((project, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow text-gray-700 font-semibold flex items-center gap-3 justify-center">
                    {project.includes("Quiz") && <FaClipboardList className="text-purple-500" />} 
                    {project.includes("To-do") && <FaClipboardList className="text-purple-500" />} 
                    {project.includes("Weather") && <FaCloudSun className="text-purple-500" />} 
                    {project.includes("Calculator") && <FaCalculator className="text-purple-500" />} 
                    {project.includes("Blog") && <FaBlogger className="text-purple-500" />} 
                    {project.includes("Portfolio") && <FaLaptopCode className="text-purple-500" />} 
                    {project.includes("Recipe") && <FaUtensils className="text-purple-500" />} 
                    {project.includes("Task") && <FaClipboardList className="text-purple-500" />} 
                    {project.includes("Keychain") && <FaCubes className="text-purple-500" />} 
                    {project.includes("Phone") && <FaMobileAlt className="text-purple-500" />} 
                    {project.includes("Chess") && <FaChess className="text-purple-500" />} 
                    {project.includes("Toy") && <FaCubes className="text-purple-500" />} 
                    {project}
                    </div>
                ))}
                </div>
                <p className="mt-6 text-lg text-gray-600 italic">...and many more!</p>
            </section>

            <section id="signup" className="py-16 px-4 md:px-10 bg-purple-600 text-white">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 md:p-12 text-gray-800">
                <h2 className="text-3xl font-bold mb-4">Ready to Join {course.title}?</h2>
                <p className="text-gray-600 mb-6 text-lg">Fill out the form below and we'll contact you with next steps.</p>
                <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Parent Name" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    <input type="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Child Name" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    <input type="number" placeholder="Child Age" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition">
                    Submit
                    </button>
                </form>
                </div>
            </section>
            <Footer />
        </>
    )
} 