import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const menuItems = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/berita',
    label: 'Berita',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: '/film',
    label: 'Film',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    href: '/musik',
    label: 'Musik',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/bookmark',
    label: 'Bookmark',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    href: '/premium',
    label: 'Premium',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l3.057-3 3.943 4 3.943-4L19 3l1 7H4L5 3zM4 10h16v11H4V10z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const initials = user
    ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  return (
    <aside style={{
      width: '190px',
      minWidth: '190px',
      backgroundColor: '#111111',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      borderRight: '1px solid #222',
      zIndex: 100,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 18px 16px 18px',
        borderBottom: '1px solid #222',
      }}>
        {/* Avatar */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: '#A855F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          color: 'white',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Menu</span>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {menuItems.map((item) => {
          const isActive = router.pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#A855F7' : '#9CA3AF',
                backgroundColor: isActive ? 'rgba(168,85,247,0.12)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout at bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #222' }}>
        <button
          onClick={() => {
            localStorage.removeItem('currentUser')
            router.push('/login')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: '#EF4444',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}
