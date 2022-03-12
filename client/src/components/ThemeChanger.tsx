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
    <div onClick={switchTheme} className='cursor-pointer'>
      {theme === "light" ?
        <i className='fa-solid fa-xl fa-moon' />
        :
        <i className='fa-solid fa-xl fa-sun' />
      }
    </div>
  )
}