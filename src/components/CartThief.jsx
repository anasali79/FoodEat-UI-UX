import { useState, useEffect, useCallback, useRef } from 'react'
import { useCart } from '../context/CartContext.jsx'


export default function CartThief() {
  const { cartItems, stealItem, lastStolenItem, returnStolenItem } = useCart()
  const [isRunning, setIsRunning] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [thiefPos, setThiefPos] = useState(-100)
  const audioRef = useRef(null)
  const npcAudioRef = useRef(null)
  const intervalRef = useRef(null)
  const isCooldownRef = useRef(false)

  useEffect(() => {
    // Preload audio
    audioRef.current = new Audio('/Chipi Chipi Chapa Chapa.mp3')
    audioRef.current.loop = true
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (npcAudioRef.current) {
        npcAudioRef.current.pause()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const triggerThief = useCallback(() => {
    if (cartItems.length === 0 || isRunning || isCooldownRef.current) return

    const stolen = stealItem()
    if (!stolen) return

    setIsRunning(true)
    setThiefPos(-100)

    // Play chipi chipi audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => console.log('Audio play failed:', err))
    }

    // Animate thief running across screen
    let pos = -100
    intervalRef.current = setInterval(() => {
      pos += 2.5
      setThiefPos(pos)

      // Show speech bubble when in the middle area
      if (pos > window.innerWidth * 0.2 && pos < window.innerWidth * 0.75) {
        setShowBubble(true)
      } else {
        setShowBubble(false)
      }

      if (pos > window.innerWidth + 120) {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        setShowBubble(false)
        // Stop audio when done
        if (audioRef.current) {
          audioRef.current.pause()
        }
      }
    }, 16)
  }, [cartItems, isRunning, stealItem])

  // Random thief attacks
  useEffect(() => {
    const interval = setInterval(() => {
      if (cartItems.length > 0 && Math.random() > 0.5) {
        triggerThief()
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [cartItems, triggerThief])

  const handleCatch = () => {
    if (!isRunning) return

    // Stop animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Return the item back to the cart!
    if (lastStolenItem) {
      returnStolenItem(lastStolenItem)
    }

    // Stop current chipi chipi audio
    if (audioRef.current) {
      audioRef.current.pause()
    }

    // Stop any currently playing NPC music first
    if (npcAudioRef.current) {
      npcAudioRef.current.pause()
    }

    // Play NPC music
    npcAudioRef.current = new Audio('/npc music.mp3')
    npcAudioRef.current.volume = 0.5
    npcAudioRef.current.play().catch(err => console.log('NPC music play failed:', err))

    // Set cooldown to prevent cat from coming back for 45 seconds (while NPC music plays)
    isCooldownRef.current = true

    // Dispatch the custom event to notify ScottishFoldPop to pause for 45 seconds
    window.dispatchEvent(new CustomEvent('cat-thief-caught'))

    setTimeout(() => {
      isCooldownRef.current = false
      if (npcAudioRef.current) {
        npcAudioRef.current.pause()
      }
    }, 45000)

    // Reset state
    setIsRunning(false)
    setShowBubble(false)
  }

  if (!isRunning) return null

  return (
    <div 
      className="cart-thief" 
      style={{ left: thiefPos + 'px' }}
      onClick={handleCatch}
    >
      <div className="thief-character animate-run">
        <img 
          src="/fat-cartoon-cat-png.webp" 
          alt="Cat Thief" 
          className="thief-image" 
        />
      </div>
      {showBubble && (
        <div className="thief-speech-bubble">
          <span>Chipi Chipi Chapa Chapa! 🐱🎶</span>
          {lastStolenItem && (
            <span className="stolen-item">Yoinked your {lastStolenItem.emoji} {lastStolenItem.name}!</span>
          )}
        </div>
      )}
    </div>
  )
}
