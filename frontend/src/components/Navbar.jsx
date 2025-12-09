import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const handleNavigate = (path) => {
        const [route, hash] = path.split("#")

        navigate(route)

        toggleMenu()

        if (!hash) return

        setTimeout(() => {
            const el = document.getElementById(hash)
            if (el) {
            el.scrollIntoView({ behavior: "smooth" })
            }
        }, 150)
    }

    useEffect(() => {
        const onScroll = () => {
        if (window.innerWidth < 768) {
            setScrolled(window.scrollY > 20)
        } else {
            setScrolled(false)
        }
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const toggleMenu = () => {
        if (!menuOpen) {
            setMenuOpen(true)
        } else {
            setMenuOpen(false)
        }
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div
                className={`
                max-w-7xl mx-auto px-6 flex items-center justify-between
                transition-all duration-300
                ${scrolled ? "py-2" : "py-4"}
                md:py-4
                `}
            >

                {/* Logo */}
                <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleNavigate("/home")}
                >
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                    T
                </div>

                <span
                    className={`
                    text-xl font-semibold transition-opacity duration-200
                    ${scrolled ? "opacity-0 md:opacity-100" : "opacity-100"}
                    `}
                >
                    Tropicode
                </span>
                </div>

                <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
                <li>
                    <span
                    onClick={() => handleNavigate("/home")}
                    className="cursor-pointer hover:text-purple-600"
                    >
                    Home
                    </span>
                </li>
                <li>
                    <span
                    onClick={() => handleNavigate("/home#courses")}
                    className="cursor-pointer hover:text-purple-600"
                    >
                    Courses
                    </span>
                </li>
                <li>
                    <span
                    onClick={() => handleNavigate("/home#contact")}
                    className="cursor-pointer hover:text-purple-600"
                    >
                    Contact
                    </span>
                </li>
                </ul>

                <div className="hidden md:flex gap-4">
                <button
                    onClick={() => handleNavigate("/login")}
                    className="cursor-pointer px-4 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white transition-colors duration-300"
                >
                    Log In
                </button>
                </div>

                <button
                className="md:hidden w-10 h-10 flex items-center justify-center"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                >
                <span className="relative block w-6 h-6">
                    <span
                    className={`
                        absolute left-0 right-0 h-0.5 bg-gray-800 rounded transition-all duration-300 transform
                        ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"}
                    `}
                    />

                    <span
                    className={`
                        absolute left-0 right-0 h-0.5 bg-gray-800 rounded transition-all duration-300 transform
                        ${menuOpen ? "top-1/2 -translate-y-1/2 opacity-0" : "top-1/2 -translate-y-1/2"}
                    `}
                    />

                    <span
                    className={`
                        absolute left-0 right-0 h-0.5 bg-gray-800 rounded transition-all duration-300 transform
                        ${menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1"}
                    `}
                    />
                </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative">
                <div
                    className={`
                        absolute left-0 right-0 top-full z-50
                        flex flex-col items-end text-right gap-4 px-6 py-6
                        bg-white shadow-md
                        transition-all duration-1000 ease-out

                        ${menuOpen ? "menu-open" : "menu-closed"}
                    `}
                >
                    <span
                        onClick={() => handleNavigate("/home#home")}
                        className="
                            text-gray-700 text-lg font-medium cursor-pointer
                            px-2 py-1 rounded select-none
                            active:bg-gray-200 active:text-gray-900
                            transition-colors duration-75
                            touch-manipulation
                        "
                    >
                        Home
                    </span>

                    <span
                        onClick={() => handleNavigate("/home#courses")}
                        className="
                            text-gray-700 text-lg font-medium cursor-pointer
                            px-2 py-1 rounded select-none
                            active:bg-gray-200 active:text-gray-900
                            transition-colors duration-75
                            touch-manipulation
                        "
                    >
                        Courses
                    </span>

                    <span
                        onClick={() => handleNavigate("/home#contact")}
                        className="
                            text-gray-700 text-lg font-medium cursor-pointer
                            px-2 py-1 rounded select-none
                            active:bg-gray-200 active:text-gray-900
                            transition-colors duration-75
                            touch-manipulation
                        "
                    >
                        Contact
                    </span>


                    <button
                        onTouchStart={(e) => {
                            e.currentTarget.classList.add("menu-tap-purple")
                            setTimeout(() => e.currentTarget.classList.remove("menu-tap-purple"), 150)
                        }}
                        onClick={() => handleNavigate("/login")}
                        className="
                            w-full
                            border border-purple-600 text-purple-600 
                            px-4 py-2 rounded
                            text-center
                        "
                    >
                        Log In
                    </button>
                </div>
            </div>


        </nav>
    )
}
