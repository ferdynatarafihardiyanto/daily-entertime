import '../styles/index.css'

if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(window, 'ethereum', {
      value: window.ethereum || {},
      writable: true,
      configurable: true,
      enumerable: true,
    })
  } catch (e) {
    // Abaikan error dari Chrome extension
  }
}

import { AudioProvider } from '../contexts/AudioContext'
import GlobalPlayer from '../components/GlobalPlayer'

function MyApp({ Component, pageProps }) {
  return (
    <AudioProvider>
      <Component {...pageProps} />
      <GlobalPlayer />
    </AudioProvider>
  )
}

export default MyApp
