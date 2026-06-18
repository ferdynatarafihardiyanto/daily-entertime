'use client'

import { useState, useEffect, useRef } from 'react'

const slides = [
  {
    image: 'https://i.ytimg.com/vi/tGv7CUutzqU/maxresdefault.jpg',
    alt: 'The 1975 - About You',
    tag: 'Music',
    title: 'About You',
    subtitle: 'The 1975',
    desc: 'A dreamy, introspective track that captures the bittersweet feeling of a love that lingers long after it\'s gone.',
  },
  {
    image: 'https://images.openai.com/static-rsc-4/XADY6aslMxQ1iDfKV_TqQEKvkNCtaiby2rXG3nlRKZpAEmMJgXk6CyB2lWshZ7hMpf7n0_aljDltxe8X52USY8hdkvVsulQc469cqcGJ9jHKDrhY0xGj5q5AOcCQlwmXNvqkHkPqYp2DkmZZuMPSrslL9A5uZ4rhyZTv0nFIDfT9G3q1EbEf0DBjCsqPJEhZ?purpose=fullsize',
    alt: 'Digital',
    tag: 'Feature · Trending',
    title: 'Digital',
    subtitle: 'World',
    desc: 'Stay ahead of the curve with the latest trends, stories, and insights from across the digital landscape.',
  },
  {
    image: 'https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ba9289c1-87ce-4e88-86a7-b5c937ae3af2/compose?aspectRatio=1.78&format=webp&width=1200',
    alt: 'Toy Story 3',
    tag: 'Film',
    title: 'Toy Story 3',
    subtitle: 'Pixar',
    desc: 'An emotional journey of friendship, loyalty, and letting go — a timeless masterpiece for all ages.',
  },
]

const DURATION = 5000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const elapsed = useRef(0)
  const progressTimer = useRef(null)
  const touchStart = useRef(0)

  const goTo = (n) => {
    setCurrent((n + slides.length) % slides.length)
    elapsed.current = 0
    setProgress(0)
  }

  const next = () => goTo(current + 1)
  const prev = () => goTo(current - 1)
  const [isHovered, setIsHovered] = useState(false)

  const handleExploreClick = () => {
    const element = document.getElementById('leaderboard')
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (paused) {
      clearInterval(progressTimer.current)
      return
    }
    progressTimer.current = setInterval(() => {
      elapsed.current += 50
      setProgress((elapsed.current / DURATION) * 100)
      if (elapsed.current >= DURATION) {
        elapsed.current = 0
        setProgress(0)
        setCurrent((prev) => (prev + 1) % slides.length)
      }
    }, 50)
    return () => clearInterval(progressTimer.current)
  }, [paused, current])

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000', fontFamily: 'sans-serif' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        style={{
          display: 'flex',
          width: `${slides.length * 100}%`,
          height: '100%',
          transform: `translateX(-${current * (100 / slides.length)}%)`,
          transition: 'transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)',
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} style={{ width: `${100 / slides.length}%`, height: '100%', position: 'relative', flexShrink: 0 }}>
            <img
              src={slide.image}
              alt={slide.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

            {/* Slide content */}
            <div style={{ position: 'absolute', bottom: '90px', left: '48px', right: '48px', color: 'white' }}>
              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
                {slide.tag}
              </p>
              <h1 style={{ fontSize: '42px', fontWeight: 500, lineHeight: 1.15, marginBottom: '14px' }}>
                {slide.title}<br />{slide.subtitle}
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '420px', marginBottom: '28px' }}>
                {slide.desc}
              </p>
                <button
                  className="hero-btn"
                  onClick={handleExploreClick}
                >
                  Explore Now
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide number */}
      <div style={{ position: 'absolute', top: '32px', right: '48px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', zIndex: 10 }}>
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '44px', left: '48px', display: 'flex', gap: '8px', zIndex: 10 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: '6px',
              width: i === current ? '22px' : '6px',
              borderRadius: i === current ? '3px' : '50%',
              background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <div style={{ position: 'absolute', bottom: '32px', right: '48px', display: 'flex', gap: '10px', zIndex: 10 }}>
        {[{ label: '←', action: prev }, { label: '→', action: next }].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.25)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '18px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: 'white', width: `${progress}%`, transition: 'width 0.1s linear', zIndex: 10 }} />
    </div>
  )
}