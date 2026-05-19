import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useChaos } from '../context/ChaosContext.jsx'


const CATEGORIES = ["All", "Burgers", "Pizza", "Indian", "Japanese", "Desserts", "Beverages", "Healthy", "Street Food"]

export default function MenuPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartItems, addToCart, FOOD_ITEMS, getItemCount, activeOrder } = useCart()
  const { addNotification, chaosLevel } = useChaos()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredItemId, setHoveredItemId] = useState(null)
  const [buttonTexts, setButtonTexts] = useState({})
  const [prices, setPrices] = useState({})

  // Initialize prices and button texts
  useEffect(() => {
    const initialPrices = {}
    const initialButtonTexts = {}
    FOOD_ITEMS.forEach(item => {
      initialPrices[item.id] = item.price
      initialButtonTexts[item.id] = "Add to Cart"
    })
    setPrices(initialPrices)
    setButtonTexts(initialButtonTexts)
  }, [FOOD_ITEMS])

  // Randomize prices slightly to simulate "surge pricing" or general instability
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev }
        const randomItem = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)]
        if (randomItem) {
          // change price by -10% to +20%
          const changePercent = (Math.random() * 0.3 - 0.1)
          const newPrice = Math.max(10, Math.round(randomItem.price * (1 + changePercent)))
          next[randomItem.id] = newPrice

          if (Math.abs(changePercent) > 0.1) {
            addNotification(`🔥 Surge pricing updated for ${randomItem.name}!`, 'warning')
          }
        }
        return next
      })
    }, 12000)
    return () => clearInterval(interval)
  }, [FOOD_ITEMS, addNotification])

  // Gaslight search query
  const handleSearchChange = (e) => {
    let value = e.target.value
    // Randomly replace characters or append chaotic words
    if (value.length > 3 && Math.random() > 0.8) {
      const typos = ["poison", "unhealthy", "cheap", "stale", "suspicious", "regret"]
      value = value + " " + typos[Math.floor(Math.random() * typos.length)]
      addNotification("🤖 Autocorrect improved your search criteria!", "info")
    }
    setSearchTerm(value)
  }

  // Handle category change with a chance of choosing a different one
  const handleCategorySelect = (category) => {
    if (Math.random() > 0.85) {
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      setSelectedCategory(randomCategory)
      addNotification(`🧭 Navigational anomaly: Category redirected to ${randomCategory}!`, 'warning')
    } else {
      setSelectedCategory(category)
    }
  }

  const handleAddToCart = (item, e) => {
    // Add extra chaos to the click: make it fly somewhere or trigger popups
    if (Math.random() > 0.9) {
      addNotification(`🚫 Kitchen busy! Denied adding ${item.name} to cart.`, 'error')
      return
    }

    const currentPrice = prices[item.id] || item.price
    addToCart({ ...item, price: currentPrice })
    addNotification(`🛒 Added ${item.name} for ₹${currentPrice}!`, 'success')

    // Change button text temporarily to something weird
    const wackyConfirmations = ["Added?", "Are you sure?", "No turning back", "Stomach warned", "Processing soul...", "Yum?"]
    setButtonTexts(prev => ({
      ...prev,
      [item.id]: wackyConfirmations[Math.floor(Math.random() * wackyConfirmations.length)]
    }))
    setTimeout(() => {
      setButtonTexts(prev => ({
        ...prev,
        [item.id]: "Add to Cart"
      }))
    }, 2000)
  }

  const handleItemHover = (itemId) => {
    setHoveredItemId(itemId)
    // Randomly change price on hover to gaslight user
    if (Math.random() > 0.7) {
      setPrices(prev => ({
        ...prev,
        [itemId]: Math.max(10, (prev[itemId] || 100) + (Math.random() > 0.5 ? 10 : -10))
      }))
    }
  }

  const filteredItems = FOOD_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Jumble the filtered items list if chaos is high
  const displayItems = chaosLevel > 3 && Math.random() > 0.85
    ? [...filteredItems].sort(() => Math.random() - 0.5)
    : filteredItems

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <div className="home-logo" onClick={() => navigate('/')}>
          FOODEAT
        </div>
        <div className="header-user">
          <span className="user-welcome">👋 Welcome, {user?.name || 'Victim'}</span>
          <button 
            className="track-order-btn" 
            onClick={() => navigate('/track')}
          >
            🛵 Track Order
          </button>
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            🛒 Cart ({getItemCount()})
          </button>
          <button className="logout-btn" onClick={() => { logout(); navigate('/') }}>
            🚪 Escape
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="menu-hero">
        <div className="hero-content">
          <h2>Feed Your Despair</h2>
          <p>The premium food delivery app that tests your patience, steals your cart items, and charges you for it.</p>
        </div>
      </section>

      {/* Control Bar */}
      <div className="menu-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for something you'll probably regret..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="menu-search"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Category filters */}
        <div className="categories-list">
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className="menu-main">
        {displayItems.length === 0 ? (
          <div className="no-items-state">
            <h3>🍽️ Nothing found here...</h3>
            <p>Or maybe our chefs went on strike. Try searching for "pizza" or clearing your search.</p>
            <button className="reset-search-btn" onClick={() => { setSearchTerm(''); setSelectedCategory('All') }}>
              Show All Cursed Food
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {displayItems.map(item => (
              <div
                key={item.id}
                className={`menu-card ${hoveredItemId === item.id ? 'hovered' : ''}`}
                onMouseEnter={() => handleItemHover(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <div className="card-image-placeholder">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="card-food-image" />
                  ) : (
                    <span className="card-emoji">{item.emoji}</span>
                  )}
                  <span className="badge-bestseller">🏆 100% Legit</span>
                </div>
                <div className="card-body">
                  <div className="card-header-row">
                    <h3>{item.name}</h3>
                    <span className="card-category">{item.category}</span>
                  </div>
                  <p className="card-desc">{item.description}</p>

                  <div className="card-footer-row">
                    <span className="card-price">₹{prices[item.id] || item.price}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(item, e)}
                      style={{
                        transform: hoveredItemId === item.id && Math.random() > 0.85
                          ? `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px)`
                          : 'none'
                      }}
                    >
                      {buttonTexts[item.id] || "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
