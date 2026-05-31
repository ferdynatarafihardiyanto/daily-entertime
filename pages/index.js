import Layout from '../components/Layout'
import HeroCarousel from '../components/HeroCarousel'
import Schedule from '../components/Schedule'
import Leaderboard from '../components/Leaderboard'
import NewTracks from '../components/NewTracks'
import News from '../components/News'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Cek apakah user yang tersimpan di local storage adalah admin
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user && user.roles && user.roles.includes('admin')) {
          router.push('/admin')
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [router])

  return (
    <Layout title="Final Project - Home" isHome={true}>
      <HeroCarousel />
      <Schedule />
      <Leaderboard />
      <NewTracks />
      <News />
      <Footer />
    </Layout>
  )
}
