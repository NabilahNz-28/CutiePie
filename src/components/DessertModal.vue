<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="dessert" class="modal-overlay" @click.self="emit('close')" role="dialog" :aria-label="dessert.name" aria-modal="true">
        <div class="modal-box" :style="{ '--accent': dessert.color }">
          <!-- Close button -->
          <button class="close-btn" @click="emit('close')" aria-label="Tutup" id="modal-close-btn">✕</button>

          <!-- Header / image -->
          <div class="modal-hero">
            <div class="hero-bg" />
            <DessertSprite :dessert="dessert" :size="160" />
            <div class="hero-emoji">{{ dessert.emoji }}</div>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <div class="modal-title-row">
              <h2 class="modal-title">{{ dessert.name }}</h2>
              <div class="rating-badge">
                ⭐ {{ dessert.rating.toFixed(1) }}
              </div>
            </div>

            <p class="modal-desc">{{ dessert.description }}</p>

            <!-- Tags -->
            <div class="modal-tags">
              <span v-for="tag in dessert.tags" :key="tag" class="modal-tag">#{{ tag }}</span>
            </div>

            <!-- Nutrition bar -->
            <div class="nutrition-section">
              <p class="section-label">Info Nutrisi</p>
              <div class="nutrition-bar-wrap">
                <div class="nutrition-bar" :style="{ width: Math.min((dessert.calories / 600) * 100, 100) + '%' }" />
              </div>
              <p class="nutrition-text">{{ dessert.calories }} kalori per porsi</p>
            </div>

            <!-- Quantity selector -->
            <div class="qty-section">
              <p class="section-label">Jumlah</p>
              <div class="qty-controls">
                <button class="qty-btn" @click="decrease" :disabled="qty <= 1" id="qty-decrease">−</button>
                <span class="qty-display">{{ qty }}</span>
                <button class="qty-btn" @click="increase" id="qty-increase">+</button>
              </div>
            </div>

            <!-- Total & CTA -->
            <div class="modal-footer">
              <div class="total-price">
                <span class="total-label">Total</span>
                <span class="total-value">Rp{{ (dessert.price * qty).toLocaleString('id-ID') }}</span>
              </div>
              <button
                class="order-btn"
                @click="handleOrder"
                id="modal-order-btn"
              >
                🛒 Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Dessert } from '../types'
import DessertSprite from './DessertSprite.vue'

const props = defineProps<{
  dessert: Dessert | null
}>()

const emit = defineEmits<{
  close: []
  'add-to-cart': [dessert: Dessert, qty: number]
}>()

const qty = ref(1)

watch(() => props.dessert, () => { qty.value = 1 })

function increase() { qty.value++ }
function decrease() { if (qty.value > 1) qty.value-- }

function handleOrder() {
  if (props.dessert) {
    emit('add-to-cart', props.dessert, qty.value)
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(90, 20, 40, 0.45);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-box {
  background: var(--white);
  border-radius: var(--radius-xl);
  max-width: 440px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(100, 0, 50, 0.25);
  animation: bounceIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brown);
  font-weight: 800;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.close-btn:hover {
  background: var(--pink-400);
  color: var(--white);
  transform: rotate(90deg) scale(1.1);
}

/* Hero */
.modal-hero {
  position: relative;
  background: linear-gradient(160deg, var(--pink-50), var(--pink-200));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 200px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 100%, var(--accent, var(--pink-300)) 0%, transparent 65%);
  opacity: 0.35;
}

.hero-emoji {
  position: absolute;
  top: 14px;
  left: 18px;
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

/* Body */
.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.modal-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--brown);
  line-height: 1.2;
}

.rating-badge {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: var(--white);
  font-weight: 800;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  box-shadow: 0 3px 10px rgba(255,170,0,0.35);
  flex-shrink: 0;
}

.modal-desc {
  font-size: 14px;
  color: var(--brown-light);
  line-height: 1.6;
}

.modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--pink-600);
  background: var(--pink-50);
  border: 1.5px solid var(--pink-200);
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

/* Nutrition */
.nutrition-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--brown-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nutrition-bar-wrap {
  background: var(--pink-100);
  border-radius: var(--radius-full);
  height: 8px;
  overflow: hidden;
}

.nutrition-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--pink-300), var(--pink-500));
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nutrition-text {
  font-size: 12px;
  color: var(--brown-light);
  font-weight: 600;
}

/* Qty */
.qty-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--pink-50);
  border: 2px solid var(--pink-200);
  border-radius: var(--radius-full);
  width: fit-content;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 20px;
  font-weight: 900;
  color: var(--pink-500);
  cursor: pointer;
  transition: background var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  background: var(--pink-100);
}

.qty-btn:disabled {
  color: var(--pink-200);
  cursor: not-allowed;
}

.qty-display {
  min-width: 48px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  color: var(--brown);
  border-left: 1.5px solid var(--pink-200);
  border-right: 1.5px solid var(--pink-200);
  padding: 0 4px;
}

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
  border-top: 1.5px solid var(--pink-100);
}

.total-price {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 11px;
  color: var(--brown-light);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-value {
  font-size: 22px;
  font-weight: 900;
  color: var(--pink-500);
}

.order-btn {
  padding: 13px 24px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 6px 20px rgba(255, 77, 141, 0.4);
  white-space: nowrap;
}

.order-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 10px 28px rgba(255, 77, 141, 0.5);
}

.order-btn:active {
  transform: scale(0.97);
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
