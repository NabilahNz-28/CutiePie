<template>
  <section class="reviews-section">
    <div class="section-header">
      <h2 class="section-title">💌 Ulasan Pelanggan</h2>
      <p class="section-sub">Kata mereka tentang CutiePie</p>
    </div>

    <div class="reviews-grid">
      <TransitionGroup name="review-pop" appear>
        <article
          v-for="(review, index) in reviews"
          :key="review.id"
          class="review-card"
          :style="{ animationDelay: (index * 120) + 'ms' }"
        >
          <div class="review-header">
            <div class="avatar">{{ review.avatar }}</div>
            <div class="reviewer-info">
              <p class="reviewer-name">{{ review.author }}</p>
              <p class="review-date">{{ review.date }}</p>
            </div>
            <div class="review-stars">
              <span v-for="s in 5" :key="s" :class="{ filled: s <= review.rating }">★</span>
            </div>
          </div>
          <p class="review-text">"{{ review.text }}"</p>
        </article>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Review } from '../types'

defineProps<{
  reviews: Review[]
}>()
</script>

<style scoped>
.reviews-section {
  padding: 60px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--brown);
  margin-bottom: 8px;
}

.section-sub {
  font-size: 15px;
  color: var(--brown-light);
  font-weight: 600;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.review-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 2px solid var(--pink-100);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  animation: slideInUp 0.5s ease both;
}

.review-card:hover {
  transform: translateY(-6px) rotate(-0.5deg);
  box-shadow: 0 16px 40px var(--shadow-soft);
  border-color: var(--pink-300);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  font-size: 32px;
  line-height: 1;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--brown);
}

.review-date {
  font-size: 11px;
  color: var(--brown-light);
}

.review-stars {
  font-size: 14px;
  color: var(--pink-100);
  display: flex;
  gap: 1px;
}

.review-stars span.filled {
  color: #f4c430;
}

.review-text {
  font-size: 13px;
  color: var(--brown-light);
  line-height: 1.6;
  font-style: italic;
}

/* Transitions */
.review-pop-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.review-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}
</style>
