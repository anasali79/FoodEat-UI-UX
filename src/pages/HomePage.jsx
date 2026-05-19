import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useChaos } from '../context/ChaosContext.jsx'


export default function HomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, user, login } = useAuth()
  const { addToCart, getItemCount, activeOrder } = useCart()
  const { addNotification } = useChaos()

  // Modal States
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [captchaInput, setCaptchaInput] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [captchaError, setCaptchaError] = useState('')

  // Evading button offset
  const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 })

  // Noodle items data matching the screenshot
  const NOODLE_ITEMS = [
    {
      id: 17,
      name: "Noodles three",
      desc: "White plate with dried shrimps",
      price: "200",
      rating: "8.1",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=500",
      emoji: "🍜"
    },
    {
      id: 18,
      name: "Noodles one",
      desc: "Noodles spicy boil with seafood and pork in hot pot",
      price: "69",
      rating: "9.2",
      image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=500",
      emoji: "🍜"
    },
    {
      id: 19,
      name: "Noodles two",
      desc: "Noodles prawn spicy soup",
      price: "180",
      rating: "8.5",
      image: "https://images.unsplash.com/photo-1600490036275-35f5f1656861?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      emoji: "🍜"
    }
  ]

  // Redirect if not logged in
  const ensureLoggedIn = () => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }

  const handleAddToCart = (item) => {
    ensureLoggedIn()

    // 10% chance of adding a "Surprise item" instead
    if (Math.random() > 0.9) {
      const surprise = { id: 99, name: "Mysterious Green Slime", price: 99, emoji: "🟢" }
      addToCart(surprise)
      addNotification("👽 Culinary Anomaly: Added 'Mysterious Green Slime' instead of Noodles!", "warning")
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: parseInt(item.price),
        emoji: item.emoji,
        description: item.desc,
        category: "Noodles"
      })
      addNotification(`🍜 Added ${item.name} to cart! Catch the thief cat if it runs!`, "success")
    }
  }

  // Cursed booking modal steps
  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) {
      addNotification("📅 Please select a date in 2085.", "warning")
      return
    }
    setBookingStep(2) // Move to Captcha
  }

  const handleCaptchaVerify = (e) => {
    e.preventDefault()
    if (captchaInput.trim() === "2x * e^(x^2)" || captchaInput.trim() === "2x e^(x^2)") {
      setBookingStep(3) // Success
      addNotification("🎉 Table booked! Wait, we gave it to someone else.", "success")
    } else {
      setCaptchaError("Wrong answer. Are you sure you are a human or just an uneducated cat?")
      addNotification("❌ CAPTCHA verification failed!", "error")
    }
  }

  // Make the correct captcha answer button evade on hover
  const handleEvadeHover = () => {
    const maxX = 120
    const maxY = 60
    setEvadeOffset({
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY
    })
    addNotification("🏃 Catch the button if you can!", "info")
  }

  // Custom click services handler
  const handleServiceClick = (serviceType) => {
    if (serviceType === 'booking') {
      setShowBookingModal(true)
    } else if (serviceType === 'catering') {
      addNotification("🤵 Catering service is fully booked for weddings in the year 2045.", "warning")
    } else if (serviceType === 'membership') {
      addNotification("💳 VIP Membership requires a deposit of 10,000 Dogecoins.", "error")
    } else if (serviceType === 'delivery') {
      addNotification("🚚 Standard delivery: 4-6 business weeks. Food quality not guaranteed.", "info")
    }
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/')}>
          FOODEAT
        </div>
        <div className="home-header-right">
          <nav className="home-nav">
            <button className="nav-link active" onClick={() => navigate('/')}>HOME</button>
            <button className="nav-link" onClick={() => { ensureLoggedIn(); navigate('/menu') }}>MENU</button>
            <button className="nav-link" onClick={() => navigate('/about')}>ABOUT</button>
            {activeOrder && (
              <button className="nav-link track-order-nav" onClick={() => navigate('/track', { state: activeOrder })}>
                TRACK ORDER 🛵
              </button>
            )}
          </nav>
          <div className="home-user-actions">
            {isLoggedIn ? (
              <div className="avatar-dropdown">
                <span className="user-welcome-home">👋 {user.name}</span>
                <button className="cart-badge-btn" onClick={() => navigate('/cart')}>
                  🛒 <span className="cart-badge-count">{getItemCount()}</span>
                </button>
                <button className="nav-login-btn small" onClick={() => navigate('/menu')}>Portal</button>
              </div>
            ) : (
              <button className="nav-login-btn" onClick={() => navigate('/login')}>
                <img src="/fat-cartoon-cat-png.webp" alt="Avatar" className="header-avatar" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text-col">
          <h1 className="hero-title">Delicious Food Is<br />Waiting For You</h1>
          <p className="hero-subtitle">
            Our team of registered nurses and skilled healthcare professionals provide in-home nursing
          </p>
          <div className="hero-buttons">
            <button className="btn-food-menu" onClick={() => { ensureLoggedIn(); navigate('/menu') }}>
              Food Menu
            </button>
            <button className="btn-book-table" onClick={() => setShowBookingModal(true)}>
              Book a Table
            </button>
          </div>
        </div>
        <div className="hero-img-col">
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
              alt="Delicious Food Poke Bowl"
              className="hero-food-img"
            />
          </div>
        </div>
      </section>

      {/* Top List / Mainstay Menu Section */}
      <section className="top-list-section">
        <h2 className="top-list-title">Top List</h2>
        <p className="top-list-subtitle">Our mainstay menu</p>

        <div className="top-list-grid">
          {NOODLE_ITEMS.map((item, index) => (
            <div className="noodle-card animate-card" key={item.id} style={{ animationDelay: `${index * 150}ms` }}>
              <div className="noodle-img-wrapper">
                <img src={item.image} alt={item.name} className="noodle-img" />
              </div>
              <div className="noodle-card-body">
                <div className="noodle-rating">
                  <span className="star-icon">⭐</span>
                  <span className="rating-val">{item.rating}</span>
                </div>
                <h3 className="noodle-title">{item.name}</h3>
                <p className="noodle-desc">{item.desc}</p>
                <div className="noodle-footer">
                  <span className="noodle-price">{item.price}</span>
                  <button className="noodle-add-btn" onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login')
                      return
                    }
                    handleAddToCart(item)
                    navigate('/menu')
                  }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* French Fries Promo Section */}
      <section className="fries-promo-section">
        <div className="fries-img-col">
          <div className="fries-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800"
              alt="Crispy French Fries"
              className="fries-img"
            />
          </div>
        </div>
        <div className="fries-text-col">
          <h2 className="fries-title">Best Potatoes For<br />French Fries</h2>
          <p className="fries-desc">
            Russet potatoes are ideal. Since they're dense, they don't contain as much water inside, which allows them to get extra crispy.
          </p>
        </div>
      </section>

      {/* Services Footer Section */}
      <section className="services-section">
        <h3 className="services-title">Our services</h3>
        <div className="services-grid">
          <div className="service-item" onClick={() => handleServiceClick('booking')}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <span className="service-text">Online booking</span>
          </div>

          <div className="service-item" onClick={() => handleServiceClick('catering')}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18h12"></path>
                <path d="M2 18h20"></path>
                <path d="M12 2v4"></path>
                <path d="M5 14a7 7 0 0 1 14 0H5z"></path>
              </svg>
            </div>
            <span className="service-text">Catering service</span>
          </div>

          <div className="service-item" onClick={() => handleServiceClick('membership')}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="service-text">Membership</span>
          </div>

          <div className="service-item" onClick={() => handleServiceClick('delivery')}>
            <div className="service-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <span className="service-text">Delivery service</span>
          </div>
        </div>
      </section>

      {/* Booking Cursed Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="modal-close" onClick={() => { setShowBookingModal(false); setBookingStep(1); }}>×</button>

            {bookingStep === 1 && (
              <form onSubmit={handleBookingSubmit} className="modal-step-form">
                <h3>📅 Reserve Your Cursed Table</h3>
                <p className="modal-instruction">Choose a date and time. (Subject to instant cancellation if our chefs feel lazy).</p>

                <div className="form-group">
                  <label>Select Date:</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="modal-select"
                  >
                    <option value="">-- Choose Date --</option>
                    <option value="2085-02-31">February 31, 2085 (Uncrowded)</option>
                    <option value="2026-05-19">Today (Already expired at 3:17 AM)</option>
                    <option value="2145-12-25">Christmas Day, 2145</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Time Slot:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="modal-select"
                  >
                    <option value="">-- Choose Time --</option>
                    <option value="03:17">03:17 AM (Breakfast rush)</option>
                    <option value="12:00">12:00 PM (Chef's nap time)</option>
                    <option value="23:59">11:59 PM (Midnight snacks only)</option>
                  </select>
                </div>

                <button type="submit" className="modal-next-btn">Continue to Verification</button>
              </form>
            )}

            {bookingStep === 2 && (
              <form onSubmit={handleCaptchaVerify} className="modal-step-form">
                <h3>🤖 Anti-Cat CAPTCHA</h3>
                <p className="modal-instruction">We have a cat problem. Solve this mathematical derivative to prove you are a human:</p>
                <div className="math-equation">
                  <code>{"d/dx (e^(x^2)) = ?"}</code>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter answer"
                    className="modal-input"
                    required
                  />
                </div>

                {captchaError && <p className="captcha-error-msg">{captchaError}</p>}

                <div className="captcha-actions">
                  <button
                    type="submit"
                    className="modal-submit-btn evading"
                    style={{
                      transform: `translate(${evadeOffset.x}px, ${evadeOffset.y}px)`
                    }}
                    onMouseEnter={handleEvadeHover}
                  >
                    Verify Answer
                  </button>

                  <button
                    type="button"
                    className="modal-bypass-btn"
                    onClick={() => {
                      ensureLoggedIn()
                      setShowBookingModal(false)
                      setBookingStep(1)
                      navigate('/menu')
                      addNotification("🍕 Smart Choice! Bypassed table booking for a virtual pizza feast.", "info")
                    }}
                  >
                    I want virtual pizza instead
                  </button>
                </div>
              </form>
            )}

            {bookingStep === 3 && (
              <div className="modal-success-state">
                <h3>🎉 Table Reservation Confirmed!</h3>
                <p>Your table is reserved for:</p>
                <div className="reservation-details">
                  <strong>Date:</strong> {selectedDate === "2085-02-31" ? "Feb 31st, 2085" : selectedDate}<br />
                  <strong>Time:</strong> {selectedTime}<br />
                  <strong>Table status:</strong> "Overbooked / Auctioning"
                </div>
                <p className="modal-warning-text">⚠️ If you do not arrive within -5 minutes, we will eat your food.</p>
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    setShowBookingModal(false)
                    setBookingStep(1)
                  }}
                >
                  Splendid!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
