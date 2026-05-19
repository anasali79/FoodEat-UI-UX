import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useChaos } from '../context/ChaosContext.jsx'
import confetti from 'canvas-confetti'
import { useCart } from '../context/CartContext.jsx'


const DRIVER_PROFILES = [
  { name: "Snail Sam", rating: "0.2/5", vehicle: "A rusty pogo stick", emoji: "🐌" },
  { name: "Usain's Grandma", rating: "4.9/5 (but she walks)", vehicle: "Rolling walker with tennis balls", emoji: "👵" },
  { name: "Gary the Intern", rating: "1.5/5 (often eats your fries)", vehicle: "Unicycle with a flat tire", emoji: "🤡" },
  { name: "Roomba 3000", rating: "NaN/5", vehicle: "Stolen shopping cart", emoji: "🤖" },
  { name: "Ghost Rider", rating: "🔥/5", vehicle: "A tricycle on fire", emoji: "💀" },
]

const PROGRESS_STEPS = [
  "Confirming your bad decisions...",
  "Chef dropped your food. Dusting it off... 🧹",
  "Chef is crying in the walk-in freezer...",
  "Driver is currently eating half of your fries... 🍟",
  "Driver got lost in a residential roundabout...",
  "Driver stopped to pet a stray cat... 🐈",
  "Delivering to your neighbor because their house looks nicer...",
  "Order Self-Destruct Sequence Initiated...",
]

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addNotification } = useChaos()
  const { activeOrder } = useCart()
  
  const [driver] = useState(DRIVER_PROFILES[Math.floor(Math.random() * DRIVER_PROFILES.length)])
  const [progressIdx, setProgressIdx] = useState(0)
  const [eta, setEta] = useState(25)
  const [driverPos, setDriverPos] = useState({ x: 50, y: 150 })
  const [chargeAttempts, setChargeAttempts] = useState(0)
  const [refundOffset, setRefundOffset] = useState({ x: 0, y: 0 })
  
  const orderDetails = activeOrder || location.state || {
    id: 'default',
    speed: 'normal',
    address: 'A mystery location',
    phoneVal: 'unknown',
    paymentMethod: 'soul',
    orderedItems: []
  }

  const handleTrackDelivery = () => {
    navigate('/track', { 
      state: activeOrder 
    })
  }

  // Trigger celebration on load
  useEffect(() => {
    // Beautiful premium confetti splash
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff2d75', '#a855f7', '#06d6a0', '#ffd60a']
    })

    // Auto update progress steps
    const interval = setInterval(() => {
      setProgressIdx(prev => {
        if (prev < PROGRESS_STEPS.length - 1) {
          const next = prev + 1
          addNotification(`🛵 Delivery Status: ${PROGRESS_STEPS[next]}`, 'info')
          return next
        }
        return prev
      })
      // ETA increases instead of decreasing
      setEta(prev => prev + Math.floor(Math.random() * 5) + 1)
    }, 8000)

    return () => clearInterval(interval)
  }, [addNotification])

  // Move driver on the mock map randomly
  useEffect(() => {
    const mapInterval = setInterval(() => {
      setDriverPos(prev => {
        // Driver wanders away or does crazy loops
        const dx = (Math.random() - 0.3) * 35 // biased to move right/away
        const dy = (Math.random() - 0.5) * 20
        return {
          x: Math.max(10, Math.min(280, prev.x + dx)),
          y: Math.max(10, Math.min(180, prev.y + dy)),
        }
      })
    }, 3000)
    return () => clearInterval(mapInterval)
  }, [])

  // Refund button jumps away
  const handleRefundHover = () => {
    const maxOffset = 140
    setRefundOffset({
      x: (Math.random() - 0.5) * maxOffset,
      y: (Math.random() - 0.5) * maxOffset,
    })
    addNotification("⚠️ Tapping refund violates section 847 of terms!", "error")
  }

  const handleChargeButton = () => {
    setChargeAttempts(prev => prev + 1)
    if (chargeAttempts === 0) {
      addNotification("💸 Thank you! Double charge processed successfully.", "success")
    } else {
      addNotification("💸 Quadruple charge processed! Generous soul!", "success")
    }
  }

  return (
    <div className="confirmation-page">
      <div className="conf-container">
        {/* Success header */}
        <div className="conf-header">
          <span className="conf-icon">🎉</span>
          <h1>Order Placed! (Supposedly)</h1>
          <p className="order-id">Order ID: #C0D3-{Math.floor(100000 + Math.random() * 900000)}</p>
        </div>

        {/* Cursed Progress Bar */}
        <div className="tracker-section">
          <h2>Real-Time Delivery Sabotage Tracker</h2>
          <div className="tracker-status-box">
            <span className="status-indicator">📡</span>
            <span className="status-text">{PROGRESS_STEPS[progressIdx]}</span>
          </div>
          <div className="tracker-progress-line">
            <div 
              className="progress-fill" 
              style={{ width: `${((progressIdx + 1) / PROGRESS_STEPS.length) * 100}%` }}
            ></div>
          </div>
          <div className="tracker-eta">
            Estimated Arrival: <span className="eta-num">{eta} minutes</span> (and counting...)
          </div>
        </div>

        {/* Map & Driver Details */}
        <div className="delivery-grid">
          {/* Driver profile */}
          <div className="driver-card">
            <h3>Your Appointed Delivery agent</h3>
            <div className="driver-header-row">
              <span className="driver-emoji">{driver.emoji}</span>
              <div>
                <h4>{driver.name}</h4>
                <p className="driver-rating">⭐ Rating: {driver.rating}</p>
              </div>
            </div>
            <div className="driver-details-list">
              <div className="driver-detail">
                <span>Vehicle:</span>
                <strong>{driver.vehicle}</strong>
              </div>
              <div className="driver-detail">
                <span>Status:</span>
                <span className="status-badge">Lost</span>
              </div>
            </div>
          </div>

          {/* Map canvas */}
          <div className="mock-map-card">
            <h3>Live GPS tracking (Approximation)</h3>
            <div className="map-canvas">
              {/* Home marker */}
              <div className="map-marker home-marker" style={{ left: '20px', top: '150px' }}>
                🏠 Your House
              </div>
              
              {/* Driver marker */}
              <div 
                className="map-marker driver-marker" 
                style={{ 
                  left: `${driverPos.x}px`, 
                  top: `${driverPos.y}px`,
                  transition: 'all 3s linear'
                }}
              >
                🏍️ {driver.name}
              </div>

              {/* Path line decoration */}
              <svg className="map-svg-path">
                <path d="M 20 150 Q 150 50, 280 150" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="3" strokeDasharray="5" />
              </svg>
            </div>
            <p className="map-caption">Note: Driver seems to be heading in the opposite direction.</p>
          </div>
        </div>

        {/* Order Details summary */}
        <div className="conf-summary-card">
          <h3>Cursed Receipt</h3>
          <div className="conf-summary-rows">
            <div className="conf-row">
              <span>Delivery Address:</span>
              <strong>{orderDetails.address}</strong>
            </div>
            <div className="conf-row">
              <span>Registered Phone:</span>
              <strong>+91 {orderDetails.phoneVal}</strong>
            </div>
            <div className="conf-row">
              <span>Paid via:</span>
              <strong>{orderDetails.paymentMethod.toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="conf-actions">
          <button className="back-menu-btn" onClick={() => navigate('/menu')}>
            🏠 Browse More Cursed Food
          </button>

          <button className="track-live-btn" onClick={handleTrackDelivery}>
            🚴 Track Live Delivery (Real-Time GPS)
          </button>
          
          <div className="chaos-buttons-row">
            {/* Evading refund button */}
            <button 
              className="refund-btn"
              style={{
                transform: `translate(${refundOffset.x}px, ${refundOffset.y}px)`,
              }}
              onMouseEnter={handleRefundHover}
            >
              💸 Instantly Refund Order
            </button>

            {/* Double charge me button */}
            <button className="double-charge-btn" onClick={handleChargeButton}>
              🤑 Double Charge Me (Tip developers)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
