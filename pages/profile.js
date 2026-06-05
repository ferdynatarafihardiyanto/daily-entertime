import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { updateUserAPI } from '../lib/api'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState({ name: '', username: '', email: '' })
  
  // State for form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: ''
  })
  
  const fileInputRef = React.useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setFormData({
        username: parsed.name || parsed.username || '',
        email: parsed.email || '',
        password: '',
        avatar: parsed.avatar || ''
      })
    } else {
      router.push('/login')
    }
  }, [router])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (user.id) {
        await updateUserAPI(user.id, { 
          username: formData.username, 
          email: formData.email,
          role: user.roles?.[0], // Send existing role if any just in case, but backend doesn't require role for user update
          avatar: formData.avatar
        })
      }
      
      const updatedUser = { ...user, name: formData.username, username: formData.username, email: formData.email, avatar: formData.avatar }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      alert('Profile berhasil diperbarui!')
      
      if (user.roles?.includes('admin')) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      alert(err.message || 'Gagal memperbarui profile')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    if (user.roles?.includes('admin')) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }

  return (
    <Layout title="Profile - Final Project">
      <div style={{ 
        minHeight: '80vh', 
        backgroundColor: 'black', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          backgroundColor: '#262626',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          
          {/* Top Section: Avatar & Photo Upload */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '36px',
              fontWeight: 'bold',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(formData.username || user.name || user.username)
              )}
            </div>

            <div style={{ 
              flex: 1, 
              backgroundColor: '#525252', 
              borderRadius: '8px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <label style={{ color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Photo Profile</label>
              <div style={{ display: 'flex', backgroundColor: '#1E1E1E', borderRadius: '4px', overflow: 'hidden' }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  Choose File
                </button>
                <span style={{ color: '#9CA3AF', padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                  {formData.avatar ? 'Image selected' : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Username Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#E5E7EB', fontSize: '12px', paddingLeft: '4px', borderLeft: '2px solid #A855F7' }}>Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{
                  backgroundColor: '#404040',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#E5E7EB', fontSize: '12px', paddingLeft: '4px', borderLeft: '2px solid #A855F7' }}>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  backgroundColor: '#404040',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#E5E7EB', fontSize: '12px', paddingLeft: '4px', borderLeft: '2px solid #A855F7' }}>Password Baru</label>
              <input 
                type="password" 
                name="password"
                placeholder="Masukan Password Baru"
                value={formData.password}
                onChange={handleChange}
                style={{
                  backgroundColor: '#404040',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 16px',
                  color: '#9CA3AF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{
                  backgroundColor: '#3B82F6', // Blue
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
              >
                <span>💾</span> Save
              </button>
              
              <button 
                type="button" 
                onClick={handleCancel}
                style={{
                  backgroundColor: '#EF4444', // Red
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
              >
                <span>↩</span> Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  )
}
