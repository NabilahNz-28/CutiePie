# 🍰 CutiePie — Sweet Bakery UI

A visually rich, interactive **front-end** web application built with **Vue 3 + TypeScript + Vite**, themed around a cute pixel-art bakery experience.

> **Note:** This project is currently a **UI/UX prototype**. It focuses on interface design, component architecture, and user interaction patterns. Backend integration (authentication, payment, real order processing) is planned for a future phase.
<img width="1280" height="890" alt="image" src="https://github.com/user-attachments/assets/1da55711-c554-4784-9bf9-5c653fea000b" />
<img width="1272" height="807" alt="image" src="https://github.com/user-attachments/assets/31d7a09f-c5f5-4926-8733-0088e0878dc4" />


---

## ✨ Features

- **Interactive Product Catalog** — filterable & searchable dessert menu grid
- **Pixel-Art Sprite Rendering** — custom sprite sheet cropping with CSS background positioning
- **Product Detail Modal** — quantity selector, calorie info, real-time total calculation
- **Shopping Cart Drawer** — animated slide-in panel with discount logic and free-shipping threshold
- **Micro-animations** — hover effects, sparkle bursts, floating elements, ripple clicks
- **Responsive Design** — adapts seamlessly from mobile to desktop
- **Toast Notifications** — feedback on every user action

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Vanilla CSS (custom design system) |
| Fonts | Google Fonts — Nunito, Pacifico |
| State | `ref` / `computed` (no external state lib) |
| Routing | None (single-page layout) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`.

<img width="1284" height="883" alt="image" src="https://github.com/user-attachments/assets/352c8b5a-e5cb-4ac7-89f5-540f204cac30" />

---

## 📁 Project Structure

```
src/
├── main.ts                  # App entry point
├── App.vue                  # Root component & page layout
├── style.css                # Global design tokens & animations
├── types.ts                 # TypeScript interfaces
├── data.ts                  # Static mock data (desserts, reviews)
└── components/
    ├── DessertSprite.vue    # Sprite sheet renderer with hover effects
    ├── DessertCard.vue      # Product card with ripple & cart state
    ├── DessertModal.vue     # Detail dialog with quantity selector
    ├── CartDrawer.vue       # Slide-in cart with discount engine
    └── ReviewsSection.vue   # Customer reviews with star ratings
```

---

## 🗺️ Roadmap

- [x] UI/UX prototype with full interactive flow
- [x] Shopping cart with discount & shipping logic (client-side)
- [ ] REST API integration (product catalog, orders)
- [ ] User authentication & profile
- [ ] Payment gateway integration
- [ ] Order tracking & history
- [ ] Admin dashboard (inventory management)

---

## 📸 Design Highlights

- **Design System** — consistent CSS custom properties for colors, spacing, radius, and transitions
- **Animation Library** — 10+ keyframe animations (float, heartbeat, sparkle, confetti, ripple)
- **Glassmorphism Navbar** — sticky with blur backdrop and scroll-aware shadow
- **Sprite Sheet** — kawaii illustration grid with precise CSS background cropping

---


## 📄 License

This project is for **portfolio and educational purposes**.  
Pixel art assets by [scrimsart](https://twitter.com/scrimsart) — all rights reserved to original artists.
