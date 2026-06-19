import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { getContentById, addBookmark, trackHistory, isLoggedIn } from '../../lib/api'
import { useAudio } from '../../contexts/AudioContext'
import { useSelector } from 'react-redux'
import { useToast } from '../../contexts/ToastContext'

export default function MusicDetail() {
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const contents = useSelector((state) => state.content.items)
  
  // Use Global Audio Context
  const { currentTrack, isPlaying, currentTime, duration, playTrack, togglePlay, seek, nextTrack, previousTrack, playlist } = useAudio()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    if (!id) return

    // Coba ambil dari cache Redux dulu
    const cachedTrack = contents.find(item => item.id.toString() === id)
    if (cachedTrack && !track) {
      let artist = 'Tidak diketahui'
      let lyrics = ''
      if (cachedTrack.description) {
        if (cachedTrack.description.includes('Artis:')) {
          const parts = cachedTrack.description.split('\n')
          artist = parts[0].replace('Artis: ', '').trim()
          if (parts.length > 1) {
            lyrics = parts.slice(1).join('\n').replace('Deskripsi: ', '').trim()
          }
        } else {
          lyrics = cachedTrack.description
        }
      }

      setTrack({
        id: cachedTrack.id,
        title: cachedTrack.title,
        artist: artist,
        lyrics: lyrics,
        image: cachedTrack.thumbnail || '/lagunyaman.svg',
        audioUrl: cachedTrack.url !== '#' ? cachedTrack.url : ''
      })
      setLoading(false)
    }

    async function fetchMusic() {
      try {
        const result = await getContentById(id)
        if (result.data) {
          let artist = 'Tidak diketahui'
          let lyrics = ''
          if (result.data.description) {
            if (result.data.description.includes('Artis:')) {
              const parts = result.data.description.split('\n')
              artist = parts[0].replace('Artis: ', '').trim()
              if (parts.length > 1) {
                lyrics = parts.slice(1).join('\n').replace('Deskripsi: ', '').trim()
              }
            } else {
              lyrics = result.data.description
            }
          }

          setTrack({
            id: result.data.id,
            title: result.data.title,
            artist: artist,
            lyrics: lyrics,
            image: result.data.thumbnail || '/lagunyaman.svg',
            audioUrl: result.data.url !== '#' ? result.data.url : ''
          })
          
          if (isLoggedIn()) {
            trackHistory(result.data.id).catch(err => console.error('Failed to track history', err))
          }
        } else {
          setError('Musik tidak ditemukan')
        }
      } catch (err) {
        setError('Gagal memuat musik')
      } finally {
        setLoading(false)
      }
    }
    fetchMusic()
  }, [id])

  // Auto-play when entering the page
  useEffect(() => {
    if (track && track.audioUrl) {
      if (!currentTrack || currentTrack.id !== track.id) {
        playTrack(track);
      }
    }
  }, [track]) // Only run when track data is successfully loaded

  // Redirect to new track page if track is changed (e.g. from GlobalPlayer next/prev)
  useEffect(() => {
    if (currentTrack && track && track.id !== currentTrack.id) {
      router.replace(`/musik/${currentTrack.id}`);
    }
  }, [currentTrack, track, router]);

  const handlePlayClick = () => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleBookmark = async () => {
    if (!track) return
    try {
      await addBookmark(track.id)
      toast.success("Musik berhasil ditambahkan ke bookmark!")
    } catch (err) {
      if (err.message.includes('Sesi telah berakhir')) {
        toast.warning("Silakan login untuk menambahkan bookmark")
      } else {
        toast.error("Gagal menambahkan bookmark: " + err.message)
      }
    }
  }

  if (loading) return <Layout title="Memuat..."><div style={{ minHeight: '80vh', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat musik...</div></Layout>
  if (error || !track) return <Layout title="Error"><div style={{ minHeight: '80vh', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error || 'Musik tidak ditemukan'}</div></Layout>

  // Sync state if this is the currently playing track
  const isThisTrackPlaying = currentTrack && currentTrack.id === track.id && isPlaying;
  const displayCurrentTime = currentTrack && currentTrack.id === track.id ? currentTime : 0;
  const displayDuration = currentTrack && currentTrack.id === track.id ? duration : 0;

  return (
    <Layout title={`${track.title} - Final Project`}>
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white', paddingBottom: '120px' }}>
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
            <button onClick={handleBookmark} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}>
              <svg width="20" height="28" viewBox="0 0 24 32" fill="white"><path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" /></svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="range" 
              min="0" 
              max={displayDuration || 100} 
              value={displayCurrentTime} 
              onChange={(e) => {
                if (currentTrack && currentTrack.id === track.id) {
                  seek(Number(e.target.value));
                }
              }}
              disabled={!track.audioUrl || (currentTrack && currentTrack.id !== track.id)}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: '#A855F7'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
              <span>{formatTime(displayCurrentTime)}</span>
              <span>{formatTime(displayDuration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <button disabled={!track.audioUrl} onClick={previousTrack} style={{ background: 'transparent', border: 'none', cursor: track.audioUrl ? 'pointer' : 'not-allowed', opacity: track.audioUrl ? 1 : 0.5 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M19 20L9 12L19 4V20Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M5 19V5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              disabled={!track.audioUrl}
              onClick={handlePlayClick} 
              style={{ background: 'transparent', border: '1px solid white', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: track.audioUrl ? 'pointer' : 'not-allowed', opacity: track.audioUrl ? 1 : 0.5 }}
            >
              {isThisTrackPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 17V7M14 17V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '4px' }}>
                  <path d="M8 5V19L19 12L8 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <button disabled={!track.audioUrl} onClick={nextTrack} style={{ background: 'transparent', border: 'none', cursor: track.audioUrl ? 'pointer' : 'not-allowed', opacity: track.audioUrl ? 1 : 0.5 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 4L15 12L5 20V4Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M19 5V19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          {!track.audioUrl && (
            <p style={{ color: '#EF4444', marginTop: '20px', fontSize: '14px' }}>File audio belum diunggah untuk musik ini.</p>
          )}

          {/* Lyrics Section */}
          {track.lyrics && (
            <div style={{ 
              width: '100%', 
              marginTop: '50px', 
              backgroundColor: '#1A1A1A', 
              borderRadius: '16px', 
              padding: '30px',
              boxSizing: 'border-box'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Lirik</h3>
              <div style={{ 
                color: '#D1D5DB', 
                fontSize: '16px', 
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                fontWeight: '500'
              }}>
                {track.lyrics}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
