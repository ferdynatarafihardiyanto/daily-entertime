import Head from 'next/head'
import Link from 'next/link'

export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Final Project</title>
        <meta name="description" content="Create your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="register-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'black' }}>
        {/* Left Branding Section */}
        <div className="register-branding" style={{ flex: 1, color: 'white', padding: '0 50px 150px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="register-headline" style={{ fontSize: '48px', fontWeight: 'normal', lineHeight: '1.2' }}>
            All your <br />
            <span className="bold-text" style={{ color: '#A855F7', fontWeight: 'bold' }}>Entertainment</span>,<br /> in one piece
          </h1>
          <p className="register-description" style={{ marginTop: '20px', fontSize: '20px', color: '#D1D5DB' }}>
            Buat akun sekarang dan nikmati<br />
            film, musik, berita seru, dan<br />
            banyak lagi setiap hari.
          </p>
        </div>

        {/* Right Register Card */}
        <div className="register-card-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="register-card" style={{ backgroundColor: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '500px', color: 'black' }}>

            {/* Welcome Text */}
            <h2 className="register-welcome" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Create your Account</h2>
            <p className="register-subtext" style={{ fontSize: '14px', color: '#6B7280', marginBottom: '30px' }}>Daftar sekarang untuk mulai menikmati hiburan favoritmu!</p>

            {/* Form */}
            <form className="register-form">
              {/* Username Input */}
              <label style={{ display: 'block', marginBottom: '0', fontWeight: '600', color: 'black', fontSize: '12px' }}>Username</label>
              <div className="register-input-group" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '8px', padding: '10px 15px', marginBottom: '8px' }}>
                <span className="input-icon" style={{ marginRight: '10px', display: 'flex' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Masukkan Username"
                  className="register-input"
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                />
              </div>

              {/* Email Input */}
              <label style={{ display: 'block', marginBottom: '0', fontWeight: '600', color: 'black', fontSize: '12px' }}>Email</label>
              <div className="register-input-group" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '8px', padding: '10px 15px', marginBottom: '6px' }}>
                <span className="input-icon" style={{ marginRight: '10px', display: 'flex' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 7L12 13L21 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Masukkan Email"
                  className="register-input"
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                />
              </div>

              {/* Password Input */}
              <label style={{ display: 'block', marginBottom: '0', fontWeight: '600', color: 'black', fontSize: '12px' }}>Password</label>
              <div className="register-input-group" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '8px', padding: '10px 15px', marginBottom: '8px' }}>
                <span className="input-icon" style={{ marginRight: '10px', display: 'flex' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Buat Password"
                  className="register-input"
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                />
              </div>

              {/* Confirm Password Input */}
              <label style={{ display: 'block', marginBottom: '0', fontWeight: '600', color: 'black', fontSize: '12px' }}>Konfirmasi Password</label>
              <div className="register-input-group" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: '8px', padding: '10px 15px', marginBottom: '12px' }}>
                <span className="input-icon" style={{ marginRight: '10px', display: 'flex' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="register-input"
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                />
              </div>

              {/* Terms and Register Button */}
              <div className="register-options" style={{ marginBottom: '20px', fontSize: '12px', color: 'black' }}>
                <label className="terms-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                  <span>Saya setuju dengan <b>Terms of Service</b> dan <b>Privacy Policy</b></span>
                </label>
              </div>

              <button type="submit" className="register-button" style={{ width: '100%', backgroundColor: '#A855F7', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Sign Up</button>
            </form>

            {/* Divider */}
            <div className="register-divider" style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', borderTop: '1px solid #E5E7EB', zIndex: '1' }}></div>
              <span style={{ backgroundColor: 'white', padding: '0 10px', color: '#6B7280', fontSize: '12px', position: 'relative', zIndex: '2' }}>or sign up with</span>
            </div>

            {/* Social Register */}
            <div className="social-register" style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="social-btn google-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#E5E7EB', color: 'black', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', width: '50%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>

            {/* Login Link - Added just in case navigation is needed */}
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
              Sudah punya akun? <Link href="/login" style={{ color: '#A855F7', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
