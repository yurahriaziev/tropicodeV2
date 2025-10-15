import { useState } from "react";
import { FaUserGraduate, FaUserFriends } from "react-icons/fa";
import Error from "./Error";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom"


export default function LoginCard() {
    const [accountType, setAccountType] = useState("student")
    const isStudent = accountType === "student"
    const [error, setError] = useState('')
    const [studentCode, setStudentCode] = useState('')
    const navigate = useNavigate()

    const info = {
        student: {
            title: 'Ready to Learn?',
            description: 'Access your courses, track your progress, and continue your tech journey with Tropicode.',
            bullets: [
              'Interactive coding lessons',
              'Build real projects',
              'Get expert guidance'
            ],
        },
        parent: {
            title: 'Track Their Progress',
            description:
              "Monitor your child's learning journey, view their achievements, and stay connected with their education.",
            bullets: [
              'Real-time progress tracking',
              'Direct teacher communication',
              'Schedule classes'
            ],
          }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log('Student login attemp') // LOG
        setError('')

        if (accountType === 'student') {
            if (!studentCode) {
                setError('Enter student code please')
                return
            }
    
            if (studentCode.length != 4) {
                setError('Incorrect student code')
                return
            }
    
            try {
                const response = await fetch(`${API_URL}/auth/student/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        'code':studentCode
                    })
                })
    
                if (!response.ok) {
                    setError('Invalid Code')
                    return
                }
    
                const data = await response.json()
                const token = data.access_token
    
                console.log('Student login successful', token) // LOG
                localStorage.setItem('token', token)
                navigate('/island')
            } catch(error) {
                setError('Server error. Try again later')
                console.log(error)
            }
        }
    }

    return (
        <div className="flex min-h-full md:min-h-[calc(100vh-151px)]">
            {error && (
                <Error message={error} onClose={() => setError(null)}/>
            )}

            <div className="w-full md:w-1/2 px-10 py-8 md:px-55 md:py-20">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                <p className="text-gray-600 mb-6">Choose your account type to continue</p>

                <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setAccountType('student')}
                    className={`flex-1 px-4 py-2 rounded-md border text-sm font-medium flex items-center justify-center gap-2 transition
                    ${isStudent ? 'bg-purple-50 text-purple-700 border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'}`}
                >
                    <FaUserGraduate /> Student
                </button>
                <button
                    onClick={() => setAccountType('parent')}
                    className={`flex-1 px-4 py-2 rounded-md border text-sm font-medium flex items-center justify-center gap-2 transition
                    ${!isStudent ? 'bg-green-50 text-green-700 border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'}`}
                >
                    <FaUserFriends /> Parent
                </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isStudent ? (
                        <input
                            type="text"
                            placeholder="Enter your 4-character code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                            maxLength={4}
                        />
                    ) : (
                        <>
                            {/* <input
                                type="email"
                                placeholder="Enter your parent email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            /> */}
                            <div className="flex items-center justify-center h-full">
                                <p className="italic text-gray-500 text-center">Coming soon...</p>
                            </div>
                        </>
                    )}

                    {!isStudent && (
                        <>
                            <div className="flex items-center justify-between text-sm">
                                {/* <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" /> Remember me
                                </label>
                                <a href="#" className="text-purple-600 hover:underline">Forgot password?</a> */}
                            </div>
                            {/* <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account? <a href="#" className="text-purple-600 hover:underline">Sign up here</a>
                            </p> */}
                        </>
                    )}

                    <button
                        type="submit"
                        className={`cursor-pointer w-full py-3 rounded-md font-medium text-white transition
                        ${isStudent ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Sign In as {isStudent ? 'Student' : 'Parent'}
                    </button>
                </form>
            </div>

            <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-10 bg-gradient-to-br from-purple-600 to-green-500">
                <div className="max-w-sm text-center">
                    <div className="text-4xl mb-4 flex justify-center">
                    {isStudent ? <FaUserGraduate /> : <FaUserFriends />}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{info[accountType].title}</h2>
                    <p className="mb-4 text-sm text-purple-100">{info[accountType].description}</p>
                    <ul className="text-sm text-purple-100 space-y-1">
                    {info[accountType].bullets.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}