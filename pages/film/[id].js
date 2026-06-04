import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Layout from '../../components/Layout'
import { getContentById, trackHistory, isLoggedIn } from '../../lib/api'

export default function FilmDetail() {
  const router = useRouter()
  const { id } = router.query
  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  const hasFetched = useRef(false)

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      async function fetchFilm() {
        try {
          const data = await getContentById(id)
          setFilm(data.data)
          
          if (isLoggedIn() && data.data) {
            trackHistory(id).catch(err => console.error('Failed to track history', err))
          }
        } catch (err) {
          console.error("Gagal mengambil data film:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchFilm()
    }
  }, [id])

  if (loading) {
    return (
      <Layout title="Loading... - Final Project">
        <div style={{ minHeight: '80vh', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          Loading...
        </div>
      </Layout>
    )
  }

  if (!film) {
    return (
      <Layout title="Not Found - Final Project">
        <div style={{ minHeight: '80vh', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          Film tidak ditemukan.
        </div>
      </Layout>
    )
  }

  // Parse Google Drive Link for Iframe
  let servers = []
  if (film.url && film.url !== '#') {
    try {
      // Check if it's a JSON string of servers
      const parsed = JSON.parse(film.url)
      if (Array.isArray(parsed)) {
        servers = parsed
      } else {
        servers = [{ name: 'Server 1', link: film.url }]
      }
    } catch (e) {
      // Not a JSON string, assume single URL
      servers = [{ name: 'Server 1', link: film.url }]
    }
  }

  // Helper to get embeddable link
  const getEmbedLink = (url) => {
    if (!url) return ''
    if (url.includes('drive.google.com') && url.includes('/view')) {
      return url.replace('/view', '/preview')
    }
    return url
  }
  
  const currentServerLink = servers.length > 0 ? getEmbedLink(servers[activeTab]?.link) : ''

  // Parse Sutradara & Sinopsis dari deskripsi (format dari tambah-film)
  let sutradara = 'Tidak diketahui'
  let sinopsis = film.description || 'Tidak ada deskripsi'
  if (film.description && film.description.includes('Sutradara:')) {
     const parts = film.description.split('\nSinopsis: ')
     sutradara = parts[0].replace('Sutradara: ', '').trim()
     if (parts.length > 1) {
       sinopsis = parts[1].trim()
     } else {
       sinopsis = ''
     }
  }

  // Dynamic view count and date formatting
  const viewCount = film ? (film.views || 0).toLocaleString('id-ID') : '0';
  const dateFormatted = film && film.created_at 
    ? new Date(film.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Tanggal tidak diketahui';

  return (
    <Layout title={`${film.title} - Final Project`}>
      <div style={{ minHeight: '100vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>{film.title}</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '30px', fontSize: '14px' }}>
            <span style={{ marginRight: '20px' }}>👁 {viewCount} kali</span>
            <span>📅 {dateFormatted}</span>
          </p>

          <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', marginBottom: '30px' }}>
            {/* Thumbnail View (sesuai figma) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
              <img src={film.thumbnail || '/filmagaklain.svg'} alt={film.title} style={{ maxWidth: '500px', width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#A855F7', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>JUDUL :</span>
              <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{film.title}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#A855F7', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>PRODUCERS :</span>
              <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>{sutradara}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#A855F7', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>DESKRIPSI :</span>
              <p style={{ margin: '5px 0', fontSize: '16px', lineHeight: '1.6' }}>{sinopsis}</p>
            </div>

            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', padding: '15px 20px', borderRadius: '8px', marginTop: '40px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
                Catatan : Gunakan <span style={{ color: '#A855F7' }}>&apos;Stream 1&apos;</span> untuk Streaming dengan Resolusi <span style={{ color: '#A855F7' }}>&apos;360P&apos;/&apos;480P&apos;</span>, Gunakan <span style={{ color: '#22C55E' }}>&apos;Stream 2&apos;</span> Untuk Resolusi <span style={{ color: '#22C55E' }}>&apos;720P&apos;</span>, dan <span style={{ color: '#3B82F6' }}>&apos;Stream 3&apos;</span> Untuk <a href="#" style={{ color: '#3B82F6', textDecoration: 'underline' }}>Alternatif</a>
              </p>
            </div>
          </div>

          {/* Streaming Section */}
          <div style={{ backgroundColor: '#1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
             <div style={{ padding: '20px 30px', borderBottom: '1px solid #333' }}>
               <h3 style={{ margin: 0, fontSize: '16px', letterSpacing: '2px', fontWeight: 'bold' }}>STREAMING</h3>
             </div>
             
             {/* Server Tabs */}
             <div style={{ padding: '20px 30px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {servers.length > 0 ? servers.map((server, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    style={{ 
                      backgroundColor: activeTab === idx ? '#A855F7' : 'transparent', 
                      color: activeTab === idx ? 'white' : '#9CA3AF', 
                      border: activeTab === idx ? 'none' : '1px solid #333', 
                      padding: '8px 24px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    {server.name || `Server ${idx + 1}`}
                  </button>
                )) : (
                  <button 
                    style={{ 
                      backgroundColor: '#A855F7', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 24px', 
                      borderRadius: '8px', 
                      cursor: 'not-allowed', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                    disabled
                  >
                    Server 1
                  </button>
                )}
             </div>
             
             {/* Video Player Area */}
             <div style={{ padding: '0 30px 30px 30px' }}>
               {currentServerLink ? (
                 <iframe 
                   src={currentServerLink} 
                   width="100%" 
                   height="550px" 
                   style={{ border: 'none', borderRadius: '12px', backgroundColor: 'black' }} 
                   allowFullScreen
                 />
               ) : (
                 <div style={{ width: '100%', height: '550px', backgroundColor: 'black', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9CA3AF' }}>
                   Video belum tersedia
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
