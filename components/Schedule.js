import { useState } from 'react'

export default function Schedule() {
  const [active, setActive] = useState(1) // index of active card (Selasa = index 1)

  const schedules = [
    { day: 'Senin',  image: '/filmmiracle.svg',     label: 'Film'   },
    { day: 'Selasa', image: '/lagutaklagisama.svg',  label: 'Musik'  },
    { day: 'Rabu',   image: '/beritarekom1.svg',     label: 'Berita' },
    { day: 'Kamis',  image: '/filmagaklain.svg',     label: 'Film'   },
    { day: 'Jumat',  image: '/lagunyaman.svg',       label: 'Musik'  },
    { day: 'Sabtu',  image: '/beritarekom2.svg',     label: 'Berita' },
    { day: 'Minggu', image: '/filmtoystory.svg',     label: 'Film'   },
  ]

  return (
    <div style={{ backgroundColor: 'black', padding: '40px 50px', color: 'white' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>
        Jadwal
      </h2>

      {/* Scroll wrapper - shows 4 cards, rest is scrollable */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '14px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
        }}>
          {schedules.map((item, index) => (
            <div
              key={index}
              onClick={() => setActive(index)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                /* Show exactly 4 cards: (100% - 3 gaps of 16px) / 4 = 25% - 12px */
                minWidth: 'calc(25% - 12px)',
                width: 'calc(25% - 12px)',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                border: active === index
                  ? '3px dashed #3B82F6'
                  : '3px solid transparent',
                boxSizing: 'border-box',
                cursor: 'pointer',
                transition: 'transform 0.2s, border 0.2s',
                transform: active === index ? 'translateY(-6px)' : 'none',
                scrollSnapAlign: 'start',
              }}
            >
              {/* Day label */}
              <div style={{ padding: '14px 16px 8px 16px' }}>
                <span style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}>
                  {item.day}
                </span>
              </div>

              {/* Image */}
              <div style={{ position: 'relative', flex: 1 }}>
                <img
                  src={item.image}
                  alt={item.label}
                  style={{
                    width: '100%',
                    height: '360px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Purple badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#A855F7',
                  color: 'white',
                  textAlign: 'center',
                  padding: '14px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  borderRadius: '0 0 12px 12px',
                }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
