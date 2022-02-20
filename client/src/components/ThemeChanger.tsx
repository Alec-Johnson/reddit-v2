import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const switchTheme = () => {
    if (mounted) {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div>
      <input type="checkbox" name="" id="checkbox" className="hidden" onClick={switchTheme} />
      <label htmlFor="checkbox" className="cursor-pointer">
        <div className="flex items-center h-5 bg-gray-300 border-2 rounded-full w-9">
          <div className="w-4 h-4 bg-white rounded-full shadow"></div>
        </div>
      </label>
    </div>
  )
}