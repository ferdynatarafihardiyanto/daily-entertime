import { useAudio } from '../contexts/AudioContext';

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, stopTrack, seek } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#121212',
      borderTop: '1px solid #333',
      padding: '10px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 9999,
      color: 'white',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.5)'
    }}>
      {/* Left: Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '30%' }}>
        <img src={currentTrack.image} alt={currentTrack.title} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{currentTrack.title}</div>
          <div style={{ color: '#A3A3A3', fontSize: '12px' }}>{currentTrack.artist}</div>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => seek(Math.max(0, currentTime - 10))} style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 20L9 12L19 4V20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 19V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          
          <button onClick={togglePlay} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 17V7M14 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '2px' }}><path d="M8 5V19L19 12L8 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
          
          <button onClick={() => seek(Math.min(duration, currentTime + 10))} style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 4L15 12L5 20V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '11px', color: '#A3A3A3' }}>
          <span>{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime} 
            onChange={(e) => seek(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#A855F7', height: '4px' }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Stop/Close Button */}
      <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={stopTrack} style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', padding: '10px' }} title="Tutup Pemutar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
