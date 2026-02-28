import { useState, useEffect } from 'react'
import Loader from './components/Loader/Loader'
import StarfieldCanvas from './components/StarfieldCanvas/StarfieldCanvas'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Certifications from './components/Certifications/Certifications'
import Skills from './components/Skills/Skills'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

function App() {
  const [loading, setLoading] = useState(true)

  // sessionStorage check — only show on first visit per session
  useEffect(() => {
    const seen = sessionStorage.getItem('portfolio_loaded')
    if (seen) {
      setLoading(false)
    }
  }, [])

  const handleLoadComplete = () => {
    sessionStorage.setItem('portfolio_loaded', 'true')
    setLoading(false)
  }

  return (
    <>
      {loading && <Loader onComplete={handleLoadComplete} />}
      <div className="app-wrapper" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease' }}>
        <StarfieldCanvas />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Certifications />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
