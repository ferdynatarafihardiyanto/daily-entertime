import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'
import { getAllUsers, createUserAPI, updateUserAPI, deleteUserAPI, getContents } from '../../lib/api'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [contents, setContents] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' })
  const [editFormData, setEditFormData] = useState({ id: '', username: '', email: '', role: 'user' })
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [resUsers, resContents] = await Promise.all([
          getAllUsers(),
          getContents()
        ])
        
        if (resUsers.data) {
          const colors = ['#D97706', '#F472B6', '#6EE7B7', '#3B82F6', '#8B5CF6']
          const formattedUsers = resUsers.data.map((u, i) => {
            const date = new Date(u.joined)
            const joinedStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            return {
              ...u,
              joined: joinedStr,
              color: colors[i % colors.length]
            }
          })
          setUsers(formattedUsers)
        }
        
        if (resContents.data) {
          setContents(resContents.data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      }
    }
    fetchData()
  }, [])

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await createUserAPI(formData)
      alert('Berhasil menambahkan pengguna')
      setIsModalOpen(false)
      setFormData({ username: '', email: '', password: '', role: 'user' })
      // Refresh the page or fetch users again to update list
      window.location.reload()
    } catch (err) {
      alert(err.message || 'Gagal menambahkan pengguna')
    }
  }

  const handleEditClick = (user) => {
    setEditFormData({
      id: user.id,
      username: user.name,
      email: user.email,
      role: user.role
    })
    setIsEditModalOpen(true)
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    try {
      await updateUserAPI(editFormData.id, editFormData)
      alert('Berhasil memperbarui pengguna')
      setIsEditModalOpen(false)
      window.location.reload()
    } catch (err) {
      alert(err.message || 'Gagal memperbarui pengguna')
    }
  }

  const handleDeleteUser = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUserAPI(id)
        alert('Berhasil menghapus pengguna')
        window.location.reload()
      } catch (err) {
        alert(err.message || 'Gagal menghapus pengguna')
      }
    }
  }

  // Calculate totals
  const totalFilm = contents.filter(c => c.category_id === 2).length
  const totalMusik = contents.filter(c => c.category_id === 3).length
  const totalBerita = contents.filter(c => c.category_id === 1).length

  // Generate activities
  const categoryNames = { 1: 'Berita', 2: 'Film', 3: 'Musik' }
  const categoryIcons = { 1: '📰', 2: '🎬', 3: '🎵' }
  const categoryColors = { 1: '#78350F', 2: '#1E3A8A', 3: '#064E3B' }
  
  const activities = [...contents].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(c => {
    const timeDiff = Math.abs(new Date() - new Date(c.created_at))
    const diffHours = Math.floor(timeDiff / (1000 * 60 * 60))
    const diffMins = Math.floor(timeDiff / (1000 * 60))
    let timeAgo = ''
    if (diffHours > 24) {
      timeAgo = Math.floor(diffHours / 24) + ' HARI YANG LALU'
    } else if (diffHours > 0) {
      timeAgo = diffHours + ' JAM YANG LALU'
    } else if (diffMins > 0) {
      timeAgo = diffMins + ' MENIT YANG LALU'
    } else {
      timeAgo = 'BARU SAJA'
    }
    
    return {
      id: c.id,
      text: `${categoryNames[c.category_id] || 'Konten'} "${c.title}" berhasil diunggah oleh admin`,
      time: timeAgo,
      icon: categoryIcons[c.category_id] || '📄',
      color: categoryColors[c.category_id] || '#333'
    }
  })
  
  const recentActivities = activities.slice(0, 3)

  // Pagination for users
  const usersPerPage = 5
  const totalUserPages = Math.ceil(users.length / usersPerPage) || 1
  const paginatedUsers = users.slice((userPage - 1) * usersPerPage, userPage * usersPerPage)

  return (
    <AdminLayout title="Admin Dashboard">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Total Users</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{users.length.toLocaleString('id-ID')}</div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>👥</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Total Film</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{totalFilm}</div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>🎬</span>
            </div>
          </div>
          
          {/* Card 3 */}
          <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Total Musik</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{totalMusik}</div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>🎵</span>
            </div>
          </div>

          {/* Card 4 */}
          <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Total Berita</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{totalBerita}</div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>📰</span>
            </div>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #222' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#A855F7' }}>⏱️</span> Aktivitas Terbaru
            </h3>
            <Link href="/admin/aktivitas" style={{ color: '#A855F7', fontSize: '14px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          <div style={{ padding: '0 20px' }}>
            {recentActivities.length > 0 ? recentActivities.map((act, index) => (
              <div key={act.id} style={{ display: 'flex', gap: '15px', padding: '20px 0', borderBottom: index < recentActivities.length - 1 ? '1px solid #222' : 'none', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{act.icon}</div>
                <div>
                  <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>{act.text}</div>
                  <div style={{ color: '#6B7280', fontSize: '12px' }}>🕒 {act.time}</div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '20px 0', color: '#6B7280', fontSize: '14px' }}>Belum ada aktivitas.</div>
            )}
          </div>
        </div>

        {/* Semua Pengguna Table */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #222' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px' }}>Semua Pengguna ({users.length.toLocaleString('id-ID')})</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: '#A855F7', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Add User
              </button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #222', color: '#9CA3AF', fontSize: '12px', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>PENGGUNA</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>EMAIL</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>BERGABUNG</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>TIPE</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>ROLE</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? paginatedUsers.map((user, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: user.color }}></div>
                    <span style={{ fontWeight: '500' }}>{user.name}</span>
                  </td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{user.email}</td>
                  <td style={{ padding: '15px 20px', color: '#D1D5DB' }}>{user.joined}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      backgroundColor: user.type === 'PREMIUM' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: user.type === 'PREMIUM' ? '#10B981' : '#9CA3AF',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      width: 'fit-content'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.type === 'PREMIUM' ? '#10B981' : '#9CA3AF' }}></span>
                      {user.type}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      backgroundColor: user.role === 'admin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: user.role === 'admin' ? '#A855F7' : '#3B82F6',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEditClick(user)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Hapus">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>Tidak ada pengguna ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', backgroundColor: '#151515' }}>
            <span>Showing {(userPage - 1) * usersPerPage + 1}-{Math.min(userPage * usersPerPage, users.length)} of {users.length.toLocaleString('id-ID')} users</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => setUserPage(p => Math.max(p - 1, 1))}
                disabled={userPage === 1}
                style={{ background: 'transparent', border: '1px solid #333', color: userPage === 1 ? '#555' : '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: userPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
              
              {[...Array(totalUserPages)].map((_, i) => (
                <button 
                  key={i + 1}
                  onClick={() => setUserPage(i + 1)}
                  style={{ background: userPage === i + 1 ? '#A855F7' : 'transparent', border: userPage === i + 1 ? 'none' : '1px solid #333', color: userPage === i + 1 ? 'white' : '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setUserPage(p => Math.min(p + 1, totalUserPages))}
                disabled={userPage === totalUserPages}
                style={{ background: 'transparent', border: '1px solid #333', color: userPage === totalUserPages ? '#555' : '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: userPage === totalUserPages ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', width: '400px', color: 'white' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Tambah Pengguna / Admin</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Username</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Role</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#333', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ background: '#A855F7', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', width: '400px', color: 'white' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Edit Pengguna</h3>
            <form onSubmit={handleEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Username</label>
                <input required type="text" value={editFormData.username} onChange={e => setEditFormData({ ...editFormData, username: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Email</label>
                <input required type="email" value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Role</label>
                <select value={editFormData.role} onChange={e => setEditFormData({ ...editFormData, role: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: 'white', boxSizing: 'border-box' }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ background: '#333', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ background: '#A855F7', border: 'none', color: 'white', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
