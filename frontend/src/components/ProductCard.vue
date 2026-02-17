<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-details">
        <span class="product-color">색상: {{ colorName }}</span>
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.product-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-color {
  font-size: 0.875rem;
  color: #4b5563;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
}
</style>
