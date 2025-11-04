import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function StudentClasses({ setError }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPast, setShowPast] = useState(false)
  
  useEffect(() => {
    const fetchClasses = async() => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Not logged in')
          return
        }

        const response = await fetch(`${API_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          setError('Unable to fetch classes. Try again')
          console.log(await response.json()) // LOG
          return
        }

        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.log(error) // LOG
        setError('Internal server error')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  function formatClassTime(isoString) {
    if (!isoString) return ""

    const date = new Date(isoString)

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })

    return `${formattedDate} - ${formattedTime}`
  }

  if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-600 dark:text-gray-300">Loading classes...</p>
        </div>
      );
  }

  if (!classes.length) {
    return (
      <div className="flex justify-center items-center py-10">
          <p className="text-gray-600 dark:text-gray-300">
          No upcoming classes yet.
          </p>
      </div>
      );
  } else {
    const now = new Date()

    const filteredClasses = classes
      .filter((cls) => {
        const start = new Date(cls.start_time);
        return showPast ? start < now : start >= now;
      })
      .sort((a, b) => {
        return showPast
          ? new Date(b.start_time) - new Date(a.start_time)
          : new Date(a.start_time) - new Date(b.start_time);
      })


    return (
      <div className="px-16 py-10 text-white min-h-screen dark:bg-[#1f1d25]">
        <div className="flex items-baseline gap-3 mb-8">
          <h2 className="text-2xl font-semibold text-[#d6ff86]">
            {showPast ? "Your Past Classes" : "Your Upcoming Classes"}
          </h2>

          <button
            onClick={() => setShowPast(!showPast)}
            className="text-sm text-gray-400 hover:text-[#d6ff86] transition font-medium mt-[2px]"
          >
            {showPast ? "View Upcoming Classes" : "View Past Classes"}
          </button>
        </div>
  
        <div className="flex flex-col gap-5">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between bg-[#22222a] border border-[#2e2e38] rounded-2xl p-6 hover:bg-[#2a2a34] transition"
            >
              <div>
                <h3 className="text-lg font-medium text-[#d6ff86]">
                  {cls.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{formatClassTime(cls.start_time)}</p>
                {/* <p className="text-sm text-gray-400">With {cls.tutor}</p> */}
              </div>
              <a
                href={cls.google_meet_link}
                className="bg-[#d6ff86] text-black font-semibold px-5 py-2 rounded-lg hover:bg-[#e5ffa7] transition"
                target="_blank"
              >
                Join Class
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

}
