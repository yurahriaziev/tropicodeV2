export default function StudentCard({ student }) {
    return (
            <div className="bg-white dark:bg-gray-800 shadow-md p-6 border-b-4 border-green-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    
                    <div className="flex flex-col">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white truncate">
                        {student ? student.first : 'Student'}
                    </h3>
                    <hr className="border-gray-200 dark:border-gray-600 my-2" />
                    <div className="mt-4">
                        <button className="px-4 py-2 text-sm font-medium bg-gray-700 dark:bg-white text-white dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-400 transition-colors cursor-pointer">
                            View Student
                        </button>
                    </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end h-full">
                    <div className="w-full h-16 bg-gray-100 dark:bg-gray-900 rounded-md mb-4">
                        {/* enrolled course or student stats */}
                    </div>
                    <div className="mt-auto">
                        <button className="px-6 py-2 text-sm font-medium bg-gray-700 dark:bg-white text-white dark:text-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors cursor-pointer">
                            Schedule Class
                        </button>
                    </div>
                    </div>

                </div>
            </div>
    )
}