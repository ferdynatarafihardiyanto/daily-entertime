import Layout from '../components/Layout'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { removeBookmark, isLoggedIn } from '../lib/api'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookmarksData, invalidateBookmarks } from '../store/userSlice'

export default function Bookmark() {
  const router = useRouter()
  const dispatch = useDispatch()
  const bookmarks = useSelector((state) => state.user.bookmarks)
  const bookmarksStatus = useSelector((state) => state.user.bookmarksStatus)

  const [bookmarkItems, setBookmarkItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Film')
  const [selectedIds, setSelectedIds] = useState(new Set())
  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false)
      return
    }
    dispatch(fetchBookmarksData())
  }, [dispatch])

  useEffect(() => {
    if (bookmarksStatus === 'idle') {
      if (isLoggedIn()) setLoading(true)
    } else if (bookmarksStatus === 'succeeded' || bookmarksStatus === 'failed') {
      if (bookmarks && bookmarks.length > 0) {
        const categoryNames = { 1: 'Berita', 2: 'Film', 3: 'Musik' }
        const items = bookmarks.map((item) => ({
          id: item.bookmark_id || item.id,
          content_id: item.id,
          title: item.title || 'Untitled',
          type: categoryNames[item.category_id] || item.category || 'Lainnya',
          dateAdded: item.created_at ? new Date(item.created_at).getFullYear().toString() : '2026',
          producer: item.description && item.description.includes('Sutradara:') ? item.description.split('\n')[0].replace('Sutradara: ', '').trim() : (item.description && item.description.includes('Artis:') ? item.description.split('\n')[0].replace('Artis: ', '').trim() : 'N/A'),
          description: item.description ? (item.description.includes('Sinopsis:') ? item.description.split('Sinopsis:')[1].trim() : (item.description.includes('Deskripsi:') ? item.description.split('Deskripsi:')[1].trim() : item.description)).substring(0, 50) + '...' : 'Tidak ada deskripsi',
          image: item.thumbnail || '/beritarekom1.svg',
        }))
        setBookmarkItems(items)
      } else {
        setBookmarkItems([])
      }
      setLoading(false)
    }
  }, [bookmarks, bookmarksStatus])

  const filteredItems = bookmarkItems.filter(item => item.type === activeCategory)

  const toggleSelection = (contentId) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(contentId)) {
      newSelected.delete(contentId)
    } else {
      newSelected.add(contentId)
    }
    setSelectedIds(newSelected)
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Pilih item yang ingin dihapus dengan menceklis kotaknya terlebih dahulu.')
      return
    }

    if (!confirm(`Hapus ${selectedIds.size} item terpilih?`)) return

    try {
      // Create array of promises to delete all selected
      const deletePromises = Array.from(selectedIds).map(contentId => removeBookmark(contentId))
      await Promise.all(deletePromises)
      
      setSelectedIds(new Set())
      dispatch(invalidateBookmarks()) // Refresh Redux state after delete
      alert('Berhasil menghapus item.')
    } catch (err) {
      alert('Gagal menghapus beberapa item: ' + err.message)
    }
  }

  return (
    <Layout title="Bookmark - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        
        {/* Header section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: 'bold' }}>Simpan</h1>
          <p style={{ margin: '0', color: '#9CA3AF', fontSize: '16px' }}>Konten yang kamu simpan</p>
        </div>

        {/* Tab and Delete Button Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
          <div style={{ display: 'flex', backgroundColor: '#1E1E1E', borderRadius: '24px', padding: '4px' }}>
            {['Film', 'Musik', 'Berita'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveCategory(tab)
                  setSelectedIds(new Set()) // clear selection on tab change
                }}
                style={{
                  padding: '8px 32px',
                  backgroundColor: activeCategory === tab ? '#A855F7' : 'transparent',
                  color: activeCategory === tab ? 'white' : '#9CA3AF',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '16px',
                  transition: 'background-color 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button 
            onClick={handleDeleteSelected}
            style={{
              position: 'absolute',
              right: '0',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Hapus
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat bookmark...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Belum ada konten tersimpan di kategori ini</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/${item.type.toLowerCase()}/${item.content_id}`)}
                style={{ display: 'flex', backgroundColor: '#1E1E1E', borderRadius: '12px', overflow: 'hidden', padding: '20px', gap: '24px', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <input 
                  type="checkbox" 
                  checked={selectedIds.has(item.content_id)}
                  onChange={(e) => { e.stopPropagation(); toggleSelection(item.content_id); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#A855F7' }}
                />
                <img src={item.image} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#000' }} />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>{item.title}</h3>
                  <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#374151', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', alignSelf: 'flex-start', color: '#D1D5DB' }}>
                    {item.dateAdded}
                  </div>
                  
                  {activeCategory === 'Berita' ? (
                    <p style={{ margin: 0, fontSize: '14px', color: '#A855F7', fontWeight: 'bold' }}>DESKRIPSI : <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>{item.description}</span></p>
                  ) : (
                    <>
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#A855F7', fontWeight: 'bold', textTransform: 'uppercase' }}>{activeCategory === 'Musik' ? 'ARTIST' : 'PRODUCERS'} : <span style={{ color: '#9CA3AF', fontWeight: 'normal', textTransform: 'none' }}>{item.producer}</span></p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#A855F7', fontWeight: 'bold' }}>DESKRIPSI : <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>{item.description}</span></p>
                    </>
                  )}
                </div>
                
                <div style={{ padding: '0 10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 32" fill="#A855F7" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <Footer />
    </Layout>
  )
}
