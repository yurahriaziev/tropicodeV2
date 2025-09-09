import { useState } from "react";

export default function NewStudentPopUp({ isOpen, onClose, onSubmit }) {
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [age, setAge] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ first, last, age: parseInt(age, 10) })
    }

    if (!isOpen) {
        return null
    }

    const handleClose = () => {
        setFirst('')
        setLast('')
        setAge('')
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-40 flex items-center justify-center p-4">
      
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
            <button 
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create New Student</h2>
        
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                    id="first-name"
                    type="text"
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                    id="last-name"
                    type="text"
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                    <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 mr-2"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Create Student
                    </button>
                </div>
            </form>
      </div>
    </div>
    )
}