import Layout from '../components/Layout'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { removeHistory, isLoggedIn } from '../lib/api'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { fetchHistoryData, invalidateHistory } from '../store/userSlice'
import { useToast } from '../contexts/ToastContext'

export default function History() {
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()
  const historyData = useSelector((state) => state.user.history)
  const historyStatus = useSelector((state) => state.user.historyStatus)

  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Film')
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false)
      return
    }
    dispatch(invalidateHistory())
    dispatch(fetchHistoryData())
  }, [dispatch])

  useEffect(() => {
    if (historyStatus === 'idle') {
      if (isLoggedIn()) setLoading(true)
    } else if (historyStatus === 'succeeded' || historyStatus === 'failed') {
      if (historyData && historyData.length > 0) {
        const typeMap = {
            News: 'Berita',
            Movie: 'Film',
            Music: 'Musik'
          }
        const items = historyData.map((item) => ({
          id: item.history_id || item.id,
          content_id: item.content_id || item.id,
          title: item.title || 'Untitled',
          type: typeMap[item.content_type_name] || 'Lainnya',
          dateAdded: item.viewed_at ? new Date(item.viewed_at).getFullYear().toString() : '2026',
          producer: item.description && item.description.includes('Sutradara:') ? item.description.split('\n')[0].replace('Sutradara: ', '').trim() : (item.description && item.description.includes('Artis:') ? item.description.split('\n')[0].replace('Artis: ', '').trim() : 'N/A'),
          description: item.description ? (item.description.includes('Sinopsis:') ? item.description.split('Sinopsis:')[1].trim() : (item.description.includes('Deskripsi:') ? item.description.split('Deskripsi:')[1].trim() : item.description)).substring(0, 50) + '...' : 'Tidak ada deskripsi',
          image: item.thumbnail || '/filmmiracle.svg',
        }))
        setHistoryItems(items)
      } else {
        setHistoryItems([])
      }
      setLoading(false)
    }
  }, [historyData, historyStatus])

  const filteredItems = historyItems.filter(item => item.type === activeCategory)

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
      toast.warning('Pilih item yang ingin dihapus dengan menceklis kotaknya terlebih dahulu.')
      return
    }

    if (!confirm(`Hapus ${selectedIds.size} item riwayat terpilih?`)) return

    try {
      setLoading(true)
      const deletePromises = Array.from(selectedIds).map(contentId => removeHistory(contentId))
      await Promise.all(deletePromises)
      
      setSelectedIds(new Set())
      toast.success('Berhasil menghapus item.')
      await dispatch(fetchHistoryData()).unwrap()
    } catch (err) {
      toast.error('Gagal menghapus beberapa item: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Riwayat - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        
        {/* Header section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', fontWeight: 'bold' }}>Riwayat</h1>
          <p style={{ margin: '0', color: '#9CA3AF', fontSize: '16px' }}>Riwayat konten yang terakhir kamu lihat</p>
        </div>

        {/* Tab and Delete Button Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', position: 'relative' }}>
          <div style={{ display: 'flex', backgroundColor: '#1E1E1E', borderRadius: '24px', padding: '4px' }}>
            {['Film', 'Musik', 'Berita'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveCategory(tab)
                  setSelectedIds(new Set())
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
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat riwayat...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Belum ada riwayat konten di kategori ini</div>
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
                  {/* Eye icon instead of Bookmark for History? Or keep same layout. The user said "2 ui ini sama cuma beda fungsi" so I'll keep the same layout, maybe a clock icon instead of bookmark for history */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
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
