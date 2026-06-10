import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children, title = 'Final Project', isHome = false }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    setIsLoggedIn(!!user)

    const saved = localStorage.getItem('sidebarOpen')
    if (saved !== null) {
      setIsSidebarOpen(JSON.parse(saved))
    }

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
        {/* Sidebar - tampil jika sidebar terbuka */}
        {isSidebarOpen && <Sidebar onClose={() => {
          setIsSidebarOpen(false)
          localStorage.setItem('sidebarOpen', JSON.stringify(false))
        }} />}

        {/* Spacer for fixed sidebar */}
        {isSidebarOpen && <div style={{ width: '260px', flexShrink: 0 }} />}

        {/* Main content */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Navbar
            isOpen={isSidebarOpen}
            onToggleSidebar={() => {
              const newState = !isSidebarOpen
              setIsSidebarOpen(newState)
              localStorage.setItem('sidebarOpen', JSON.stringify(newState))
            }}
            isScrolled={isScrolled}
          />
          <main
            style={{ flex: 1, paddingTop: isHome ? '0' : '64px' }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
