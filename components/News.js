import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents } from '../store/contentSlice'

export default function News() {
  const dispatch = useDispatch()
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [newsList, setNewsList] = useState([])

  useEffect(() => {
    if (contentStatus === 'idle') {
      dispatch(fetchContents())
    }
  }, [contentStatus, dispatch])

  useEffect(() => {
    if (contentStatus === 'succeeded' || contentStatus === 'failed') {
      const data = contents || []
      const latestNews = data
        .filter(item => item.category_id === 1)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 4)
      
      setNewsList(latestNews)
    }
  }, [contents, contentStatus])

  const getTimeAgo = (dateString) => {
    if (!dateString) return ''
    const diffMs = new Date() - new Date(dateString)
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 24 && diffHours > 0) return `${diffHours} jam lalu`
    if (diffHours === 0) return 'Baru saja'
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} hari lalu`
  }

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Berita Terbaru</h3>
          <Link href="/berita" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {newsList.map((news) => (
            <div key={news.id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link href={`/berita/${news.id}`}>
                <img src={news.thumbnail || '/beritarekom1.svg'} alt={news.title} style={{ width: '240px', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
              </Link>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#A855F7' }}>{news.genre || 'Nasional'}</span>
                <Link href={`/berita/${news.id}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', lineHeight: '1.4', cursor: 'pointer' }}>{news.title}</h4>
                </Link>
                <span style={{ fontSize: '12px', color: '#999' }}>News • {getTimeAgo(news.created_at)} • {news.view || 0} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
