import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState } from 'react'

export default function Berita() {
  const [searchQuery, setSearchQuery] = useState('')

  const newsItems = [
    {
      slug: 'sekretaris-al-as-dipecat',
      title: 'Lagi, Giliran Sekretaris Angkatan Laut AS yang Dipecat Pentagon',
      meta: 'News - 4 jam lalu',
      image: '/beritarekom1.svg'
    },
    {
      slug: 'fadly-alberto-kungfu',
      title: 'Fadly Alberto Ungkap Alasan Menyerang Kungfu Pemain Dewa United U20',
      meta: 'Bola - 4 jam lalu',
      image: '/beritarekom2.svg'
    },
    {
      slug: 'man-city-menang',
      title: 'Man City Hanya Menang 1-0 Lawan Burnley, Pep: Kenapa Harus Frustasi?',
      meta: 'Bola - 5 jam lalu',
      image: '/beritarekom3.svg'
    },
    {
      slug: 'kronologi-driver-ojol-antapani',
      title: 'Kronologi Driver Ojol di Antapani Diduga dilecehkan Remaja, Nyaris Diamuk Massa',
      meta: 'Nasional - 10 jam lalu',
      image: '/beritarekom4.svg'
    },
  ]

  const filteredNews = newsItems.filter(news => 
    news.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout title="Berita - Final Project">
      <div style={{ minHeight: '80vh', backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
        
        {/* Search Bar */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '12px 20px',
            maxWidth: '100%'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Cari Berita" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                border: 'none', 
                outline: 'none', 
                width: '100%', 
                fontSize: '16px',
                color: 'black'
              }} 
            />
          </div>
        </div>

        {/* News List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {filteredNews.length > 0 ? filteredNews.map((news) => (
            <div key={news.slug} style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <img 
                src={news.image} 
                alt="News thumbnail" 
                style={{ width: '320px', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Link href={`/berita/${news.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '500', lineHeight: '1.4', maxWidth: '85%', cursor: 'pointer' }}>
                    {news.title}
                  </h2>
                </Link>
                <span style={{ fontSize: '14px', color: '#ccc' }}>
                  {news.meta}
                </span>
                
                {/* Bookmark Icon */}
                <div style={{ position: 'absolute', bottom: '0', right: '0', cursor: 'pointer' }}>
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" />
                  </svg>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Berita tidak ditemukan</div>
          )}
        </div>

      </div>
      <Footer />
    </Layout>
  )
}
