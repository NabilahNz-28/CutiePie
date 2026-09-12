<template>
  <div class="cart-drawer" :class="{ open: isOpen }" role="complementary" aria-label="Keranjang belanja">
    <div class="drawer-overlay" @click="emit('close')" />

    <div class="drawer-panel">
      <!-- Header -->
      <div class="drawer-header">
        <div class="drawer-title">
          <span class="cart-icon">🛒</span>
          <h2>Keranjang</h2>
          <span v-if="totalItems > 0" class="item-badge">{{ totalItems }}</span>
        </div>
        <button class="drawer-close" @click="emit('close')" id="cart-close-btn" aria-label="Tutup keranjang">✕</button>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-sprite">🧺</div>
        <p class="empty-title">Keranjangmu kosong!</p>
        <p class="empty-sub">Tambahkan kue manis ke keranjang kamu 🍰</p>
      </div>

      <!-- Items list -->
      <div v-else class="cart-items">
        <TransitionGroup name="cart-item-list" tag="ul" class="items-list">
          <li
            v-for="item in items"
            :key="item.dessert.id"
            class="cart-item"
          >
            <div class="item-sprite">
              <DessertSprite :dessert="item.dessert" :size="52" />
            </div>
            <div class="item-info">
              <p class="item-name">{{ item.dessert.name }}</p>
              <p class="item-price">Rp{{ item.dessert.price.toLocaleString('id-ID') }}</p>
            </div>
            <div class="item-controls">
              <button class="qty-sm-btn" @click="emit('decrease', item.dessert.id)" :id="`cart-dec-${item.dessert.id}`">−</button>
              <span class="item-qty">{{ item.quantity }}</span>
              <button class="qty-sm-btn" @click="emit('increase', item.dessert.id)" :id="`cart-inc-${item.dessert.id}`">+</button>
            </div>
            <button class="remove-btn" @click="emit('remove', item.dessert.id)" :id="`cart-remove-${item.dessert.id}`" aria-label="Hapus item">🗑️</button>
          </li>
        </TransitionGroup>
      </div>

      <!-- Summary -->
      <div v-if="items.length > 0" class="cart-summary">
        <div class="summary-row">
          <span>Subtotal ({{ totalItems }} item)</span>
          <span>Rp{{ subtotal.toLocaleString('id-ID') }}</span>
        </div>
        <div class="summary-row discount">
          <span>🎁 Diskon Spesial</span>
          <span>-Rp{{ discount.toLocaleString('id-ID') }}</span>
        </div>
        <div class="summary-row ongkir">
          <span>🚚 Ongkos Kirim</span>
          <span>{{ subtotal >= 100000 ? 'Gratis! 🥳' : 'Rp10.000' }}</span>
        </div>
        <div class="summary-divider" />
        <div class="summary-row total">
          <span>Total</span>
          <span>Rp{{ total.toLocaleString('id-ID') }}</span>
        </div>
        <button class="checkout-btn" @click="handleCheckout" id="checkout-btn">
          💖 Checkout Sekarang
        </button>
        <p class="free-shipping-note" v-if="subtotal < 100000">
          Belanja Rp{{ (100000 - subtotal).toLocaleString('id-ID') }} lagi untuk gratis ongkir! 🚀
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '../types'
import DessertSprite from './DessertSprite.vue'

const props = defineProps<{
  isOpen: boolean
  items: CartItem[]
}>()

const emit = defineEmits<{
  close: []
  remove: [id: number]
  increase: [id: number]
  decrease: [id: number]
  checkout: []
}>()

const totalItems = computed(() => props.items.reduce((sum, i) => sum + i.quantity, 0))
const subtotal = computed(() => props.items.reduce((sum, i) => sum + i.dessert.price * i.quantity, 0))
const discount = computed(() => totalItems.value >= 3 ? Math.round(subtotal.value * 0.1) : 0)
const ongkir = computed(() => subtotal.value >= 100000 ? 0 : 10000)
const total = computed(() => subtotal.value - discount.value + ongkir.value)

function handleCheckout() {
  emit('checkout')
}
</script>

<style scoped>
.cart-drawer {
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
}

.cart-drawer.open {
  pointer-events: all;
}

.drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(90, 20, 40, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.cart-drawer.open .drawer-overlay {
  opacity: 1;
}

.drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(420px, 100vw);
  background: var(--white);
  box-shadow: -10px 0 60px rgba(100, 0, 50, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cart-drawer.open .drawer-panel {
  transform: translateX(0);
}

/* Header */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 2px solid var(--pink-100);
  background: linear-gradient(135deg, var(--pink-50), var(--cream));
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-icon {
  font-size: 24px;
}

.drawer-title h2 {
  font-size: 20px;
  font-weight: 900;
  color: var(--brown);
}

.item-badge {
  background: var(--pink-400);
  color: var(--white);
  font-size: 12px;
  font-weight: 900;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--pink-100);
  color: var(--brown);
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-close:hover {
  background: var(--pink-400);
  color: var(--white);
  transform: rotate(90deg);
}

/* Empty */
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  text-align: center;
}

.empty-sprite {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--brown);
}

.empty-sub {
  font-size: 14px;
  color: var(--brown-light);
}

/* Items */
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.items-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--pink-50);
  border-radius: var(--radius-md);
  border: 1.5px solid var(--pink-100);
  transition: all var(--transition-normal);
}

.cart-item:hover {
  border-color: var(--pink-300);
  box-shadow: 0 4px 12px var(--shadow-soft);
}

.item-sprite {
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--brown);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 12px;
  font-weight: 700;
  color: var(--pink-500);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--white);
  border: 1.5px solid var(--pink-200);
  border-radius: var(--radius-full);
  padding: 2px;
}

.qty-sm-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--pink-500);
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}

.qty-sm-btn:hover {
  background: var(--pink-100);
}

.item-qty {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: var(--brown);
}

.remove-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.5;
  transition: all var(--transition-fast);
  padding: 4px;
  border-radius: 50%;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.2);
  background: var(--pink-100);
}

/* Summary */
.cart-summary {
  padding: 16px 20px;
  background: var(--cream);
  border-top: 2px solid var(--pink-100);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: var(--brown-light);
}

.summary-row.discount {
  color: var(--green-dark);
}

.summary-row.total {
  font-size: 18px;
  font-weight: 900;
  color: var(--brown);
}

.summary-divider {
  height: 1.5px;
  background: var(--pink-200);
  border-radius: var(--radius-full);
}

.checkout-btn {
  padding: 14px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: all var(--transition-normal);
  box-shadow: 0 8px 24px rgba(255, 77, 141, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

.checkout-btn:hover {
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 77, 141, 0.55);
}

.free-shipping-note {
  font-size: 12px;
  text-align: center;
  color: var(--brown-light);
  font-weight: 600;
}

/* List transitions */
.cart-item-list-enter-active,
.cart-item-list-leave-active {
  transition: all 0.3s ease;
}

.cart-item-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
