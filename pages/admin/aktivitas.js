import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getContents } from '../../lib/api'
import Link from 'next/link'

export default function AktivitasPage() {
  const [contents, setContents] = useState([])
  const [activityPage, setActivityPage] = useState(1)

  useEffect(() => {
    async function fetchContents() {
      try {
        const res = await getContents()
        if (res.data) {
          setContents(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch contents:', err)
      }
    }
    fetchContents()
  }, [])

  // Generate activities
  const categoryNames = { 1: 'Berita', 2: 'Film', 3: 'Musik' }
  const categoryIcons = { 1: '📰', 2: '🎬', 3: '🎵' }
  const categoryColors = { 1: '#78350F', 2: '#1E3A8A', 3: '#064E3B' }
  
  const activities = [...contents].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(c => {
    const timeDiff = Math.abs(new Date() - new Date(c.created_at))
    const diffHours = Math.floor(timeDiff / (1000 * 60 * 60))
    const diffMins = Math.floor(timeDiff / (1000 * 60))
    let timeAgo = ''
    if (diffHours > 24) {
      timeAgo = Math.floor(diffHours / 24) + ' HARI YANG LALU'
    } else if (diffHours > 0) {
      timeAgo = diffHours + ' JAM YANG LALU'
    } else if (diffMins > 0) {
      timeAgo = diffMins + ' MENIT YANG LALU'
    } else {
      timeAgo = 'BARU SAJA'
    }
    
    return {
      id: c.id,
      text: `${categoryNames[c.category_id] || 'Konten'} "${c.title}" berhasil diunggah oleh admin`,
      time: timeAgo,
      icon: categoryIcons[c.category_id] || '📄',
      color: categoryColors[c.category_id] || '#333'
    }
  })

  // Pagination
  const itemsPerPage = 15
  const totalActivityPages = Math.ceil(activities.length / itemsPerPage) || 1
  const paginatedActivities = activities.slice((activityPage - 1) * itemsPerPage, activityPage * itemsPerPage)

  return (
    <AdminLayout title="Semua Aktivitas">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a href="/admin" style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '24px', textDecoration: 'none' }}>
            &larr;
          </a>
          <h2 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#A855F7' }}>⏱️</span> Semua Aktivitas
          </h2>
        </div>

        <div style={{ backgroundColor: '#111', borderRadius: '12px', padding: '20px', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            {paginatedActivities.length > 0 ? paginatedActivities.map((act, index) => (
              <div key={act.id} style={{ display: 'flex', gap: '15px', padding: '15px 0', borderBottom: index < paginatedActivities.length - 1 ? '1px solid #222' : 'none', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{act.icon}</div>
                <div>
                  <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px', lineHeight: '1.4' }}>{act.text}</div>
                  <div style={{ color: '#6B7280', fontSize: '12px', fontWeight: 'bold' }}>🕒 {act.time}</div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px 0', color: '#6B7280', textAlign: 'center' }}>Belum ada aktivitas yang tercatat.</div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalActivityPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #222', marginTop: '20px' }}>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Page {activityPage} of {totalActivityPages}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  disabled={activityPage === 1}
                  onClick={() => setActivityPage(p => p - 1)} 
                  style={{ background: activityPage === 1 ? '#222' : '#333', color: activityPage === 1 ? '#555' : 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: activityPage === 1 ? 'not-allowed' : 'pointer' }}>
                  Prev
                </button>
                <button 
                  disabled={activityPage === totalActivityPages}
                  onClick={() => setActivityPage(p => p + 1)} 
                  style={{ background: activityPage === totalActivityPages ? '#222' : '#A855F7', color: activityPage === totalActivityPages ? '#555' : 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: activityPage === totalActivityPages ? 'not-allowed' : 'pointer' }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
