import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'

export default function TambahMusik() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [judulMusik, setJudulMusik] = useState('')
  const [penyanyiMusik, setPenyanyiMusik] = useState('')

  const [musics, setMusics] = useState([
    { id: 1, title: 'Tak Lagi Sama', meta: 'POP • 4:12', artist: 'Rizky Febian', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/lagutaklagisama.svg' },
    { id: 2, title: 'Nyaman', meta: 'POP • 3:45', artist: 'Andmesh', date: 'Oct 22, 2023', status: 'DRAFT', image: '/lagunyaman.svg' },
    { id: 3, title: 'That Should Be Me', meta: 'POP • 3:52', artist: 'Justin Bieber', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/lagujustinbeiber.svg' },
    { id: 4, title: 'Satru', meta: 'DANGDUT • 4:30', artist: 'Denny Caknan', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/lagusatru.svg' },
  ])

  const handleUnggah = () => {
    if (!judulMusik) {
      alert("Judul musik tidak boleh kosong!");
      return;
    }
    const musikBaru = {
      id: Date.now(),
      title: judulMusik,
      meta: 'GENRE BARU • 3:00',
      artist: penyanyiMusik || 'Admin',
      date: 'Hari ini',
      status: 'PUBLISHED',
      image: '/lagutaklagisama.svg'
    };
    setMusics([musikBaru, ...musics]);
    setJudulMusik('');
    setPenyanyiMusik('');
    setShowForm(false);
  }

  const filteredMusics = musics.filter(music => 
    music.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    music.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (showForm) {
    return (
      <AdminLayout title="Tambah Musik Baru - Admin">
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            Tambah Musik Baru
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Input Judul */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Judul Musik</label>
              <input type="text" placeholder="Masukan Judul Musik" value={judulMusik} onChange={(e) => setJudulMusik(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            {/* Input Penyanyi */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Penyanyi Lagu</label>
              <input type="text" placeholder="Masukan Nama Penyanyi Lagu" value={penyanyiMusik} onChange={(e) => setPenyanyiMusik(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            {/* Upload Area */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ flex: 1, border: '1px dashed #555', borderRadius: '12px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '15px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Upload Audio Musik</span>
              </div>
              <div style={{ flex: 1, border: '1px dashed #555', borderRadius: '12px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '15px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Upload Poster Album</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={() => setShowForm(false)} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Unggah Musik</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Tambah Musik - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Tambah Musik</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Manage and review your latest music uploads and curate your library.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#D8B4FE', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Add New Music
          </button>
        </div>

        {/* Table Container */}
        <div style={{ backgroundColor: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: '8px', padding: '8px 15px', width: '300px' }}>
              <span style={{ color: '#9CA3AF', marginRight: '10px' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search music by title, artist, or genre..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>All Status ⌄</button>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>Genre ⌄</button>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>Date ⌄</button>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Music Title</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Artist</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Date Added</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMusics.length > 0 ? filteredMusics.map((music, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{i + 1}</span>
                    <img src={music.image} alt={music.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{music.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{music.meta}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{music.artist}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{music.date}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: music.status === 'PUBLISHED' ? '#4F46E5' : '#374151', 
                      color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                    }}>
                      • {music.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <span style={{ cursor: 'pointer' }}>✏️</span>
                      <span style={{ cursor: 'pointer' }}>👁️</span>
                      <span style={{ cursor: 'pointer' }}>🗑️</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Musik tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
            <span>Showing 1-4 of 124 musics</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>&lt;</button>
              <button style={{ background: '#D8B4FE', border: 'none', color: 'black', width: '24px', height: '24px', borderRadius: '4px', fontWeight: 'bold' }}>1</button>
              <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>2</button>
              <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>3</button>
              <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>&gt;</button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
