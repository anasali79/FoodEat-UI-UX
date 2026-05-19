import { useState, useEffect, useRef } from 'react'


export default function CookieConsent({ onAccept }) {
  const [rejectCount, setRejectCount] = useState(0)
  const [miniPopups, setMiniPopups] = useState([])
  const [acceptFollowing, setAcceptFollowing] = useState(false)
  const [acceptPos, setAcceptPos] = useState({ x: 0, y: 0 })
  const [isShaking, setIsShaking] = useState(false)
  const containerRef = useRef(null)

  const rejectMessages = [
    "Are you sure? 🥺",
    "You hurt our feelings 😢",
    "We have families to feed! 😭",
    "Our cookies are organic! 🍪",
    "Please... we're begging you 🙏",
    "Fine. Accept or we cry. 😤",
    "LAST CHANCE! 💀",
    "OK OK the accept button is coming to YOU now...",
  ]

  const handleReject = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
    
    if (rejectCount < rejectMessages.length) {
      const newPopup = {
        id: Date.now(),
        message: rejectMessages[rejectCount],
        x: Math.random() * 60 + 10,
        y: Math.random() * 60 + 10,
      }
      setMiniPopups(prev => [...prev, newPopup])
      setRejectCount(prev => prev + 1)

      if (rejectCount >= 6) {
        setAcceptFollowing(true)
      }
    }
  }

  // Accept button follows cursor after enough rejections
  useEffect(() => {
    if (!acceptFollowing) return
    const handleMove = (e) => {
      setAcceptPos({
        x: e.clientX - 60,
        y: e.clientY - 20,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [acceptFollowing])

  return (
    <div className="cookie-overlay">
      <div className={`cookie-main ${isShaking ? 'shake' : ''}`} ref={containerRef}>
        <div className="cookie-icon">🍪</div>
        <h2>We Use Cookies!</h2>
        <p>We use cookies, trackers, your browsing history, your Netflix password, 
           your childhood memories, and your WiFi to enhance your experience.</p>
        <p className="cookie-small">By existing on this page you've already agreed to 847 terms and conditions.</p>
        
        <div className="cookie-buttons">
          {!acceptFollowing ? (
            <button className="cookie-accept" onClick={onAccept}>
              Accept All 47 Categories
            </button>
          ) : (
            <button 
              className="cookie-accept cookie-accept-following"
              style={{ 
                position: 'fixed', 
                left: acceptPos.x + 'px', 
                top: acceptPos.y + 'px',
                zIndex: 100000 
              }}
              onClick={onAccept}
            >
              🍪 ACCEPT ME! I'M RIGHT HERE! 🍪
            </button>
          )}
          <button className="cookie-reject" onClick={handleReject}>
            {rejectCount === 0 ? 'Reject' : `Reject Again (${rejectCount}/∞)`}
          </button>
        </div>
        
        <button className="cookie-close-btn" title="Close">✕</button>
        <p className="cookie-close-hint">← This button does absolutely nothing</p>
      </div>

      {miniPopups.map(popup => (
        <div 
          key={popup.id}
          className="mini-popup"
          style={{ left: popup.x + '%', top: popup.y + '%' }}
        >
          <div className="mini-popup-content">
            {popup.message}
          </div>
        </div>
      ))}
    </div>
  )
}
