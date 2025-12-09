"use client"

import {
  FaPython,
  FaJs,
  FaReact,
  FaGamepad,
  FaCube,
  FaCode,
} from "react-icons/fa"
import { SiFlask } from "react-icons/si";

const iconMap = {
  Python: FaPython,
  JavaScript: FaJs,
  ReactJS: FaReact,
  Flask: SiFlask,
  Pygame: FaGamepad,
  Tinkercad: FaCube,
  "3D Modeling": FaCube,
  "Game Design": FaGamepad,
  "Web Apps": FaCode,
  "2D Games": FaGamepad,
}

export default function InfiniteScrollStrip({ items, duration = 60 }) {
  const repeated = [...items, ...items] // duplicate JSX track 1:1

  return (
    <div className="relative overflow-hidden w-full py-8 bg-white">
      {/* gradient fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      <div className="overflow-hidden">
        <div
          className="flex w-max items-center gap-8 animate-marquee"
          style={{
            animationDuration: `${duration}s`,
          }}
        >
          {repeated.map((item, i) => {
            const Icon = iconMap[item]
            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-6 py-3 text-sm font-medium text-purple-700 whitespace-nowrap shadow"
              >
                {Icon && <Icon className="text-lg" />}
                {item}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
