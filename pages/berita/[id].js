import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

const newsData = {
  'sekretaris-al-as-dipecat': {
    title: 'Lagi, Giliran Sekretaris Angkatan Laut AS yang Dipecat Pentagon',
    image: '/beritarekom1.svg',
    body1: 'WASHINGTON - Pentagon kembali melakukan perombakan jajaran pejabat tingginya. Kali ini, Sekretaris Angkatan Laut Amerika Serikat dilaporkan telah dibebastugaskan dari jabatannya menyusul serangkaian kontroversi internal.',
    body2: 'Pemecatan ini dikonfirmasi oleh juru bicara Departemen Pertahanan yang menyatakan bahwa keputusan tersebut diambil demi menjaga integritas dan profesionalisme di lingkungan militer AS.',
    body3: 'Meski tidak dirinci secara spesifik, beberapa sumber menyebutkan bahwa hal ini berkaitan erat dengan perbedaan pandangan tajam terkait kebijakan keamanan laut dalam menghadapi ketegangan global baru-baru ini.',
  },
  'fadly-alberto-kungfu': {
    title: 'Fadly Alberto Ungkap Alasan Menyerang Kungfu Pemain Dewa United U20',
    image: '/beritarekom2.svg',
    body1: 'JAKARTA - Insiden tak terpuji mewarnai jalannya pertandingan Liga Junior akhir pekan lalu. Fadly Alberto akhirnya angkat bicara usai aksinya yang viral karena tertangkap kamera melepaskan tendangan ala kungfu ke arah pemain Dewa United U20.',
    body2: '"Saya terbawa emosi sesaat karena provokasi lawan yang terus-menerus memancing amarah sejak babak pertama," ungkap Fadly dalam konferensi pers yang digelar Selasa pagi.',
    body3: 'Komisi Disiplin telah memanggil sang pemain dan manajemen tim. Sanksi tegas berupa larangan bertanding dan denda besar kini membayangi Fadly sebagai buntut dari tindakannya yang mencederai nilai sportivitas.',
  },
  'man-city-menang': {
    title: 'Man City Hanya Menang 1-0 Lawan Burnley, Pep: Kenapa Harus Frustasi?',
    image: '/beritarekom3.svg',
    body1: 'MANCHESTER - Manchester City harus bersusah payah untuk meraih tiga poin usai menang tipis 1-0 saat menjamu Burnley di Etihad Stadium. Gol tunggal City baru tercipta di babak kedua melalui aksi striker andalan mereka.',
    body2: 'Meski mendominasi penguasaan bola hingga 75%, lini serang The Citizens berkali-kali menemui jalan buntu akibat rapatnya pertahanan tim tamu.',
    body3: 'Manajer Pep Guardiola menanggapi santai hasil ini. "Kenapa harus frustasi? Burnley bertahan dengan sangat baik. Yang terpenting adalah kami mendapat tiga poin dan terus menjaga asa juara," ujarnya usai laga.',
  },
  'kronologi-driver-ojol-antapani': {
    title: 'Kronologi Driver Ojol di Antapani Diduga dilecehkan Remaja, Nyaris Diamuk Massa',
    image: '/beritarekom4.svg',
    body1: 'BANDUNG - Seorang pengemudi ojek online (ojol) di kawasan Antapani, Bandung, menjadi korban dugaan pelecehan yang dilakukan oleh sekelompok remaja.',
    body2: '"Saya hanya sedang menunggu orderan, tiba-tiba mereka datang dan mulai mengganggu secara fisik dan verbal," ujar korban saat dimintai keterangan oleh petugas kepolisian.',
    body3: 'Kejadian ini sempat memancing amarah warga dan sesama rekan ojol yang nyaris main hakim sendiri. Polisi akhirnya tiba di lokasi tepat waktu untuk mengamankan para remaja tersebut dari amukan massa.',
  },
}

export default function BeritaDetail() {
  const router = useRouter()
  const { id: slug } = router.query
  const news = newsData[slug] || { title: 'Loading...', image: '/beritarekom1.svg', body1: '', body2: '', body3: '' }

  return (
    <Layout title={`${news.title} - Final Project`}>
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {/* Centered Title */}
          <h1 style={{ textAlign: 'center', fontSize: '28px', lineHeight: '1.4', marginBottom: '50px', padding: '0 20px' }}>
            {news.title}
          </h1>

          {/* Two Column: Image + First paragraph */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
            <div style={{ flex: '1' }}>
              <img src={news.image} alt="News Photo" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: '1', fontSize: '18px', lineHeight: '1.6', color: '#E5E7EB' }}>
              <p style={{ margin: 0 }}>{news.body1}</p>
            </div>
          </div>

          {/* Full Width Text */}
          <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#E5E7EB', display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px', textAlign: 'center' }}>
            <p style={{ margin: 0 }}>{news.body2}</p>
            <p style={{ margin: 0 }}>{news.body3}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
