# FOODEAT (CursedEats) 🍕
### *The World's Most Frustrating Food Delivery Experience from Hell*

Welcome to **FOODEAT**, an intentionally chaotic, frustrating, yet fully functional food delivery web application built for a UI/UX competition. The goal of this application is to maximize user irritation through unhinged design features and dark humor, all wrapped in a polished, premium aesthetic.

---

## 🚀 Key Features

*   **Public Access & Authentication Boundaries:** Explore the homepage and view items publicly. If you click `+` to add an item, you'll be prompted to sign up or log in.
*   **Chaos Cart Surcharges:** Enjoy randomized, unexplained fees such as the "Existential Tax", "Breathing Fee", and "Emotional Damage Surcharge".
*   **The Evading Checkout Button:** Try to click the checkout button when your tip is below 20%. Spoiler: It runs away!
*   **Chipi Chipi Cat Thief:** A wild cat randomly steals items from your cart while playing high-speed music. You must catch it to get your food back.
*   **Fahhhhh Cat Spawner:** A Scottish Fold cat pops up on your screen screaming "FAHHHHH" just to test your sanity.
*   **Windows Security alert (Not a Scam):** Warnings about `HungryWorm.exe` scanning your food history.
*   **Desolation Tracking:** Watch your delivery rider take a nap, get chased by dogs, or visit their ex in real-time.

---

## 🛠️ Technology Stack

*   **Frontend Library:** React (Vite)
*   **Styling:** Vanilla CSS (Refactored and consolidated into 3 files for high performance and clean structure)
*   **Icons & Illustrations:** Premium vector graphics & Unsplash illustrations
*   **Audio Assets:** Immersive sound effects for various easter eggs and chaotic prompts

---

## 📁 CSS Architecture

We consolidated the chaotic styling into **3 main files** located in `/src`:
1.  **`src/index.css`**: Global design tokens, CSS variables, resets, custom fonts (Outfit, Inter, Comic Neue, Bangers), and common keyframe animations.
2.  **`src/pages.css`**: The styles for all pages (`HomePage`, `MenuPage`, `AboutPage`, `CartPage`, `CheckoutPage`, `LoginPage`, `TrackOrderPage`, and `OrderConfirmation`).
3.  **`src/components.css`**: Component-specific styles (`CartThief`, `CookieConsent`, `FakeAd`, `NotificationSpam`, `RageCursor`, `ScottishFoldPop`, and `VirusWarning`).

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd "event 2"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Building for Production
To bundle and optimize the application for deployment:
```bash
npm run build
```
The optimized output will be written to the `dist/` directory.

---

## 💡 Learn More
To learn about all hidden mechanics, easter eggs, and tricks embedded in this project, check out [EASTER_EGGS.md](./EASTER_EGGS.md).
