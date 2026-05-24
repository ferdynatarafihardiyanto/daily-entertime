import Layout from '../components/Layout'
import Footer from '../components/Footer'

export default function History() {
  const historyItems = [
    { id: 1, title: 'Miracle in Cell No.7', type: 'Film', time: 'Hari ini', image: '/filmmiracle.svg' },
    { id: 2, title: 'Nyaman', type: 'Musik', time: 'Kemarin', image: '/lagunyaman.svg' },
    { id: 3, title: 'Lagi, Giliran Sekretaris Angkatan Laut AS dipecat', type: 'Berita', time: 'Kemarin', image: '/beritarekom1.svg' },
    { id: 4, title: 'Toy Story 3', type: 'Film', time: '2 hari lalu', image: '/filmtoystory.svg' },
  ]

  return (
    <Layout title="History - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <h1 style={{ margin: '0 0 30px 0', fontSize: '32px' }}>
          History Anda
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', fontSize: '12px', color: '#999', alignItems: 'center' }}>
            <div style={{ paddingLeft: '120px' }}>JUDUL</div>
            <div>KATEGORI</div>
            <div style={{ textAlign: 'center' }}>WAKTU</div>
            <div></div>
          </div>

          {/* List */}
          {historyItems.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', alignItems: 'center', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img src={item.image} alt={item.title} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                <span>{item.title}</span>
              </div>
              <div>{item.type}</div>
              <div style={{ textAlign: 'center' }}>{item.time}</div>
              <div style={{ textAlign: 'right', color: '#999' }}>✖</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Layout>
  )
}
