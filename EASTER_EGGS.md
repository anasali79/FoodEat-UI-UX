# FOODEAT Easter Eggs & Chaotic Features Registry 🥚✨
### *The Ultimate Guide to User Sanity Annihilation*

This document tracks all the custom-built, intentionally frustrating, and hilarious easter eggs designed to make the food ordering flow a hilarious nightmare.

---

## 📋 Summary of Chaos

| Easter Egg / Feature | Location | Trigger Mechanic | Frustration Level |
| :--- | :--- | :--- | :--- |
| **The Evading Checkout Button** | Checkout Page | Hovering over "Place Order" button when tips are under 20% | 🤬 🤬 🤬 🤬 🤬 |
| **Chipi Chipi Cat Thief** | Anywhere | Randomly spawns (50% chance every 20s) if items are in cart | 🐱 🔊 🤬 🤬 🤬 |
| **Fahhhhh Cat Pops** | Anywhere | Randomly spawns (every 30s) or initial spawn after 10s | 🐾 🔊 🤬 🤬 |
| **Rage Cursor** | Anywhere | Clicking on empty space repeatedly | 🖱️ 😡 🤬 |
| **Cookie Consent from Hell** | Home Page / Login | Clicking "Reject Cookies" | 🍪 🤬 🤬 🤬 🤬 |
| **Windows Alert (Not a Scam)** | Login / Home | Randomly pops up warning about `HungryWorm.exe` | 🦠 ⚠️ 🤬 🤬 |
| **Chaos Surcharge & Hidden Fees** | Cart / Checkout | Calculated automatically in total breakdown | 💸 🤬 🤬 🤬 |
| **Despair Tip Options** | Checkout Page | Presenting slider or negative/outrageous tips | 💰 🤬 🤬 |
| **The Detour-Loving Rider** | Track Order Page | Real-time tracking updates of delivery progress | 🛵 🗺️ 🤬 🤬 |

---

## 🔍 In-Depth Breakdown

### 1. The Evading Checkout Button 🏃‍♂️
*   **Code Location:** `src/pages/CheckoutPage.jsx`, `src/pages/CheckoutPage.css`
*   **How it works:** When users proceed to checkout and fill out their details, they must choose a tip. If the tip slider is set to **less than 20%**, hovering the cursor over the "Place Order" button triggers a CSS translation, making the button jump randomly around the card to evade clicks.
*   **The Solution:** Increase the tip to 20% or higher, or try to be fast enough to catch the button.

### 2. Chipi Chipi Cat Thief 🐈‍⬛🎵
*   **Code Location:** `src/components/CartThief.jsx`, `src/components/CartThief.css`
*   **How it works:** Spawns a fat cartoon cat that sprints horizontally across the browser screen. It plays the high-speed *Chipi Chipi Chapa Chapa* viral audio track. As it runs, it steals (yoinks) a random item from the active cart context.
*   **How to defeat it:** Click/tap directly on the cat before it exits the screen. If caught, it stops running, plays peaceful "NPC Lobby Music" for 45 seconds, and returns the stolen food back to your cart.

### 3. Fahhhhh Cat Spawner 🐱🔊
*   **Code Location:** `src/components/ScottishFoldPop.jsx`, `src/components/ScottishFoldPop.css`
*   **How it works:** Spawns random cards containing a screaming Scottish Fold cat. It plays a loud, funny "Fahhhhh!" screaming sound effect.
*   **How to dismiss it:** Click the pop-up to close it. If you catch the *Chipi Chipi Cat Thief*, this spawner is paused for 45 seconds to give your ears a rest.

### 4. Rage Cursor 😡🖱️
*   **Code Location:** `src/components/RageCursor.jsx`, `src/components/RageCursor.css`
*   **How it works:** Tracks the user's cursor click rate. Clicking repeatedly on empty, non-interactive regions increases the cursor's visual font-size and replaces the default pointer with a cursor that evolves based on anger level:
    *   *Default:* `🖱️`
    *   *Mildly annoyed:* `😤` (size > 45px)
    *   *Extremely angry:* `😡` (size > 60px)

### 5. Cookie Consent from Hell 🍪
*   **Code Location:** `src/components/CookieConsent.jsx`, `src/components/CookieConsent.css`
*   **How it works:** A standard cookie banner pops up at the bottom of the screen. If the user clicks "Reject", the banner shakes violently, and spawns dozens of miniature popups that cover the screen saying "Why?", "Are you sure?", "Cookies are good for your health!". The reject button then shifts positions or turns into an accept button.

### 6. Windows Security Alert (Not a Scam) 🦠⚠️
*   **Code Location:** `src/components/VirusWarning.jsx`, `src/components/VirusWarning.css`
*   **How it works:** Randomly triggers a mock blue/gray Windows 98-style alert window warning that a dangerous malware `HungryWorm.exe` has infected the browser, scanning their food history and preparing to email the data to their ex-partner.
*   **The Joke:** A countdown timer counts down to 0, then displays "JK! 😂 Your device is fine. But your taste in food? Questionable."

### 7. Emotional Surcharges & Hidden Fees 💸
*   **Code Location:** `src/context/CartContext.jsx`
*   **How it works:** In the cart subtotal summary, several random fees are appended:
    *   *Chaos Surcharge:* ₹49
    *   *Existential Tax:* ₹21
    *   *Breathing Fee:* ₹15
    *   *Bad Weather Fee:* ₹30 (applied even if it's perfectly sunny)
    *   *Total Emotional damage processing fee:* Added randomly.

### 8. The Detour-Loving Rider 🛵
*   **Code Location:** `src/pages/TrackOrderPage.jsx`, `src/pages/TrackOrderPage.css`
*   **How it works:** Once an order is successfully placed, the tracking screen shows the rider's progress. Rather than driving straight to your house, the status updates show:
    *   *15%:* Rider stopped to play with a street dog.
    *   *35%:* Rider got chased by monkeys, took a detour to Noida.
    *   *55%:* Rider is currently taking a power nap under a tree.
    *   *75%:* Rider stopped to clear up an argument with their ex.
    *   *95%:* Rider is outside your door eating one of your fries.
*   **The Reset:** When progress reaches 100%, the active order is cleared out and reset.
