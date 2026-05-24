import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'

export default function TambahFilm() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [judulFilm, setJudulFilm] = useState('')
  const [sutradaraFilm, setSutradaraFilm] = useState('')

  const [films, setFilms] = useState([
    { id: 1, title: 'Miracle in Cell No. 7', meta: 'Drama, Family • 145 MIN', director: 'Hanung Bramantyo', date: 'Sep 08, 2022', status: 'PUBLISHED', image: '/filmmiracle.svg' },
    { id: 2, title: 'Ipar Adalah Maut', meta: 'Drama • 120 MIN', director: 'Hanung Bramantyo', date: 'May 16, 2024', status: 'PUBLISHED', image: '/filmiparadalahmaut.svg' },
    { id: 3, title: 'Danur: I Can See Ghosts', meta: 'Horror • 78 MIN', director: 'Awi Suryadi', date: 'Mar 30, 2017', status: 'PUBLISHED', image: '/filmdanur.svg' },
    { id: 4, title: 'Agak Laen', meta: 'Comedy, Horror • 119 MIN', director: 'Muhadkly Acho', date: 'Feb 01, 2024', status: 'PUBLISHED', image: '/filmagaklain.svg' },
  ])

  const handleUnggah = () => {
    if (!judulFilm) {
      alert("Judul film tidak boleh kosong!");
      return;
    }
    const filmBaru = {
      id: Date.now(),
      title: judulFilm,
      meta: 'Kategori Baru • 100 MIN',
      director: sutradaraFilm || 'Admin',
      date: 'Hari ini',
      status: 'PUBLISHED',
      image: '/filmmiracle.svg'
    };
    setFilms([filmBaru, ...films]);
    setJudulFilm('');
    setSutradaraFilm('');
    setShowForm(false);
  }

  const filteredFilms = films.filter(film => 
    film.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
    film.meta.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (showForm) {
    return (
      <AdminLayout title="Tambah Film Baru - Admin">
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            Tambah Film Baru
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Input Judul */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Judul Film</label>
              <input type="text" placeholder="Masukan Judul Film" value={judulFilm} onChange={(e) => setJudulFilm(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            {/* Input Sutradara */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Sutradara Film</label>
              <input type="text" placeholder="Masukan Nama Sutradara Film" value={sutradaraFilm} onChange={(e) => setSutradaraFilm(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            {/* Input Sinopsis */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Sinopsis Film</label>
              <textarea placeholder="Masukan Sinopsis Film" rows="5" style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            {/* Upload Area */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ flex: 1, border: '1px dashed #555', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '15px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Upload File Vidio</span>
              </div>
              <div style={{ flex: 1, border: '1px dashed #555', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '15px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Upload Poster Film</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={() => setShowForm(false)} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Unggah Film</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Tambah Film - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Tambah Film</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Manage and review your latest cinema uploads and curate your library.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#D8B4FE', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Add New Film
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
                placeholder="Search films by title, director, or genre..." 
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
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Film Title</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Director</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Date Added</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFilms.length > 0 ? filteredFilms.map((film, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{i + 1}</span>
                    <img src={film.image} alt={film.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{film.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{film.meta}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{film.director}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{film.date}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: film.status === 'PUBLISHED' ? '#4F46E5' : '#374151', 
                      color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                    }}>
                      • {film.status}
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Film tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
            <span>Showing 1-4 of 124 films</span>
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
