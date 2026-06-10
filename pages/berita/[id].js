import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useState, useEffect } from 'react'
import { getContentById, trackHistory, isLoggedIn } from '../../lib/api'
import { useSelector } from 'react-redux'

export default function BeritaDetail() {
  const router = useRouter()
  const { id: slug } = router.query
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  const contents = useSelector((state) => state.content.items)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    if (!slug) return;

    // Coba ambil dari cache Redux dulu
    const cachedNews = contents.find(item => item.id.toString() === slug)
    if (cachedNews && !news) {
      setNews({
        title: cachedNews.title,
        image: cachedNews.thumbnail || '/beritarekom1.svg',
        body: cachedNews.description || 'Tidak ada deskripsi yang tersedia.',
      })
      setLoading(false)
    }

    async function fetchNewsDetail() {
      try {
        const data = await getContentById(slug);
        if (data.data && data.data.category_id === 1) {
          const item = data.data;
          setNews({
            title: item.title,
            image: item.thumbnail || '/beritarekom1.svg',
            body: item.description || 'Tidak ada deskripsi yang tersedia.',
          })
          if (isLoggedIn()) {
            trackHistory(item.id).catch(err => console.error('Failed to track history', err))
          }
        }
      } catch (err) {
        console.error("Gagal mengambil detail berita:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNewsDetail()
  }, [slug])

  if (loading) {
    return (
      <Layout title="Loading... - Final Project">
        <div style={{ minHeight: '80vh', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
          Memuat berita...
        </div>
      </Layout>
    )
  }

  if (!news) {
    return (
      <Layout title="Berita Tidak Ditemukan - Final Project">
        <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px', color: 'white', textAlign: 'center' }}>
          Berita tidak ditemukan.
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${news.title} - Final Project`}>
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Centered Title */}
          <h1 style={{ textAlign: 'center', fontSize: '28px', lineHeight: '1.4', marginBottom: '40px', padding: '0 20px', fontWeight: 'bold' }}>
            {news.title}
          </h1>

          {/* Centered Image */}
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
            <img src={news.image} alt="News Photo" style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

          {/* Full Width Text, Aligned Left */}
          <div style={{ width: '100%', fontSize: '18px', lineHeight: '1.8', color: '#E5E7EB', display: 'flex', flexDirection: 'column', gap: '24px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {news.body.split('\n').map((paragraph, index) => (
              <p key={index} style={{ margin: 0 }}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
