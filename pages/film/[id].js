import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Layout from '../../components/Layout'
import { getContentById, trackHistory, isLoggedIn } from '../../lib/api'
import { useSelector } from 'react-redux'

export default function FilmDetail() {
  const router = useRouter()
  const { id } = router.query
  const [film, setFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const hasFetched = useRef(false)
  const contents = useSelector((state) => state.content.items)

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return }
    if (!id) return

    const cachedFilm = contents.find(item => item.id.toString() === id)
    if (cachedFilm && !film) { setFilm(cachedFilm); setLoading(false) }

    if (!hasFetched.current) {
      hasFetched.current = true
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
  }, [id, contents])

  if (loading) {
    return (
      <Layout title="Loading... - Final Project">
        <div style={{ minHeight: '100vh', backgroundColor: '#07080D', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: '36px', height: '36px',
            border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#A855F7',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        </div>
      </Layout>
    )
  }

  if (!film) {
    return (
      <Layout title="Not Found - Final Project">
        <div style={{ minHeight: '100vh', backgroundColor: '#07080D', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'white' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>Film tidak ditemukan.</span>
        </div>
      </Layout>
    )
  }

  // Parse servers
  let servers = []
  if (film.url && film.url !== '#') {
    try {
      const parsed = JSON.parse(film.url)
      servers = Array.isArray(parsed) ? parsed : [{ name: 'Server 1', link: film.url }]
    } catch {
      servers = [{ name: 'Server 1', link: film.url }]
    }
  }

  const getEmbedLink = (url) => {
    if (!url) return ''
    if (url.includes('drive.google.com') && url.includes('/view')) return url.replace('/view', '/preview')
    return url
  }

  const currentServerLink = servers.length > 0 ? getEmbedLink(servers[activeTab]?.link) : ''

  // Parse sutradara & sinopsis
  let sutradara = 'Tidak diketahui'
  let sinopsis = film.description || 'Tidak ada deskripsi.'
  if (film.description?.includes('Sutradara:')) {
    const parts = film.description.split('\nSinopsis: ')
    sutradara = parts[0].replace('Sutradara: ', '').trim()
    sinopsis = parts.length > 1 ? parts[1].trim() : ''
  }

  const viewCount = (film.views_count || 0).toLocaleString('id-ID')
  const dateFormatted = film.created_at
    ? new Date(film.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Tanggal tidak diketahui'

  const SERVER_COLORS = ['#A855F7', '#34D399', '#818CF8']

  return (
    <Layout title={`${film.title} - Final Project`}>
      <div style={{ minHeight: '100vh', backgroundColor: '#07080D', fontFamily: 'Inter, sans-serif' }}>

        {/* ── Hero Banner ── */}
        <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
          {/* Blurred backdrop */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#12151F' }} />
          {film.thumbnail && (
            <img
              src={film.thumbnail}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.15, filter: 'blur(12px)', transform: 'scale(1.1)',
              }}
            />
          )}
          {/* Fade ke bawah */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,8,13,0.3) 0%, #07080D 100%)' }} />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            style={{
              position: 'absolute', top: '24px', left: '32px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12L12 19M5 12L12 5"/>
            </svg>
          </button>

          {/* Poster + title di bawah hero */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0 32px 28px',
            display: 'flex', alignItems: 'flex-start', gap: '24px',
          }}>
            {/* Poster kecil */}
            <div style={{
              width: '120px', flexShrink: 0,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)',
            }}>
              {film.thumbnail ? (
                <img src={film.thumbnail} alt={film.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '2/3', backgroundColor: '#1C2030', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Title meta */}
            <div style={{ flex: 1, paddingBottom: '4px' }}>
              <span style={{
                display: 'inline-block', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px',
                padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(168,85,247,0.18)', color: '#C084FC',
                marginBottom: '10px',
              }}>
                FILM
              </span>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', margin: '0 0 10px', lineHeight: '1.2', letterSpacing: '-0.4px' }}>
                {film.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  {viewCount} tayangan
                </span>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {dateFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '24px 32px 48px', display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>

          {/* Kolom kiri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Streaming card */}
            <SectionCard title="Streaming">
              {/* Server tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {servers.length > 0 ? servers.map((server, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    style={{
                      padding: '7px 18px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '12px', fontWeight: '700',
                      backgroundColor: activeTab === idx ? SERVER_COLORS[idx] || '#A855F7' : 'transparent',
                      color: activeTab === idx ? '#fff' : '#6B7280',
                      border: activeTab === idx ? 'none' : '1px solid #1F2937',
                      transition: 'all 0.2s',
                    }}
                  >
                    {server.name || `Server ${idx + 1}`}
                  </button>
                )) : (
                  <button style={{ padding: '7px 18px', borderRadius: '8px', backgroundColor: '#A855F7', color: '#fff', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'not-allowed' }} disabled>
                    Server 1
                  </button>
                )}
              </div>

              {/* Player */}
              {currentServerLink ? (
                <iframe
                  src={currentServerLink}
                  width="100%"
                  height="460px"
                  style={{ border: 'none', borderRadius: '10px', backgroundColor: '#06080D', display: 'block' }}
                  allowFullScreen
                />
              ) : (
                <div style={{
                  width: '100%', height: '460px', backgroundColor: '#06080D',
                  borderRadius: '10px', border: '1px solid #1A2035',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
                }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(168,85,247,0.1)', border: '2px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#A855F7"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span style={{ fontSize: '13px', color: '#4B5563' }}>Video belum tersedia</span>
                </div>
              )}

              {/* Catatan server */}
              <div style={{ marginTop: '12px', background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.12)', borderRadius: '8px', padding: '10px 14px' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.7', margin: 0 }}>
                  <span style={{ color: '#C084FC', fontWeight: '600' }}>Stream 1</span> — resolusi 360p/480p &nbsp;·&nbsp;{' '}
                  <span style={{ color: '#34D399', fontWeight: '600' }}>Stream 2</span> — resolusi 720p &nbsp;·&nbsp;{' '}
                  <span style={{ color: '#818CF8', fontWeight: '600' }}>Stream 3</span> — alternatif
                </p>
              </div>
            </SectionCard>

            {/* Sinopsis card */}
            <SectionCard title="Sinopsis">
              <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.8', margin: 0 }}>
                {sinopsis || 'Tidak ada sinopsis.'}
              </p>
            </SectionCard>
          </div>

          {/* Kolom kanan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Info Film */}
            <SectionCard title="Info Film">
              <InfoRow label="Judul" value={film.title} />
              <InfoRow label="Sutradara" value={sutradara} />
              <InfoRow label="Kategori" value="Film" />
              <InfoRow label="Ditambahkan" value={dateFormatted} last />
            </SectionCard>

            {/* Stat tayangan */}
            <div style={{
              background: '#0E1220', border: '1px solid #1A2035', borderRadius: '10px',
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>Total Tayangan</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#F9FAFB' }}>{viewCount}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  )
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: '#0E1220', border: '1px solid #1A2035', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1A2035', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A855F7', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#9CA3AF', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  )
}

function InfoRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '3px',
      padding: '9px 0',
      borderBottom: last ? 'none' : '1px solid #111827',
    }}>
      <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#A855F7', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', color: '#E5E7EB', lineHeight: '1.5' }}>
        {value}
      </span>
    </div>
  )
}