import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
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
        {/* Admin Sidebar */}
        {isSidebarOpen && <AdminSidebar onClose={() => {
          setIsSidebarOpen(false)
          localStorage.setItem('sidebarOpen', JSON.stringify(false))
        }} />}

        {/* Spacer for fixed admin sidebar */}
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
            style={{ flex: 1, backgroundColor: '#000', padding: '100px 40px 40px' }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
