import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const menuItems = [
    { label: 'Dashboard', icon: '🏠', path: '/admin' },
    { label: 'Jadwal Mingguan', icon: '📅', path: '/admin/jadwal' },
    { label: 'Tambah Film', icon: '🎞️', path: '/admin/tambah-film' },
    { label: 'Tambah Musik', icon: '🎵', path: '/admin/tambah-musik' },
    { label: 'Tambah Berita', icon: '📰', path: '/admin/tambah-berita' },
    { label: 'Verifikasi Premium', icon: '👑', path: '/admin/verifikasi' },
  ]

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      borderRight: '2px solid #A855F7',
      borderTop: '2px solid #A855F7',
      borderBottom: '2px solid #A855F7',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      flexShrink: 0
    }}>
      <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 40px 0', paddingLeft: '10px' }}>
        Menu Admin
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = router.pathname === item.path
          return (
            <Link key={index} href={item.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: isActive ? 'white' : '#9CA3AF',
              textDecoration: 'none',
              fontSize: '15px',
              paddingLeft: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
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
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <span>🚪</span> Log Out
      </button>
    </div>
  )
}
