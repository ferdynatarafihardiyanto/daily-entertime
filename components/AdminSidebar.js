import Link from 'next/link'
import { useRouter } from 'next/router'
import { logout } from '../lib/api'

export default function AdminSidebar({ onClose }) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    { label: 'Dashboard', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>, path: '/admin' },
    { label: 'Jadwal Mingguan', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>, path: '/admin/jadwal' },
    { label: 'Tambah Film', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>, path: '/admin/tambah-film' },
    { label: 'Tambah Musik', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>, path: '/admin/tambah-musik' },
    { label: 'Tambah Berita', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>, path: '/admin/tambah-berita' },
    { label: 'Verifikasi Premium', isComingSoon: true, icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>, path: '/admin/verifikasi' },
  ]

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      flexShrink: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0, paddingLeft: '10px' }}>
          Menu Admin
        </h2>
        {onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = router.pathname === item.path
          return (
            <Link 
              key={index} 
              href={item.isComingSoon ? '#' : item.path} 
              onClick={(e) => {
                if (item.isComingSoon) {
                  e.preventDefault();
                  alert("Fitur ini akan segera hadir di update selanjutnya");
                }
              }}
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: isActive ? 'white' : '#9CA3AF',
              textDecoration: 'none',
              fontSize: '16px',
              paddingLeft: '10px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
              <span style={{ fontWeight: isActive ? 'bold' : 'normal', flex: 1 }}>{item.label}</span>
              {item.isComingSoon && (
                <span style={{ 
                  fontSize: '9px', 
                  backgroundColor: '#A855F7', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>
                  Coming Soon
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: '#FF0000',
          color: 'white',
          border: 'none',
          padding: '14px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '15px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Log Out
      </button>
    </div>
  )
}
