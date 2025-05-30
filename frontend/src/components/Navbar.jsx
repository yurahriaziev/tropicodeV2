import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path)
    }

    return (
        <nav className="flex justify-between items-center px-8 py-4 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                    T
                </div>
                <span className="text-xl font-semibold">Tropicode</span>
            </div>

            <ul className="flex gap-6 text-sm font-medium text-gray-700">
                <li><a onClick={() => handleNavigate('/home')} className="cursor-pointer hover:text-purple-600">Home</a></li>
                <li><a onClick={() => handleNavigate('/home#courses')} href="#courses" className="cursor-pointer hover:text-purple-600">Courses</a></li>
                <li><a href="#about" className="cursor-pointer hover:text-purple-600">About</a></li>
                <li><a href="#contact" className="cursor-pointer hover:text-purple-600">Contact</a></li>
            </ul>

            <div className="flex gap-4">
                <button onClick={() => handleNavigate('/login')} className="px-4 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">Log In</button>
                {/* <button className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">Sign Up</button> */}
            </div>
        </nav>
    )
}