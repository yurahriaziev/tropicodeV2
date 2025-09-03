// import { useEffect, useState} from "react";

// const SunIcon = () => <span>☀️</span>;
// const MoonIcon = () => <span>🌙</span>;

// export default function ThemeToggle() {
//     const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

//     useEffect(() => {
//         if (theme === 'dark') {
//             document.documentElement.classList.add("dark");
//         } else {
//             document.documentElement.classList.remove("dark")
//         }

//         localStorage.setItem('theme', theme)
//     }, [theme])

//     return (
//         <button
//             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//             className={`cursor-pointer bg-transparent p-2 rounded-md text-gray-800 dark:text-gray-200`}
//         >
//             {theme === 'light' ? <MoonIcon /> : <SunIcon />}
//         </button>
//     )
// }

import { useEffect, useState } from "react";

const SunIcon = () => <span>☀️</span>;
const MoonIcon = () => <span>🌙</span>;

export default function ThemeToggle() {
  // Default to dark on first load if nothing saved
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return true; // <- default to dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    // Functional update avoids stale state bugs
    setIsDark((d) => !d);
    // Optional: quick sanity log
    // setTimeout(() => console.log('dark on html?', document.documentElement.classList.contains('dark')), 0);
  };

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer bg-transparent p-2 rounded-md text-gray-800 dark:text-gray-200"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
