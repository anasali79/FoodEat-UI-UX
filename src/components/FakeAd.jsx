import { useState, useEffect } from 'react'


const ADS = [
  { title: "🔥 HOT SINGLES IN YOUR KITCHEN 🔥", subtitle: "Local chefs want to cook for YOU!", cta: "MEET THEM NOW" },
  { title: "You are the 1,000,000th visitor!", subtitle: "Click here to claim your FREE BIRYANI! 🎉", cta: "CLAIM PRIZE" },
  { title: "LOSE 50KG IN 2 DAYS", subtitle: "Doctors HATE this one weird food trick!", cta: "LEARN MORE" },
  { title: "⚡ YOUR INTERNET IS SLOW ⚡", subtitle: "Download more RAM to speed up your food delivery!", cta: "DOWNLOAD NOW" },
  { title: "🎮 Play CursedEats: The Game!", subtitle: "Are you a true food warrior? Prove it!", cta: "PLAY FREE" },
]

export default function FakeAd({ onClose }) {
  const [ad] = useState(ADS[Math.floor(Math.random() * ADS.length)])
  const [closeAttempts, setCloseAttempts] = useState(0)
  const [closeBtnPos, setCloseBtnPos] = useState({ top: 8, right: 8 })
  const [showRealClose, setShowRealClose] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onClose])

  const handleFakeClose = () => {
    setCloseAttempts(prev => prev + 1)
    // Move the close button
    setCloseBtnPos({
      top: Math.random() * 80 + 5,
      right: Math.random() * 80 + 5,
    })
    if (closeAttempts >= 3) {
      setShowRealClose(true)
    }
  }

  return (
    <div className="fake-ad-overlay">
      <div className="fake-ad-container">
        <div className="fake-ad-banner">ADVERTISEMENT</div>
        <div className="fake-ad-content">
          <h2>{ad.title}</h2>
          <p>{ad.subtitle}</p>
          <button className="fake-ad-cta">{ad.cta}</button>
          <div className="fake-ad-countdown">
            Ad closes in: {timeLeft} seconds
          </div>
        </div>

        {/* Tiny moving close button */}
        <button
          className="fake-ad-close"
          style={{ top: closeBtnPos.top + '%', right: closeBtnPos.right + '%' }}
          onClick={handleFakeClose}
          title="Close (good luck)"
        >
          ✕
        </button>

        {/* Real close after 4 failed attempts */}
        {showRealClose && (
          <button className="fake-ad-real-close" onClick={onClose}>
            OK fine, here's the real close button →  ✕
          </button>
        )}

        <div className="fake-ad-footer">
          <span>Not a virus</span>
          <span>Totally legit</span>
          <span>100% safe</span>
        </div>
      </div>
    </div>
  )
}
