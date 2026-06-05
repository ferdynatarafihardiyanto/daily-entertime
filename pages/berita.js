import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBookmarks, addBookmark, removeBookmark, isLoggedIn } from '../lib/api'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents } from '../store/contentSlice'
import { invalidateBookmarks } from '../store/userSlice'

export default function Berita() {
  const dispatch = useDispatch()
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [searchQuery, setSearchQuery] = useState('')
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())

  // Dummy data sebagai fallback jika backend belum berjalan
  const fallbackNews = [
    {
      id: 1,
      slug: 'sekretaris-al-as-dipecat',
      title: 'Lagi, Giliran Sekretaris Angkatan Laut AS yang Dipecat Pentagon',
      date: '24 Mei 2026',
      description: 'Lagi, Giliran Sekretaris Angkatan Laut AS yang Dipecat Pentagon, kasus ini kembali mencuat setelah sejumlah petinggi menyatakan...',
      image: '/beritarekom1.svg'
    },
    {
      id: 2,
      slug: 'fadly-alberto-kungfu',
      title: 'Fadly Alberto Ungkap Alasan Menyerang Kungfu Pemain Dewa United U20',
      date: '24 Mei 2026',
      description: 'Fadly Alberto mengungkap alasannya usai pertandingan yang berlangsung panas di babak kedua turnamen lokal...',
      image: '/beritarekom2.svg'
    },
    {
      id: 3,
      slug: 'man-city-menang',
      title: 'Man City Hanya Menang 1-0 Lawan Burnley, Pep: Kenapa Harus Frustasi?',
      date: '23 Mei 2026',
      description: 'Pertandingan Liga Inggris mempertemukan Man City dengan Burnley dengan hasil akhir tipis. Pelatih Pep Guardiola menegaskan timnya bermain cukup baik.',
      image: '/beritarekom3.svg'
    },
    {
      id: 4,
      slug: 'kronologi-driver-ojol-antapani',
      title: 'Kronologi Driver Ojol di Antapani Diduga dilecehkan Remaja, Nyaris Diamuk Massa',
      date: '22 Mei 2026',
      description: 'Seorang pengemudi ojek online di daerah Antapani diduga mengalami pelecehan oleh sekelompok remaja hingga mengundang amarah warga sekitar.',
      image: '/beritarekom4.svg'
    },
  ]

  useEffect(() => {
    if (contentStatus === 'idle') {
      dispatch(fetchContents())
    }
  }, [contentStatus, dispatch])

  useEffect(() => {
    if (contentStatus === 'loading' || contentStatus === 'idle') {
      setLoading(true)
    } else if (contentStatus === 'succeeded' || contentStatus === 'failed') {
      if (contents && contents.length > 0) {
        const beritaItems = contents
          .filter(item => item.category_id === 1)
          .map((item) => ({
            id: item.id,
            slug: item.id.toString(),
            title: item.title,
            date: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja',
            description: item.description || 'Tidak ada deskripsi',
            image: item.thumbnail || '/beritarekom1.svg',
          }))
        
        if (beritaItems.length > 0) {
          setNewsItems(beritaItems)
        } else {
          setNewsItems(fallbackNews)
        }
      } else {
        setNewsItems(fallbackNews)
      }
      setLoading(false)
    }
  }, [contents, contentStatus])

  useEffect(() => {

    async function fetchBookmarksData() {
      if (!isLoggedIn()) return
      try {
        const data = await getBookmarks()
        if (data.data) {
          const ids = new Set(data.data.map(b => b.id))
          setBookmarkedIds(ids)
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err)
      }
    }

    fetchBookmarksData()

    const onFocus = () => {
      if (contentStatus === 'succeeded' || contentStatus === 'failed') {
        dispatch(fetchContents())
      }
      fetchBookmarksData()
    }

    window.addEventListener('focus', onFocus)
    
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [contentStatus, dispatch])

  const filteredNews = newsItems.filter(news => 
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookmark = async (id) => {
    if (!isLoggedIn()) {
      alert("Silakan login untuk mengatur bookmark")
      return
    }

    const newBookmarkedIds = new Set(bookmarkedIds)
    const isBookmarked = bookmarkedIds.has(id)
    
    // Optimistic update
    if (isBookmarked) {
      newBookmarkedIds.delete(id)
    } else {
      newBookmarkedIds.add(id)
    }
    setBookmarkedIds(newBookmarkedIds)

    try {
      if (isBookmarked) {
        await removeBookmark(id)
      } else {
        await addBookmark(id)
      }
      dispatch(invalidateBookmarks())
    } catch (err) {
      // Revert if failed
      setBookmarkedIds(bookmarkedIds)
      alert("Gagal memperbarui bookmark: " + err.message)
    }
  }

  return (
    <Layout title="Berita - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        
        {/* Search Bar */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '12px 20px',
            maxWidth: '100%'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Cari Judul Berita" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                border: 'none', 
                outline: 'none', 
                width: '100%', 
                fontSize: '16px',
                color: 'black'
              }} 
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat berita...</div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#F87171', marginBottom: '20px' }}>{error}</div>
        )}

        {/* News List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {filteredNews.length > 0 ? filteredNews.map((news) => (
              <div key={news.id || news.slug} style={{ 
                display: 'flex', 
                gap: '24px', 
                backgroundColor: '#1E1E1E', 
                padding: '20px', 
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={news.image} 
                  alt="News thumbnail" 
                  style={{ width: '260px', height: '160px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#000', flexShrink: 0 }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link href={`/berita/${news.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 'bold', lineHeight: '1.3', cursor: 'pointer' }}>
                        {news.title}
                      </h2>
                    </Link>
                    
                    {/* Bookmark Icon */}
                    <div 
                      style={{ cursor: 'pointer', padding: '5px' }}
                      onClick={() => handleBookmark(news.id)}
                    >
                      <svg width="20" height="26" viewBox="0 0 24 32" fill={bookmarkedIds.has(news.id) ? "#A855F7" : "none"} stroke={bookmarkedIds.has(news.id) ? "#A855F7" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2C2.89543 2 2 2.89543 2 4V30L12 24L22 30V4C22 2.89543 21.1046 2 20 2H4Z" />
                      </svg>
                    </div>
                  </div>

                  <div style={{ display: 'inline-block', backgroundColor: '#2C2C2E', color: '#9CA3AF', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                    {news.date}
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#9CA3AF', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {news.description}
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Berita tidak ditemukan</div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </Layout>
  )
}
