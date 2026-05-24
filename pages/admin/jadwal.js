import AdminLayout from '../../components/AdminLayout'
import { useState } from 'react'

export default function JadwalMingguan() {
  const [activeFilter, setActiveFilter] = useState('Film')

  const calendarDays = [
    { date: 30, prevMonth: true }, { date: 31, prevMonth: true }, { date: 1, events: [{ title: 'JUMBO', type: 'Film' }] }, { date: 2 }, { date: 3 }, { date: 4 }, { date: 5 },
    { date: 6 }, { date: 7 }, { date: 8 }, { date: 9 }, { date: 10 }, { date: 11 }, { date: 12 },
    { date: 13 }, { date: 14 }, { date: 15 }, { date: 16 }, { date: 17 }, { date: 18 }, { date: 19 },
    { date: 20 }, { date: 21 }, { date: 22 }, { date: 23 }, { date: 24 }, { date: 25 }, { date: 26 },
    { date: 27 }, { date: 28 }, { date: 29 }, { date: 30 }, { date: 1, nextMonth: true }, { date: 2, nextMonth: true }, { date: 3, nextMonth: true }
  ]

  return (
    <AdminLayout title="Jadwal Mingguan - Admin">
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
        
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Film', 'Musik', 'Berita'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{ 
                  backgroundColor: activeFilter === f ? (f === 'Film' ? '#FBCFE8' : f === 'Musik' ? '#D1FAE5' : '#FEF08A') : 'white',
                  color: 'black',
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Month & Add Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>April 2025</h2>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>&lt;</button>
                <button style={{ backgroundColor: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>&gt;</button>
              </div>
            </div>
            <button style={{ 
              backgroundColor: '#A855F7', color: 'white', border: 'none', 
              padding: '10px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              + Tambah Jadwal
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
            {['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'].map(day => (
              <div key={day} style={{ padding: '15px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px', fontWeight: 'bold' }}>{day}</div>
            ))}
          </div>
          
          {/* Calendar Body */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, i) => {
              // Highlight styling
              let bg = 'white';
              if (day.date === 1 && !day.prevMonth && !day.nextMonth) bg = '#FCE7F3'; // Pinkish for date 1
              if (day.date === 2 && !day.prevMonth && !day.nextMonth) bg = '#D1FAE5'; // Greenish
              if (day.date === 3 && !day.prevMonth && !day.nextMonth) bg = '#FEF08A'; // Yellowish
              if (day.date === 4 && !day.prevMonth && !day.nextMonth) bg = '#FCE7F3';
              if (day.date === 5 && !day.nextMonth) bg = '#D1FAE5';
              if (day.date === 6 && !day.prevMonth) bg = '#FEF08A';
              if (day.date === 7 && !day.prevMonth) bg = '#FCE7F3';
              
              return (
                <div key={i} style={{ 
                  height: '120px', 
                  borderRight: '1px solid #E5E7EB', 
                  borderBottom: '1px solid #E5E7EB',
                  padding: '10px',
                  backgroundColor: bg
                }}>
                  <div style={{ color: day.prevMonth || day.nextMonth ? '#93C5FD' : 'black', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
                    {day.date}
                  </div>
                  {day.events && day.events.map((ev, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#BE185D', fontWeight: 'bold', fontSize: '12px' }}>{ev.title}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '10px', marginTop: '15px' }}>{ev.type}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
