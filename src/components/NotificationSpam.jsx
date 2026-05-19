import { useState, useEffect } from 'react'
import { useChaos } from '../context/ChaosContext.jsx'


const SPAM_MESSAGES = [
  { emoji: "🍕", text: "Your pizza misses you! Come back!" },
  { emoji: "😭", text: "Cart is crying. It feels empty inside." },
  { emoji: "🔥", text: "FLASH SALE: 0.5% off everything!!" },
  { emoji: "📢", text: "Your neighbor just ordered. Don't be left out!" },
  { emoji: "⏰", text: "It's been 3 seconds since your last order!" },
  { emoji: "🧠", text: "Fun fact: Hungry people make bad decisions." },
  { emoji: "💀", text: "Your stomach filed a complaint." },
  { emoji: "🎪", text: "FOODEAT Circus is in town! No one asked!" },
  { emoji: "👻", text: "A ghost in our kitchen says hi." },
  { emoji: "🤡", text: "You're still using this app? Respect." },
  { emoji: "📊", text: "Your hunger level: YES." },
  { emoji: "🎵", text: "If this app had audio, it'd be playing Nickelback." },
  { emoji: "🐛", text: "That's not a bug, it's a feature. We promise." },
  { emoji: "💰", text: "Surge pricing activated! JK... unless? 👀" },
  { emoji: "🌶️", text: "Your spice tolerance has been reported to authorities." },
]

export default function NotificationSpam() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const spamInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const msg = SPAM_MESSAGES[Math.floor(Math.random() * SPAM_MESSAGES.length)]
        const id = Date.now() + Math.random()
        setNotifications(prev => [...prev.slice(-4), { ...msg, id }])

        // Auto-remove after 4 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id))
        }, 4000)
      }
    }, 8000)

    // First notification after 5 seconds
    const firstTimer = setTimeout(() => {
      const msg = SPAM_MESSAGES[0]
      const id = Date.now()
      setNotifications([{ ...msg, id }])
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000)
    }, 5000)

    return () => {
      clearInterval(spamInterval)
      clearTimeout(firstTimer)
    }
  }, [])

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notification-container">
      {notifications.map((notif, idx) => (
        <div
          key={notif.id}
          className="spam-notification"
          style={{ '--delay': idx * 0.1 + 's' }}
        >
          <span className="notif-emoji">{notif.emoji}</span>
          <span className="notif-text">{notif.text}</span>
          <button className="notif-dismiss" onClick={() => dismiss(notif.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
