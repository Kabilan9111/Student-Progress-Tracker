import React, { useEffect, useState } from 'react'

export default function HomePage({ onFinish }) {
  const text = 'Welcome Leo'
  const [displayedText, setDisplayedText] = useState('')
  const [fadeOut, setFadeOut] = useState(false)

  // Typing effect
  useEffect(() => {
    let index = 0
    const typingInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1))
      index++
      if (index === text.length) {
        clearInterval(typingInterval)
      }
    }, 120) // typing speed

    return () => clearInterval(typingInterval)
  }, [])

  // Fade out + exit
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 3500) // stays visible

    const exitTimer = setTimeout(() => {
      onFinish && onFinish()
    }, 4200) // fully gone

    return () => {
      clearTimeout(timer)
      clearTimeout(exitTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 tracking-wide">
        {displayedText}
        <span className="animate-pulse ml-1">▍</span>
      </h1>
    </div>
  )
}
