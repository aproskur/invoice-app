'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import UserAvatar from './UserAvatar';



export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    setDarkMode(stored === 'dark')
  }, [])
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])
  

  return (
    <aside className="flex w-full h-16 md:h-screen md:w-20 bg-[#1E2139] flex-row md:flex-col items-center justify-between md:rounded-tr-3xl md:rounded-br-3xl overflow-hidden relative">

      {/* === Logo Block === */}
      <div className="relative w-16 h-16 md:w-full md:h-20 overflow-hidden flex items-center justify-center rounded-tr-2xl rounded-br-2xl">
        <div className="absolute inset-0 bg-[#7C5DFA]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#9277FF] z-10 rounded-tl-2xl" />
        <div className="relative z-20">
          <img src="/assets/logo.svg" alt="Logo" className="w-6 h-6" />
        </div>
      </div>

      {/* === Moon Icon (mobile only) === */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
        className="absolute right-20 md:hidden z-20"
      >
        <img src="/assets/icon-moon.svg" alt="Toggle theme" className="w-5 h-5" />
      </button>

      {/* === Desktop Spacer === */}
      <div className="hidden md:flex flex-1" />

      {/* === Moon Icon (desktop) === */}
      <div className="hidden md:block absolute bottom-[122px] left-1/2 -translate-x-1/2">
      <button
  onClick={() => setDarkMode(!darkMode)}
  aria-label="Toggle theme"
>
  <img
    src={darkMode ? '/assets/icon-sun.svg' : '/assets/icon-moon.svg'}
    alt={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    className="w-5 h-5"
  />
</button>

      </div>

      {/* === Avatar Block === */}
      <div className="relative w-16 h-16 md:w-full md:h-20 border-l md:border-l-0 md:border-t border-gray-400 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 z-10">
          <Image
            src="/assets/image-avatar.jpg"
            alt="User avatar"
            width={60}
            height={60}
            className="object-cover"
          />
        </div>
      </div>
    </aside>
  )
}
