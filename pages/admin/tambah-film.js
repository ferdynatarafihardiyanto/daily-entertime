import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect, useRef } from 'react'
import { createContent, deleteContentAPI, updateContentAPI, uploadBase64API } from '../../lib/api'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { fetchContents, invalidateContent } from '../../store/contentSlice'

export default function TambahFilm() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  // Data dari Redux
  const contents = useSelector((state) => state.content.items)
  const contentStatus = useSelector((state) => state.content.status)

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [films, setFilms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6
  const [viewItem, setViewItem] = useState(null)
  const [activePreviewTab, setActivePreviewTab] = useState(0)

  // Form states
  const [editingId, setEditingId] = useState(null)
  const [judulFilm, setJudulFilm] = useState('')
  const [sutradaraFilm, setSutradaraFilm] = useState('')
  const [sinopsis, setSinopsis] = useState('')
  const [servers, setServers] = useState([{ id: 1, name: 'Server 1', link: '' }])
  const [thumbnailBase64, setThumbnailBase64] = useState('')
  const [thumbnailFileName, setThumbnailFileName] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const fileInputRef = useRef(null)

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
        const mappedFilms = contents
          .filter(item => item.category_id === 2 || item.content_type_name === 'Movie')
          .map(item => {
            let sutradara = 'Tidak diketahui'
            if (item.description && item.description.includes('Sutradara:')) {
              sutradara = item.description.split('\nSinopsis: ')[0].replace('Sutradara: ', '').trim()
            }
            
            return {
              id: item.id,
              title: item.title,
              meta: `Film • ${new Date(item.created_at).toLocaleDateString()}`,
              director: sutradara,
              date: new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'PUBLISHED',
              image: item.thumbnail || '/filmagaklain.svg',
              raw: item
            }
          })
        setFilms(mappedFilms)
      }
    }
  }, [contents, contentStatus])

  const handleFileChange = (e) => {
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
  };

  const handleServerChange = (index, value) => {
    const newServers = [...servers]
    newServers[index].link = value
    setServers(newServers)
  }

  const handleServerNameChange = (index, value) => {
    const newServers = [...servers]
    newServers[index].name = value
    setServers(newServers)
  }

  const addServer = () => {
    setServers([...servers, { id: Date.now(), name: `Server ${servers.length + 1}`, link: '' }])
  }

  const removeServer = (index) => {
    const newServers = [...servers]
    newServers.splice(index, 1)
    setServers(newServers)
  }

  const resetForm = () => {
    setEditingId(null)
    setJudulFilm('')
    setSutradaraFilm('')
    setSinopsis('')
    setServers([{ id: 1, name: 'Server 1', link: '' }])
    setThumbnailBase64('')
    setThumbnailFileName('')
    setThumbnailFile(null)
    setShowForm(false)
  }

  const handleEdit = (film) => {
    setEditingId(film.id)
    setJudulFilm(film.raw.title)
    
    // Parse Sutradara & Sinopsis
    let sutradara = ''
    let parsedSinopsis = film.raw.description || ''
    if (film.raw.description && film.raw.description.includes('Sutradara:')) {
       const parts = film.raw.description.split('\nSinopsis: ')
       sutradara = parts[0].replace('Sutradara: ', '').trim()
       if (parts.length > 1) parsedSinopsis = parts[1].trim()
       else parsedSinopsis = ''
    }
    setSutradaraFilm(sutradara)
    setSinopsis(parsedSinopsis)

    // Parse servers
    if (film.raw.url && film.raw.url !== '#') {
      try {
        const parsedUrls = JSON.parse(film.raw.url)
        if (Array.isArray(parsedUrls)) {
          setServers(parsedUrls.map((s, idx) => ({ id: idx + 1, name: s.name || `Server ${idx + 1}`, link: s.link })))
        } else {
          setServers([{ id: 1, name: 'Server 1', link: film.raw.url }])
        }
      } catch (e) {
        setServers([{ id: 1, name: 'Server 1', link: film.raw.url }])
      }
    } else {
      setServers([{ id: 1, name: 'Server 1', link: '' }])
    }

    setThumbnailBase64(film.raw.thumbnail || '')
    setThumbnailFileName(film.raw.thumbnail ? 'Gambar Saat Ini' : '')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      try {
        await deleteContentAPI(id)
        alert('Film berhasil dihapus!')
        dispatch(invalidateContent()) // Force fetch from server
        dispatch(fetchContents())
      } catch (error) {
        alert('Gagal menghapus film: ' + error.message)
      }
    }
  }

  const handleUnggah = async () => {
    if (!judulFilm) {
      alert("Judul film tidak boleh kosong!");
      return;
    }

    const descriptionString = sinopsis ? `Sutradara: ${sutradaraFilm}\nSinopsis: ${sinopsis}` : `Sutradara: ${sutradaraFilm}`;
    const urlString = JSON.stringify(servers.filter(s => s.link.trim() !== '').map((s, idx) => ({ name: s.name || `Server ${idx + 1}`, link: s.link })));

    try {
      const uploadRes = await uploadBase64API(thumbnailBase64, 'movie-poster.jpg');
      if (!uploadRes.success) {
        throw new Error(uploadRes.message || "Gagal mengunggah gambar ke Cloudinary");
      }
      const imageUrl = uploadRes.imageUrl;

      if (editingId) {
        // Edit mode
        await updateContentAPI(editingId, {
          title: judulFilm,
          description: descriptionString,
          thumbnail: imageUrl || undefined, // keep old if not changing
          url: urlString,
        });
        alert("Berhasil! Film berhasil diperbarui.");
      } else {
        // Create mode
    const slug = judulFilm
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    await createContent({
      title: judulFilm,
      slug,
      description: descriptionString,
      contentTypeId: 2,
      thumbnail: imageUrl || "",
      status: "published",
      url: urlString
    });
        alert("Berhasil! Film berhasil ditambahkan ke database.");
      }
      dispatch(invalidateContent());
      dispatch(fetchContents()); // Refresh data from server
      resetForm();
    } catch (err) {
      if (err.message && (err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('sesi'))) {
        alert("Sesi login Anda telah berakhir atau tidak valid. Anda akan diarahkan ke halaman login. Silakan login kembali untuk melanjutkan.");
        import('../../lib/api').then(({ logout }) => logout());
      } else {
        alert("Gagal menyimpan film: " + (err.message || "Terjadi kesalahan"));
      }
    }
  }

  const filteredFilms = films.filter(film => 
    film.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    film.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
    film.meta.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredFilms.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const displayedFilms = filteredFilms.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  if (showForm) {
    return (
      <AdminLayout title={`${editingId ? 'Edit' : 'Tambah'} Film - Admin`}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', backgroundColor: '#1A1A1A', borderRadius: '16px', padding: '40px', border: '1px solid #333' }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', width: 'fit-content', margin: '0 auto 40px auto' }}>
            {editingId ? 'Edit Film' : 'Tambah Film Baru'}
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
              <textarea placeholder="Masukan Sinopsis Film" value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} rows="5" style={{ width: '100%', backgroundColor: '#2A2A2A', border: 'none', padding: '15px 20px', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', resize: 'none' }}></textarea>
            </div>

            {/* Link & Upload Area */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {servers.map((server, index) => (
                  <div key={server.id}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>
                      {server.name || `Server ${index + 1}`} {index === 0 ? '(Utama)' : ''}
                    </label>
                    <div style={{ display: 'flex' }}>
                       <input 
                         type="text" 
                         placeholder={`Nama Server ${index + 1}`} 
                         value={server.name} 
                         onChange={(e) => handleServerNameChange(index, e.target.value)} 
                         style={{ width: '120px', backgroundColor: '#2A2A2A', border: '1px solid #333', padding: '15px 15px', borderRadius: '8px 0 0 8px', color: '#9CA3AF', fontSize: '14px', outline: 'none' }} 
                       />
                       <input type="text" placeholder="Link (https://drive...)" value={server.link} onChange={(e) => handleServerChange(index, e.target.value)} style={{ flex: 1, backgroundColor: '#1A1A1A', border: '1px solid #333', borderLeft: 'none', padding: '15px 20px', borderRadius: index > 0 ? '0' : '0 8px 8px 0', color: 'white', fontSize: '14px', outline: 'none' }} />
                       {index > 0 && (
                         <button type="button" onClick={() => removeServer(index)} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '0 15px', borderRadius: '0 8px 8px 0', cursor: 'pointer', marginLeft: '5px' }}>X</button>
                       )}
                    </div>
                  </div>
                ))}
                
                <button type="button" onClick={addServer} style={{ width: '100%', backgroundColor: 'transparent', border: '1px dashed #A855F7', color: '#A855F7', padding: '15px', borderRadius: '8px', cursor: 'pointer', marginTop: '5px' }}>
                  + Tambah Server Lainnya
                </button>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#E5E7EB', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Upload Poster (Thumbnail)</label>
                <div style={{ display: 'flex', backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', padding: '5px' }}>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  <button type="button" onClick={() => fileInputRef.current.click()} style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Pilih File</button>
                  <span style={{ padding: '10px', color: '#9CA3AF', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{thumbnailFileName || 'Tidak ada file yang dipilih'}</span>
                </div>
                {thumbnailBase64 && thumbnailFileName === 'Gambar Saat Ini' && (
                   <img src={thumbnailBase64} alt="Current Thumbnail" style={{ width: '100%', marginTop: '15px', borderRadius: '8px', objectFit: 'cover' }} />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
              <button onClick={resetForm} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>Batal</button>
              <button onClick={handleUnggah} style={{ backgroundColor: '#A855F7', border: 'none', color: 'white', padding: '12px 30px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Simpan Perubahan' : 'Unggah Film'}</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Kelola Film - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Daftar Film</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Kelola koleksi film, edit data, dan hapus konten yang tidak diperlukan.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            style={{ backgroundColor: '#A855F7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            + Tambah Film Baru
          </button>
        </div>

        {/* Table Container */}
        <div style={{ backgroundColor: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: '8px', padding: '8px 15px', width: '300px' }}>
              <span style={{ color: '#9CA3AF', marginRight: '10px' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Cari film berdasarkan judul..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
              />
            </div>
            {/* <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: '#2A2A2A', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '6px', display: 'flex', gap: '5px' }}>Semua Status ⌄</button>
            </div> */}
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#9CA3AF', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Judul Film</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Tanggal</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Sutradara</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Memuat data film...</td>
                </tr>
              ) : displayedFilms.length > 0 ? displayedFilms.map((film, i) => (
                <tr key={film.id} style={{ borderBottom: '1px solid #333', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={film.image} alt={film.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{film.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{film.meta}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{film.date}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{film.director}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      {/* Edit Button */}
                      <button onClick={() => handleEdit(film)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      
                      {/* View Button */}
                      <button onClick={() => { setViewItem(film); setActivePreviewTab(0); }} style={{ background: 'rgba(34, 197, 94, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button onClick={() => handleDelete(film.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Hapus">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>Film tidak ditemukan dalam database.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {!isLoading && filteredFilms.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', borderTop: '1px solid #333' }}>
              <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredFilms.length)} dari {filteredFilms.length} film</span>
              
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ background: 'transparent', border: 'none', color: currentPage === 1 ? '#555' : '#9CA3AF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      style={{ 
                        background: currentPage === i + 1 ? '#D8B4FE' : 'transparent', 
                        border: 'none', 
                        color: currentPage === i + 1 ? 'black' : '#9CA3AF', 
                        width: '24px', height: '24px', 
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
                    style={{ background: 'transparent', border: 'none', color: currentPage === totalPages ? '#555' : '#9CA3AF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#1A1A1A', padding: '30px', borderRadius: '16px', maxWidth: '800px', width: '100%', color: 'white', position: 'relative', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setViewItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '24px', lineHeight: '1' }}>&times;</button>
              <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', fontSize: '20px' }}>Preview Film</h2>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', marginBottom: '30px' }}>
                <img src={viewItem.image} alt={viewItem.title} style={{ width: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{viewItem.title}</h3>
                  <div style={{ color: '#A855F7', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}>{viewItem.director}</div>
                  <div style={{ color: '#E5E7EB', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewItem.raw.description}</div>
                </div>
              </div>
              
              {/* Video Player */}
              {(() => {
                let servers = []
                if (viewItem.raw.url && viewItem.raw.url !== '#') {
                  try {
                    const parsed = JSON.parse(viewItem.raw.url)
                    if (Array.isArray(parsed)) servers = parsed
                    else servers = [{ name: 'Server 1', link: viewItem.raw.url }]
                  } catch (e) {
                    servers = [{ name: 'Server 1', link: viewItem.raw.url }]
                  }
                }
                const getEmbedLink = (url) => {
                  if (!url) return ''
                  if (url.includes('drive.google.com') && url.includes('/view')) return url.replace('/view', '/preview')
                  return url
                }
                const currentServerLink = servers.length > 0 ? getEmbedLink(servers[activePreviewTab]?.link) : ''
                
                return (
                  <div style={{ backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                    {/* Server Tabs */}
                    {servers.length > 0 && (
                      <div style={{ padding: '15px 20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid #333' }}>
                         {servers.map((server, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setActivePreviewTab(idx)}
                             style={{ 
                               backgroundColor: activePreviewTab === idx ? '#A855F7' : 'transparent', 
                               color: activePreviewTab === idx ? 'white' : '#9CA3AF', 
                               border: activePreviewTab === idx ? 'none' : '1px solid #333', 
                               padding: '6px 16px', 
                               borderRadius: '8px', 
                               cursor: 'pointer', 
                               fontWeight: 'bold',
                               fontSize: '13px'
                             }}
                           >
                             {server.name || `Server ${idx + 1}`}
                           </button>
                         ))}
                      </div>
                    )}
                    
                    {currentServerLink ? (
                      <iframe src={currentServerLink} width="100%" height="450px" style={{ border: 'none' }} allowFullScreen />
                    ) : (
                      <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9CA3AF' }}>Video belum tersedia</div>
                    )}
                  </div>
                )
              })()}

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
