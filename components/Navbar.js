import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Navbar({ onToggleSidebar, isScrolled = false, isOpen = false }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <nav style={{
      backgroundColor: isScrolled ? 'black' : 'transparent',
      padding: '12px 30px',
      borderBottom: '1px solid',
      borderBottomColor: isScrolled ? '#222' : 'transparent',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: (user && isOpen) ? '260px' : '0',
      right: 0,
      zIndex: 50,
      transition: 'all 0.3s ease'
    }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {!isOpen && (
          <button
            onClick={onToggleSidebar}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
          >
            ☰
          </button>
        )}
        <img src="/logo%20navbar.png" alt="Logo DE" style={{ height: '38px', borderRadius: '50%' }} />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          /* Profile badge - shown when logged in */
          <div 
            onClick={() => router.push('/profile')}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#A855F7',
            borderRadius: '12px',
            padding: '8px 14px 8px 8px',
            cursor: 'pointer',
          }}>
            {/* Avatar circle */}
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '13px',
              color: 'white',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (user.name || user.username || 'U').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
              )}
            </div>
            {/* Name */}
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', lineHeight: 1 }}>
                {user.roles?.includes('admin') ? 'Admin' : 'Hallo'}
              </div>
              <div style={{
                color: 'white',
                fontWeight: '600',
                fontSize: '13px',
                lineHeight: 1.3,
                maxWidth: '160px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user.name || user.username || 'User'}
              </div>
            </div>
          </div>
        ) : (
          /* Guest buttons */
          <>
            <Link href="/register" style={{
              backgroundColor: '#A855F7',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              Sign Up
            </Link>
            <Link href="/login" style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '8px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
