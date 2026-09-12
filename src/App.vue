<template>
  <div class="app">
    <!-- Floating confetti -->
    <div class="confetti-layer" aria-hidden="true">
      <span v-for="c in confetti" :key="c.id" class="confetti-piece" :style="c.style">{{ c.emoji }}</span>
    </div>

    <!-- ===== NAVBAR ===== -->
    <header class="navbar" :class="{ scrolled: isScrolled }">
      <div class="navbar-inner">
        <div class="logo" @click="scrollToTop">
          <span class="logo-icon">🍰</span>
          <span class="logo-text">CutiePie</span>
        </div>

        <nav class="nav-links" aria-label="Navigasi utama">
          <a href="#menu" class="nav-link" @click.prevent="scrollTo('menu')">Menu</a>
          <a href="#about" class="nav-link" @click.prevent="scrollTo('about')">Tentang</a>
          <a href="#reviews" class="nav-link" @click.prevent="scrollTo('reviews')">Ulasan</a>
        </nav>

        <button
          class="cart-btn"
          @click="cartOpen = true"
          id="open-cart-btn"
          aria-label="Buka keranjang"
        >
          <span class="cart-btn-icon">🛒</span>
          <span class="cart-btn-label">Keranjang</span>
          <Transition name="badge-pop">
            <span v-if="totalCartItems > 0" class="cart-count">{{ totalCartItems }}</span>
          </Transition>
        </button>
      </div>
    </header>

    <!-- ===== HERO ===== -->
    <section class="hero" id="home">
      <div class="hero-content">
        <p class="hero-eyebrow">🌸 Pixel Art Bakery</p>
        <h1 class="hero-title">Selamat Datang di<br /><span class="gradient-text">CutiePie!</span></h1>
        <p class="hero-subtitle">
          Kue-kue manis lucu dalam wujud pixel art yang menggemaskan.<br />
          Pesan sekarang dan rasakan manisnya! 💕
        </p>
        <div class="hero-actions">
          <button class="cta-primary" @click="scrollTo('menu')" id="hero-order-btn">
            🍰 Lihat Menu
          </button>
          <button class="cta-secondary" @click="scrollTo('about')" id="hero-about-btn">
            Tentang Kami
          </button>
        </div>

        <!-- Floating badges -->
        <div class="hero-badges">
          <span class="hero-badge">🚀 Pengiriman Cepat</span>
          <span class="hero-badge">💯 Bahan Premium</span>
          <span class="hero-badge">🎁 Kemasan Cantik</span>
        </div>
      </div>

      <!-- Animated dessert showcase -->
      <div class="hero-showcase">
        <div class="showcase-ring" />
        <div class="showcase-sprites">
          <div
            v-for="(d, i) in showcaseDesserts"
            :key="d.id"
            class="showcase-item"
            :style="showcaseItemStyle(i, showcaseDesserts.length)"
          >
            <DessertSprite :dessert="d" :size="72" />
          </div>
        </div>
        <div class="showcase-center">
          <span class="showcase-center-emoji">🍰</span>
        </div>
      </div>
    </section>

    <!-- ===== STATS BAR ===== -->
    <div class="stats-bar">
      <div class="stat-pill" v-for="stat in stats" :key="stat.label">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- ===== ABOUT ===== -->
    <section class="about-section" id="about">
      <div class="about-inner">
        <div class="about-image">
          <img
            src="/img/cupcake.png"
            alt="CutiePie Twitch Badges — pixel art desserts"
            class="about-img"
          />
          <div class="about-img-glow" />
        </div>
        <div class="about-text">
          <p class="section-eyebrow">✨ Kisah Kami</p>
          <h2 class="about-title">Dibuat dengan<br /><span class="pink-text">Cinta & Piksel</span></h2>
          <p class="about-desc">
            CutiePie lahir dari kecintaan kami terhadap kue-kue manis dan seni pixel art.
            Setiap produk dirancang dengan detail penuh kasih sayang, menggunakan bahan
            berkualitas premium pilihan terbaik.
          </p>
          <p class="about-desc">
            Kami percaya bahwa setiap gigitan harus menjadi pengalaman yang menyenangkan —
            seperti melihat karakter pixel art favorit kamu menjadi nyata di lidah! 🎮🍰
          </p>
          <div class="about-features">
            <div class="feature" v-for="f in features" :key="f.label">
              <span class="feature-icon">{{ f.icon }}</span>
              <span class="feature-label">{{ f.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MENU ===== -->
    <section class="menu-section" id="menu">
      <div class="section-header">
        <p class="section-eyebrow">🍩 Pilihan Menu</p>
        <h2 class="menu-title">Menu Spesial Kami</h2>
        <p class="menu-sub">Klik menu untuk melihat detail & pesan sekarang!</p>
      </div>

      <!-- Filter tabs -->
      <div class="filter-tabs" role="tablist" aria-label="Filter menu">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: activeFilter === tab.value }"
          @click="activeFilter = tab.value"
          :id="`filter-${tab.value}`"
          role="tab"
          :aria-selected="activeFilter === tab.value"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Search bar -->
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari kue favoritmu..."
          class="search-input"
          id="menu-search"
          aria-label="Cari menu"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="Hapus pencarian">✕</button>
      </div>

      <!-- Menu grid -->
      <TransitionGroup name="grid-item" tag="div" class="menu-grid">
        <DessertCard
          v-for="dessert in filteredDesserts"
          :key="dessert.id"
          :dessert="dessert"
          :cart-quantity="getCartQty(dessert.id)"
          @add-to-cart="addToCart"
          @open-detail="openDetail"
        />
      </TransitionGroup>

      <!-- No results -->
      <div v-if="filteredDesserts.length === 0" class="no-results">
        <p class="no-results-emoji">😢</p>
        <p class="no-results-text">Tidak ada kue yang cocok!</p>
        <button class="reset-btn" @click="resetFilters" id="reset-filter-btn">Reset Filter</button>
      </div>
    </section>

    <!-- ===== REVIEWS ===== -->
    <div id="reviews">
      <ReviewsSection :reviews="reviews" />
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          <span>🍰</span>
          <span>CutiePie</span>
        </div>
        <p class="footer-copy">
          Dibuat dengan 💖 untuk semua pecinta kue manis<br />
          <span style="opacity:0.6; font-size: 12px">Pixel art by <strong>scrimsart</strong></span>
        </p>
        <div class="footer-links">
          <a href="#menu" @click.prevent="scrollTo('menu')">Menu</a>
          <a href="#about" @click.prevent="scrollTo('about')">Tentang</a>
          <a href="#reviews" @click.prevent="scrollTo('reviews')">Ulasan</a>
        </div>
      </div>
    </footer>

    <!-- ===== MODALS & OVERLAYS ===== -->
    <DessertModal
      :dessert="selectedDessert"
      @close="selectedDessert = null"
      @add-to-cart="addToCartWithQty"
    />

    <CartDrawer
      :is-open="cartOpen"
      :items="cartItems"
      @close="cartOpen = false"
      @remove="removeFromCart"
      @increase="increaseQty"
      @decrease="decreaseQty"
      @checkout="handleCheckout"
    />

    <!-- Toast notification -->
    <Transition name="toast-slide">
      <div v-if="toastMsg" class="toast" role="alert" aria-live="polite">
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Dessert, CartItem } from './types'
import { desserts, reviews } from './data'
import DessertCard from './components/DessertCard.vue'
import DessertSprite from './components/DessertSprite.vue'
import DessertModal from './components/DessertModal.vue'
import CartDrawer from './components/CartDrawer.vue'
import ReviewsSection from './components/ReviewsSection.vue'

// ── Navbar scroll effect ──────────────────────────────────────────────
const isScrolled = ref(false)
function onScroll() { isScrolled.value = window.scrollY > 60 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

// ── Confetti layer ────────────────────────────────────────────────────
const confettiEmojis = ['🌸', '✨', '🍓', '⭐', '💕', '🎀', '🌺', '🍰']
const confetti = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  emoji: confettiEmojis[i % confettiEmojis.length],
  style: {
    left: Math.random() * 100 + 'vw',
    animationDuration: (8 + Math.random() * 12) + 's',
    animationDelay: (Math.random() * -20) + 's',
    fontSize: (10 + Math.random() * 16) + 'px',
    opacity: 0.2 + Math.random() * 0.3,
  },
}))

// ── Hero showcase ─────────────────────────────────────────────────────
const showcaseDesserts = computed(() => desserts.slice(0, 6))

function showcaseItemStyle(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  const radius = 140
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return {
    position: 'absolute' as const,
    left: `calc(50% + ${x}px - 36px)`,
    top: `calc(50% + ${y}px - 36px)`,
    animation: `float ${3 + index * 0.4}s ease-in-out infinite`,
    animationDelay: (index * 0.3) + 's',
  }
}

// ── Stats & Features ──────────────────────────────────────────────────
const stats = [
  { value: '2.4K+', label: 'Pelanggan Puas' },
  { value: '8', label: 'Menu Pilihan' },
  { value: '4.9⭐', label: 'Rating Rata-Rata' },
  { value: '100%', label: 'Bahan Alami' },
]

const features = [
  { icon: '🌿', label: 'Bahan Alami' },
  { icon: '🎁', label: 'Kemasan Cantik' },
  { icon: '🚀', label: 'Kirim Cepat' },
  { icon: '💯', label: 'Kualitas Terjamin' },
]

// ── Filter & Search ───────────────────────────────────────────────────
type FilterValue = 'all' | 'kue' | 'donat' | 'buah' | 'premium'

const filterTabs = [
  { value: 'all' as FilterValue, icon: '🍰', label: 'Semua' },
  { value: 'kue' as FilterValue, icon: '🧁', label: 'Kue' },
  { value: 'donat' as FilterValue, icon: '🍩', label: 'Donat' },
  { value: 'buah' as FilterValue, icon: '🍓', label: 'Buah' },
  { value: 'premium' as FilterValue, icon: '💎', label: 'Premium' },
]

const activeFilter = ref<FilterValue>('all')
const searchQuery = ref('')

const filteredDesserts = computed(() => {
  let list = desserts
  if (activeFilter.value !== 'all') {
    const tagMap: Record<string, string> = {
      kue: 'kue',
      donat: 'donat',
      buah: 'buah',
      premium: 'premium',
    }
    const tag = tagMap[activeFilter.value]
    list = list.filter(d => d.tags.includes(tag))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.tags.some(t => t.includes(q))
    )
  }
  return list
})

function resetFilters() {
  activeFilter.value = 'all'
  searchQuery.value = ''
}

// ── Cart ──────────────────────────────────────────────────────────────
const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)

const totalCartItems = computed(() => cartItems.value.reduce((s, i) => s + i.quantity, 0))

function getCartQty(id: number) {
  return cartItems.value.find(i => i.dessert.id === id)?.quantity ?? 0
}

function addToCart(dessert: Dessert) {
  const existing = cartItems.value.find(i => i.dessert.id === dessert.id)
  if (existing) {
    existing.quantity++
  } else {
    cartItems.value.push({ dessert, quantity: 1 })
  }
  showToast(`${dessert.emoji} ${dessert.name} ditambahkan! 🎉`)
}

function addToCartWithQty(dessert: Dessert, qty: number) {
  const existing = cartItems.value.find(i => i.dessert.id === dessert.id)
  if (existing) {
    existing.quantity += qty
  } else {
    cartItems.value.push({ dessert, quantity: qty })
  }
  showToast(`${dessert.emoji} ${dessert.name} ×${qty} ditambahkan! 🎉`)
}

function removeFromCart(id: number) {
  cartItems.value = cartItems.value.filter(i => i.dessert.id !== id)
}

function increaseQty(id: number) {
  const item = cartItems.value.find(i => i.dessert.id === id)
  if (item) item.quantity++
}

function decreaseQty(id: number) {
  const item = cartItems.value.find(i => i.dessert.id === id)
  if (item) {
    if (item.quantity <= 1) removeFromCart(id)
    else item.quantity--
  }
}

function handleCheckout() {
  cartItems.value = []
  cartOpen.value = false
  showToast('🎉 Pesananmu berhasil! Terima kasih sudah berbelanja di CutiePie! 💕')
}

// ── Detail Modal ──────────────────────────────────────────────────────
const selectedDessert = ref<Dessert | null>(null)

function openDetail(dessert: Dessert) {
  selectedDessert.value = dessert
}

// ── Toast ─────────────────────────────────────────────────────────────
const toastMsg = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3000)
}
</script>

<style scoped>
/* ── App shell ──────────────────────────────────────────────────── */
.app {
  position: relative;
  min-height: 100vh;
}

/* ── Confetti ─────────────────────────────────────────────────────── */
.confetti-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -40px;
  animation: confetti-fall linear infinite;
  user-select: none;
}

/* ── Navbar ───────────────────────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 800;
  background: rgba(255, 240, 245, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1.5px solid var(--pink-100);
  transition: box-shadow var(--transition-fast), background var(--transition-fast);
}

.navbar.scrolled {
  box-shadow: 0 4px 24px var(--shadow-soft);
  background: rgba(255, 240, 245, 0.96);
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 22px;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  font-weight: 700;
  font-size: 14px;
  color: var(--brown-light);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--pink-500);
  background: var(--pink-50);
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: 2px solid var(--pink-300);
  background: linear-gradient(135deg, var(--pink-400), var(--pink-500));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px rgba(255, 77, 141, 0.3);
  white-space: nowrap;
}

.cart-btn:hover {
  transform: scale(1.06) translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 77, 141, 0.4);
}

.cart-btn-icon {
  font-size: 16px;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--berry);
  color: var(--white);
  font-size: 11px;
  font-weight: 900;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--white);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* ── Hero ─────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  min-height: calc(100vh - 64px);
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero-eyebrow {
  font-size: 14px;
  font-weight: 800;
  color: var(--pink-500);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 56px);
  color: var(--brown);
  line-height: 1.15;
}

.gradient-text {
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--brown-light);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-primary {
  padding: 14px 28px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 77, 141, 0.4);
  transition: all var(--transition-normal);
}

.cta-primary:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 14px 32px rgba(255, 77, 141, 0.5);
}

.cta-secondary {
  padding: 14px 28px;
  border-radius: var(--radius-full);
  border: 2px solid var(--pink-300);
  background: transparent;
  color: var(--pink-500);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.cta-secondary:hover {
  background: var(--pink-50);
  transform: translateY(-2px);
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-badge {
  font-size: 12px;
  font-weight: 700;
  background: var(--white);
  color: var(--brown-light);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--pink-200);
  box-shadow: 0 2px 8px var(--shadow-soft);
}

/* Hero Showcase */
.hero-showcase {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0 auto;
}

.showcase-ring {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 2.5px dashed var(--pink-300);
  animation: float 8s ease-in-out infinite;
  opacity: 0.6;
}

.showcase-sprites {
  position: absolute;
  inset: 0;
}

.showcase-item {
  position: absolute;
  width: 72px;
  height: 72px;
}

.showcase-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  animation: heartbeat 2s ease-in-out infinite;
  z-index: 2;
}

/* ── Stats bar ────────────────────────────────────────────────────── */
.stats-bar {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  display: flex;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
  overflow: hidden;
}

.stats-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 20px 40px;
  border-right: 1px solid rgba(255,255,255,0.2);
  position: relative;
  z-index: 1;
}

.stat-pill:last-child {
  border-right: none;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── About ────────────────────────────────────────────────────────── */
.about-section {
  position: relative;
  z-index: 1;
  padding: 80px 24px;
  background: linear-gradient(160deg, var(--cream) 0%, var(--pink-50) 100%);
}

.about-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-image {
  position: relative;
}

.about-img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 64px var(--shadow-medium);
  position: relative;
  z-index: 1;
  transition: transform var(--transition-slow);
  image-rendering: pixelated;
}

.about-img:hover {
  transform: scale(1.03) rotate(-1deg);
}

.about-img-glow {
  position: absolute;
  inset: 12px;
  background: linear-gradient(135deg, var(--pink-300), var(--pink-500));
  border-radius: var(--radius-xl);
  filter: blur(24px);
  opacity: 0.4;
  z-index: 0;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-eyebrow {
  font-size: 13px;
  font-weight: 800;
  color: var(--pink-500);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.about-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  color: var(--brown);
  line-height: 1.2;
}

.pink-text {
  color: var(--pink-500);
}

.about-desc {
  font-size: 15px;
  color: var(--brown-light);
  line-height: 1.7;
}

.about-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  border: 1.5px solid var(--pink-100);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  transition: all var(--transition-normal);
}

.feature:hover {
  border-color: var(--pink-400);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow-soft);
}

.feature-icon {
  font-size: 20px;
}

.feature-label {
  font-size: 13px;
  font-weight: 800;
  color: var(--brown);
}

/* ── Menu Section ─────────────────────────────────────────────────── */
.menu-section {
  position: relative;
  z-index: 1;
  padding: 80px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.menu-title {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--brown);
  margin: 8px 0;
}

.menu-sub {
  font-size: 15px;
  color: var(--brown-light);
  font-weight: 600;
}

/* Filter tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-tab {
  padding: 8px 20px;
  border-radius: var(--radius-full);
  border: 2px solid var(--pink-200);
  background: var(--white);
  color: var(--brown-light);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.filter-tab:hover {
  border-color: var(--pink-400);
  color: var(--pink-500);
  transform: translateY(-2px);
}

.filter-tab.active {
  background: linear-gradient(135deg, var(--pink-400), var(--pink-500));
  border-color: transparent;
  color: var(--white);
  box-shadow: 0 4px 14px rgba(255, 77, 141, 0.35);
  transform: translateY(-1px);
}

/* Search */
.search-wrap {
  position: relative;
  max-width: 400px;
  margin: 0 auto 36px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 42px;
  border: 2px solid var(--pink-200);
  border-radius: var(--radius-full);
  background: var(--white);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--brown);
  font-weight: 600;
  outline: none;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.search-input::placeholder {
  color: var(--pink-300);
}

.search-input:focus {
  border-color: var(--pink-400);
  box-shadow: 0 0 0 4px rgba(255, 77, 141, 0.12), 0 4px 16px var(--shadow-soft);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--pink-100);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--brown-light);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--pink-300);
  color: var(--white);
}

/* Menu grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

/* No results */
.no-results {
  text-align: center;
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-results-emoji {
  font-size: 48px;
}

.no-results-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--brown-light);
}

.reset-btn {
  padding: 10px 24px;
  border-radius: var(--radius-full);
  border: 2px solid var(--pink-400);
  background: transparent;
  color: var(--pink-500);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.reset-btn:hover {
  background: var(--pink-400);
  color: var(--white);
}

/* ── Footer ───────────────────────────────────────────────────────── */
.footer {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, var(--brown) 0%, #3d1f0e 100%);
  padding: 40px 24px;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--pink-300);
}

.footer-copy {
  font-size: 14px;
  color: rgba(255, 220, 230, 0.7);
  font-weight: 600;
  text-align: center;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 16px;
}

.footer-links a {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 200, 220, 0.7);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--pink-300);
}

/* ── Toast ────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--brown), #5d2020);
  color: var(--white);
  padding: 14px 28px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.25);
  z-index: 1100;
  white-space: nowrap;
  max-width: calc(100vw - 48px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ── Grid item transitions ────────────────────────────────────────── */
.grid-item-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.grid-item-leave-active {
  transition: all 0.25s ease;
  position: absolute;
}

.grid-item-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.grid-item-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Badge pop */
.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-pop-enter-from,
.badge-pop-leave-to {
  transform: scale(0);
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 40px;
    min-height: auto;
    gap: 40px;
  }

  .hero-showcase {
    width: 260px;
    height: 260px;
  }

  .about-inner {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none;
  }

  .stat-pill {
    padding: 16px 20px;
  }

  .footer-inner {
    flex-direction: column;
    text-align: center;
  }

  .cart-btn-label {
    display: none;
  }
}
</style>
