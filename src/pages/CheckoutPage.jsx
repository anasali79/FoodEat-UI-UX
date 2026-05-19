import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useChaos } from '../context/ChaosContext.jsx'


const MOCK_ADDRESSES = [
  "Bermuda Triangle, Ocean Floor",
  "Area 51, Hangar 18",
  "The dark corner under your bed 🕸️",
  "Inside your refrigerator (meta)",
  "404 Street Not Found",
  "The bottom of a bottomless pit",
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, getTotal, clearCart, setActiveOrder } = useCart()
  const { addNotification } = useChaos()

  const [address, setAddress] = useState('')
  const [phoneVal, setPhoneVal] = useState(8888888888) // Slider starting value
  const [paymentMethod, setPaymentMethod] = useState('soul')
  const [speed, setSpeed] = useState('normal')
  const [isPlacing, setIsPlacing] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [cardNum, setCardNum] = useState('')
  const [cvv, setCvv] = useState('')

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/menu')
    }
  }, [cartItems, navigate])

  // Random address suggestion
  const autoSuggestAddress = () => {
    const randomAddr = MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)]
    setAddress(randomAddr)
    addNotification("📍 Smart Address Locator selected a premium delivery destination!", "success")
  }

  // Handle typing inside address box: sometimes insert typos
  const handleAddressChange = (e) => {
    let val = e.target.value
    if (val.length > 5 && Math.random() > 0.9) {
      val = val + " (probably?)"
      addNotification("✍️ Address autocompleted with extra uncertainty.", "info")
    }
    setAddress(val)
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()

    if (!address) {
      addNotification("🚨 Where should we dump the food? Enter an address!", "error")
      return
    }

    if (paymentMethod === 'card' && (cardNum.length < 12 || cvv.length < 3)) {
      addNotification("💳 Card details look suspicious... just like our food.", "error")
      return
    }

    // Trigger Captcha verification
    setShowCaptcha(true)
  }

  const submitCaptcha = () => {
    if (captchaAnswer.toLowerCase() === 'existential dread' || captchaAnswer.trim() !== '') {
      setShowCaptcha(false)
      setIsPlacing(true)
      
      const orderedItems = [...cartItems]
      const orderId = Date.now().toString()
      // Simulate fake placing order
      setTimeout(() => {
        setIsPlacing(false)
        setActiveOrder({ id: orderId, speed, address, phoneVal, paymentMethod, orderedItems })
        clearCart()
        navigate('/confirmation', { state: { id: orderId, speed, address, phoneVal, paymentMethod, orderedItems } })
      }, 3000)
    } else {
      addNotification("❌ Incorrect cabbage verification! Try again.", "error")
    }
  }

  // Calculate total depending on speed
  const baseTotal = getTotal()
  let speedCharge = 0
  if (speed === 'asap') speedCharge = 250
  if (speed === 'mouth') speedCharge = 9999999

  const grandTotal = baseTotal + speedCharge

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
        <h1>Cursed Checkout Desk 🧾</h1>
        <div></div>
      </header>

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          {/* Section 1: Delivery Address */}
          <div className="checkout-section">
            <h2>1. Where should we drop the delivery? 📍</h2>
            <div className="input-group">
              <textarea
                value={address}
                onChange={handleAddressChange}
                placeholder="Type your address... or click auto-locate for a surprise destination"
                className="checkout-textarea"
                rows={3}
              />
              <button
                type="button"
                className="auto-locate-btn"
                onClick={autoSuggestAddress}
              >
                🔮 Auto-Locate Premium Coordinates
              </button>
            </div>
          </div>

          {/* Section 2: Phone number slider (unhinged) */}
          <div className="checkout-section">
            <h2>2. Slide to Select Phone Number 📱</h2>
            <p className="phone-subtitle">Due to server load, keyboard phone input is disabled. Please use the slider to select your exact phone number.</p>
            <div className="phone-slider-wrapper">
              <input
                type="range"
                min="7000000000"
                max="9999999999"
                value={phoneVal}
                onChange={(e) => setPhoneVal(parseInt(e.target.value))}
                className="phone-slider"
              />
              <div className="selected-phone">
                📞 +91 {phoneVal.toString().replace(/(\d{5})(\d{5})/, "$1-$2")}
              </div>
            </div>
            <p className="phone-hint">Tip: Move it pixel by pixel to get your exact number. Good luck!</p>
          </div>

          {/* Section 3: Delivery Speed */}
          <div className="checkout-section">
            <h2>3. Desired Speed of Regret 🚀</h2>
            <div className="speed-options">
              <label className={`speed-card ${speed === 'normal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="speed"
                  value="normal"
                  checked={speed === 'normal'}
                  onChange={() => setSpeed('normal')}
                />
                <span className="speed-title">🐌 Normal Speed</span>
                <span className="speed-desc">Arrives when our delivery driver wakes up. Free.</span>
              </label>

              <label className={`speed-card ${speed === 'asap' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="speed"
                  value="asap"
                  checked={speed === 'asap'}
                  onChange={() => setSpeed('asap')}
                />
                <span className="speed-title">⚡ ASAP (Surge)</span>
                <span className="speed-desc">Driver will ignore traffic laws. +₹250</span>
              </label>

              <label className={`speed-card ${speed === 'mouth' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="speed"
                  value="mouth"
                  checked={speed === 'mouth'}
                  onChange={() => setSpeed('mouth')}
                />
                <span className="speed-title">🛸 Directly into my Mouth</span>
                <span className="speed-desc">Teleported straight into your gullet. +₹9,999,999</span>
              </label>
            </div>
          </div>

          {/* Section 4: Payment */}
          <div className="checkout-section">
            <h2>4. Pay with what remains of your sanity 💳</h2>
            <div className="payment-options">
              <label className={`payment-card ${paymentMethod === 'soul' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="soul"
                  checked={paymentMethod === 'soul'}
                  onChange={() => setPaymentMethod('soul')}
                />
                <span className="payment-title">👻 Sell My Soul</span>
                <span className="payment-desc">Instantly approved. (Terms apply)</span>
              </label>

              <label className={`payment-card ${paymentMethod === 'napkin' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="napkin"
                  checked={paymentMethod === 'napkin'}
                  onChange={() => setPaymentMethod('napkin')}
                />
                <span className="payment-title">🧻 IOU written on a napkin</span>
                <span className="payment-desc">Requires photo upload of napkin (Mocked)</span>
              </label>

              <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span className="payment-title">💳 Credit Card (Not secure)</span>
                <span className="payment-desc">We will store this in plain text.</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-fields animate-fade-in">
                <input
                  type="text"
                  placeholder="Card Number (we'll show it to everyone)"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  className="checkout-input"
                />
                <div className="card-fields-row">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="checkout-input cvv-input"
                  />
                  <input
                    type="text"
                    placeholder="Expiry (MM/YY)"
                    className="checkout-input expiry-input"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'napkin' && (
              <div className="napkin-upload animate-fade-in">
                <label className="napkin-dropzone">
                  <span>📁 Drag napkin file here, or click to draw one</span>
                  <input type="file" style={{ display: 'none' }} onChange={() => addNotification("📸 Mock napkin uploaded successfully!", "success")} />
                </label>
              </div>
            )}
          </div>

          {/* Place Order Trigger */}
          <div className="checkout-summary-box">
            <div className="final-total-row">
              <span>Grand Total including Chaos surcharge:</span>
              <span className="final-price">₹{grandTotal}</span>
            </div>
            <button type="submit" className="place-order-btn">
              ⚡ Place Order (Confirm Doom)
            </button>
          </div>
        </form>
      </div>

      {/* Captcha Modal Overlay */}
      {showCaptcha && (
        <div className="captcha-overlay">
          <div className="captcha-modal">
            <h2>🤖 Human Verification Captcha</h2>
            <p>Prove you are not a machine. Solve this simple riddle:</p>
            <div className="riddle-container">
              <strong>"What feels completely empty but keeps costing you more money?"</strong>
            </div>
            <input
              type="text"
              placeholder="Your answer (Hint: 'your wallet' or 'existential dread')"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              className="captcha-input"
            />
            <div className="captcha-actions">
              <button type="button" className="captcha-submit-btn" onClick={submitCaptcha}>
                Verify Cabbage State
              </button>
              <button type="button" className="captcha-cancel-btn" onClick={() => setShowCaptcha(false)}>
                I am a robot, let me go
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placing Loader */}
      {isPlacing && (
        <div className="placing-loader-overlay">
          <div className="placing-box">
            <div className="placing-spinner">🌀</div>
            <h2>Fumbling your order details...</h2>
            <p>Our drivers are playing rock-paper-scissors to see who is forced to deliver this.</p>
          </div>
        </div>
      )}
    </div>
  )
}
