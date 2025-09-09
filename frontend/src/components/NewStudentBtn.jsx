export default function NewStudentBtn({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer flex items-center gap-3 px-6 py-2 bg-transparent border-1 border-white text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 "
        >
            + New Student
        </button>
    )
}

// focus:outline-none focus:ring-2 focus:ring-offset-2