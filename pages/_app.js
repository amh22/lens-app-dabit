import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ padding: '20px 40px' }}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
