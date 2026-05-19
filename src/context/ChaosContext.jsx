import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ChaosContext = createContext()

export function ChaosProvider({ children }) {
  const [clickCount, setClickCount] = useState(0)
  const [cursorSize, setCursorSize] = useState(20)
  const [chaosLevel, setChaosLevel] = useState(1)
  const [notifications, setNotifications] = useState([])

  // Track global clicks for rage cursor
  useEffect(() => {
    const handleClick = () => {
      setClickCount(prev => prev + 1)
      setCursorSize(prev => Math.min(prev + 3, 120))
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Increase chaos over time
  useEffect(() => {
    const interval = setInterval(() => {
      setChaosLevel(prev => Math.min(prev + 0.1, 10))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }, [])

  const resetCursor = useCallback(() => {
    setCursorSize(20)
    setClickCount(0)
  }, [])

  return (
    <ChaosContext.Provider value={{
      clickCount, cursorSize, chaosLevel, notifications,
      addNotification, resetCursor
    }}>
      {children}
    </ChaosContext.Provider>
  )
}

export function useChaos() {
  const ctx = useContext(ChaosContext)
  if (!ctx) throw new Error('useChaos must be used within ChaosProvider')
  return ctx
}
