import Lenis from 'lenis'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import TrackOrderPage from './pages/TrackOrderPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import FakeAd from './components/FakeAd.jsx'
import VirusWarning from './components/VirusWarning.jsx'
import NotificationSpam from './components/NotificationSpam.jsx'
import RageCursor from './components/RageCursor.jsx'
import CartThief from './components/CartThief.jsx'
import ScottishFoldPop from './components/ScottishFoldPop.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ChaosProvider, useChaos } from './context/ChaosContext.jsx'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  
  const [showCookie, setShowCookie] = useState(() => {
    return localStorage.getItem('cookiesAccepted') !== 'true'
  })
  const [showAd, setShowAd] = useState(false)
  const [showVirus, setShowVirus] = useState(false)
  
  // Tsunami wipe states
  const [isWashing, setIsWashing] = useState(false)
  const [isWiped, setIsWiped] = useState(false)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    window.lenis = lenis

    return () => {
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  // Reset scroll to top on routing
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])
  
  // Cooldown track (2 minutes)
  const [lastTsunamiTime, setLastTsunamiTime] = useState(() => {
    const saved = localStorage.getItem('lastTsunamiTime')
    return saved ? parseInt(saved, 10) : 0
  })

  useEffect(() => {
    // Show fake ad after 15 seconds
    const adTimer = setTimeout(() => setShowAd(true), 15000)
    // Show virus warning randomly
    const virusTimer = setTimeout(() => {
      if (isLoggedIn) setShowVirus(true)
    }, 35000)
    return () => {
      clearTimeout(adTimer)
      clearTimeout(virusTimer)
    }
  }, [isLoggedIn])

  // Random ad popups every 40 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) setShowAd(true)
    }, 40000)
    return () => clearInterval(interval)
  }, [])

  const handleTsunamiTrigger = () => {
    if (isWashing || isWiped) return
    setIsWashing(true)
    
    // Save last time
    const now = Date.now()
    setLastTsunamiTime(now)
    localStorage.setItem('lastTsunamiTime', now.toString())
    
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav')
      audio.volume = 0.4
      audio.play().catch(e => {})
    } catch(e) {}

    setTimeout(() => {
      setIsWiped(true)
      setIsWashing(false)
    }, 2800)
  }

  // Auto trigger on page navigation if 2 minutes passed
  useEffect(() => {
    const timeSinceLast = Date.now() - lastTsunamiTime
    if (timeSinceLast > 120000) { // 2 minutes
      // Short delay after entering page so they see the page first
      const timer = setTimeout(() => {
        handleTsunamiTrigger()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  // Auto trigger in background if they stay on same page
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLast = Date.now() - lastTsunamiTime
      if (timeSinceLast > 120000) {
        handleTsunamiTrigger()
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [lastTsunamiTime])

  const handleRestore = () => {
    setIsWiped(false)
    setIsWashing(false)
    // Add brief cooldown cushion to avoid immediate re-trigger on next action
    const cushionTime = Date.now()
    setLastTsunamiTime(cushionTime)
    localStorage.setItem('lastTsunamiTime', cushionTime.toString())
  }

  if (isWiped) {
    return (
      <div className="tsunami-blank-screen">
        {/* Rewind & Fix Page Button at the top */}
        <button 
          className="tsunami-rewind-top-btn" 
          onClick={handleRestore}
          title="Rewind Wave & Fix Page"
        >
          🔁 Rewind & Fix Page
        </button>

        <div className="blank-screen-content">
          <span className="peace-emoji">🧘‍♂️✨</span>
          <h1>All is Calm. All is Clean.</h1>
          <p>
            The great digital tsunami has swept away your unhinged cravings, the chaos of hidden surcharges, 
            and the screaming cats of FOODEAT.
          </p>
          <p className="subtext">
            Breathe in. Breathe out. You are finally free from the pizza demons.
          </p>
          <button className="restore-btn" onClick={handleRestore}>
            Return to Chaos 🍕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={isWashing ? "tsunami-washing-mode" : ""}>
      <RageCursor />
      <NotificationSpam />
      <CartThief />
      <ScottishFoldPop />
      {showCookie && <CookieConsent onAccept={() => {
        setShowCookie(false)
        localStorage.setItem('cookiesAccepted', 'true')
      }} />}
      {showAd && <FakeAd onClose={() => setShowAd(false)} />}
      {showVirus && <VirusWarning onClose={() => setShowVirus(false)} />}
      
      {/* Global blurred background blobs */}
      <div className="global-blur-blob blob-green"></div>
      <div className="global-blur-blob blob-orange"></div>
      <div className="global-blur-blob blob-peach"></div>

      {/* Floating Tsunami Trigger Button */}
      <button 
        className="floating-tsunami-trigger" 
        onClick={handleTsunamiTrigger} 
        title="Trigger Tsunami Page-Wipe"
      >
        🌊
      </button>

      {/* Tsunami Wave Graphic */}
      {isWashing && (
        <div className="tsunami-wave">
          <div className="wave-text">🌊 TSUNAMI INCOMING 🌊</div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage isRegisterMode={false} />} />
        <Route path="/register" element={<LoginPage isRegisterMode={true} />} />
        <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/track" element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ChaosProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ChaosProvider>
    </BrowserRouter>
  )
}

export default App
