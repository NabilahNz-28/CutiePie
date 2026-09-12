<template>
  <article
    class="dessert-card"
    :class="{ 'in-cart': isInCart, 'sold-out': !dessert.available }"
    :style="{ '--accent': dessert.color }"
    @click="handleCardClick"
    tabindex="0"
    :aria-label="`${dessert.name} - Rp${dessert.price.toLocaleString('id-ID')}`"
    @keydown.enter="handleCardClick"
  >
    <!-- Ribbon for special items -->
    <div v-if="dessert.rating >= 5.0" class="ribbon">⭐ Terlaris</div>

    <!-- Sprite Display -->
    <div class="sprite-area">
      <DessertSprite :dessert="dessert" :size="96" />
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="dessert-name">{{ dessert.name }}</h3>
        <span class="dessert-emoji">{{ dessert.emoji }}</span>
      </div>

      <p class="dessert-desc">{{ dessert.description }}</p>

      <!-- Tags -->
      <div class="tags">
        <span
          v-for="tag in dessert.tags"
          :key="tag"
          class="tag"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <span class="stat-item">
          <span class="stat-icon">⭐</span>
          {{ dessert.rating.toFixed(1) }}
        </span>
        <span class="stat-item">
          <span class="stat-icon">🔥</span>
          {{ dessert.calories }} kal
        </span>
      </div>

      <!-- Price & Action -->
      <div class="card-footer">
        <div class="price">
          <span class="price-label">Harga</span>
          <span class="price-value">Rp{{ dessert.price.toLocaleString('id-ID') }}</span>
        </div>

        <button
          class="add-btn"
          :class="{ 'added': isInCart }"
          @click.stop="emit('add-to-cart', dessert)"
          :disabled="!dessert.available"
          :id="`add-btn-${dessert.id}`"
        >
          <span class="btn-icon">{{ isInCart ? '✓' : '+' }}</span>
          <span class="btn-text">{{ isInCart ? 'Di Keranjang' : 'Tambah' }}</span>
        </button>
      </div>
    </div>

    <!-- Ripple effect -->
    <span v-if="showRipple" class="ripple-effect" :style="rippleStyle" />
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Dessert } from '../types'
import DessertSprite from './DessertSprite.vue'

const props = defineProps<{
  dessert: Dessert
  cartQuantity: number
}>()

const emit = defineEmits<{
  'add-to-cart': [dessert: Dessert]
  'open-detail': [dessert: Dessert]
}>()

const isInCart = computed(() => props.cartQuantity > 0)

const showRipple = ref(false)
const rippleStyle = ref({})

function handleCardClick(event: MouseEvent | KeyboardEvent) {
  if (event instanceof MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    rippleStyle.value = {
      left: (event.clientX - rect.left) + 'px',
      top: (event.clientY - rect.top) + 'px',
    }
    showRipple.value = true
    setTimeout(() => { showRipple.value = false }, 700)
  }
  emit('open-detail', props.dessert)
}
</script>

<style scoped>
.dessert-card {
  position: relative;
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 2px solid var(--pink-100);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-fast);
  display: flex;
  flex-direction: column;
  outline: none;
}

.dessert-card:hover,
.dessert-card:focus {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px var(--shadow-medium);
  border-color: var(--accent);
}

.dessert-card.in-cart {
  border-color: var(--pink-400);
  animation: pulse-glow 2s ease-in-out infinite;
}

.dessert-card.sold-out {
  opacity: 0.6;
  filter: grayscale(0.4);
}

/* Ribbon */
.ribbon {
  position: absolute;
  top: 14px;
  right: -6px;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-600));
  color: var(--white);
  font-size: 10px;
  font-weight: 800;
  padding: 4px 14px 4px 8px;
  border-radius: 4px 0 0 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  letter-spacing: 0.5px;
  z-index: 2;
}

.ribbon::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 0;
  border-width: 10px 6px 10px 0;
  border-style: solid;
  border-color: transparent var(--pink-600) transparent transparent;
  transform: rotateY(180deg);
  width: 0;
  height: 0;
}

/* Sprite Area */
.sprite-area {
  background: linear-gradient(160deg, #fff8fa 0%, var(--pink-50) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 140px;
  position: relative;
  overflow: hidden;
}

.sprite-area::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 60%, rgba(255, 182, 210, 0.2) 0%, transparent 70%);
}

/* Card content */
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dessert-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--brown);
  line-height: 1.2;
}

.dessert-emoji {
  font-size: 20px;
  flex-shrink: 0;
}

.dessert-desc {
  font-size: 12px;
  color: var(--brown-light);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--pink-500);
  background: var(--pink-50);
  border: 1px solid var(--pink-200);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.3px;
}

/* Stats */
.stats-row {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--brown-light);
}

.stat-icon {
  font-size: 13px;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--pink-100);
}

.price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 10px;
  color: var(--brown-light);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  font-size: 15px;
  font-weight: 900;
  color: var(--pink-500);
}

/* Add button */
.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: none;
  background: linear-gradient(135deg, var(--pink-400), var(--pink-500));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px rgba(255, 77, 141, 0.35);
}

.add-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(255, 77, 141, 0.5);
}

.add-btn:active {
  transform: scale(0.95);
}

.add-btn.added {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.35);
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-icon {
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
}

/* Ripple */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background: rgba(255, 100, 150, 0.4);
  transform: scale(0);
  animation: ripple 0.7s ease-out forwards;
  pointer-events: none;
  margin-top: -4px;
  margin-left: -4px;
}
</style>
