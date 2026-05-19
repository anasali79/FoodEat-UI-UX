import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()

const FOOD_ITEMS = [
  { id: 1, name: "Mystery Meat Burger", price: 299, emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80", description: "You don't want to know what's in it", category: "Burgers" },
  { id: 2, name: "Suspiciously Fresh Pizza", price: 449, emoji: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80", description: "Made yesterday... we think", category: "Pizza" },
  { id: 3, name: "Existential Crisis Pasta", price: 349, emoji: "🍝", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80", description: "It questions its own existence", category: "Italian" },
  { id: 4, name: "Haunted Sushi Roll", price: 599, emoji: "🍣", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80", description: "The fish stares back at you", category: "Japanese" },
  { id: 5, name: "Gaslighting Garlic Bread", price: 149, emoji: "🧄", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80", description: "Makes you doubt if you ordered it", category: "Sides" },
  { id: 6, name: "Passive Aggressive Salad", price: 199, emoji: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80", description: "Judges your life choices", category: "Healthy" },
  { id: 7, name: "Dramatic Dosa", price: 179, emoji: "🫓", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80", description: "Falls apart at the slightest touch", category: "Indian" },
  { id: 8, name: "Betrayal Biryani", price: 399, emoji: "🍚", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80", description: "Promises chicken, delivers potato", category: "Indian" },
  { id: 9, name: "Cry-Me-A-River Momos", price: 249, emoji: "🥟", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80", description: "So spicy you'll question reality", category: "Chinese" },
  { id: 10, name: "Emotionally Unavailable Ice Cream", price: 159, emoji: "🍦", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80", description: "Melts before it arrives", category: "Desserts" },
  { id: 11, name: "Gaslit Gulab Jamun", price: 129, emoji: "🍩", image: "https://images.unsplash.com/photo-1681476747916-8a8fc7e2001e?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Were there 2 or 3? You'll never know", category: "Desserts" },
  { id: 12, name: "Toxic Relationship Thali", price: 499, emoji: "🍱", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80", description: "You keep coming back to it", category: "Indian" },
  { id: 13, name: "Trust Issues Tea", price: 79, emoji: "🍵", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80", description: "Is it hot? Is it cold? Surprise!", category: "Beverages" },
  { id: 14, name: "Villain Origin Story Vadapav", price: 99, emoji: "🥙", image: "https://images.unsplash.com/photo-1769030905851-c0e0a4fe5c51?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "The one that started it all", category: "Street Food" },
  { id: 15, name: "Identity Crisis Coffee", price: 199, emoji: "☕", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80", description: "Can't decide if it's a latte or americano", category: "Beverages" },
  { id: 16, name: "Paranoid Paneer Tikka", price: 329, emoji: "🧀", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80", description: "Keeps looking over its shoulder", category: "Indian" },
  { id: 17, name: "Noodles three", price: 200, emoji: "🍜", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80", description: "White plate with dried shrimps", category: "Noodles" },
  { id: 18, name: "Noodles one", price: 69, emoji: "🍜", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80", description: "Noodles spicy boil with seafood and pork in hot pot", category: "Noodles" },
  { id: 19, name: "Noodles two", price: 180, emoji: "🍜", image: "https://images.unsplash.com/photo-1600490036275-35f5f1656861?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", description: "Noodles prawn spicy soup", category: "Noodles" },
]

export { FOOD_ITEMS }

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems')
    return saved ? JSON.parse(saved) : []
  })
  const [stolenItems, setStolenItems] = useState([])
  const [lastStolenItem, setLastStolenItem] = useState(null)
  const [activeOrder, setActiveOrderState] = useState(() => {
    const saved = localStorage.getItem('activeOrder')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const setActiveOrder = useCallback((order) => {
    setActiveOrderState(order)
    if (order) {
      localStorage.setItem('activeOrder', JSON.stringify(order))
    } else {
      localStorage.removeItem('activeOrder')
    }
  }, [])

  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== itemId))
    } else {
      setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
    }
  }, [])

  const stealItem = useCallback(() => {
    if (cartItems.length === 0) return null
    const randomIndex = Math.floor(Math.random() * cartItems.length)
    const stolen = cartItems[randomIndex]
    setLastStolenItem(stolen)
    setStolenItems(prev => [...prev, stolen])
    setCartItems(prev => {
      const item = prev[randomIndex]
      if (item.quantity > 1) {
        return prev.map((i, idx) => idx === randomIndex ? { ...i, quantity: i.quantity - 1 } : i)
      }
      return prev.filter((_, idx) => idx !== randomIndex)
    })
    return stolen
  }, [cartItems])

  const returnStolenItem = useCallback((stolen) => {
    if (!stolen) return
    setCartItems(prev => {
      const existing = prev.find(i => i.id === stolen.id)
      if (existing) {
        return prev.map(i => i.id === stolen.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...stolen, quantity: 1 }]
    })
    // Remove it from stolen list
    setStolenItems(prev => prev.filter(i => i.id !== stolen.id))
  }, [])

  const getTotal = useCallback(() => {
    const base = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    // Add random "service charges"
    const chaos = Math.floor(Math.random() * 50) + 10
    return base + chaos
  }, [cartItems])

  const getItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity,
      stealItem, stolenItems, lastStolenItem, setLastStolenItem,
      returnStolenItem,
      getTotal, getItemCount, clearCart, FOOD_ITEMS,
      activeOrder, setActiveOrder
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
