import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const filmData = {
  'miracle-in-cell-no-7': { title: 'Miracle in Cell No. 7', image: '/filmmiracle.svg', desc: 'Film ini mengangkat kisah mengharukan seorang ayah dengan keterbelakangan mental yang dituduh melakukan kejahatan dan dijebloskan ke dalam sel nomor 7 bersama para penjahat lainnya.' },
  'ipar-adalah-maut': { title: 'Ipar Adalah Maut', image: '/filmiparadalahmaut.svg', desc: 'Sebuah drama keluarga yang menceritakan tentang konflik dan pengkhianatan di dalam rumah tangga yang bermula dari kehadiran saudara ipar.' },
  'danur-i-can-see-ghosts': { title: 'Danur: I Can See Ghosts', image: '/filmdanur.svg', desc: 'Kisah nyata seorang gadis indigo yang memiliki kemampuan untuk melihat dan berinteraksi dengan hantu-hantu di sekitarnya sejak kecil.' },
  'agak-laen': { title: 'Agak Laen', image: '/filmagaklain.svg', desc: 'Film komedi horor yang mengisahkan empat sekawan yang bekerja di rumah hantu pasar malam yang terancam bangkrut, hingga sebuah kejadian tak terduga mengubah nasib mereka.' },
}

export default function FilmDetail() {
  const router = useRouter()
  const { id: slug } = router.query
  const film = filmData[slug] || { title: 'Loading...', image: '/filmagaklain.svg', desc: '' }

  return (
    <Layout title={`${film.title} - Final Project`}>
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
            <img src={film.image} alt={film.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
          </div>

          {/* White Info Card */}
          <div style={{ backgroundColor: 'white', color: 'black', width: '95%', padding: '30px', borderRadius: '16px', marginTop: '-40px', position: 'relative', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>{film.title}</h2>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px' }}>
                <svg width="20" height="28" viewBox="0 0 24 32" fill="black"><path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" /></svg>
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6', color: '#333' }}>{film.desc}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
