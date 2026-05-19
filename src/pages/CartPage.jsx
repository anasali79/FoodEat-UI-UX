import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useChaos } from '../context/ChaosContext.jsx'


export default function CartPage() {
  const navigate = useNavigate()
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    stolenItems, 
    getTotal 
  } = useCart()
  const { addNotification } = useChaos()

  const [serviceCharge, setServiceCharge] = useState(49)
  const [airTax, setAirTax] = useState(15)
  const [tipPercent, setTipPercent] = useState(25) // Defaults high!
  const [sliderMessage, setSliderMessage] = useState("Generous Tipper! 😊")
  const [checkoutAttempts, setCheckoutAttempts] = useState(0)
  const [checkoutBtnPos, setCheckoutBtnPos] = useState({ x: 0, y: 0 })
  const [evadingCheckout, setEvadingCheckout] = useState(false)

  // Service charge changes randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setServiceCharge(prev => {
        const next = Math.max(10, prev + Math.floor(Math.random() * 21) - 10)
        if (next !== prev) {
          addNotification(`🧾 Regulatory fee adjusted: ₹${next}`, 'info')
        }
        return next
      })
      setAirTax(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2))
    }, 10000)
    return () => clearInterval(interval)
  }, [addNotification])

  // Tip slider message logic
  const handleTipChange = (e) => {
    const val = parseInt(e.target.value)
    setTipPercent(val)
    if (val < 15) {
      setSliderMessage("Are you serious? 😢")
    } else if (val < 25) {
      setSliderMessage("The chef has kids to feed... 👶")
    } else if (val < 50) {
      setSliderMessage("Thank you! Chef is smiling. 😊")
    } else if (val < 75) {
      setSliderMessage("Wow! Chef will write a poem about you! ✍️")
    } else {
      setSliderMessage("MARRY THE CHEF! 💍💖")
    }
  }

  // Remove button action
  const handleRemove = (item) => {
    // 30% chance to fail removing or increase quantity instead
    if (Math.random() > 0.7) {
      updateQuantity(item.id, item.quantity + 1)
      addNotification(`📈 Failed to remove: Added 1 more ${item.name} instead!`, 'warning')
    } else {
      removeFromCart(item.id)
      addNotification(`🗑️ Removed ${item.name} from cart.`, 'info')
    }
  }

  // Quantity updates
  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta
    if (Math.random() > 0.85) {
      // random scale up
      const weirdQty = newQty + Math.floor(Math.random() * 3) + 1
      updateQuantity(item.id, weirdQty)
      addNotification(`🤪 Quantity selector glitched! Set to ${weirdQty}.`, 'warning')
    } else {
      updateQuantity(item.id, newQty)
    }
  }

  // Evading checkout button
  const handleCheckoutHover = () => {
    if (tipPercent < 20) {
      setEvadingCheckout(true)
      const maxDist = 150
      setCheckoutBtnPos({
        x: (Math.random() - 0.5) * maxDist,
        y: (Math.random() - 0.5) * maxDist,
      })
      addNotification("⚠️ Tip must be at least 20% to unlock checkout!", "error")
    } else {
      setEvadingCheckout(false)
      setCheckoutBtnPos({ x: 0, y: 0 })
    }
  }

  const handleCheckoutClick = () => {
    if (tipPercent < 20) {
      addNotification("🚨 Checkout blocked: Insufficient tipping!", "error")
      return
    }
    
    // Sometimes mock failure
    if (checkoutAttempts === 0 && Math.random() > 0.4) {
      setCheckoutAttempts(1)
      addNotification("🌐 Connection error 500: Stomach too empty. Try again.", "error")
      return
    }

    navigate('/checkout')
  }

  // Calculate final total
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tipAmount = Math.round(itemsTotal * (tipPercent / 100))
  const finalTotal = itemsTotal + serviceCharge + airTax + tipAmount

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate('/menu')}>
          ← Back to Despair Menu
        </button>
        <h1>Your Desolation Cart 🛒</h1>
        <div></div>
      </header>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <span className="empty-emoji">🗑️</span>
            <h2>Your cart is as empty as our promises.</h2>
            <p>Go back and add some questionable foods before we report you for loitering.</p>
            <button className="shop-btn" onClick={() => navigate('/menu')}>
              Browse Food Items
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items List */}
            <div className="cart-items-section">
              <div className="section-title">
                <h2>Cart Items ({cartItems.length})</h2>
              </div>
              <div className="items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item-card">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    ) : (
                      <span className="item-emoji">{item.emoji}</span>
                    )}
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-desc">{item.description}</p>
                      <span className="item-price">₹{item.price} each</span>
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="item-quantity-controls">
                      <button className="qty-btn" onClick={() => handleQtyChange(item, -1)}>-</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleQtyChange(item, 1)}>+</button>
                    </div>

                    <button className="item-remove-btn" onClick={() => handleRemove(item)}>
                      🗑️ Trash
                    </button>
                  </div>
                ))}
              </div>

              {/* Items Stolen Graveyard */}
              {stolenItems.length > 0 && (
                <div className="stolen-graveyard">
                  <h3>🪦 The Stolen Graveyard ({stolenItems.length})</h3>
                  <p className="graveyard-subtitle">These items were snatched by the Cart Thief. No refunds.</p>
                  <div className="stolen-items-grid">
                    {stolenItems.map((item, idx) => (
                      <div key={idx} className="stolen-item-tag">
                        <span>{item.emoji}</span>
                        <span className="stolen-name">{item.name}</span>
                        <span className="stolen-rip">R.I.P</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary Section */}
            <div className="bill-summary-section">
              <div className="summary-card">
                <h2>Cursed Bill Details</h2>
                
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{itemsTotal}</span>
                  </div>
                  <div className="summary-row dynamic-row">
                    <span>Instability Service Charge ⚡</span>
                    <span>₹{serviceCharge}</span>
                  </div>
                  <div className="summary-row dynamic-row">
                    <span>Breathing Oxygen Tax 💨</span>
                    <span>₹{airTax}</span>
                  </div>
                  
                  {/* Tipping Section */}
                  <div className="tip-box">
                    <div className="tip-header">
                      <span>Tip the Chef (Required*)</span>
                      <span className="tip-percent">{tipPercent}% (₹{tipAmount})</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tipPercent}
                      onChange={handleTipChange}
                      className="tip-slider"
                    />
                    <p className={`tip-message ${tipPercent < 20 ? 'tip-warn' : ''}`}>
                      {sliderMessage}
                    </p>
                  </div>
                </div>

                <div className="summary-total">
                  <span>Grand Total</span>
                  <span className="total-glow">₹{finalTotal}</span>
                </div>

                <div className="checkout-btn-wrapper">
                  <button
                    className={`checkout-btn ${evadingCheckout ? 'evading' : ''} ${tipPercent < 20 ? 'disabled' : ''}`}
                    style={{
                      transform: `translate(${checkoutBtnPos.x}px, ${checkoutBtnPos.y}px)`,
                    }}
                    onMouseEnter={handleCheckoutHover}
                    onClick={handleCheckoutClick}
                  >
                    🚀 Proceed to Checkout (No refunds)
                  </button>
                </div>
                <p className="fine-print">* Tipping less than 20% makes the checkout button run away.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
