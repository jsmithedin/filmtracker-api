import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [enabled])

  return (
    <button onClick={() => setEnabled(!enabled)} className="p-2">
      {enabled ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
