import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useChaos } from '../context/ChaosContext.jsx'
import { useCart } from '../context/CartContext.jsx'


const DEFAULT_ITEMS = [
  { id: '1', name: 'Mystery Meat Burger', price: 120, emoji: '🍔', quantity: 1, description: 'Contains actual mystery.', image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80" },
  { id: '2', name: 'Soggy Fries', price: 60, emoji: '🍟', quantity: 2, description: 'Sweated in a paper bag for 45 minutes.', image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80" }
]

const LANDMARKS = [
  {
    pct: 12,
    name: "Pan Shop",
    title: "Chuing Pan 🍃",
    desc: "Rider stopped to chew a fresh sweet Banarasi pan.",
    coord: { x: 183, y: 60 },
    fallback: "Bhai, pehle thoda Meetha Pan khaunga, uske baad hi delivery hogi. Dimaag mat khao.",
    sound: "/Voicy_Bolo Zubaan Kesari.mp3"
  },
  {
    pct: 28,
    name: "Cigarette Tapri",
    title: "Sutta Break 🚬",
    desc: "Rider is having a quick smoke at the corner tapri.",
    coord: { x: 225, y: 162 },
    fallback: "Abhi ek Gold Flake sulgaya hai. Sutta peene de shanti se, tera food thanda ho toh micro-wave kar lena.",
    sound: "/Voicy_500 cigarettes.mp3"
  },
  {
    pct: 48,
    name: "Susu Spot",
    title: "Urgent Susu Stop 🌳",
    desc: "Rider is relieving himself behind a mango tree.",
    coord: { x: 365, y: 250 },
    fallback: "Abhi ek urgent pee break liya hai ped ke peeche. Ek toh dhoop itni hai upar se tumhara phone baj raha hai.",
    sound: "/Urination - QuickSounds.com.mp3"
  },
  {
    pct: 68,
    name: "GF's House",
    title: "GF's House Detour 💖",
    desc: "Rider took a detour to give his girlfriend a chocolate.",
    coord: { x: 440, y: 270 },
    fallback: "Arey yaar, gf gussa thi toh milne aa gaya. Usse zyada important hai kya tumhara pizza?",
    sound: "/Kissing Sound - QuickSounds.com.mp3"
  },
  {
    pct: 86,
    name: "Red Light",
    title: "Red Light Chill 🚥",
    desc: "Rider is waiting at the traffic signal, browsing TikTok.",
    coord: { x: 588, y: 320 },
    fallback: "Signal laal hai aur dhoop tez hai. Main toh chaon me khada hoon, jaldi hai toh khud aake le jao.",
    sound: "/traficc.mp3"
  }
]

const RIDER_MESSAGES = [
  "Bhaiya main map follow nahi kar raha, main surya devta ki disha dekh ke aa raha hoon. ☀️",
  "Rasta thoda kharab hai, upar se raste mein ek bohot pyaari billi mil gayi thi toh wahi ruk gaya. 🐈",
  "Sir aapke burger mein se ek bite test kiya, quality bilkul 10/10 hai! Baaki ka raste mein kha raha hoon. 🍔",
  "Main aapki building ke bahar khada hoon par yahan koi security guard nahi hai, toh main wapas jaa raha hoon. 🚪",
  "Sorry bhaiya, bike ka petrol khatam ho gaya. Ab main pogo stick pe aa raha hoon. 🛴"
]

const getRouteCoord = (pct) => {
  const segments = [
    { start: { x: 100, y: 80 }, end: { x: 250, y: 80 }, startPct: 0, endPct: 18 },
    { start: { x: 250, y: 80 }, end: { x: 250, y: 220 }, startPct: 18, endPct: 35 },
    { start: { x: 250, y: 220 }, end: { x: 480, y: 220 }, startPct: 35, endPct: 62 },
    { start: { x: 480, y: 220 }, end: { x: 480, y: 320 }, startPct: 62, endPct: 74 },
    { start: { x: 480, y: 320 }, end: { x: 700, y: 320 }, startPct: 74, endPct: 100 }
  ]
  const seg = segments.find(s => pct >= s.startPct && pct <= s.endPct) || segments[segments.length - 1]
  const segPct = (pct - seg.startPct) / (seg.endPct - seg.startPct)
  const x = seg.start.x + (seg.end.x - seg.start.x) * segPct
  const y = seg.start.y + (seg.end.y - seg.start.y) * segPct
  return { x, y }
}

const USER_REPLY_FALLBACKS = [
  "Rasta mat sikhao bhaiya, main 5 saal se yahan delivery kar raha hoon. Shanti rakho.",
  "Abhi raste mein gadi ka tyre puncher ho gaya hai. Faltu message mat karo.",
  "Main shortcut se aa raha hoon, but shortcut me bohot saare stray dogs peeche padd gaye hain! 🐕",
  "Arey yar, signal par police khadi hai aur mera challan katne wala hai. Message mat karo abhi.",
  "Dhoop bohot tez hai, main thoda neem ke ped ki chaon me resting kar raha hoon.",
  "Khana toh mere bag me hi hai, par main thoda raste me momos khane lag gaya tha. Bas 5 minute.",
  "Bhaiya main bike nahi chala raha abhi, thoda break le ke phone pe call of duty khel raha hoon."
]

export default function TrackOrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addNotification } = useChaos()
  const { activeOrder, setActiveOrder } = useCart()

  // Extract ordered items from state or activeOrder, fallback to defaults
  const orderedItems = location.state?.orderedItems || activeOrder?.orderedItems || DEFAULT_ITEMS
  const address = location.state?.address || activeOrder?.address || "Bermuda Triangle, Hangar 18"
  const phone = location.state?.phoneVal || activeOrder?.phoneVal || "9876543210"

  const orderId = location.state?.id || activeOrder?.id || 'default'

  console.log("🔍 TrackOrderPage Init Debug:", {
    orderId,
    activeOrderId: activeOrder?.id,
    locationStateId: location.state?.id,
    savedTrackId: localStorage.getItem('track_orderId'),
    savedProgress: localStorage.getItem('track_riderProgress')
  })

  // Helper to get from localstorage if the saved order id matches the current activeOrder id
  const getSavedTrackValue = (key, defaultValue) => {
    const savedId = localStorage.getItem('track_orderId')
    if (savedId === orderId) {
      const savedVal = localStorage.getItem(key)
      if (savedVal !== null) {
        try {
          return JSON.parse(savedVal)
        } catch (e) {
          return defaultValue
        }
      }
    }
    return defaultValue
  }

  // Slider state for bribing the rider (affects animation speed)
  const [bribeAmount, setBribeAmount] = useState(() => getSavedTrackValue('track_bribeAmount', 0))
  const [riderProgress, setRiderProgress] = useState(() => getSavedTrackValue('track_riderProgress', 0))
  const [riderStatus, setRiderStatus] = useState(() => getSavedTrackValue('track_riderStatus', {
    title: "Order Accepted",
    desc: "Chef is staring at the order ticket in disbelief."
  }))

  // Chat state
  const [chatHistory, setChatHistory] = useState(() => getSavedTrackValue('track_chatHistory', [
    {
      sender: 'rider',
      text: "Arey yaar, order toh accept ho gaya hai par kitchen me chef thoda busy hai nashta karne me.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]))
  const [userMessageInput, setUserMessageInput] = useState('')
  const [riderIsTyping, setRiderIsTyping] = useState(false)
  const [eta, setEta] = useState(() => getSavedTrackValue('track_eta', 20))

  // Internal state to track visited checkpoints & pauses
  const [visitedCheckpoints, setVisitedCheckpoints] = useState(() => getSavedTrackValue('track_visitedCheckpoints', []))
  const [isPaused, setIsPaused] = useState(() => getSavedTrackValue('track_isPaused', false))
  const [pausedLandmarkName, setPausedLandmarkName] = useState(() => getSavedTrackValue('track_pausedLandmarkName', ''))
  const [pauseTicksLeft, setPauseTicksLeft] = useState(() => getSavedTrackValue('track_pauseTicksLeft', 0))

  // Save orderId to localStorage when orderId changes
  useEffect(() => {
    if (orderId && orderId !== 'default') {
      localStorage.setItem('track_orderId', orderId)
    }
  }, [orderId])

  // Save tracker states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('track_riderProgress', JSON.stringify(riderProgress))
  }, [riderProgress])

  useEffect(() => {
    localStorage.setItem('track_riderStatus', JSON.stringify(riderStatus))
  }, [riderStatus])

  useEffect(() => {
    localStorage.setItem('track_chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  useEffect(() => {
    localStorage.setItem('track_eta', JSON.stringify(eta))
  }, [eta])

  useEffect(() => {
    localStorage.setItem('track_visitedCheckpoints', JSON.stringify(visitedCheckpoints))
  }, [visitedCheckpoints])

  useEffect(() => {
    localStorage.setItem('track_isPaused', JSON.stringify(isPaused))
  }, [isPaused])

  useEffect(() => {
    localStorage.setItem('track_pausedLandmarkName', JSON.stringify(pausedLandmarkName))
  }, [pausedLandmarkName])

  useEffect(() => {
    localStorage.setItem('track_pauseTicksLeft', JSON.stringify(pauseTicksLeft))
  }, [pauseTicksLeft])

  useEffect(() => {
    localStorage.setItem('track_bribeAmount', JSON.stringify(bribeAmount))
  }, [bribeAmount])

  // Chat auto-scroll reference
  const chatEndRef = useRef(null)

  // References to keep state available to the tick interval closure
  const bribeAmountRef = useRef(bribeAmount)
  useEffect(() => { bribeAmountRef.current = bribeAmount }, [bribeAmount])

  const isPausedRef = useRef(isPaused)
  useEffect(() => { isPausedRef.current = isPaused }, [isPaused])

  const pausedLandmarkNameRef = useRef(pausedLandmarkName)
  useEffect(() => { pausedLandmarkNameRef.current = pausedLandmarkName }, [pausedLandmarkName])

  const pauseTicksLeftRef = useRef(pauseTicksLeft)
  useEffect(() => { pauseTicksLeftRef.current = pauseTicksLeft }, [pauseTicksLeft])

  const visitedCheckpointsRef = useRef(visitedCheckpoints)
  useEffect(() => { visitedCheckpointsRef.current = visitedCheckpoints }, [visitedCheckpoints])

  const riderProgressRef = useRef(riderProgress)
  useEffect(() => { riderProgressRef.current = riderProgress }, [riderProgress])

  const etaRef = useRef(eta)
  useEffect(() => { etaRef.current = eta }, [eta])

  // Log active state of Mistral API Key to the console
  useEffect(() => {
    const mistralKey = import.meta.env.VITE_MISTRAL_API_KEY
    if (mistralKey && mistralKey !== 'your_mistral_api_key_here' && mistralKey.trim() !== '') {
      console.log("🤖 Mistral AI Rider Chat ACTIVE! Key successfully loaded from environment: " + mistralKey.slice(0, 8) + "...")
    } else {
      console.log("⚠️ Mistral AI Rider Chat OFFLINE: VITE_MISTRAL_API_KEY is not set or empty in .env. Using offline fallback messages.")
    }
  }, [])

  // Auto-scroll chat history
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight
    }
  }, [chatHistory, riderIsTyping])

  // Mistral AI call helper
  const getAiRiderResponse = async (contextPrompt, fallbackText) => {
    const activeKey = import.meta.env.VITE_MISTRAL_API_KEY
    if (!activeKey || activeKey === 'your_mistral_api_key_here' || activeKey.trim() === '') {
      await new Promise(r => setTimeout(r, 1000))
      return fallbackText
    }

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: 'open-mistral-7b',
          messages: [
            {
              role: 'system',
              content: `You are a lazy, rude, funny Indian delivery boy who speaks in Hinglish (Hindi + English in Latin script). Context: ${contextPrompt}. Respond to the customer in a brutal, aggressive, and sarcastic tone. Keep it under 25 words.`
            },
            {
              role: 'user',
              content: 'Jawab do.'
            }
          ]
        })
      })
      const data = await response.json()
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const rawContent = data.choices[0].message.content.trim()
        return rawContent.replace(/\*/g, '')
      }
      return fallbackText
    } catch (err) {
      console.error('Mistral API error:', err)
      return fallbackText
    }
  }

  // Sync rider progress along the path and updates statuses
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. If paused, decrement ticks
      if (isPausedRef.current) {
        const nextTicks = pauseTicksLeftRef.current - 1
        setPauseTicksLeft(nextTicks)
        if (nextTicks <= 0) {
          setIsPaused(false)
          setPausedLandmarkName('')
          setRiderStatus({
            title: "Out for Delivery",
            desc: "Rider is moving again. Keep checking your food!"
          })
          addNotification("🛵 Rider is moving again!", "info")
        }
        return
      }

      const progress = riderProgressRef.current
      if (progress >= 100) {
        clearInterval(interval)
        return
      }

      // 2. Check if we hit any new landmark
      const nextLandmark = LANDMARKS.find(l =>
        progress >= l.pct &&
        !visitedCheckpointsRef.current.includes(l.pct)
      )

      if (nextLandmark) {
        // Stop at this landmark!
        setIsPaused(true)
        setPausedLandmarkName(nextLandmark.name)
        setVisitedCheckpoints(prev => [...prev, nextLandmark.pct])
        
        // Play the funny sound effect
        if (nextLandmark.sound) {
          const audio = new Audio(nextLandmark.sound)
          audio.play().catch(e => console.error("Could not play landmark sound:", e))
        }

        // calculate pause ticks (fewer ticks if higher bribe)
        const ticks = Math.max(5, 18 - Math.floor(bribeAmountRef.current / 10))
        setPauseTicksLeft(ticks)

        // Update rider status
        setRiderStatus({
          title: nextLandmark.title,
          desc: nextLandmark.desc
        })

        addNotification(`🚨 Rider stopped: ${nextLandmark.title}`, 'warning')

        // Increase ETA by a funny random range
        const etaAdd = Math.floor(Math.random() * 3) + 2
        setEta(prev => prev + etaAdd)

        // Trigger AI chat message
        setRiderIsTyping(true)

        getAiRiderResponse(`Stopped at ${nextLandmark.name}: ${nextLandmark.desc}`, nextLandmark.fallback).then(msg => {
          setRiderIsTyping(false)
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          setChatHistory(prev => [...prev, {
            sender: 'rider',
            text: `[🚨 Checkpoint Update]: "${msg}"`,
            time: timeStr
          }])
          addNotification("📞 New status update in chat!", "warning")
        })
        return
      }

      // 3. Normal progress increment
      let increment = 0.35 + (bribeAmountRef.current / 150) * 1.5

      // If bribe is 0, 15% chance to move backward!
      if (bribeAmountRef.current === 0 && Math.random() < 0.15) {
        increment = -0.4
      }

      let nextProgress = progress + increment
      if (nextProgress < 0) nextProgress = 0
      if (nextProgress >= 100) {
        nextProgress = 100
        setRiderStatus({
          title: "Delivered (Supposedly)",
          desc: "Left near a random tree outside. Check your neighbors yards."
        })
        setEta(0)
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setChatHistory(prev => [...prev, {
          sender: 'rider',
          text: "Chalo, order deliver ho gaya. Ped ke paas phenk diya hai, dhoond lo agar kismat ho toh.",
          time: timeStr
        }])
        addNotification("🍔 Delivery complete! Good luck finding it.", "success")
        
        // Clear the active order after delivery
        setActiveOrder(null)
        
        const audio = new Audio("/Aaye.mp3")
        audio.play().catch(e => console.error("Could not play ayeen sound:", e))
      } else {
        // decrement ETA occasionally
        if (Math.random() < 0.08 && etaRef.current > 1) {
          setEta(prev => prev - 1)
        }
      }
      setRiderProgress(nextProgress)
    }, 1000)

    return () => clearInterval(interval)
  }, [addNotification])

  // Call the delivery rider
  const handleCallRider = () => {
    // Choose appropriate context
    let contextPrompt = "You are currently riding the bike."
    let fallbackText = "Rasta thoda kharab hai, surya devta ki disha dekh ke aa raha hoon. ☀️"

    if (isPausedRef.current && pausedLandmarkNameRef.current) {
      contextPrompt = `You are currently stopped at the ${pausedLandmarkNameRef.current}.`
      const activeLandmark = LANDMARKS.find(l => l.name === pausedLandmarkNameRef.current)
      if (activeLandmark) {
        fallbackText = activeLandmark.fallback
      }
    } else {
      const randomMsg = RIDER_MESSAGES[Math.floor(Math.random() * RIDER_MESSAGES.length)]
      fallbackText = randomMsg
    }

    setRiderIsTyping(true)
    addNotification("📞 Calling rider...", "info")

    getAiRiderResponse(contextPrompt, fallbackText).then(msg => {
      setRiderIsTyping(false)
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setChatHistory(prev => [...prev, {
        sender: 'rider',
        text: `[Call Transcription]: "${msg}"`,
        time: timeStr
      }])
      addNotification("📞 Call completed!", "warning")
    })
  }

  // Handle Send Message Form Submit
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!userMessageInput.trim()) return

    const userMsg = userMessageInput
    setUserMessageInput('')

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user message to chat history
    setChatHistory(prev => [...prev, {
      sender: 'user',
      text: userMsg,
      time: timeStr
    }])

    // Trigger typing indicator
    setRiderIsTyping(true)

    // Get response
    const fallbackText = USER_REPLY_FALLBACKS[Math.floor(Math.random() * USER_REPLY_FALLBACKS.length)]

    getAiRiderResponse(`Customer sent message: "${userMsg}"`, fallbackText).then(replyMsg => {
      setRiderIsTyping(false)
      setChatHistory(prev => [...prev, {
        sender: 'rider',
        text: replyMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      addNotification("📩 New message from Rider!", "warning")
    })
  }

  // Calculate coordinates
  const activeLandmark = LANDMARKS.find(l => isPaused && pausedLandmarkName === l.name)
  const riderPos = activeLandmark ? activeLandmark.coord : getRouteCoord(riderProgress)

  // Calculate bill totals
  const subtotal = orderedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const speed = location.state?.speed || activeOrder?.speed || 'normal'
  const speedCharge = speed === 'asap' ? 250 : speed === 'mouth' ? 9999999 : 0
  const grandTotal = subtotal + speedCharge + 49 + 15 + bribeAmount

  if (orderId === 'default') {
    return (
      <div className="track-page empty-track-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--neon-pink)', textAlign: 'center', textShadow: '0 0 20px rgba(255, 45, 117, 0.5)' }}>Place order garib! 😤</h1>
        <button className="back-menu-btn" style={{ fontSize: '1.5rem', padding: '1rem 2rem' }} onClick={() => navigate('/menu')}>
          🏠 Go to Menu
        </button>
      </div>
    )
  }

  return (
    <div className="track-page">
      {/* Header */}
      <header className="track-header">
        <div className="header-brand" onClick={() => navigate('/menu')}>
          <h1 className="logo-text">FOODEAT</h1>
        </div>
        <button className="back-menu-btn" onClick={() => navigate('/menu')}>
          🏠 Back to Menu
        </button>
      </header>

      <div className="track-container">
        {/* Left column: Map & Live Tracking */}
        <div className="track-left">
          <div className="track-card map-card">
            <div className="map-title-row">
              <h2>GPS Live Navigation</h2>
              <span className="map-badge">⚡ Real-Time Sabotage</span>
            </div>
            <p className="map-subtitle">Rider path is highlighted below. Tipping speeds up the bike.</p>

            {/* Interactive map wrapper */}
            <div className="map-area">
              <svg className="map-svg-grid" viewBox="0 0 800 400" width="100%" height="100%">
                <defs>
                  {/* Grid background pattern */}
                  <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#city-grid)" />

                {/* City Rivers & Parks */}
                <path d="M -50 200 Q 200 150 350 280 T 850 180" fill="none" stroke="rgba(30, 144, 255, 0.08)" strokeWidth="40" />
                <rect x="50" y="250" width="120" height="80" rx="10" fill="rgba(46, 213, 115, 0.08)" />
                <text x="110" y="295" fill="rgba(46, 213, 115, 0.3)" fontSize="12" fontWeight="bold" textAnchor="middle">Cursed Park 🌲</text>

                {/* Winding path road */}
                <path
                  id="delivery-route"
                  d="M 100 80 L 250 80 L 250 220 L 480 220 L 480 320 L 700 320"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.05)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Highlighted route path (glowing red line) */}
                <path
                  d="M 100 80 L 250 80 L 250 220 L 480 220 L 480 320 L 700 320"
                  fill="none"
                  stroke="var(--neon-pink)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 6"
                  className="glowing-route"
                />

                {/* Landmarks on map */}
                {/* Pan Shop */}
                <g transform="translate(183, 60)">
                  <circle r="14" fill="#fff" stroke="#ff7f50" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <text y="4" fontSize="12" textAnchor="middle">🍃</text>
                  <text y="-20" fontSize="9" fontWeight="bold" fill="var(--text-secondary)" textAnchor="middle">Pan Shop</text>
                </g>

                {/* Cigarette Tapri */}
                <g transform="translate(225, 162)">
                  <circle r="14" fill="#fff" stroke="#ff7f50" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <text y="4" fontSize="12" textAnchor="middle">🚬</text>
                  <text y="-20" fontSize="9" fontWeight="bold" fill="var(--text-secondary)" textAnchor="middle">Tapri</text>
                </g>

                {/* Susu Spot */}
                <g transform="translate(365, 250)">
                  <circle r="14" fill="#fff" stroke="#ff7f50" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <text y="4" fontSize="12" textAnchor="middle">🌳</text>
                  <text y="-20" fontSize="9" fontWeight="bold" fill="var(--text-secondary)" textAnchor="middle">Susu Spot</text>
                </g>

                {/* GF's House detour */}
                <g transform="translate(440, 270)">
                  <circle r="14" fill="#fff" stroke="#ff7f50" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <text y="4" fontSize="12" textAnchor="middle">💖</text>
                  <text y="-20" fontSize="9" fontWeight="bold" fill="var(--text-secondary)" textAnchor="middle">GF's House</text>
                </g>

                {/* Red Light */}
                <g transform="translate(588, 320)">
                  <circle r="14" fill="#fff" stroke="#ff7f50" strokeWidth="2" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }} />
                  <text y="4" fontSize="12" textAnchor="middle">🚥</text>
                  <text y="-20" fontSize="9" fontWeight="bold" fill="var(--text-secondary)" textAnchor="middle">Red Light</text>
                </g>

                {/* Restaurant Marker */}
                <g transform="translate(100, 80)">
                  <circle r="22" fill="#fff" stroke="#ff7f50" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.1))' }} />
                  <text y="6" fontSize="22" textAnchor="middle">🏢</text>
                  <text y="38" fontSize="10" fontWeight="bold" fill="var(--text-primary)" textAnchor="middle">RESTAURANT</text>
                </g>

                {/* User Home Marker */}
                <g transform="translate(700, 320)">
                  <circle r="22" fill="#fff" stroke="#2ed573" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.1))' }} />
                  <text y="6" fontSize="22" textAnchor="middle">🏠</text>
                  <text y="38" fontSize="10" fontWeight="bold" fill="var(--text-primary)" textAnchor="middle">MY HOUSE</text>
                </g>
              </svg>

              {/* Rider bike marker */}
              <div
                className="rider-bike-marker"
                style={{
                  left: `${(riderPos.x / 800) * 100}%`,
                  top: `${(riderPos.y / 400) * 100}%`,
                  transition: 'left 0.8s linear, top 0.8s linear'
                }}
              >
                <div className="rider-tooltip">🛵 Rider ({Math.round(riderProgress)}%)</div>
                <span className="rider-bike-emoji">🛵</span>
              </div>
            </div>

            {/* Live progress details */}
            <div className="tracker-status-box">
              <div className="tracker-indicator">
                <span className="tracker-ping"></span>
                <strong>Status: {riderStatus.title}</strong>
              </div>
              <p>{riderStatus.desc}</p>
              {isPaused && (
                <div className="pause-timer" style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--neon-pink)', fontWeight: 'bold' }}>
                  ⏳ Stuck here for another {pauseTicksLeft} seconds...
                </div>
              )}
              <div className="eta-badge" style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                🕒 Estimated Arrival: <strong>{eta > 0 ? `${eta} minutes` : 'Delivered (Supposedly)'}</strong>
              </div>
            </div>
          </div>

          {/* Interactive Bribe Rider controls */}
          <div className="track-card interaction-card">
            <h3>Rider Operations Dashboard</h3>

            <div className="bribe-section">
              <div className="bribe-header">
                <span>⚡ Bribe Rider to ride faster</span>
                <strong className="bribe-val">₹{bribeAmount} Tip</strong>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={bribeAmount}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setBribeAmount(val)
                  addNotification(`💸 Rider bribed! Delivery speed increased by ${(val / 1.5).toFixed(0)}%.`, 'success')
                }}
                className="bribe-slider"
              />
              <div className="bribe-labels">
                <span>0 Tip (Walks backward)</span>
                <span>₹75 (Normal Speed)</span>
                <span>₹150 (Supersonic Bike)</span>
              </div>
            </div>

            <div className="rider-actions-row">
              <button className="action-btn call-rider-btn" onClick={handleCallRider}>
                📞 Call Delivery Rider
              </button>
              <button className="action-btn report-btn" onClick={() => addNotification("🚫 Support Desk closed because employees went to sleep.", "error")}>
                ⚠️ Report Delay
              </button>
            </div>

            {/* Live Chat with Rider */}
            <div className="rider-chat-section">
              <h4>💬 Chat with Delivery Agent (Hinglish AI)</h4>
              <div className="chat-thread-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                      <span className="chat-avatar">{msg.sender === 'user' ? '👤' : '🧔'}</span>
                      <div className="chat-bubble">
                        <span className="chat-sender-name">{msg.sender === 'user' ? 'You' : 'Rider'}</span>
                        <p className="chat-message-text">{msg.text}</p>
                        <span className="chat-timestamp">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {riderIsTyping && (
                    <div className="chat-bubble-wrapper rider">
                      <span className="chat-avatar">🧔</span>
                      <div className="chat-bubble typing-bubble">
                        <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Type a message to rider..."
                  value={userMessageInput}
                  onChange={(e) => setUserMessageInput(e.target.value)}
                  className="chat-text-input"
                />
                <button type="submit" className="chat-send-btn">Send ⚡</button>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Ordered Products Receipt */}
        <div className="track-right">
          <div className="track-card receipt-card">
            <h3>Ordered Products</h3>
            <div className="receipt-items-list">
              {orderedItems.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="receipt-item-image" />
                  ) : (
                    <span className="receipt-item-emoji">{item.emoji}</span>
                  )}
                  <div className="receipt-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="receipt-item-price-qty">
                    <span className="qty-tag">x{item.quantity}</span>
                    <span className="price-tag">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-totals">
              <div className="receipt-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="receipt-row">
                <span>Regret Speed Upgrade ({speed.toUpperCase()})</span>
                <span>₹{speedCharge}</span>
              </div>
              <div className="receipt-row">
                <span>Oxygen Service Charge</span>
                <span>₹49</span>
              </div>
              <div className="receipt-row">
                <span>Rider Bribe Tip</span>
                <span>₹{bribeAmount}</span>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-row grand-total-row">
                <span>Grand Total</span>
                <span className="grand-total-val">₹{grandTotal}</span>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="delivery-destination">
                <span>📍 Delivery Address:</span>
                <p>{address}</p>
              </div>
              <div className="delivery-destination">
                <span>📱 Registered Phone:</span>
                <p>+91 {phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
