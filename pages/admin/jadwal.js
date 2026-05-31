import AdminLayout from '../../components/AdminLayout'
import { useState, useEffect } from 'react'
import { getSchedules, createSchedule, getContents } from '../../lib/api'

export default function JadwalMingguan() {
  const [activeFilter, setActiveFilter] = useState('Film')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState([])
  const [contents, setContents] = useState([])
  
  // Modal States
  const [showModal, setShowModal] = useState(false)
  const [newSchedule, setNewSchedule] = useState({ category: 'Film', contentId: '', date: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [schedRes, contentRes] = await Promise.all([
        getSchedules(),
        getContents()
      ])
      if (schedRes.data) setSchedules(schedRes.data)
      if (contentRes.data) setContents(contentRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    }
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Calendar Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday = 0, Sunday = 6
  }

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())
  
  const daysInPrevMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1)
  
  const calendarDays = []
  
  // Prev month padding
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ date: daysInPrevMonth - firstDay + i + 1, prevMonth: true })
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`
    
    // Find events
    const dayEvents = schedules.filter(s => {
      if (!s.start_datetime) return false
      const evDate = new Date(s.start_datetime)
      const evDStr = `${evDate.getFullYear()}-${String(evDate.getMonth()+1).padStart(2,'0')}-${String(evDate.getDate()).padStart(2,'0')}`
      return evDStr === dStr
    })
    
    calendarDays.push({ date: i, events: dayEvents, dateString: dStr })
  }
  
  // Next month padding
  const totalCells = Math.ceil(calendarDays.length / 7) * 7
  const remaining = totalCells - calendarDays.length
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ date: i, nextMonth: true })
  }

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  // Category mapping
  const categoryIds = { 'Berita': 1, 'Film': 2, 'Musik': 3 }
  const categoryColors = { 1: '#FEF08A', 2: '#FBCFE8', 3: '#D1FAE5' } // Berita=Yellow, Film=Pink, Musik=Green
  const categoryTextColors = { 1: '#A16207', 2: '#BE185D', 3: '#047857' }

  const handleAddSchedule = async () => {
    if (!newSchedule.contentId || !newSchedule.date) {
      alert("Pilih nama dan tanggal terlebih dahulu")
      return
    }

    // Validation: Check if there's already a schedule on the selected date
    const selectedDateStr = newSchedule.date
    const dateExists = schedules.some(s => {
      if (!s.start_datetime) return false
      const evDate = new Date(s.start_datetime)
      const evDStr = `${evDate.getFullYear()}-${String(evDate.getMonth()+1).padStart(2,'0')}-${String(evDate.getDate()).padStart(2,'0')}`
      return evDStr === selectedDateStr
    })

    if (dateExists) {
      alert("Mohon maaf, sudah ada jadwal pada tanggal tersebut. Silakan pilih tanggal lain.")
      return
    }

    try {
      await createSchedule({
        contentId: newSchedule.contentId,
        startDatetime: newSchedule.date + 'T00:00:00Z',
        title: contents.find(c => c.id == newSchedule.contentId)?.title || 'Jadwal',
      })
      alert("Jadwal berhasil ditambahkan!")
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert("Gagal menambahkan jadwal: " + err.message)
    }
  }

  const availableContents = contents.filter(c => c.category_id == categoryIds[newSchedule.category])

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
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={handlePrevMonth} style={{ backgroundColor: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: 'black' }}>&lt;</button>
                <button onClick={handleNextMonth} style={{ backgroundColor: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: 'black' }}>&gt;</button>
              </div>
            </div>
            <button onClick={() => setShowModal(true)} style={{ 
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
              // Get category of the first event if exists
              let bg = 'white'
              if (!day.prevMonth && !day.nextMonth && day.events?.length > 0) {
                const firstEventCat = contents.find(c => c.id === day.events[0].content_id)?.category_id
                if (firstEventCat) bg = categoryColors[firstEventCat]
              }
              
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
                  {day.events && day.events.map((ev, idx) => {
                    const c = contents.find(cc => cc.id === ev.content_id)
                    const catId = c?.category_id
                    const catName = catId === 1 ? 'Berita' : catId === 2 ? 'Film' : 'Musik'
                    const textColor = catId ? categoryTextColors[catId] : 'black'
                    
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: '5px' }}>
                        <span style={{ color: textColor, fontWeight: 'bold', fontSize: '12px' }}>{c?.title || ev.title}</span>
                        <span style={{ color: '#9CA3AF', fontSize: '10px', marginTop: '2px' }}>{catName}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#1A1A1A', padding: '30px', borderRadius: '16px', width: '400px', border: '1px solid #333' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #A855F7', paddingBottom: '10px', display: 'inline-block', margin: '0 auto 30px auto', width: '100%' }}>
                Tambah Jadwal
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'white', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Kategori</label>
                  <select 
                    value={newSchedule.category}
                    onChange={(e) => setNewSchedule({ ...newSchedule, category: e.target.value, contentId: '' })}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2A2A2A', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                  >
                    <option value="Film">Film</option>
                    <option value="Musik">Musik</option>
                    <option value="Berita">Berita</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'white', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Pilih Nama {newSchedule.category}</label>
                  <select 
                    value={newSchedule.contentId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, contentId: e.target.value })}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2A2A2A', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                  >
                    <option value="">Pilih judul {newSchedule.category.toLowerCase()}...</option>
                    {availableContents.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'white', borderLeft: '3px solid #A855F7', paddingLeft: '10px' }}>Tanggal</label>
                  <input 
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2A2A2A', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 30px', backgroundColor: 'transparent', border: '1px solid #555', borderRadius: '24px', color: 'white', cursor: 'pointer' }}>Batal</button>
                <button onClick={handleAddSchedule} style={{ padding: '10px 30px', backgroundColor: '#A855F7', border: 'none', borderRadius: '24px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Tambahkan Jadwal</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
