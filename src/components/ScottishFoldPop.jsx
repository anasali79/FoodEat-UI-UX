import { useState, useEffect, useRef } from 'react'


export default function ScottishFoldPop() {
  const [pops, setPops] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)

  // Listen to the custom event when the cat thief is caught
  useEffect(() => {
    const handleThiefCaught = () => {
      isPausedRef.current = true
      setIsPaused(true)

      // Resume spawning after 45 seconds
      setTimeout(() => {
        isPausedRef.current = false
        setIsPaused(false)
      }, 45000)
    }

    window.addEventListener('cat-thief-caught', handleThiefCaught)
    return () => {
      window.removeEventListener('cat-thief-caught', handleThiefCaught)
    }
  }, [])

  useEffect(() => {
    const spawnPop = () => {
      // Check if spawner is paused
      if (isPausedRef.current) return

      // Play the sound
      const audio = new Audio('/fahhhhh.mp3')
      audio.volume = 0.6
      audio.play().catch(err => console.log('Audio playback block or failure:', err))

      // Generate pop settings
      const newPop = {
        id: Math.random() + '-' + Date.now(),
        top: Math.random() * 60 + 15, // 15% to 75%
        left: Math.random() * 60 + 15,
        rotation: (Math.random() - 0.5) * 40, // -20deg to 20deg
        scale: Math.random() * 0.3 + 0.8, // 0.8 to 1.1 scale
      }

      setPops(prev => [...prev, newPop])

      // Auto-remove pop after 3.5 seconds
      setTimeout(() => {
        setPops(prev => prev.filter(p => p.id !== newPop.id))
      }, 3500)
    }

    // Spawn every 30 seconds
    const interval = setInterval(spawnPop, 30000)

    // Spawn initial pop after 10 seconds
    const initialTimeout = setTimeout(spawnPop, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [])

  const removePop = (id) => {
    setPops(prev => prev.filter(p => p.id !== id))
  }

  return (
    <>
      {/* Optional: cute debug indicator showing if the cat pops are paused */}
      {isPaused && (
        <div className="scottish-fold-status">
          💤 Scottish Fold is resting for 45s (Thief was caught!)
        </div>
      )}

      {pops.map(pop => (
        <div
          key={pop.id}
          className="scottish-fold-pop-container"
          style={{
            top: `${pop.top}%`,
            left: `${pop.left}%`,
            transform: `translate(-50%, -50%) rotate(${pop.rotation}deg) scale(${pop.scale})`,
          }}
          onClick={() => removePop(pop.id)}
        >
          <div className="scottish-fold-pop-card">
            <img
              src="/scottish-fold-playing.webp"
              alt="Scottish Fold Cat"
              className="scottish-fold-image"
            />
            <div className="cat-caption">FAHHHHH! 🐱🔊</div>
          </div>
        </div>
      ))}
    </>
  )
}
