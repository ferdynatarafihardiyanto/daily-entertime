import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect, useRef } from 'react'
import { createContent, deleteContentAPI, updateContentAPI, uploadBase64API } from '../../lib/api'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents, invalidateContent } from '../../store/contentSlice'
import { useToast } from '../../contexts/ToastContext'

export default function TambahMusik() {
  const router = useRouter()
  const dispatch = useDispatch()
  const toast = useToast()
  
  // Data dari Redux
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [musics, setMusics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6
  const [viewItem, setViewItem] = useState(null)

  // Form states
  const [editingId, setEditingId] = useState(null)
  const [judulMusik, setJudulMusik] = useState('')
  const [penyanyiMusik, setPenyanyiMusik] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  
  // File inputs
  const [audioBase64, setAudioBase64] = useState('')
  const [audioFileName, setAudioFileName] = useState('')
  const [thumbnailBase64, setThumbnailBase64] = useState('')
  const [thumbnailFileName, setThumbnailFileName] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  
  const audioInputRef = useRef(null)
  const coverInputRef = useRef(null)

  useEffect(() => {
    if (contentStatus === 'idle') {
      dispatch(fetchContents())
    }
  }, [contentStatus, dispatch])

  useEffect(() => {
    if (contentStatus === 'loading' || contentStatus === 'idle') {
      setIsLoading(true)
    } else {
      setIsLoading(false)
      if (contents) {
        const mappedMusics = contents
          .filter(item => item.category_id === 3 || item.content_type_name === 'Music')
          .map(item => {
            let artist = 'Tidak diketahui'
            if (item.description && item.description.includes('Artis:')) {
              artist = item.description.split('\n')[0].replace('Artis: ', '').trim()
            }
            
            return {
              id: item.id,
              title: item.title,
              meta: `Musik • ${new Date(item.created_at).toLocaleDateString()}`,
              artist: artist,
              date: new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'PUBLISHED',
              image: item.thumbnail || '/lagutaklagisama.svg',
              raw: item
            }
          })
        setMusics(mappedMusics)
      }
    }
  }, [contents, contentStatus])

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setJudulMusik('')
    setPenyanyiMusik('')
    setDeskripsi('')
    setAudioBase64('')
    setAudioFileName('')
    setThumbnailBase64('')
    setThumbnailFileName('')
    setThumbnailFile(null)
    setShowForm(false)
  }

  const handleEdit = (music) => {
    setEditingId(music.id)
    setJudulMusik(music.raw.title)
    
    let artist = ''
    let parsedDeskripsi = music.raw.description || ''
    if (music.raw.description && music.raw.description.includes('Artis:')) {
       const parts = music.raw.description.split('\n')
       artist = parts[0].replace('Artis: ', '').trim()
       if (parts.length > 1) {
         parsedDeskripsi = parts.slice(1).join('\n').replace('Deskripsi: ', '').trim()
       } else {
         parsedDeskripsi = ''
       }
    }
    setPenyanyiMusik(artist)
    setDeskripsi(parsedDeskripsi)

    setAudioBase64(music.raw.url || '')
    setAudioFileName(music.raw.url && music.raw.url.length > 10 ? 'Audio Saat Ini' : '')
    setThumbnailBase64(music.raw.thumbnail || '')
    setThumbnailFileName(music.raw.thumbnail ? 'Cover Saat Ini' : '')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus musik ini?')) {
      try {
        await deleteContentAPI(id)
        toast.success('Musik berhasil dihapus!')
        dispatch(invalidateContent())
        dispatch(fetchContents())
      } catch (error) {
        toast.error('Gagal menghapus musik: ' + error.message)
      }
    }
  }

  const handleUnggah = async () => {
    if (!judulMusik) {
      toast.warning("Judul musik tidak boleh kosong!");
      return;
    }

    const descriptionString = deskripsi ? `Artis: ${penyanyiMusik}\nDeskripsi: ${deskripsi}` : `Artis: ${penyanyiMusik}`;
    
    try {
      // 1. Unggah gambar cover ke Cloudinary jika baru/base64
      const coverRes = await uploadBase64API(thumbnailBase64, 'music-cover.jpg');
      if (!coverRes.success) {
        throw new Error(coverRes.message || "Gagal mengunggah cover album ke Cloudinary");
      }
      const imageUrl = coverRes.imageUrl;

      // 2. Unggah file audio ke Cloudinary jika baru/base64
      const audioRes = await uploadBase64API(audioBase64, 'music-audio.mp3');
      if (!audioRes.success) {
        throw new Error(audioRes.message || "Gagal mengunggah file audio ke Cloudinary");
      }
      const audioUrl = audioRes.imageUrl;

      if (editingId) {
        await updateContentAPI(editingId, {
          title: judulMusik,
          description: descriptionString,
          thumbnail: imageUrl || undefined,
          url: audioUrl || undefined,
        });
        toast.success("Berhasil! Musik berhasil diperbarui.");
      } else {
        const slug = judulMusik
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");

        await createContent({
          title: judulMusik,
          slug,
          description: descriptionString,
          contentTypeId: 1,
          thumbnail: imageUrl || '/lagutaklagisama.svg',
          url: audioUrl || '#',
          status: "published"
        });
        toast.success("Berhasil! Musik berhasil ditambahkan ke database.");
      }
      dispatch(invalidateContent())
      dispatch(fetchContents())
      resetForm();
    } catch (err) {
      if (err.message && (err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('sesi'))) {
        toast.error("Sesi login Anda telah berakhir atau tidak valid. Anda akan diarahkan ke halaman login. Silakan login kembali untuk melanjutkan.");
        import('../../lib/api').then(({ logout }) => logout());
      } else {
        toast.error("Gagal menyimpan musik: " + (err.message || "Terjadi kesalahan"));
      }
    }
  }

  const filteredMusics = musics.filter(music => 
    music.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    music.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredMusics.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const displayedMusics = filteredMusics.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  if (showForm) {
    return (
      <AdminLayout title={`${editingId ? 'Edit' : 'Tambah'} Musik - Admin`}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            {editingId ? 'Edit Musik' : 'Tambah Musik Baru'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Judul Lagu</label>
              <input type="text" placeholder="Masukan Judul Lagu" value={judulMusik} onChange={(e) => setJudulMusik(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Nama Artis / Band</label>
              <input type="text" placeholder="Masukan Nama Artis" value={penyanyiMusik} onChange={(e) => setPenyanyiMusik(e.target.value)} style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Deskripsi / Lirik</label>
              <textarea placeholder="Masukan Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows="5" style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
              {/* Upload Audio */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Upload Audio (.mp3)</label>
                <div style={{ display: 'flex', backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', padding: '5px' }}>
                  <input type="file" accept="audio/mp3,audio/mpeg" ref={audioInputRef} onChange={handleAudioChange} style={{ display: 'none' }} />
                  <button type="button" onClick={() => audioInputRef.current.click()} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Pilih File</button>
                  <span style={{ padding: '10px', color: '#9CA3AF', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{audioFileName || 'Tidak ada file yang dipilih'}</span>
                </div>
                {audioBase64 && audioBase64.startsWith('data:audio') && (
                  <audio controls src={audioBase64} style={{ width: '100%', marginTop: '10px', height: '35px' }} />
                )}
              </div>

              {/* Upload Cover */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Upload Cover Album</label>
                <div style={{ display: 'flex', backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', padding: '5px' }}>
                  <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverChange} style={{ display: 'none' }} />
                  <button type="button" onClick={() => coverInputRef.current.click()} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Pilih File</button>
                  <span style={{ padding: '10px', color: '#9CA3AF', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thumbnailFileName || 'Tidak ada file yang dipilih'}</span>
                </div>
                {thumbnailBase64 && thumbnailFileName === 'Cover Saat Ini' && (
                   <img src={thumbnailBase64} alt="Current Cover" style={{ width: '100px', height: '100px', marginTop: '15px', borderRadius: '8px', objectFit: 'cover' }} />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={resetForm} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Simpan Perubahan' : 'Unggah Musik'}</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Daftar Musik - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Daftar Musik</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Kelola daftar konten musik yang tersedia di platform.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#A855F7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Tambah Musik Baru
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
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>JUDUL MUSIK</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>TANGGAL DIBUAT</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px' }}>PENCIPTA</th>
                <th style={{ padding: '15px 20px', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat data musik...</td>
                </tr>
              ) : displayedMusics.length > 0 ? displayedMusics.map((music) => (
                <tr key={music.id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={music.image} alt={music.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ fontWeight: 'bold' }}>{music.title}</div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{music.date}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{music.artist}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(music)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      
                      <button onClick={() => setViewItem(music)} style={{ background: 'rgba(34, 197, 94, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>

                      <button onClick={() => handleDelete(music.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Hapus">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Musik tidak ditemukan dalam database.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {!isLoading && filteredMusics.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
              <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredMusics.length)} dari {filteredMusics.length} Musik</span>
              
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
              <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', fontSize: '20px' }}>Preview Musik</h2>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                <img src={viewItem.image} alt={viewItem.title} style={{ width: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{viewItem.title}</h3>
                  <div style={{ color: '#A855F7', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}>{viewItem.artist}</div>
                  <div style={{ color: '#E5E7EB', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewItem.raw.description}</div>
                  {viewItem.raw.url && viewItem.raw.url.length > 10 && (
                    <audio controls src={viewItem.raw.url} style={{ width: '100%', marginTop: '20px', height: '40px' }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
