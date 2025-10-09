import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import StudentCard from "../components/StudentCard"
import NewStudentBtn from "../components/NewStudentBtn"
import NewStudentPopUp from "../components/NewStudentPopUp"
import Error from "../components/Error"
import GoogleAccountBtn from "../components/GoogleAccountBtn"

export default function TutorPage() {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [tutorData, setTutorData] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [students, setStudents] = useState([])
    const [googleConnected, setGoogleConnected] = useState(false)
    const [tutorClasses, setTutorClasses] = useState([])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    useEffect(() => {
        const fetchTutor = async() => {
            const token = localStorage.getItem('token')
            if (token) {
                const response = await fetch(`${API_URL}/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })

                const classesResponse = await fetch(`${API_URL}/classes`, {
                    method:'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    setError('Invalid request')
                    localStorage.removeItem('token')
                    return
                }

                if (!classesResponse.ok) {
                    setError('Error fetching class IDs')
                    return
                }

                const data = await response.json()
                setTutorData(data)

                if (data.tutor_gmail) {
                    setGoogleConnected(true)
                }

                const classData = await classesResponse.json()
                setTutorClasses(classData)
                console.log(classData) // LOG
                console.log(data) // LOG
            } else {
                setError('Not logged in')
            }
        }


        fetchTutor()
    }, [])

    const handleCreateStudent = async(student) => {
        console.log('new student') // LOG

        setError('')
        console.log(student)

        if (!student.first || !student.last || !student.age) {
            setError('Fill out all spots')
            return
        }

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Not authorized')
                navigate('/')
                return
            }
            const response = await fetch(`${API_URL}/tutors/student`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(student)
            })

            if (!response.ok) {
                setError('Error creating student. Try again')
                console.log(response.status, response.statusText) // LOG
            }

            const data = await response.json()
            setStudents(prevStudents => [...prevStudents, data])
            setIsModalOpen(false)
        } catch (error) {
            setError('Server error. Try again')
            console.log(error) // LOG
        }
    }

    useEffect(() => {
        const fetchStudents = async() => {
            const token = localStorage.getItem('token')
            if (token) {
                const studentsResponse = await fetch(`${API_URL}/tutors/me/students`, {
                        method: 'GET',
                        headers: {
                            'Authorization':`Bearer ${token}`
                        }
                    })

                if (!studentsResponse.ok) {
                    setError('Error fetching studnts')
                    setStudents([])
                } else {
                    const studentsData = await studentsResponse.json()
                    setStudents(studentsData)
                    console.log(studentsData)
                }
            } else {
                setError('Not logged in')
            }
        }

        fetchStudents()
    }, [])

    return (
        <div className="page bg-gray-50 dark:bg-gray-900 min-h-screen">
            {error && (
                <Error message={error} onClose={() => setError(null)}/>
            )}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tropicode Tutor | {tutorData.first}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <button onClick={handleLogout} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    Logout
                    </button>
                </div>
                </div>
            </header>

            <div className="grid grid-cols-8 grid-rows-5 gap-4 m-6">
                <div className="col-span-2 row-span-5 space-y-4">
                    
                    {students.length > 0 ? (
                        students.map((student, index) => (
                            <StudentCard key={index} student={student} setError={setError} />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 p-6 shadow-md">
                            <p className="text-gray-500 dark:text-gray-400 italic">
                                No students have been added yet.
                            </p>
                        </div>
                    )}
                </div>
                <div className="col-span-4 row-span-5 col-start-3">
                    <div className="bg-white dark:bg-gray-800 p-6 shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Upcoming Classes</h3>
                        <p className="text-gray-600 dark:text-gray-400">No upcoming classes scheduled</p>
                    </div>
                </div>
                <div className="row-span-5 col-start-7 col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Actions</h3>
                        {/* <p className="text-gray-600 dark:text-gray-400">Actions coming soon</p> */}
                        <div className="flex flex-col space-y-4">
                            <NewStudentBtn onClick={() => setIsModalOpen(true)} />
                            <GoogleAccountBtn connected={googleConnected} setError={setError} />
                        </div>
                    </div>
                </div>
            </div>
            <NewStudentPopUp
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleCreateStudent}
            />
        </div>
    )
}