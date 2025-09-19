import { useState } from "react"

export default function StudentCard({ student }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState('')

    const handleScheduleSubmit = (e) => {
        e.preventDefault()

        console.log({
        studentId: student.id,
        title,
        startTime,
        })

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
                    required
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    required
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