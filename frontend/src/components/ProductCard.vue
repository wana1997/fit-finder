<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-meta">
        <span class="product-color">{{ colorName }}</span>
        <span class="product-price">{{ formattedPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// 색상 한글 변환
const colorName = computed(() => {
  const colorMap = {
    'black': '검은색',
    'white': '흰색',
    'navy': '네이비',
    'gray': '회색',
    'red': '빨간색'
  }
  return colorMap[props.product.color] || props.product.color
})

// 가격 포맷팅
const formattedPrice = computed(() => {
  return props.product.price.toLocaleString() + '원'
})
</script>

<style scoped>
.product-card {
  display: flex;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: clip;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  height: 120px;
  margin-bottom: 12px;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 3px 0 0 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.product-color {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #667eea;
  white-space: nowrap;
}
</style>