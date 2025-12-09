import { FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SkillCard({ title, description, icon, topics = [], link = "#" }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <div className="rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      
      <div className="bg-purple-50 py-6 flex justify-center text-3xl text-purple-600">
        {icon}
      </div>

      {/* Make content stretch & allow pushing Learn More to bottom */}
      <div className="p-6 flex flex-col gap-5 text-gray-800 flex-1">
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <ul className="space-y-3">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              {topic}
            </li>
          ))}
        </ul>

        {/* Push this to the bottom of each card */}
        <div className="mt-auto pt-4">
          <a
            onClick={() => handleNavigate(link)}
            className="cursor-pointer flex items-center text-purple-600 font-semibold text-sm hover:underline"
          >
            Learn More <FaAngleRight className="ml-1 text-xs" />
          </a>
        </div>
      </div>

    </div>
  )

}