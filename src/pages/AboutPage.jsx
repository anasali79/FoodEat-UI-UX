import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChaos } from '../context/ChaosContext.jsx'


const TEAM_MEMBERS = [
  {
    name: "Chef Disappointment",
    role: "Head Chef & Chief Chaos Officer",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Graduated from a YouTube cooking tutorial he watched at 3 AM. His specialty is burning water.",
    funFact: "Has never actually tasted his own food. Says it's 'beneath him'."
  },
  {
    name: "Delivery Bhai",
    role: "Senior Delivery Architect",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Holds the world record for most detours taken during a single delivery (47). GPS calls HIM for directions.",
    funFact: "His bike runs on pure audacity and chai fumes."
  },
  {
    name: "Karen the Cat",
    role: "Cart Theft Specialist & Quality Saboteur",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "A Scottish Fold who steals from your cart when you're not looking. Has zero remorse. Loves belly rubs.",
    funFact: "Has eaten more customer orders than all delivery partners combined."
  },
  {
    name: "Gupta Ji",
    role: "CFO (Chief Fraud Officer)",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Invented the concept of 'Chaos Surcharge'. Adds hidden fees that even he can't explain.",
    funFact: "Once charged a customer ₹49 for 'emotional damage processing fee'."
  },
  {
    name: "404 Not Found",
    role: "Lead Developer & Bug Creator",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Wrote the entire app in one energy-drink-fueled night. The bugs are features, he insists.",
    funFact: "The evading checkout button was an accident. He just kept it."
  },
  {
    name: "Suresh the Intern",
    role: "Customer Support & Scapegoat",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Answers all complaints with 'Sir, aapka call important hai'. Has never resolved a single ticket.",
    funFact: "His auto-reply is longer than the Terms of Service."
  }
]

const REVIEWS = [
  { stars: 1, text: "I ordered biryani. Got existential dread instead. 10/10 would not recommend.", author: "Sharma Ji Ka Beta" },
  { stars: 2, text: "The delivery rider stopped at his girlfriend's house, a pan shop, AND a red light. My food arrived as a fossil.", author: "Hungry_Ghost_69" },
  { stars: 1, text: "The cat stole my entire cart THREE times. I had to re-add everything. The cat is evil.", author: "CatHater2025" },
  { stars: 5, text: "Best app ever! I lost 10kg because the food never arrived. Diet plan working perfectly!", author: "AccidentalDieter" },
  { stars: 1, text: "The checkout button literally runs away from my cursor. I've been trying to pay for 45 minutes.", author: "FrustratedUser" },
  { stars: 3, text: "Food was cold, rider was rude, cat stole my fries. But the memes on the tracking page were fire 🔥", author: "VibeChecker" },
]

const MILESTONES = [
  { year: "2024", event: "Founded in a parking lot by two guys who couldn't code" },
  { year: "2024", event: "First delivery completed (only 6 hours late)" },
  { year: "2024", event: "Introduced the legendary Evading Checkout Button™" },
  { year: "2025", event: "Karen the Cat hired as Chief Saboteur" },
  { year: "2025", event: "Achieved 0% customer satisfaction - a new industry record" },
  { year: "2025", event: "Won 'Most Unhinged App' at the UI/UX competition" },
]

export default function AboutPage() {
  const navigate = useNavigate()
  const { addNotification } = useChaos()
  const [visitorCount, setVisitorCount] = useState(0)
  const [activeTeamMember, setActiveTeamMember] = useState(null)

  useEffect(() => {
    // Fake visitor counter that keeps changing
    setVisitorCount(Math.floor(Math.random() * 3) + 1)
    const interval = setInterval(() => {
      setVisitorCount(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="home-logo" onClick={() => navigate('/')}>
          FOODEAT
        </div>
        <nav className="about-nav">
          <button onClick={() => navigate('/')}>🏠 Home</button>
          <button onClick={() => navigate('/menu')}>🍕 Menu</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">About Us <span className="title-emoji">💀</span></h1>
          <p className="about-tagline">
            We're not just a food delivery app. We're a <em>lifestyle of suffering</em>.
          </p>
          <div className="visitor-badge">
            <span className="visitor-dot"></span>
            {visitorCount} {visitorCount === 1 ? 'victim' : 'victims'} currently viewing this page
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-section story-section">
        <h2 className="section-title">Our Origin Story 📖</h2>
        <div className="story-content">
          <div className="story-card">
            <p>
              <strong>FOODEAT</strong> was born in 2024 when two college dropouts realized they could 
              neither cook nor code — but they <em>could</em> make people suffer through a beautifully 
              designed interface.
            </p>
            <p>
              What started as a joke submission for a UI/UX competition quickly spiraled into 
              the most frustrating food delivery experience known to humanity. Our riders take 
              detours to their girlfriend's houses, our cat steals your cart items, and our 
              checkout button literally runs away from your cursor.
            </p>
            <p>
              We don't deliver food. We deliver <strong>chaos</strong>. And sometimes, if the 
              stars align and our rider hasn't stopped for a smoke break, actual food too.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-section values-section">
        <h2 className="section-title">Our Core Values 🎯</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-illustration-wrapper">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=150" alt="Chaos" className="value-illustration-img" />
            </div>
            <h3>Maximum Chaos</h3>
            <p>Every feature is designed to test your patience. If you're not frustrated, we've failed.</p>
          </div>
          <div className="value-card">
            <div className="value-illustration-wrapper">
              <img src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=200&h=150" alt="Cat Policy" className="value-illustration-img" />
            </div>
            <h3>Cat First Policy</h3>
            <p>Karen the Cat's needs come before yours. She eats first, you eat... maybe.</p>
          </div>
          <div className="value-card">
            <div className="value-illustration-wrapper">
              <img src="https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=200&h=150" alt="Hidden Fees" className="value-illustration-img" />
            </div>
            <h3>Hidden Fees</h3>
            <p>We believe in surprise charges. "Chaos Surcharge", "Existential Tax", "Breathing Fee" — all real.</p>
          </div>
          <div className="value-card">
            <div className="value-illustration-wrapper">
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200&h=150" alt="Evading Responsibility" className="value-illustration-img" />
            </div>
            <h3>Evading Responsibility</h3>
            <p>Like our checkout button, we dodge all accountability. Terms & Conditions apply (they don't).</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section team-section">
        <h2 className="section-title">Meet The "Team" 👥</h2>
        <p className="section-subtitle">The magnificent disasters behind your suffering</p>
        <div className="team-grid">
          {TEAM_MEMBERS.map((member, index) => (
            <div 
              className={`team-card ${activeTeamMember === index ? 'active' : ''}`} 
              key={index}
              onClick={() => {
                setActiveTeamMember(activeTeamMember === index ? null : index)
                addNotification(`👤 ${member.name} says: "Stop clicking on me!"`, "warning")
              }}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="team-avatar-wrapper">
                <img src={member.image} alt={member.name} className="team-avatar-img" />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
              {activeTeamMember === index && (
                <div className="team-funfact animate-fade-in">
                  <strong>🤫 Fun Fact:</strong> {member.funFact}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section timeline-section">
        <h2 className="section-title">Our "Journey" 🗓️</h2>
        <div className="timeline">
          {MILESTONES.map((milestone, index) => (
            <div className="timeline-item" key={index} style={{ animationDelay: `${index * 150}ms` }}>
              <div className="timeline-year">{milestone.year}</div>
              <div className="timeline-line"></div>
              <div className="timeline-event">{milestone.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="about-section reviews-section">
        <h2 className="section-title">What Our Victims Say 💬</h2>
        <div className="reviews-grid">
          {REVIEWS.map((review, index) => (
            <div className="review-card" key={index} style={{ animationDelay: `${index * 100}ms` }}>
              <div className="review-stars">
                {'⭐'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
              </div>
              <p className="review-text">"{review.text}"</p>
              <span className="review-author">— {review.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="about-section stats-section">
        <h2 className="section-title">Our Achievements 📊</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">0%</span>
            <span className="stat-label">Customer Satisfaction</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">∞</span>
            <span className="stat-label">Hidden Charges Added</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">47</span>
            <span className="stat-label">Avg. Detours Per Delivery</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">3hrs</span>
            <span className="stat-label">Avg. Delivery Time</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section cta-section">
        <div className="cta-content">
          <h2>Still Here? 🤡</h2>
          <p>You've read all of this and you STILL want to order? You're either very brave or very hungry.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/menu')}>
              🍕 Order Anyway (Brave Soul)
            </button>
            <button className="cta-btn secondary" onClick={() => {
              addNotification("🚪 You can check out any time you like, but you can never leave.", "error")
            }}>
              🚪 Run Away
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© 2025 FOODEAT — No rights reserved. We don't care. Neither should you.</p>
        <p className="footer-disclaimer">⚠️ This app is intentionally unhinged. No actual food was harmed in the making of this app. Cats were slightly inconvenienced.</p>
      </footer>
    </div>
  )
}
