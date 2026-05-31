import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getContents, addBookmark } from '../lib/api'

export default function NewTracks() {
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getContents()
        const data = res.data || []
        // Filter Musik (category_id = 3), sort by views descending, take 4
        const topTracks = data
          .filter(item => item.category_id === 3)
          .sort((a, b) => (b.view || 0) - (a.view || 0))
          .map(item => {
            let artist = 'Unknown Artist'
            if (item.description && item.description.includes('Artis:')) {
              artist = item.description.split('\n')[0].replace('Artis: ', '').trim()
            } else if (item.description) {
              artist = item.description.substring(0, 50) + '...'
            }
            return { ...item, artist }
          })
          .slice(0, 4)
        
        setTracks(topTracks)
      } catch (err) {
        console.error('Failed to fetch tracks:', err)
      }
    }
    fetchData()
  }, [])

  const handleBookmark = async (id) => {
    try {
      await addBookmark(id)
      alert("Musik berhasil ditambahkan ke bookmark!")
    } catch (err) {
      if (err.message.includes('Sesi telah berakhir')) {
        alert("Silakan login untuk menambahkan bookmark")
      } else {
        alert("Gagal menambahkan bookmark: " + err.message)
      }
    }
  }

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Lagu Terlaris</h3>
          <Link href="/musik" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', fontSize: '12px', color: '#999', alignItems: 'center' }}>
            <div style={{ paddingLeft: '120px' }}>TITLE</div>
            <div>ARTIST</div>
            <div style={{ textAlign: 'center' }}>TIME</div>
          </div>

          {/* Track List */}
          {tracks.map((track) => (
            <div key={track.id} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', alignItems: 'center', fontSize: '14px', borderBottom: '1px solid #1f1f1f', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link href={`/musik/${track.id}`}>
                  <img src={track.thumbnail || '/lagunyaman.svg'} alt={track.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#000' }} />
                </Link>
                <Link href={`/musik/${track.id}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>{track.title}</span>
                </Link>
              </div>
              <div style={{ color: '#ccc', fontSize: '14px' }}>{track.artist}</div>
              {/* Fake time based on ID so it stays consistent */}
              <div style={{ textAlign: 'center', color: '#ccc' }}>{`3:${(track.id * 17 % 40) + 10}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
