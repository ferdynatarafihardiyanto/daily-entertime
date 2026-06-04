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

import { Provider } from 'react-redux'
import { store } from '../store/store'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AudioProvider>
        <Component {...pageProps} />
        <GlobalPlayer />
      </AudioProvider>
    </Provider>
  )
}

export default MyApp
