export default function HeroSection() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '750px', backgroundColor: 'black' }}>

      {/* Left Panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img src="/filmaboutyou.svg" alt="The 1975" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
        {/* Overlay for media player */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px', color: 'white' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#ccc' }}>1975</p>
          <h3 style={{ margin: 0, fontSize: '24px' }}>About You</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>The 1975</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontSize: '12px' }}>5:13</span>
            <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '30%', backgroundColor: 'white', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img src="/digital.svg" alt="News" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* Explore Button */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#A855F7', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            Explore Now
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img src="/filmtoystory.svg" alt="Toy Story 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

    </div>
  )
}
