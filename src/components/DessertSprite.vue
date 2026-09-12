<template>
  <div
    class="sprite-wrapper"
    :style="{
      width: size + 'px',
      height: size + 'px',
    }"
    :class="{ 'is-hovering': isHovering }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="sprite-clip">
      <div
        class="sprite"
        :style="spriteStyle"
      />
    </div>
    <!-- Sparkles on hover -->
    <span v-if="isHovering" class="sparkle s1">✨</span>
    <span v-if="isHovering" class="sparkle s2">⭐</span>
    <span v-if="isHovering" class="sparkle s3">✨</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Dessert } from '../types'

const props = withDefaults(defineProps<{
  dessert: Dessert
  size?: number
}>(), {
  size: 80,
})

const isHovering = ref(false)

// desserts.jpg: 1376 x 768px, 4 cols x 2 rows
// Each cell: 344w x 384h
const IMG_W = 1376
const IMG_H = 768
const COLS = 4
const ROWS = 2
const CELL_W = IMG_W / COLS  // 344
const CELL_H = IMG_H / ROWS  // 384

const spriteStyle = computed(() => {
  // Scale so cell height fills the display size (portrait cells → square display)
  const scale = props.size / CELL_H
  const scaledW = IMG_W * scale
  const scaledH = IMG_H * scale
  const bgX = -(props.dessert.spriteX * CELL_W) * scale
  const bgY = -(props.dessert.spriteY * CELL_H) * scale
  // Rendered cell width at this scale
  const cellW = CELL_W * scale

  return {
    width: cellW + 'px',
    height: props.size + 'px',
    backgroundImage: `url('/img/desserts.jpg')`,
    backgroundSize: `${scaledW}px ${scaledH}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'auto',
  }
})
</script>

<style scoped>
.sprite-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-normal);
  flex-shrink: 0;
}

.sprite-wrapper.is-hovering {
  transform: scale(1.15) translateY(-4px);
  filter: drop-shadow(0 8px 16px rgba(255, 100, 150, 0.5));
}

/* Clip the cell to a circle */
.sprite-clip {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprite {
  background-repeat: no-repeat;
  flex-shrink: 0;
}

.sparkle {
  position: absolute;
  font-size: 14px;
  pointer-events: none;
  animation: sparkle 0.8s ease-out forwards;
  z-index: 2;
}

.s1 {
  top: -8px;
  right: -4px;
  animation-delay: 0ms;
}

.s2 {
  bottom: -4px;
  left: -8px;
  animation-delay: 100ms;
  font-size: 12px;
}

.s3 {
  top: 50%;
  right: -12px;
  animation-delay: 200ms;
  font-size: 10px;
}
</style>
