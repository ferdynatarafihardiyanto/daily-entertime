import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBookmarks, addBookmark, removeBookmark, isLoggedIn } from '../lib/api'
import { useAudio } from '../contexts/AudioContext'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents } from '../store/contentSlice'

export default function Musik() {
  const dispatch = useDispatch()
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [searchQuery, setSearchQuery] = useState('')
  const [musicItems, setMusicItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio()

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
        const fetchedMusic = contents
          .filter(item => item.category_id === 3)
          .map((item) => {
            let artist = 'Musik'
            if (item.description && item.description.includes('Artis:')) {
              artist = item.description.split('\n')[0].replace('Artis: ', '').trim()
            } else if (item.description) {
              artist = item.description.substring(0, 50) + '...'
            }
            
            return {
              id: item.id,
              slug: item.id.toString(),
              title: item.title,
              meta: artist,
              image: item.thumbnail || '/lagutaklagisama.svg',
              audioUrl: item.url !== '#' ? item.url : '',
              lyrics: item.description || ''
            }
          })
        
        setMusicItems(fetchedMusic)
      } else {
        setMusicItems([])
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

  const filteredMusic = musicItems.filter(music => 
    music.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    music.meta.toLowerCase().includes(searchQuery.toLowerCase())
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
        alert("Musik dihapus dari menu bookmark!")
      } else {
        await addBookmark(id)
        newBookmarkedIds.add(id)
        alert("Musik berhasil disimpan ke menu bookmark!")
      }
      setBookmarkedIds(newBookmarkedIds)
    } catch (err) {
      alert("Gagal memperbarui bookmark: " + err.message)
    }
  }

  return (
    <Layout title="Musik - Final Project">
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
              placeholder="Cari Musik" 
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
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat musik...</div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#F87171', marginBottom: '20px' }}>{error}</div>
        )}

        {/* Music List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {filteredMusic.length > 0 ? filteredMusic.map((music) => (
              <div key={music.id || music.slug} style={{ 
                display: 'flex', 
                gap: '24px', 
                backgroundColor: '#1E1E1E', 
                padding: '20px', 
                borderRadius: '16px',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={music.image} 
                  alt="Music thumbnail" 
                  style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px', backgroundColor: '#000' }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link href={`/musik/${music.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <h2 style={{ margin: '0 0 12px 0', fontSize: '26px', fontWeight: 'bold', lineHeight: '1.3', cursor: 'pointer' }}>
                        {music.title}
                      </h2>
                    </Link>
                    
                    {/* Bookmark Icon */}
                    <div 
                      style={{ cursor: 'pointer', padding: '5px' }}
                      onClick={() => handleBookmark(music.id)}
                    >
                      <svg width="20" height="26" viewBox="0 0 24 32" fill={bookmarkedIds.has(music.id) ? "#A855F7" : "none"} stroke={bookmarkedIds.has(music.id) ? "#A855F7" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2C2.89543 2 2 2.89543 2 4V30L12 24L22 30V4C22 2.89543 21.1046 2 20 2H4Z" />
                      </svg>
                    </div>
                  </div>

                  <span style={{ fontSize: '15px', color: '#A3A3A3' }}>
                    Artist: {music.meta}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Musik tidak ditemukan</div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </Layout>
  )
}
