const PlusIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
)

export default function NewStudentBtn({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer flex items-center gap-3 px-6 py-2 bg-transparent border-1 border-white text-white rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 "
        >
            <PlusIcon />
            <span className="whitespace-nowrap">New Student</span>
        </button>
    )
}