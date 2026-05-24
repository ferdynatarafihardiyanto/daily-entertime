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

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
