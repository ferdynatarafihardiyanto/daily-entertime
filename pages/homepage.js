import Head from 'next/head'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import Schedule from '../components/Schedule'
import Leaderboard from '../components/Leaderboard'
import NewTracks from '../components/NewTracks'
import News from '../components/News'
import Footer from '../components/Footer'

export default function Homepage() {
  return (
    <>
      <Head>
        <title>Final Project - Homepage</title>
        <meta name="description" content="Homepage dengan JavaScript murni" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Navbar />
        <HeroCarousel />
        <Schedule />
        <Leaderboard />
        <NewTracks />
        <News />
        <Footer />
      </>
    </>
  )
}
