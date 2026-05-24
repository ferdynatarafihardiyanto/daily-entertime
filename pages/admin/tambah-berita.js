import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'

export default function TambahBerita() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [judulBaru, setJudulBaru] = useState('')
  const [teksBaru, setTeksBaru] = useState('')

  const [news, setNews] = useState([
    { id: 1, title: 'Lagi, Giliran Sekretaris Angkatan Laut AS...', meta: 'Berita Utama', author: 'Tim Redaksi', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/beritarekom1.svg' },
    { id: 2, title: 'Fadly Alberto Ungkap Alasan Menyerang...', meta: 'Olahraga', author: 'Reporter Olahraga', date: 'Oct 22, 2023', status: 'DRAFT', image: '/beritarekom2.svg' },
    { id: 3, title: 'Man City Hanya Menang 1-0 Lawan Burnley...', meta: 'Olahraga', author: 'Analis Keuangan', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/beritarekom3.svg' },
    { id: 4, title: 'Kronologi Driver Ojol di Antapani Diduga...', meta: 'Nasional', author: 'Tim Redaksi', date: 'Oct 24, 2023', status: 'PUBLISHED', image: '/beritarekom4.svg' },
  ])

  const handleUnggah = () => {
    if (!judulBaru) {
      alert("Judul tidak boleh kosong!");
      return;
    }
    
    const beritaBaru = {
      id: Date.now(),
      title: judulBaru,
      meta: 'Berita Terbaru',
      author: 'Admin Panel',
      date: 'Hari ini', // Bisa pakai fungsi date() asli
      status: 'PUBLISHED',
      image: '/beritarekom1.svg' // Gambar default sementara
    };

    // Tambahkan ke state urutan teratas
    setNews([beritaBaru, ...news]);
    
    // Reset form dan tutup popup
    setJudulBaru('');
    setTeksBaru('');
    setShowForm(false);
    
    alert("Berhasil! Berita berhasil ditambahkan ke dalam tabel (Mockup)");
  }

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.meta.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (showForm) {
    return (
      <AdminLayout title="Tambah Berita Baru - Admin">
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            Tambah Berita Baru
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Input Judul */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Judul Berita</label>
              <input type="text" placeholder="Masukan Judul berita" value={judulBaru} onChange={(e) => setJudulBaru(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            {/* Input Teks Berita */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Teks Berita</label>
              <textarea placeholder="Masukan Teks Berita" value={teksBaru} onChange={(e) => setTeksBaru(e.target.value)} rows="6" style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            {/* Upload Area */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ border: '1px dashed #555', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '15px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Upload Foto Berita</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={() => setShowForm(false)} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Unggah Berita</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Tambah Berita - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Tambah Berita</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Manage and review your latest news uploads and curate your timeline.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#D8B4FE', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Add New News
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
                placeholder="Search news by title, author, or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>All Status ⌄</button>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>Category ⌄</button>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>Date ⌄</button>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>News Title</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Author</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Date Added</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? filteredNews.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{i + 1}</span>
                    <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.meta}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{item.author}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{item.date}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: item.status === 'PUBLISHED' ? '#4F46E5' : '#374151', 
                      color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                    }}>
                      • {item.status}
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Berita tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
            <span>Showing 1-4 of 124 news</span>
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
