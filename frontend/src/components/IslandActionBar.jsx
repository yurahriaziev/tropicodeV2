import classesIcon from '../../public/images/elearning.png'
import homeworkIcon from '../../public/images/web-programming.png'
import chatIcon from '../../public/images/chat.png'
import profileIcon from '../../public/images/profile.png'

const ActionButton = ({ id, label, iconSrc, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex flex-col items-center justify-center gap-2 p-3 w-24 h-24 transition-colors duration-200 cursor-pointer ${
      activeTab === id
        ? `text-teal-600 dark:text-[#d3fc72]`
        : `text-gray-500 dark:text-white hover:text-teal-500 dark:hover:text-[#d3fc72]`
    }`}
  >
    <img src={iconSrc} alt={`${label} icon`} className="w-8 h-8 object-contain" />
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

export default function IslandActionBar({ activeTab, setActiveTab }) {
    return (
        <div className="flex justify-center items-center gap-5 bg-transparent border border-none">
          <ActionButton 
            id="classes" 
            label="Classes" 
            iconSrc={classesIcon} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <ActionButton 
            id="homework" 
            label="Homework" 
            iconSrc={homeworkIcon} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <ActionButton 
            id="chat" 
            label="Chat" 
            iconSrc={chatIcon} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <ActionButton 
            id="profile" 
            label="Profile" 
            iconSrc={profileIcon} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
    )
}