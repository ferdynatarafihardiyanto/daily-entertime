import Link from 'next/link'

export default function NewTracks() {
  const tracks = [
    { id: 1, slug: 'nyaman', title: 'Nyaman', artist: 'Amnesd', album: 'Nyaman', time: '4:20', image: '/lagunyaman.svg' },
    { id: 2, slug: 'tak-lagi-sama', title: 'Tak Lagi Sama', artist: 'Rizky Febian', album: 'Tak Lagi Sama', time: '4:14', image: '/lagutaklagisama.svg' },
    { id: 3, slug: 'that-should-be-me', title: 'that should be me', artist: 'Justin Beiber', album: 'Tahat should be me', time: '3:57', image: '/lagujustinbeiber.svg' },
    { id: 4, slug: 'satru', title: 'Satru', artist: 'Deny Caknan', album: 'satru', time: '4:23', image: '/lagusatru.svg' },
  ]

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>New Tracks</h3>
          <Link href="/musik" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 0.5fr 40px', fontSize: '12px', color: '#999', alignItems: 'center' }}>
            <div style={{ paddingLeft: '120px' }}>TITLE</div>
            <div>ARTIST</div>
            <div>ALBUM</div>
            <div style={{ textAlign: 'center' }}>TIME</div>
            <div></div>
          </div>

          {/* Track List */}
          {tracks.map((track) => (
            <div key={track.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 0.5fr 40px', alignItems: 'center', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link href={`/musik/${track.slug}`}>
                  <img src={track.image} alt={track.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }} />
                </Link>
                <Link href={`/musik/${track.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <span style={{ cursor: 'pointer' }}>{track.title}</span>
                </Link>
              </div>
              <div>{track.artist}</div>
              <div>{track.album}</div>
              <div style={{ textAlign: 'center' }}>{track.time}</div>
              <div style={{ textAlign: 'right', color: '#999' }}>♡</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
