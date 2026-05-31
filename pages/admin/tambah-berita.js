import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect, useRef } from 'react'
import { createContent, getContents, deleteContentAPI, updateContentAPI } from '../../lib/api'
import { useRouter } from 'next/router'

export default function TambahBerita() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6
  const [viewItem, setViewItem] = useState(null)

  const [editingId, setEditingId] = useState(null)
  const [judulBaru, setJudulBaru] = useState('')
  const [teksBaru, setTeksBaru] = useState('')
  
  const [thumbnailBase64, setThumbnailBase64] = useState('')
  const [thumbnailFileName, setThumbnailFileName] = useState('')
  const fileInputRef = useRef(null)

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const result = await getContents()
      if (result.data) {
        const mappedNews = result.data
          .filter(item => item.category_id === 1)
          .map(item => ({
            id: item.id,
            title: item.title,
            meta: 'Berita',
            author: 'Admin',
            date: new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            image: item.thumbnail || '/beritarekom1.svg',
            raw: item
          }))
        setNews(mappedNews)
      }
    } catch (err) {
      console.error("Gagal mengambil data berita:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setEditingId(null)
    setJudulBaru('')
    setTeksBaru('')
    setThumbnailBase64('')
    setThumbnailFileName('')
    setShowForm(false)
  }

  const handleEdit = (newsItem) => {
    setEditingId(newsItem.id)
    setJudulBaru(newsItem.raw.title)
    setTeksBaru(newsItem.raw.description || '')
    setThumbnailBase64(newsItem.raw.thumbnail || '')
    setThumbnailFileName(newsItem.raw.thumbnail ? 'Gambar Saat Ini' : '')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await deleteContentAPI(id)
        alert('Berita berhasil dihapus!')
        fetchNews()
      } catch (error) {
        alert('Gagal menghapus berita: ' + error.message)
      }
    }
  }

  const handleUnggah = async () => {
    if (!judulBaru) {
      alert("Judul tidak boleh kosong!");
      return;
    }
    
    try {
      if (editingId) {
        await updateContentAPI(editingId, {
          title: judulBaru,
          description: teksBaru,
          thumbnail: thumbnailBase64 || undefined,
        });
        alert("Berhasil! Berita berhasil diperbarui.");
      } else {
        await createContent({
          title: judulBaru,
          description: teksBaru,
          category_id: 1,
          thumbnail: thumbnailBase64 || '/beritarekom1.svg',
          url: '#',
        });
        alert("Berhasil! Berita berhasil ditambahkan ke database.");
      }
      resetForm();
      fetchNews();
    } catch (err) {
      if (err.message && (err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('sesi'))) {
        alert("Sesi login Anda telah berakhir atau tidak valid. Anda akan diarahkan ke halaman login. Silakan login kembali untuk melanjutkan.");
        import('../../lib/api').then(({ logout }) => logout());
      } else {
        alert("Gagal menyimpan berita: " + (err.message || "Terjadi kesalahan"));
      }
    }
  }

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const displayedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  if (showForm) {
    return (
      <AdminLayout title={`${editingId ? 'Edit' : 'Tambah'} Berita - Admin`}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Judul Berita</label>
              <input type="text" placeholder="Masukan Judul Berita" value={judulBaru} onChange={(e) => setJudulBaru(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Isi Berita / Ringkasan</label>
              <textarea placeholder="Masukan Isi Berita" value={teksBaru} onChange={(e) => setTeksBaru(e.target.value)} rows="6" style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Upload Gambar Berita</label>
              <div style={{ display: 'flex', backgroundColor: '#2A2A2A', borderRadius: '8px', padding: '5px' }}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Pilih File</button>
                <span style={{ padding: '10px', color: '#9CA3AF', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{thumbnailFileName || 'Tidak ada file yang dipilih'}</span>
              </div>
              {thumbnailBase64 && (
                 <img src={thumbnailBase64} alt="Preview" style={{ width: '150px', marginTop: '15px', borderRadius: '8px', objectFit: 'cover' }} />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={resetForm} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Simpan Perubahan' : 'Unggah Berita'}</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Daftar Berita - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Daftar Berita</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Kelola daftar konten berita yang tersedia di platform.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#A855F7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Tambah Berita Baru
          </button>
        </div>

        <div style={{ backgroundColor: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: '8px', padding: '8px 15px', width: '300px' }}>
              <span style={{ color: '#9CA3AF', marginRight: '10px' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Cari berdasarkan judul..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #333', fontSize: '12px' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>JUDUL BERITA</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>TANGGAL DIBUAT</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>PENCIPTA</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat data berita...</td>
                </tr>
              ) : displayedNews.length > 0 ? displayedNews.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{item.date}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{item.author}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      
                      <button onClick={() => setViewItem(item)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>

                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Hapus">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Berita tidak ditemukan dalam database.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {!isLoading && filteredNews.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
              <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredNews.length)} dari {filteredNews.length} Berita</span>
              
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ background: '#2A2A2A', border: 'none', color: currentPage === 1 ? '#555' : '#9CA3AF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', padding: '5px 10px', borderRadius: '4px' }}
                  >
                    Sebelumnya
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{ 
                        background: currentPage === i + 1 ? '#A855F7' : '#2A2A2A', 
                        border: 'none', 
                        color: currentPage === i + 1 ? 'white' : '#9CA3AF', 
                        width: '28px', height: '28px', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{ background: '#2A2A2A', border: 'none', color: currentPage === totalPages ? '#555' : '#9CA3AF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', padding: '5px 10px', borderRadius: '4px' }}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#1A1A1A', padding: '30px', borderRadius: '16px', maxWidth: '700px', width: '100%', color: 'white', position: 'relative', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setViewItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '24px', lineHeight: '1' }}>&times;</button>
              <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', fontSize: '20px' }}>Preview Berita</h2>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                <img src={viewItem.image} alt={viewItem.title} style={{ width: '250px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{viewItem.title}</h3>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '15px', backgroundColor: '#2C2C2E', display: 'inline-block', padding: '4px 12px', borderRadius: '12px' }}>{viewItem.date}</div>
                  <div style={{ color: '#E5E7EB', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewItem.raw.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
