import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { loginAPI } from '../lib/api'

export default function Login() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginAPI(identifier, password)
      const user = data.data?.user

      if (user) {
        // Tutup menu/sidebar secara default ketika baru login
        localStorage.setItem('sidebarOpen', JSON.stringify(false))

        // Redirect berdasarkan role
        if (user.roles && user.roles.includes('admin')) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (err) {
      setError(err.message || 'Email atau Password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - Final Project</title>
        <meta name="description" content="Login to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="login-page">
        {/* Left Branding Section */}
        <div className="login-branding" style={{ padding: '0 50px 150px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="login-headline" style={{ fontSize: '48px', fontWeight: 'normal', lineHeight: '1.2' }}>
            All your <br />
            <span className="bold-text" style={{ color: '#A855F7', fontWeight: 'bold' }}>Entertainment</span>,<br /> in one piece
          </h1>
          <p className="login-description" style={{ marginTop: '20px', fontSize: '20px', color: '#D1D5DB' }}>
            Buat akun sekarang dan nikmati<br />
            film, musik, berita seru, dan<br />
            banyak lagi setiap hari.
          </p>

          {/* Info box */}
          <div style={{
            marginTop: '40px',
            padding: '16px 20px',
            backgroundColor: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#D1D5DB',
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#A855F7' }}>🔗 Terintegrasi dengan Backend</p>
            <p style={{ margin: '2px 0' }}>Login menggunakan akun yang sudah terdaftar di database.</p>
            <p style={{ margin: '2px 0' }}>Belum punya akun? <Link href="/register" style={{ color: '#E9D5FF' }}>Daftar di sini</Link></p>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="login-card-wrapper">
          <div className="login-card">
            {/* Logo */}
            <div className="login-logo">
              <img src="/logo%20navbar.png" alt="DE Logo" className="login-logo-img" />
            </div>

            {/* Welcome Text */}
            <h2 className="login-welcome">Welcome Back 👋</h2>
            <p className="login-subtext">Lanjut untuk menikmati hiburan favoritmu</p>

            {/* Error message */}
            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '12px',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Input */}
              <label style={{ display: 'block', marginBottom: '0.02px', fontWeight: '200', color: 'black' }}>Email</label>
              <div className="login-input-group">
                <span className="input-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 7L12 13L21 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Masukkan Email"
                  className="login-input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <label style={{ display: 'block', marginBottom: '0.02px', fontWeight: '200', color: 'black' }}>Password</label>
              <div className="login-input-group">
                <span className="input-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="16" r="1" fill="black" />
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="#" className="forgot-password">Forgot Password?</Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Memproses...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with</span>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button className="social-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="signup-link">
              Belum punya akun? <Link href="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
