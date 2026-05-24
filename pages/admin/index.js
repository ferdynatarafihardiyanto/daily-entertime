import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const users = [
    { name: 'M. Nata', email: 'm.nata321@gmail.com', joined: '16 Jul 2025', type: 'GRATIS', color: '#D97706' }, // Goldish avatar
    { name: 'Naila Pinky', email: 'naky326@gmail.com', joined: '05 Jan 2025', type: 'PREMIUM', color: '#F472B6' }, // Pinkish avatar
    { name: 'Diky Baskara', email: 'dikara777@gmail.com', joined: '02 Feb 2025', type: 'GRATIS', color: '#6EE7B7' }, // Greenish avatar
  ]

  return (
    <AdminLayout title="Admin Dashboard">
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Top Cards */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Card 1 */}
          <div style={{ flex: 1, backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Total Users</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>1.000</div>
              <div style={{ color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
                ↗ +12%
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>👥</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div style={{ flex: 1, backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Premium Users</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>900</div>
              <div style={{ color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
                ★ +90%
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
            </div>
          </div>
          
          {/* Card 3 */}
          <div style={{ flex: 1, backgroundColor: '#111', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>Revenue</div>
              <div style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>90jt</div>
              <div style={{ color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' }}>
                + Rp 15jt
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>👛</span>
            </div>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #222' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#A855F7' }}>⏱️</span> Aktivitas Terbaru
            </h3>
            <a href="#" style={{ color: '#A855F7', fontSize: '14px', textDecoration: 'none' }}>View All</a>
          </div>
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', gap: '15px', padding: '20px 0', borderBottom: '1px solid #222', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎬</div>
              <div>
                <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Film "JUMBO" berhasil diunggah oleh admin</div>
                <div style={{ color: '#6B7280', fontSize: '12px' }}>🕒 2 MENIT YANG LALU</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', padding: '20px 0', borderBottom: '1px solid #222', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#064E3B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎵</div>
              <div>
                <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Musik "Rahasia Hati" berhasil diunggah oleh admin</div>
                <div style={{ color: '#6B7280', fontSize: '12px' }}>🕒 1 JAM YANG LALU</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', padding: '20px 0', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#78350F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📰</div>
              <div>
                <div style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Berita "IHSG Diproyeksi Rawan Koreksi, 6 Saham Ini Diprediksi Bisa Cuan" berhasil diunggah oleh admin</div>
                <div style={{ color: '#6B7280', fontSize: '12px' }}>🕒 3 JAM YANG LALU</div>
              </div>
            </div>
          </div>
        </div>

        {/* Semua Pengguna Table */}
        <div style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #222' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px' }}>Semua Pengguna (1.000)</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ background: '#222', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Funnel</button>
              <button style={{ background: '#222', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Download</button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #222', color: '#9CA3AF', fontSize: '12px', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>PENGGUNA</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>EMAIL</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>BERGABUNG</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>TIPE</th>
                <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
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
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', color: '#9CA3AF', fontSize: '13px', backgroundColor: '#151515' }}>
            <span>Showing 1-10 of 1,000 users</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button style={{ background: 'transparent', border: '1px solid #333', color: '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Prev</button>
              <button style={{ background: '#A855F7', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>1</button>
              <button style={{ background: 'transparent', border: '1px solid #333', color: '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>2</button>
              <button style={{ background: 'transparent', border: '1px solid #333', color: '#9CA3AF', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
