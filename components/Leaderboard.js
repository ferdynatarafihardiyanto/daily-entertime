import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents } from '../store/contentSlice'

export default function Leaderboard() {
  const dispatch = useDispatch()
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)
  
  const [films, setFilms] = useState([])

  useEffect(() => {
    if (contentStatus === 'idle') {
      dispatch(fetchContents())
    }
  }, [contentStatus, dispatch])

  useEffect(() => {
    if (contentStatus === 'succeeded' || contentStatus === 'failed') {
      const data = contents || []
      const topFilms = data
        .filter(item => item.category_id === 2)
        .sort((a, b) => (b.view || 0) - (a.view || 0))
        .slice(0, 4)
      
      setFilms(topFilms)
    }
  }, [contents, contentStatus])

  return (
    <div id="leaderboard" style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Leaderboard</h2>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Film Terlaris</h3>
          <Link href="/film" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {films.map((item, index) => (
            <div key={item.id} style={{ position: 'relative' }}>
              <Link href={`/film/${item.id}`}>
                <img src={item.thumbnail || '/filmmiracle.svg'} alt={item.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
              </Link>

              {/* Huge purple number */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-10px',
                fontSize: '120px',
                fontWeight: 'bold',
                color: '#A855F7',
                lineHeight: 1,
                textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                fontFamily: 'impact, sans-serif'
              }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
