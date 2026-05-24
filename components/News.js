import Link from 'next/link'

export default function News() {
  const newsItems = [
    {
      id: 1,
      slug: 'sekretaris-al-as-dipecat',
      tag: 'Rekomendasi',
      title: 'Lagi, Giliran Sekretaris Angkatan Laut AS yang Dipecat Pentagon',
      meta: 'News - 4 jam lalu',
      image: '/beritarekom1.svg'
    },
    {
      id: 2,
      slug: 'fadly-alberto-kungfu',
      tag: 'Rekomendasi',
      title: 'Fadly Alberto Ungkap Alasan Menyerang Kungfu Pemain Dewa United U20',
      meta: 'Bola - 4 jam lalu',
      image: '/beritarekom2.svg'
    },
    {
      id: 3,
      slug: 'man-city-menang',
      tag: 'Rekomendasi',
      title: 'Man City Hanya Menang 1-0 Lawan Burnley, Pep: Kenapa Harus Frustasi?',
      meta: 'Bola - 5 jam lalu',
      image: '/beritarekom3.svg'
    },
    {
      id: 4,
      slug: 'kronologi-driver-ojol-antapani',
      tag: 'Rekomendasi',
      title: 'Kronologi Driver Ojol di Antapani Diduga dilecehkan Remaja, Nyaris Diamuk Massa',
      meta: 'Nasional - 10 jam lalu',
      image: '/beritarekom4.svg'
    },
  ]

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Berita Terkini</h3>
          <Link href="/berita" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {newsItems.map((news) => (
            <div key={news.id} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link href={`/berita/${news.slug}`}>
                <img src={news.image} alt="News thumbnail" style={{ width: '240px', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
              </Link>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{news.tag}</span>
                <Link href={`/berita/${news.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal', lineHeight: '1.4', cursor: 'pointer' }}>{news.title}</h4>
                </Link>
                <span style={{ fontSize: '12px', color: '#999' }}>{news.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
