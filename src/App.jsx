import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
  const [showCookie, setShowCookie] = useState(() => {
    return localStorage.getItem('cookiesAccepted') !== 'true'
  })
  const [showAd, setShowAd] = useState(false)
  const [showVirus, setShowVirus] = useState(false)

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

  return (
    <>
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
    </>
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
