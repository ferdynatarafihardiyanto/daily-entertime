import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBookmarks, addBookmark, removeBookmark, isLoggedIn } from '../lib/api'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents } from '../store/contentSlice'

export default function Film() {
  const dispatch = useDispatch()
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [searchQuery, setSearchQuery] = useState('')
  const [filmItems, setFilmItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())

  const fallbackFilms = [
    {
      id: 1,
      slug: 'miracle-in-cell-no-7',
      title: 'Miracle in Cell No. 7',
      meta: 'Drama, Family • 2022',
      image: '/filmmiracle.svg'
    },
    {
      id: 2,
      slug: 'ipar-adalah-maut',
      title: 'Ipar Adalah Maut',
      meta: 'Drama • 2024',
      image: '/filmiparadalahmaut.svg'
    },
    {
      id: 3,
      slug: 'danur-i-can-see-ghosts',
      title: 'Danur: I Can See Ghosts',
      meta: 'Horror • 2017',
      image: '/filmdanur.svg'
    },
    {
      id: 4,
      slug: 'agak-laen',
      title: 'Agak Laen',
      meta: 'Comedy, Horror • 2024',
      image: '/filmagaklain.svg'
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
        const fetchedFilms = contents
          .filter(item => item.category_id === 2)
          .map((item) => {
            let sutradara = 'Tidak diketahui'
            let sinopsis = 'Film'
            if (item.description && item.description.includes('Sutradara:')) {
              const parts = item.description.split('\nSinopsis: ')
              sutradara = parts[0].replace('Sutradara: ', '').trim()
              if (parts.length > 1) {
                sinopsis = parts[1].trim()
              }
            } else if (item.description) {
              sinopsis = item.description
            }

            const words = sinopsis.split(' ')
            const liteSinopsis = words.length > 20 ? words.slice(0, 20).join(' ') + '...' : sinopsis

            return {
              id: item.id,
              slug: item.id.toString(),
              title: item.title,
              director: sutradara,
              synopsis: liteSinopsis,
              image: item.thumbnail || '/filmmiracle.svg',
            }
          })
        
        if (fetchedFilms.length > 0) {
          setFilmItems(fetchedFilms)
        } else {
          setFilmItems(fallbackFilms)
        }
      } else {
        setFilmItems(fallbackFilms)
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
        dispatch(fetchContents()) // Refresh data softly
      }
      fetchBookmarksData()
    }

    window.addEventListener('focus', onFocus)
    
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [contentStatus, dispatch])

  const filteredFilms = filmItems.filter(film => 
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookmark = async (id) => {
    if (!isLoggedIn()) {
      alert("Silakan login untuk mengatur bookmark")
      return
    }

    try {
      const newBookmarkedIds = new Set(bookmarkedIds)
      if (bookmarkedIds.has(id)) {
        await removeBookmark(id)
        newBookmarkedIds.delete(id)
        alert("Film dihapus dari menu bookmark!")
      } else {
        await addBookmark(id)
        newBookmarkedIds.add(id)
        alert("Film berhasil disimpan ke menu bookmark!")
      }
      setBookmarkedIds(newBookmarkedIds)
    } catch (err) {
      alert("Gagal memperbarui bookmark: " + err.message)
    }
  }

  return (
    <Layout title="Film - Final Project">
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
              placeholder="Cari Film" 
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
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat film...</div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#F87171', marginBottom: '20px' }}>{error}</div>
        )}

        {/* Film List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {filteredFilms.length > 0 ? filteredFilms.map((film) => (
              <div key={film.id || film.slug} style={{ 
                display: 'flex', 
                gap: '24px', 
                backgroundColor: '#1E1E1E', 
                padding: '20px', 
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={film.image} 
                  alt="Film thumbnail" 
                  style={{ width: '160px', height: '220px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#000' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link href={`/film/${film.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <h2 style={{ margin: '0 0 12px 0', fontSize: '26px', fontWeight: 'bold', lineHeight: '1.3', cursor: 'pointer' }}>
                        {film.title}
                      </h2>
                    </Link>
                    
                    {/* Bookmark Icon */}
                    <div 
                      style={{ cursor: 'pointer', padding: '5px' }}
                      onClick={() => handleBookmark(film.id)}
                    >
                      <svg width="20" height="26" viewBox="0 0 24 32" fill={bookmarkedIds.has(film.id) ? "#A855F7" : "none"} stroke={bookmarkedIds.has(film.id) ? "#A855F7" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2C2.89543 2 2 2.89543 2 4V30L12 24L22 30V4C22 2.89543 21.1046 2 20 2H4Z" />
                      </svg>
                    </div>
                  </div>

                  <span style={{ fontSize: '15px', color: '#A3A3A3', fontWeight: '500' }}>
                    Sutradara: <span style={{ color: '#A855F7' }}>{film.director || 'Tidak diketahui'}</span>
                  </span>
                  
                  <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.6', color: '#9CA3AF', maxWidth: '90%' }}>
                    {film.synopsis || 'Saksikan keseruan dan ketegangan dalam film ini.'}
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Film tidak ditemukan</div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </Layout>
  )
}
