import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'


const CURSED_PLACEHOLDERS = [
  "your_ex@heartbreak.com",
  "definitely_not_a_bot@fake.com",
  "hungry_and_desperate@food.com",
  "i_have_no_taste@cursed.com",
  "sold_my_soul@pizza.com",
]

const FAKE_LOADING_MESSAGES = [
  "Checking if you're human... 🤖",
  "Verifying your food worthiness...",
  "Consulting the pizza gods... 🍕",
  "Running background check on your stomach...",
  "Hacking into your fridge... 🧊",
  "Calculating your hunger level...",
  "Bribing the authentication server... 💰",
  "Almost there... (we said that 3 lies ago)",
  "Reticulating splines... 🧬",
  "Summoning the delivery demons... 👹",
]

const VISUAL_ITEMS = [
  { id: 0, label: "🍕 Pizza" },
  { id: 1, label: "🥦 Broccoli" },
  { id: 2, label: "💸 Bribe Money" },
  { id: 3, label: "🐛 Coding Bug" },
  { id: 4, label: "☕ Coffee" },
  { id: 5, label: "🪳 Cockroach" },
]

function CursedFightGame({ onWin, onLose }) {
  const canvasRef = useRef(null)
  const [round, setRound] = useState(1)
  const [status, setStatus] = useState('playing') // 'playing', 'round_clear', 'win', 'lose'
  const keys = useRef({ a: false, d: false, space: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = true
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = true
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        keys.current.space = true
      }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = false
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = false
      if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    // Physics vars
    let px = 80
    let py = 280
    let pWidth = 50
    let pHeight = 80
    let pHealth = 100
    let pAttacking = false
    let pAttackCooldown = 0
    let pFlash = 0

    let ex = 670
    let ey = 280
    let eWidth = 50
    let eHeight = 80
    
    // Enemy scaling based on round
    const maxEnemyHealth = 100 + (round - 1) * 30
    let eHealth = maxEnemyHealth
    let eAttacking = false
    let eAttackCooldown = 0
    let eFlash = 0

    const enemySpeed = 0.8 + (round - 1) * 0.45
    const enemyDamage = 8 + (round - 1) * 3
    const enemyAttackProb = 0.01 + (round - 1) * 0.005

    let particles = []

    const playSound = (freq, type = 'square', duration = 0.1) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + duration)
      } catch (e) { }
    }

    const createHitParticles = (x, y) => {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 15 + Math.floor(Math.random() * 15),
          color: `hsl(${Math.random() * 360}, 100%, 60%)`
        })
      }
    }

    let gameEnded = false

    const loop = () => {
      if (gameEnded || status !== 'playing') return

      // Update positions
      if (keys.current.a) px -= 2.6
      if (keys.current.d) px += 2.6

      // Boundary checks
      if (px < 0) px = 0
      if (px > 800 - pWidth) px = 800 - pWidth

      // Attack triggers
      if (keys.current.space && pAttackCooldown <= 0) {
        pAttacking = true
        pAttackCooldown = 18
        playSound(440, 'triangle', 0.1)
        // Hit check
        const distance = Math.abs((px + pWidth / 2) - (ex + eWidth / 2))
        if (distance < 95) {
          eHealth -= 20
          eFlash = 10
          playSound(180, 'sawtooth', 0.12)
          createHitParticles(ex + eWidth / 2, ey + eHeight / 2)
          ex += 25
          if (ex > 800 - eWidth) ex = 800 - eWidth
        }
      }

      // Computer Enemy AI
      const distance = Math.abs((px + pWidth / 2) - (ex + eWidth / 2))
      if (distance > 60) {
        if (ex > px + pWidth / 2) {
          ex -= enemySpeed
        } else {
          ex += enemySpeed
        }
      }

      // Enemy Attack
      if (distance < 85 && eAttackCooldown <= 0) {
        if (Math.random() < enemyAttackProb) {
          eAttacking = true
          eAttackCooldown = 22
          playSound(350, 'triangle', 0.1)

          if (distance < 85) {
            pHealth -= enemyDamage
            pFlash = 10
            playSound(150, 'sawtooth', 0.15)
            createHitParticles(px + pWidth / 2, py + pHeight / 2)
            px -= 20
            if (px < 0) px = 0
          }
        }
      }

      // Decrement timers
      if (pAttackCooldown > 0) pAttackCooldown--
      if (eAttackCooldown > 0) eAttackCooldown--
      if (pFlash > 0) pFlash--
      if (eFlash > 0) eFlash--

      if (pAttackCooldown < 10) pAttacking = false
      if (eAttackCooldown < 12) eAttacking = false

      // Update particles
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        if (p.life <= 0) particles.splice(idx, 1)
      })

      // Check game over
      if (pHealth <= 0) {
        pHealth = 0
        gameEnded = true
        playSound(80, 'sawtooth', 0.8)
        setStatus('lose')
      } else if (eHealth <= 0) {
        eHealth = 0
        gameEnded = true
        playSound(650, 'sine', 0.5)
        if (round < 3) {
          setStatus('round_clear')
        } else {
          setStatus('win')
        }
      }

      // DRAWING
      ctx.clearRect(0, 0, 800, 400)

      // Ring Floor
      ctx.fillStyle = '#292524'
      ctx.fillRect(0, 0, 800, 400)
      ctx.fillStyle = '#78716c'
      ctx.fillRect(0, 360, 800, 40)
      ctx.fillStyle = '#f43f5e'
      ctx.fillRect(0, 356, 800, 4)

      // Arena cage background lines
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.1)'
      ctx.lineWidth = 2
      for (let i = 0; i < 800; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, 356)
        ctx.stroke()
      }

      // Draw HUD (Health bars)
      // Player
      ctx.fillStyle = '#444'
      ctx.fillRect(20, 20, 250, 20)
      ctx.fillStyle = pFlash > 0 ? '#ef4444' : '#22c55e'
      ctx.fillRect(20, 20, Math.max(0, pHealth * 2.5), 20)
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(20, 20, 250, 20)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px Outfit, sans-serif'
      ctx.fillText(`YOU (🧑‍🍳 CHEF): ${pHealth}%`, 20, 55)

      // Enemy
      ctx.fillStyle = '#444'
      ctx.fillRect(530, 20, 250, 20)
      ctx.fillStyle = eFlash > 0 ? '#ffffff' : '#e11d48'
      ctx.fillRect(530, 20, Math.max(0, (eHealth / maxEnemyHealth) * 250), 20)
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(530, 20, 250, 20)
      ctx.fillStyle = '#fff'
      ctx.fillText(`CURSED BOT (🤖 ROUND ${round}): ${Math.round((eHealth / maxEnemyHealth) * 100)}%`, 530, 55)

      // Controls overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.font = '11px Courier New'
      ctx.fillText(`[A/D] Move | [SPACE] Punch | ROUND ${round} OF 3`, 310, 50)

      // Draw Player (Chef)
      ctx.save()
      if (pFlash > 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'
      } else {
        ctx.fillStyle = '#f59e0b'
      }
      // Body
      ctx.fillRect(px, py, pWidth, pHeight)
      // Chef Hat
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(px + 5, py - 20, pWidth - 10, 20)
      ctx.beginPath()
      ctx.arc(px + pWidth / 2, py - 20, 15, 0, Math.PI * 2)
      ctx.fill()
      // Spatula swing weapon
      if (pAttacking) {
        ctx.fillStyle = '#eab308'
        ctx.fillRect(px + pWidth, py + 20, 30, 8)
        ctx.fillStyle = '#9ca3af'
        ctx.fillRect(px + pWidth + 30, py + 12, 10, 24)
      } else {
        ctx.fillStyle = '#eab308'
        ctx.fillRect(px + pWidth - 10, py + 10, 10, 30)
      }
      ctx.restore()

      // Draw Enemy (Bot)
      ctx.save()
      if (eFlash > 0) {
        ctx.fillStyle = 'white'
      } else {
        ctx.fillStyle = '#881337'
      }
      // Robot Body
      ctx.fillRect(ex, ey, eWidth, eHeight)
      // Antennas
      ctx.fillStyle = '#f43f5e'
      ctx.fillRect(ex + 10, ey - 15, 5, 15)
      ctx.fillRect(ex + eWidth - 15, ey - 15, 5, 15)
      ctx.beginPath()
      ctx.arc(ex + 12, ey - 15, 4, 0, Math.PI * 2)
      ctx.arc(ex + eWidth - 13, ey - 15, 4, 0, Math.PI * 2)
      ctx.fill()
      // Red glowing eyes
      ctx.fillStyle = '#f43f5e'
      ctx.fillRect(ex + 8, ey + 12, 8, 4)
      ctx.fillRect(ex + eWidth - 16, ey + 12, 8, 4)
      // Sword weapon
      if (eAttacking) {
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(ex - 25, ey + 25, 25, 8)
      } else {
        ctx.fillStyle = '#b91c1c'
        ctx.fillRect(ex, ey + 20, 10, 30)
      }
      ctx.restore()

      // Draw particles
      particles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 4, 4)
      })

      if (!gameEnded && status === 'playing') {
        animationId = requestAnimationFrame(loop)
      }
    }

    loop()
    return () => cancelAnimationFrame(animationId)
  }, [status, round])

  const nextRound = () => {
    setRound(prev => prev + 1)
    setStatus('playing')
  }

  return (
    <div className="fight-game-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="fight-canvas"
      />
      {status === 'round_clear' && (
        <div className="fight-overlay win">
          <h2>🏆 ROUND {round} CLEARED!</h2>
          <p>The Cursed Server Bot has retreated temporarily. Prepare for the next round!</p>
          <button className="confirm-btn" onClick={nextRound}>
            Start Round {round + 1}
          </button>
        </div>
      )}
      {status === 'win' && (
        <div className="fight-overlay win">
          <h2>🏆 GRAND VICTORY!</h2>
          <p>You beat the Cursed Server Bot in all 3 rounds of honorable combat!</p>
          <button className="confirm-btn" onClick={onWin}>
            Verify and Log In
          </button>
        </div>
      )}
      {status === 'lose' && (
        <div className="fight-overlay lose">
          <h2>💀 NOOB! (Defeated in Round {round})</h2>
          <p>You were defeated by the Cursed Bot. You are not worthy of ordering food.</p>
          <button className="confirm-btn reset" onClick={onLose}>
            Try Verification Again
          </button>
        </div>
      )}
    </div>
  )
}

export default function LoginPage({ isRegisterMode = false }) {
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [failCount, setFailCount] = useState(0)
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 })
  const [isButtonEvading, setIsButtonEvading] = useState(false)
  const [placeholder, setPlaceholder] = useState(CURSED_PLACEHOLDERS[0])
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [termsText, setTermsText] = useState(isRegisterMode ? "I agree to auction my keyboard to the dark web" : "I agree to sell my soul for food")
  const buttonRef = useRef(null)

  // Verification state machine: 'form', 'math', 'trivia', 'visual', 'game'
  const [activeStep, setActiveStep] = useState('form')
  const [mathAnswer, setMathAnswer] = useState('')
  const [selectedHappiness, setSelectedHappiness] = useState([])

  useEffect(() => {
    if (isLoggedIn) navigate('/menu')
  }, [isLoggedIn, navigate])

  useEffect(() => {
    setTermsText(isRegisterMode ? "I agree to auction my keyboard to the dark web" : "I agree to sell my soul for food")
  }, [isRegisterMode])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(CURSED_PLACEHOLDERS[Math.floor(Math.random() * CURSED_PLACEHOLDERS.length)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleButtonHover = () => {
    if (failCount >= 1 && !isButtonEvading) {
      setIsButtonEvading(true)
      const maxX = 200
      const maxY = 100
      setButtonOffset({
        x: (Math.random() - 0.5) * maxX,
        y: (Math.random() - 0.5) * maxY,
      })
      setTimeout(() => setIsButtonEvading(false), 800)
    }
  }

  const startVerificationFlow = () => {
    setLoginError('')
    setIsLoading(true)
    setLoadingIdx(0)

    let timerIdx = 0
    const loadTimer = setInterval(() => {
      if (timerIdx < FAKE_LOADING_MESSAGES.length - 1) {
        setLoadingMsg(FAKE_LOADING_MESSAGES[timerIdx])
        setLoadingIdx(timerIdx)
        timerIdx++
      } else {
        clearInterval(loadTimer)
        setIsLoading(false)
        setActiveStep('math')
      }
    }, 400)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (isRegisterMode) {
      if (!name.trim()) {
        setLoginError("We need a name to address your ransom letter. ✉️")
        return
      }
      if (!email.trim() || !password) {
        setLoginError("Fields can't be empty... or can they? 🤔")
        return
      }
      if (password.length < 3) {
        setLoginError("Password too short. Like your attention span. 📏")
        return
      }
      if (password !== confirmPassword) {
        setLoginError("Passwords don't match! Double-check your finger coordination. 🖐️")
        return
      }
      if (!termsAgreed) {
        setLoginError("You must sell your soul to register! Check the box. 📜")
        return
      }
    } else {
      if (!email || !password) {
        setLoginError("Fields can't be empty... or can they? 🤔")
        return
      }
      if (password.length < 3) {
        setLoginError("Password too short. Like your attention span. 📏")
        return
      }
      if (!termsAgreed) {
        setLoginError("You must agree to sell your soul to log in! Check the box. 📜")
        return
      }
    }

    startVerificationFlow()
  }

  const handleVerifyMath = (e) => {
    e.preventDefault()
    setLoginError('')
    if (mathAnswer.trim() === '69') {
      setActiveStep('trivia')
    } else {
      setLoginError("Wrong BODMAS answer! Think about operator precedence. (Hint: Multiplication first!)")
    }
  }

  const handleVerifyTrivia = (option) => {
    setLoginError('')
    if (option === 'B') {
      setActiveStep('visual')
    } else {
      setLoginError("❌ Wrong! Pineapple, cheese & mushrooms belong on pizza. Try again.")
    }
  }

  const toggleHappinessCell = (id) => {
    if (selectedHappiness.includes(id)) {
      setSelectedHappiness(prev => prev.filter(x => x !== id))
    } else {
      setSelectedHappiness(prev => [...prev, id])
    }
  }

  const handleVerifyVisual = () => {
    setLoginError('')
    // Pizza (0), Bribe Money (2), Coffee (4)
    const isCorrect = selectedHappiness.includes(0) &&
      selectedHappiness.includes(2) &&
      selectedHappiness.includes(4) &&
      !selectedHappiness.includes(1) &&
      !selectedHappiness.includes(3) &&
      !selectedHappiness.includes(5)

    if (isCorrect) {
      setActiveStep('game')
    } else {
      setLoginError("❌ Incorrect selection! You selected sadness. Select ONLY Pizza, Coffee, and Bribe money.")
      setSelectedHappiness([])
    }
  }

  const handleGameVictory = () => {
    login({ 
      email: email || 'cursed_buyer@domain.com', 
      name: isRegisterMode ? (name || 'Cursed Registrant') : (email ? email.split('@')[0] : 'Cursed Buyer') 
    })
    navigate('/menu')
  }

  const handleGameDefeat = () => {
    setActiveStep('math')
    setMathAnswer('')
    setSelectedHappiness([])
    setLoginError("❌ Defeated! You lost to the Server Bot. Restarting verification sequence!")
  }

  return (
    <div className="login-page">
      {/* Floating food emojis background */}
      <div className="login-bg-emojis">
        {['🍕', '🍔', '🌮', '🍣', '🍩', '🍜', '🥟', '🧁', '☕', '🍱', '🌶️', '🥗'].map((emoji, i) => (
          <span
            key={i}
            className="bg-emoji"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              fontSize: `${1.2 + Math.random() * 1.5}rem`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {activeStep === 'game' ? (
        <div className="captcha-step game-step">
          <h2 className="step-title">🥋 Step 4: Tekken Verification</h2>
          <p className="step-desc">Defeat the Cursed Server Bot! Left/Right: A/D key, Attack: SPACEBAR.</p>

          <CursedFightGame
            onWin={handleGameVictory}
            onLose={handleGameDefeat}
          />

          {loginError && <p className="captcha-err">{loginError}</p>}
        </div>
      ) : (
        <div className="login-container">
          <div className="login-logo">
            <h1 className="logo-text">FOODEAT</h1>
            <p className="logo-tagline">Food Delivery From Hell 🔥</p>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="fake-loading">
              <div className="loading-spinner"></div>
              <p className="loading-message">{loadingMsg}</p>
              <div className="loading-bar">
                <div
                  className="loading-bar-fill"
                  style={{ width: `${((loadingIdx + 1) / FAKE_LOADING_MESSAGES.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 0: LOGIN FORM */}
          {!isLoading && activeStep === 'form' && (
            <>
              <div className="login-warning">
                <span>⚠️</span>
                <span>
                  {isRegisterMode 
                    ? "By registering, you agree that we will auction your keyboard to the dark web" 
                    : "By logging in, you agree to receive 847 notifications per minute"}
                </span>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {isRegisterMode && (
                  <div className="input-group">
                    <label>👤 Name (what do we call our victim?)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe (soon to be deceased)"
                      className="login-input"
                      autoComplete="off"
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>📧 Email (we'll spam it)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="login-input"
                    autoComplete="off"
                  />
                </div>

                <div className="input-group">
                  <label>🔒 Password (we won't even check)</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRegisterMode ? "must be at least 3 chars" : "literally anything works"}
                      className="login-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {isRegisterMode && (
                  <div className="input-group">
                    <label>🔒 Confirm Password (must match, or does it?)</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="type it again correctly"
                        className="login-input"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="terms-row">
                  <label className="terms-label">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="terms-checkbox"
                    />
                    <span className="terms-checkmark"></span>
                    <span className="terms-text">{termsText}</span>
                  </label>
                </div>

                {loginError && (
                  <div className="login-error">
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  ref={buttonRef}
                  type="submit"
                  className={`login-btn ${isButtonEvading ? 'evading' : ''}`}
                  style={{
                    transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                  }}
                  onMouseEnter={handleButtonHover}
                >
                  {isRegisterMode 
                    ? (failCount === 0 ? '🚀 Create Account & Face Trials' : '😤 TRY REGISTERING AGAIN') 
                    : (failCount === 0 ? '🚀 Enter the Chaos' : '😤 TRY AGAIN (pls work)')}
                </button>
              </form>

              <div className="login-footer">
                {isRegisterMode ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Already have an account? Sign In</a>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>New here? Sign Up</a>
                )}
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy (LOL)</a>
              </div>

              <div className="social-login">
                <p>{isRegisterMode ? "Or register with:" : "Or sign in with:"}</p>
                <div className="social-buttons">
                  <button className="social-btn" onClick={() => { 
                    if (isRegisterMode) setName('Google Victim');
                    setEmail('google_victim@gmail.com'); 
                    setPassword('googleIsWatching'); 
                    if (isRegisterMode) setConfirmPassword('googleIsWatching');
                    startVerificationFlow() 
                  }}>
                    🔍 Google (we'll read your emails)
                  </button>
                  <button className="social-btn" onClick={() => { 
                    if (isRegisterMode) setName('GitHub Nerd');
                    setEmail('github_nerd@github.com'); 
                    setPassword('gitCommitOrDie'); 
                    if (isRegisterMode) setConfirmPassword('gitCommitOrDie');
                    startVerificationFlow() 
                  }}>
                    🐙 GitHub (we'll fork your repos)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 1: MATH CAPTCHA */}
          {!isLoading && activeStep === 'math' && (
            <div className="captcha-step">
              <h2 className="step-title">🧮 Step 1: BODMAS Bot Test</h2>
              <p className="step-desc">Solve this math riddle to prove you're not an automated scraper.</p>

              <div className="math-question-box">
                <code>69 + 420 × 0 = ?</code>
              </div>

              <form onSubmit={handleVerifyMath} className="captcha-form">
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="Enter answer"
                  className="login-input captcha-input"
                  autoFocus
                  required
                />

                {loginError && <p className="captcha-err">{loginError}</p>}

                <button type="submit" className="login-btn captcha-btn">
                  Verify Math Skills 🧠
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: TRIVIA QUIZ */}
          {!isLoading && activeStep === 'trivia' && (
            <div className="captcha-step">
              <h2 className="step-title">💡 Step 2: Human Culinary Quiz</h2>
              <p className="step-desc">Prove you possess emotional intelligence. Choose correct option.</p>

              <div className="trivia-question">
                Which ingredient absolutely does NOT belong on a fresh pizza?
              </div>

              <div className="trivia-options">
                <button className="trivia-option-btn" onClick={() => handleVerifyTrivia('A')}>
                  Option A: Pineapple (Pineapple is sweet, it's allowed)
                </button>
                <button className="trivia-option-btn" onClick={() => handleVerifyTrivia('B')}>
                  Option B: Tears of React Developers (Makes it too salty)
                </button>
                <button className="trivia-option-btn" onClick={() => handleVerifyTrivia('C')}>
                  Option C: Mozzarella Cheese (Delicious dairy fat)
                </button>
                <button className="trivia-option-btn" onClick={() => handleVerifyTrivia('D')}>
                  Option D: Sliced Mushrooms (Fungi are healthy)
                </button>
              </div>

              {loginError && <p className="captcha-err">{loginError}</p>}
            </div>
          )}

          {/* STEP 3: VISUAL PUZZLE */}
          {!isLoading && activeStep === 'visual' && (
            <div className="captcha-step">
              <h2 className="step-title">🖼️ Step 3: Select Happiness</h2>
              <p className="step-desc">Click to select only the cells containing "Real Happiness".</p>

              <div className="visual-captcha-grid">
                {VISUAL_ITEMS.map((item) => {
                  const selected = selectedHappiness.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`visual-cell ${selected ? 'selected' : ''}`}
                      onClick={() => toggleHappinessCell(item.id)}
                    >
                      <span className="cell-emoji">{item.label.split(' ')[0]}</span>
                      <span className="cell-text">{item.label.split(' ').slice(1).join(' ')}</span>
                    </div>
                  )
                })}
              </div>

              {loginError && <p className="captcha-err">{loginError}</p>}

              <button className="login-btn captcha-btn" onClick={handleVerifyVisual}>
                Verify Image Selection 🎨
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
