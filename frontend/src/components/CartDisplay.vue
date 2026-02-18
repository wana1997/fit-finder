<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})

const colorMap = {
  'black': '검은색',
  'white': '흰색',
  'navy': '네이비',
  'gray': '회색',
  'red': '빨간색'
}

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}
</script>

<template>
  <div class="cart-display">
    <div v-if="items.length === 0" class="empty-cart">
      <p class="empty-cart-text">🛒 장바구니가 비어있습니다.</p>
    </div>
    <div v-else class="cart-items">
      <div class="cart-summary">
        <span class="summary-text">총 {{ items.length }}개 상품</span>
        <span class="summary-price">
          총액: {{ calculateTotal(items).toLocaleString() }}원
        </span>
      </div>
      <div class="cart-list">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="cart-item-image" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">{{ item.name }}</h4>
            <p class="cart-item-description">{{ item.description }}</p>
            <div class="cart-item-footer">
              <span class="cart-item-color">{{ colorMap[item.color] || item.color }}</span>
              <span class="cart-item-price">{{ item.price.toLocaleString() }}원</span>
            </div>
          </div>
          <div class="cart-item-quantity">
            <span class="qty-badge">{{ item.quantity }}개</span>
            <span class="item-subtotal">{{ (item.price * item.quantity).toLocaleString() }}원</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-display {
  margin-top: 1rem;
  width: 100%;
}

.empty-cart {
  text-align: center;
  padding: 2rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
}

.empty-cart-text {
  margin: 0;
  color: #9ca3af;
  font-size: 1rem;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.summary-text {
  color: #374151;
  font-size: 0.95rem;
}

.summary-price {
  color: #667eea;
  font-size: 1rem;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.cart-list::-webkit-scrollbar {
  width: 6px;
}

.cart-list::-webkit-scrollbar-track {
  background: transparent;
}

.cart-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.cart-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.cart-item-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-description {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cart-item-color {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.cart-item-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
}

.cart-item-quantity {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  text-align: right;
  gap: 0.5rem;
}

.qty-badge {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
  background: #eef2ff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.item-subtotal {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}
</style>
