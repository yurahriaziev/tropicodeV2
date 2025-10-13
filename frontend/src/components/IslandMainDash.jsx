import { useEffect, useState } from "react";
import WelcomeBanner from "./WelcomeBanner";
import { API_URL } from "../config";
import IslandActionBar from "./IslandActionBar";
import StudentClasses from "./StudentClasses";

export default function IslandMainDash() {
    const [studentData, setStudentData] = useState({})
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('classes')

    useEffect(() => {
        const fetchStudentData = async() => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/users/me`, {
                        method: 'GET',
                        headers: {'Authorization':`Bearer ${token}`}
                    })

                    if (!response.ok) {
                        setError('Invalid request')
                        localStorage.removeItem('token')
                        return
                    }

                    const data = await response.json()
                    setStudentData(data)
                    console.log(data) // LOG
                } catch(error) {
                    console.log(error) // LOG
                    setError('Invalid request')
                }
            } else {
                setError('Not logged in')
                return
            }
        }

        fetchStudentData()
    }, [])
    
    return (
        <main className={`min-h-[calc(100vh-75px)] overflow-hidden bg-green-50 dark:bg-[#1f1d25]`}>
            <WelcomeBanner name={studentData.first} />
            <IslandActionBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <StudentClasses setError={setError} />
        </main>
    )
}