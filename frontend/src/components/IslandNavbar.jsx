import { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function IslandNavbar() {
    const [time, setTime] = useState(new Date())
    const navigate = useNavigate()
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const formattedTime = time.toLocaleTimeString()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    
    return (
        <header className={`w-full bg-white dark:bg-black border-b dark:border-[#1e1b2b] shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center font-bold text-white text-lg">
                    T
                </div>
                <span className={`text-xl font-bold text-gray-900 dark:text-white`}>Tropicode</span>
                </div>

                {/* Welcome + Time + Actions */}
                <div className="flex items-center space-x-6">
                <div className={`flex items-center space-x-2 text-sm text-gray-700 dark:text-white`}>
                    {/* <FaSun className="text-yellow-400" /> */}
                    <ThemeToggle />
                    <span>Welcome back</span>
                    <span className="text-gray-400">|</span>
                    <span className={`font-mono text-gray-800 dark:text-white`}>{formattedTime}</span>
                </div>

                {/* <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-xl text-sm hover:bg-teal-50 transition">
                    Profile
                </button> */}

                <button onClick={handleLogout} className={`cursor-pointer px-4 py-2 bg-teal-600 dark:bg-[#d3fc72] text-white dark:text-black rounded-xl text-sm hover:bg-teal-700 dark:hover:bg-[#d3fc7277] transition`}>
                    Sign Out
                </button>
                
                </div>
            </div>
        </header>
        
    )
}