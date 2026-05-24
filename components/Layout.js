import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children, title = 'Final Project', isHome = false }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen')
      if (saved !== null) return JSON.parse(saved)
    }
    return false // Default closed
  })
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    setIsLoggedIn(!!user)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'black' }}>
        {/* Sidebar - hanya tampil jika sudah login dan sidebar terbuka */}
        {isLoggedIn && isSidebarOpen && <Sidebar />}

        {/* Spacer for fixed sidebar */}
        {isLoggedIn && isSidebarOpen && <div style={{ width: '190px', flexShrink: 0 }} />}

        {/* Main content */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            onToggleSidebar={() => {
              const newState = !isSidebarOpen
              setIsSidebarOpen(newState)
              localStorage.setItem('sidebarOpen', JSON.stringify(newState))
            }}
            isScrolled={isScrolled}
          />
          <main
            style={{ flex: 1, marginTop: isHome ? '-64px' : '0' }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
