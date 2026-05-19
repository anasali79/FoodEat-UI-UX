import { useEffect, useRef } from 'react'
import { useChaos } from '../context/ChaosContext.jsx'


export default function RageCursor() {
  const { cursorSize } = useChaos()
  const cursorRef = useRef(null)

  useEffect(() => {
    const handleMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - cursorSize / 2 + 'px'
        cursorRef.current.style.top = e.clientY - cursorSize / 2 + 'px'
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [cursorSize])

  if (cursorSize <= 30) return null

  return (
    <div
      ref={cursorRef}
      className="rage-cursor"
      style={{
        width: cursorSize + 'px',
        height: cursorSize + 'px',
        fontSize: Math.max(12, cursorSize * 0.4) + 'px'
      }}
    >
      {cursorSize > 60 ? '😡' : cursorSize > 45 ? '😤' : '🖱️'}
    </div>
  )
}
