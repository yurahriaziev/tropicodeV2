// import { useEffect, useState } from "react";

// export default function Error({ message, onClose }) {
//     const [isClosing, setIsClosing] = useState(false);

//     useEffect(() => {
//         const closeTimer = setTimeout(() => {
//             onClose()
//         }, 2500)

//         const removeTimer = setTimeout(() => {
//             onClose()
//         }, 3000)

//         return () => {
//             clearTimeout(closeTimer)
//             clearTimeout(removeTimer)
//         }
//     }, [onClose])

//     return (
//         <div>
//             <div>
//                 <p>{message}</p>
//             </div>
//         </div>
//     )
// }

"use client"

import { useEffect, useState } from "react"


export default function Error({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Reset states when message changes
    setIsVisible(false)
    setIsClosing(false)

    // Small delay to ensure the reset takes effect, then trigger slide down
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    // Start closing animation after 2.5 seconds
    const closeTimer = setTimeout(() => {
      setIsClosing(true)
    }, 2500)

    // Remove component after animation completes
    const removeTimer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
      clearTimeout(removeTimer)
    }
  }, [message, onClose]) // Added message as dependency

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div
        className={`
         bg-red-500 text-white px-6 py-4 rounded-b-lg shadow-lg max-w-md w-full mx-4
          flex items-center space-x-3 transform transition-all duration-300 ease-out
          ${isVisible && !isClosing ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <p className="flex-1 font-medium text-white">{message}</p>
        <button
          onClick={() => {
            setIsClosing(true)
            setTimeout(onClose, 300)
          }}
          className="text-white hover:text-red-200 transition-colors"
        >
        </button>
      </div>
    </div>
  )
}