import Layout from '../components/Layout'
import Footer from '../components/Footer'

export default function Bookmark() {
  const bookmarkItems = [
    { id: 1, title: 'Tak Lagi Sama', type: 'Musik', dateAdded: '12 Nov 2026', image: '/lagutaklagisama.svg' },
    { id: 2, title: 'Agak Laen', type: 'Film', dateAdded: '10 Nov 2026', image: '/filmagaklain.svg' },
    { id: 3, title: 'Man City Hanya Menang 1-0 Lawan Burnley', type: 'Berita', dateAdded: '8 Nov 2026', image: '/beritarekom2.svg' },
  ]

  return (
    <Layout title="Bookmark - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <h1 style={{ margin: '0 0 30px 0', fontSize: '32px' }}>
          Bookmark Anda
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', fontSize: '12px', color: '#999', alignItems: 'center' }}>
            <div style={{ paddingLeft: '120px' }}>JUDUL</div>
            <div>KATEGORI</div>
            <div style={{ textAlign: 'center' }}>DITAMBAHKAN PADA</div>
            <div></div>
          </div>

          {/* List */}
          {bookmarkItems.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', alignItems: 'center', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={item.image} alt={item.title} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <span>{item.title}</span>
              </div>
              <div>{item.type}</div>
              <div style={{ textAlign: 'center' }}>{item.dateAdded}</div>
              <div style={{ textAlign: 'right', color: '#A855F7' }}>♥</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Layout>
  )
}
