import Link from 'next/link'

export default function Leaderboard() {
  const trendingItems = [
    { id: 1, slug: 'miracle-in-cell-no-7', title: 'Miracle in Cell No.7', image: '/filmmiracle.svg' },
    { id: 2, slug: 'ipar-adalah-maut', title: 'Ipar Adalah Maut', image: '/filmiparadalahmaut.svg' },
    { id: 3, slug: 'danur-i-can-see-ghosts', title: 'Danur', image: '/filmdanur.svg' },
    { id: 4, slug: 'agak-laen', title: 'Agak Laen', image: '/filmagaklain.svg' },
  ]

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Leaderboard</h2>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>Sedang Tren Sekarang</h3>
          <Link href="/film" style={{ color: '#ccc', textDecoration: 'none', fontSize: '14px' }}>View All</Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
          {trendingItems.map((item) => (
            <div key={item.id} style={{ flex: 1, position: 'relative' }}>
              <Link href={`/film/${item.slug}`}>
                <img src={item.image} alt={item.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
              </Link>

              {/* Huge purple number */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-10px',
                fontSize: '120px',
                fontWeight: 'bold',
                color: '#A855F7',
                lineHeight: 1,
                textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                fontFamily: 'impact, sans-serif'
              }}>
                {item.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
