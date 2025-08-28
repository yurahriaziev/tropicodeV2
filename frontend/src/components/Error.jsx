import { useEffect, useState } from "react"

export default function Error({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    setIsVisible(false)
    setIsClosing(false)

    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    const closeTimer = setTimeout(() => {
      setIsClosing(true)
    }, 2500)

    const removeTimer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
      clearTimeout(removeTimer)
    }
  }, [message, onClose])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div
        className={`
         bg-red-500 text-white px-6 py-4 rounded-b-lg shadow-lg max-w-md w-full mx-4
          flex items-center justify-center transform transition-all duration-300 ease-out
          ${isVisible && !isClosing ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <p className="font-medium text-white">{message}</p>
      </div>
    </div>
  )
}
