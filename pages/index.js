import Layout from '../components/Layout'
import HeroCarousel from '../components/HeroCarousel'
import Schedule from '../components/Schedule'
import Leaderboard from '../components/Leaderboard'
import NewTracks from '../components/NewTracks'
import News from '../components/News'
import Footer from '../components/Footer'

export default function Home() {
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
