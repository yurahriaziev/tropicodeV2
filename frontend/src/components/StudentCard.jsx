import { useState } from "react"
import { API_URL } from "../config"

export default function StudentCard({ student, setError }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState('')

    const handleScheduleSubmit = async(e) => {
        e.preventDefault()

        if (!title || !startTime) {
            setError('Enter class details')
            return
        }
        const isoStart = new Date(startTime).toISOString()
        
        const studentId = student.id
        console.log(typeof title)   // LOG
        console.log(typeof startTime) // LOG
        console.log(typeof studentId) // LOG
        try {
            const token = localStorage.getItem('token')
            if (token) {
                const classResponse = await fetch(`${API_URL}/classes`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title:title,
                        start_time:isoStart,
                        student_id:studentId
                    })
                })
    
                if (!classResponse.ok) {
                    console.log(await classResponse.json())
                    setError('Please log in with Google again')
                    return
                }
    
                const classData = await classResponse.json()
                console.log('Class created') // LOG
                console.log(classData) // LOG
            }
        } catch (error) {
            setError('Server error')
            return
        }

        setIsFlipped(false)
        setTitle('')
        setStartTime('')
    }

    const buttonClasses = "px-4 py-2 text-sm font-medium bg-white dark:bg-white text-gray-800 border border-gray-300 dark:border-gray-400 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors cursor-pointer"
    return (
        <div className="bg-transparent h-48 [perspective:1000px]">
        
        <div
            className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
        >
            
            <div className="absolute w-full h-full bg-white dark:bg-gray-800 shadow-md p-6 border-b-4 border-green-500 [backface-visibility:hidden]">
                <div className="flex flex-col h-full">
                    <div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white truncate">
                        {student ? student.first : 'Student'}
                    </h3>
                    <hr className="border-gray-200 dark:border-gray-600 my-2" />
                    </div>
                    <div className="flex-grow">
                    {/* Placeholder for other info */}
                    </div>
                    <div className="flex justify-between items-center">
                    <button className={buttonClasses}>
                        View Student
                    </button>
                    <button
                        onClick={() => setIsFlipped(true)}
                        className={buttonClasses}
                    >
                        Schedule Class
                    </button>
                    </div>
                </div>
            </div>

            <div className="absolute w-full h-full bg-white dark:bg-gray-800 shadow-md p-6 border-b-4 border-purple-500 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <form onSubmit={handleScheduleSubmit} className="flex flex-col h-full">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">New Class for {student.first}</h4>
                <div className="space-y-2 flex-grow">
                <input
                    type="text"
                    placeholder="Class Title (e.g., Algebra Basics)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    
                />
                </div>
                <div className="flex justify-end items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                    Confirm
                </button>
                </div>
            </form>
            </div>
            
        </div>
    </div>
  );
}