import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const musicData = {
  'tak-lagi-sama': { title: 'Tak Lagi Sama', artist: 'Rizky Febian', image: '/lagutaklagisama.svg' },
  'nyaman': { title: 'Nyaman', artist: 'Andmesh', image: '/lagunyaman.svg' },
  'that-should-be-me': { title: 'That Should Be Me', artist: 'Justin Bieber', image: '/lagujustinbeiber.svg' },
  'satru': { title: 'Satru', artist: 'Denny Caknan x Happy Asmara', image: '/lagusatru.svg' },
}

export default function MusicDetail() {
  const router = useRouter()
  const { id: slug } = router.query
  const track = musicData[slug] || { title: 'Loading...', artist: '', image: '/lagunyaman.svg' }

  return (
    <Layout title={`${track.title} - Final Project`}>
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Cover Image */}
          <img src={track.image} alt={track.title} style={{ width: '400px', height: '260px', objectFit: 'cover', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />

          {/* Track Info & Bookmark */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>{track.title}</h2>
              <p style={{ margin: 0, fontSize: '16px', color: '#ccc' }}>{track.artist}</p>
            </div>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}>
              <svg width="20" height="28" viewBox="0 0 24 32" fill="white"><path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" /></svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', marginBottom: '30px' }}>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#333', borderRadius: '2px', position: 'relative' }}>
              <div style={{ width: '30%', height: '100%', backgroundColor: 'white', borderRadius: '2px' }}></div>
              <div style={{ width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '-4px', left: '30%', transform: 'translateX(-50%)' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#999' }}>
              <span>00:25</span>
              <span>-4:44</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M19 20L9 12L19 4V20Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M5 19V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button style={{ background: 'transparent', border: '1px solid white', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10 17V7M14 17V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 4L15 12L5 20V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M19 5V19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
