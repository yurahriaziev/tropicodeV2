import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaClipboardList, FaCloudSun, FaCalculator, FaBlogger, FaLaptopCode, FaUtensils, FaMobileAlt, FaCubes, FaChess, FaCodeBranch, FaDatabase } from "react-icons/fa";
import { useEffect, useState } from "react";
import { API_URL, GAMEDEV, MODELING, PROGRAMMING, UNITYDEV, WEBDEV } from "../config";

export default function CoursePage() {
    const { courseName } = useParams();
    const [values, setValues] = useState({
            first: "",
            last: "",
            email: "",
            childAge: ""
        })
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // dummy data
    const courseData = {
        "programming": {
            title: "Python & JavaScript Programming",
            description:
                "Master two of the most popular programming languages used in web development, data science, and more.",
            skills: ["Loops", "Functions", "APIs", "Data Types"],
            projects: ["Quiz App", "To-do List", "Weather App", "Calculator"],
            languages: ["Python", "JavaScript"],
            source: PROGRAMMING
        },
        "reactjs-web-development": {
            title: "Web Development with Flask & ReactJS",
            description:
                "Learn to build dynamic websites using modern tools and frameworks.",
            skills: ["Flask", "React", "HTML", "CSS"],
            projects: ["Blog Website", "Portfolio", "Recipe App", "Task Tracker"],
            languages: ["Python", "JavaScript"],
            source: WEBDEV
        },
        "3d-printing-design": {
            title: "3D Printing & Modeling",
            description:
                "Turn digital models into real-world objects and explore the world of 3D design.",
            skills: ["3D Modeling", "Design Thinking", "CAD", "Slicing"],
            projects: ["Keychain", "Phone Stand", "Chess Piece", "Toy Car"],
            languages: ["TinkerCAD", "Fusion 360"],
            source: MODELING
        },
        "pygame-game-development": {
            title: "Game Development with Python & Pygame",
            description:
            "Go from zero to advanced by building your own 2D games using Python and Pygame.",
            skills: [
            "Game Loops",
            "Sprite Animation",
            "Collision Detection",
            "Input Handling",
            "Level Design",
            "Sound & Effects",
            ],
            projects: [
            "Pong Clone",
            "Space Shooter",
            "Platformer",
            "Top-Down Adventure Game",
            ],
            languages: ["Python", "Pygame"],
            source: GAMEDEV
        },
        "unity-game-development": {
            title: "Game Development with Unity",
            description:
                "Design and build immersive 2D and 3D games using Unity and C#, from core mechanics to polished gameplay.",
            skills: [
                "Game Objects & Components",
                "C# Scripting",
                "Physics & Collisions",
                "UI Systems",
                "Level Design",
            ],
            projects: [
                "2D Platformer",
                "3D Obstacle Course",
                "Endless Runner",
                "Mini RPG Game",
            ],
            languages: ["C#", "Unity"],
            source: UNITYDEV
        }
    }
      
    const course = courseData[courseName];

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const validate = () => {
        const newErrors = {}

        if (!values.first.trim()) {
            newErrors.first = "Parent first name field is required."
        }

        if (!values.last.trim()) {
            newErrors.last = "Parent last name field is required."
        }

        if (!values.email.trim()) {
            newErrors.email = "Email field is required."
        }

        if (!values.childAge) {
            newErrors.childAge = "Child age is required."
        } else {
            const ageNum = Number(values.childAge)
            if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
            newErrors.childAge = "Child age must be between 1 and 18."
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setSubmitted(true)

        if (!validate()) return
        
        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    first: values.first,
                    last: values.last,
                    email: values.email,
                    child_age: values.childAge,
                    source: course.source
                })
            })

            if (!response.ok) {
                setError('Error submitting contact information. Please try again')
                return
            }

            setSuccess(true)
            setValues({
                first: "",
                last: "",
                email: "",
                childAge: ""
            })
        } catch (error) {
            setError('Server error. Try again later')
            console.log(error) // LOG
        }
    }

    return (
        <>
            <Navbar />

            <section className="relative bg-gradient-to-br from-purple-600 to-green-500 py-15 text-white">
            <div className="container mx-auto px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {course.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
                {course.description}
                </p>
                <a
                href="#signup"
                className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
                >
                Sign Up for Free Lesson
                </a>
            </div>
            </section>

            <section className="py-14 bg-white text-center">
            <h2 className="text-3xl font-bold mb-10 text-gray-800">
                What You'll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Skills You'll Learn
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {course.skills.map((skill, idx) => (
                    <div
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-5 py-3 rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                    >
                        <FaCodeBranch className="text-purple-500" /> {skill}
                    </div>
                    ))}
                </div>
                </div>

                <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Languages & Tools
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {course.languages.map((lang, idx) => (
                    <div
                        key={idx}
                        className="bg-green-100 text-green-700 px-5 py-3 rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                    >
                        <FaDatabase className="text-green-500" /> {lang}
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </section>

            <section className="py-12 bg-gray-50 text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Projects You'll Build
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {course.projects.map((project, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-lg shadow text-gray-700 font-semibold flex items-center gap-3 justify-center"
                >
                    {project}
                </div>
                ))}
            </div>
            <p className="mt-6 text-lg text-gray-600 italic">
                ...and many more!
            </p>
            </section>

            <section
            id="signup"
            className="py-16 px-4 md:px-10 bg-purple-600 text-white"
            >
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 md:p-12 text-gray-800">
                <h2 className="text-3xl font-bold mb-4">
                Ready to Join {course.title}?
                </h2>

                {/* SUCCESS MESSAGE */}
                {success && (
                <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Thank you for signing up!
                    </h3>
                    <p className="text-gray-600 text-lg">
                    We’ve received your interest in{" "}
                    <span className="font-semibold">{course.title}</span>.
                    <br />
                    We’ll be reaching out shortly with next steps.
                    </p>
                </div>
                )}

                {/* FORM (hidden after success) */}
                {!success && (
                <>
                    <p className="text-gray-600 mb-6 text-lg">
                        Fill out the form below and we'll contact you with next steps.
                    </p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    placeholder="Parent First Name"
                                    value={values.first}
                                    onChange={(e) => {
                                    setValues((v) => ({ ...v, first: e.target.value }))
                                    setErrors((err) => ({ ...err, first: undefined }))
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {submitted && errors.first && (
                                    <p className="text-red-500 text-xs pl-1">{errors.first}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    placeholder="Parent Last Name"
                                    value={values.last}
                                    onChange={(e) => {
                                    setValues((v) => ({ ...v, last: e.target.value }))
                                    setErrors((err) => ({ ...err, last: undefined }))
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {submitted && errors.last && (
                                    <p className="text-red-500 text-xs pl-1">{errors.last}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={(e) => {
                                    setValues((v) => ({ ...v, email: e.target.value }))
                                    setErrors((err) => ({ ...err, email: undefined }))
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {submitted && errors.email && (
                                    <p className="text-red-500 text-xs pl-1">{errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <input
                                    type="number"
                                    placeholder="Child Age"
                                    value={values.childAge}
                                    onChange={(e) => {
                                    setValues((v) => ({ ...v, childAge: e.target.value }))
                                    setErrors((err) => ({ ...err, childAge: undefined }))
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {submitted && errors.childAge && (
                                    <p className="text-red-500 text-xs pl-1">{errors.childAge}</p>
                                )}
                            </div>
                        </div>

                        <button
                        type="submit"
                        className="cursor-pointer w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition"
                        >
                        Submit
                        </button>
                    </form>
                </>
                )}
            </div>
            </section>

            <Footer />
        </>
    )
} 