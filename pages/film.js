import Layout from '../components/Layout'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useState } from 'react'

export default function Film() {
  const [searchQuery, setSearchQuery] = useState('')

  const filmItems = [
    {
      slug: 'miracle-in-cell-no-7',
      title: 'Miracle in Cell No. 7',
      meta: 'Drama, Family • 2022',
      image: '/filmmiracle.svg'
    },
    {
      slug: 'ipar-adalah-maut',
      title: 'Ipar Adalah Maut',
      meta: 'Drama • 2024',
      image: '/filmiparadalahmaut.svg'
    },
    {
      slug: 'danur-i-can-see-ghosts',
      title: 'Danur: I Can See Ghosts',
      meta: 'Horror • 2017',
      image: '/filmdanur.svg'
    },
    {
      slug: 'agak-laen',
      title: 'Agak Laen',
      meta: 'Comedy, Horror • 2024',
      image: '/filmagaklain.svg'
    },
  ]

  const filteredFilms = filmItems.filter(film => 
    film.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout title="Film - Final Project">
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
              placeholder="Cari Film" 
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

        {/* Film List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {filteredFilms.length > 0 ? filteredFilms.map((film) => (
            <div key={film.slug} style={{ display: 'flex', gap: '30px' }}>
              <img 
                src={film.image} 
                alt="Film thumbnail" 
                style={{ width: '240px', height: '320px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', paddingTop: '10px' }}>
                <Link href={`/film/${film.slug}`} style={{ textDecoration: 'none', color: 'white' }}>
                  <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', lineHeight: '1.4', maxWidth: '85%', cursor: 'pointer' }}>
                    {film.title}
                  </h2>
                </Link>
                <span style={{ fontSize: '16px', color: '#ccc' }}>
                  {film.meta}
                </span>
                
                <p style={{ marginTop: '20px', fontSize: '15px', lineHeight: '1.6', color: '#9CA3AF', maxWidth: '90%' }}>
                  Saksikan keseruan dan ketegangan dalam film ini. Nikmati kualitas streaming terbaik hanya di platform kami. Tambahkan ke bookmark agar tidak terlewatkan.
                </p>
                
                {/* Bookmark Icon */}
                <div style={{ position: 'absolute', bottom: '10px', right: '0', cursor: 'pointer' }}>
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 0C1.79086 0 0 1.79086 0 4V32L12 25L24 32V4C24 1.79086 22.2091 0 20 0H4Z" />
                  </svg>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px' }}>Film tidak ditemukan</div>
          )}
        </div>

      </div>
      <Footer />
    </Layout>
  )
}
