import { useState, useEffect } from 'react'


export default function VirusWarning({ onClose }) {
  const [timer, setTimer] = useState(5)
  const [showPsych, setShowPsych] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setShowPsych(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="virus-overlay">
      <div className="virus-window">
        <div className="virus-titlebar">
          <span>⚠️ Windows Security Alert - NOT A SCAM</span>
          <button className="virus-titlebar-close" onClick={onClose}>✕</button>
        </div>
        <div className="virus-body">
          <div className="virus-icon-row">
            <span className="virus-big-icon">🦠</span>
            <span className="virus-big-icon">⚠️</span>
            <span className="virus-big-icon">🦠</span>
          </div>
          <h2>CRITICAL VIRUS DETECTED!</h2>
          <p className="virus-alert-text">Your device has been infected with <strong>HungryWorm.exe</strong></p>
          <p>Your food preferences are being LEAKED to your ex!</p>
          <p>Your Swiggy password has been compromised!</p>
          <div className="virus-progress">
            <div className="virus-progress-bar"></div>
          </div>
          <p className="virus-progress-text">Scanning your food history... 69% infected</p>

          {!showPsych ? (
            <p className="virus-timer">Self-destructing in: <span className="timer-num">{timer}</span>s</p>
          ) : (
            <div className="virus-psych">
              <p>JK! 😂 Your device is fine.</p>
              <p className="virus-small">But your taste in food? Questionable.</p>
              <button className="virus-ok-btn" onClick={onClose}>I accept my bad taste</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
