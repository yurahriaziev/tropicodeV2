import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)
    const [menuMounted, setMenuMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const handleNavigate = (path) => {
        const [route, hash] = path.split("#")

        navigate(route)

        closeMenu()

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

    const openMenu = () => {
        setMenuMounted(true)
        requestAnimationFrame(() => {
        setMenuOpen(true)
        })
    }

    const closeMenu = () => {
        setMenuOpen(false)

        setTimeout(() => {
        setMenuMounted(false)
        }, 250)
    }

    const toggleMenu = () => {
        if (!menuMounted) openMenu()
        else closeMenu()
    }

    const scrollToSection = (id) => {
        closeMenu()

        setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: "smooth" })
        }
        }, 200)
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

            {/* On mobile: hide text when scrolled; on desktop: always show */}
            <span
                className={`
                text-xl font-semibold transition-opacity duration-200
                ${scrolled ? "opacity-0 md:opacity-100" : "opacity-100"}
                `}
            >
                Tropicode
            </span>
            </div>

            {/* Desktop Menu – always visible on desktop, never affected by scrolled */}
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

            {/* Desktop Buttons – always visible on desktop */}
            <div className="hidden md:flex gap-4">
            <button
                onClick={() => handleNavigate("/login")}
                className="cursor-pointer px-4 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white transition-colors duration-300"
            >
                Log In
            </button>
            </div>

            {/* Hamburger – mobile only */}
            <button
            className="md:hidden w-10 h-10 flex items-center justify-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            >
            <span className="relative block w-6 h-6">
                {/* Top bar */}
                <span
                className={`
                    absolute left-0 right-0 h-0.5 bg-gray-800 rounded transition-all duration-300 transform
                    ${menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1"}
                `}
                />

                {/* Middle bar */}
                <span
                className={`
                    absolute left-0 right-0 h-0.5 bg-gray-800 rounded transition-all duration-300 transform
                    ${menuOpen ? "top-1/2 -translate-y-1/2 opacity-0" : "top-1/2 -translate-y-1/2"}
                `}
                />

                {/* Bottom bar */}
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
        {menuMounted && (
            <div
            className={`
                md:hidden bg-white px-6 py-4 shadow-inner flex flex-col gap-4 text-gray-700 text-sm
                ${menuOpen ? "menu-open" : "menu-close"}
                pointer-events-auto
            `}
            >
            <span
                onClick={() => handleNavigate("/home")}
                className="cursor-pointer hover:text-purple-600 active:text-purple-800 active:scale-[0.98] transition-all duration-150 touch-manipulation"
            >
                Home
            </span>

            <span
                onClick={() => handleNavigate("/home#courses")}
                className="cursor-pointer hover:text-purple-600 active:text-purple-800 active:scale-[0.98] transition-all duration-150 touch-manipulation"
            >
                Courses
            </span>

            <span
                onClick={() => handleNavigate("/home#contact")}
                className="cursor-pointer hover:text-purple-600 active:text-purple-800 active:scale-[0.98] transition-all duration-150 touch-manipulation"
            >
                Contact
            </span>

            <button
                onClick={() => handleNavigate("/login")}
                className="mt-2 px-4 py-2 border border-purple-600 text-purple-600 rounded 
                        hover:bg-purple-50 active:bg-purple-100 active:scale-[0.98]
                        transition-all duration-150 w-full text-left touch-manipulation"
            >
                Log In
            </button>
            </div>
        )}
        </nav>
    )
}
