<script setup>
import { ref, nextTick, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import CartDisplay from './CartDisplay.vue'
import { useAgent } from '../composables/useAgent'
import { useCart } from '../composables/useCart'

const messages = ref([
  {
    role: 'assistant',
    ment: '안녕하세요! Fit-Finder입니다. 어떤 옷을 찾으시나요? 😊',
    action: null,
    data: null,
    timestamp: new Date()
  }
])

const userInput = ref('')
const messagesContainer = ref(null)
const sessionId = ref(null)
const showSidebar = ref(true)
const form = ref(null)

// Agent composable 사용
const { isLoading, createAgentSession, sendAgentMessage } = useAgent()
const { cartItems, addToCart, removeFromCart } = useCart()

const cloneCartItems = () => cartItems.value.map(item => ({ ...item }))

// 컴포넌트 마운트 시 세션 생성
onMounted(async () => {
  try {
    if (sessionId.value) return
    sessionId.value = await createAgentSession()
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      ment: '세션 생성에 실패했습니다. 페이지를 새로고침해주세요.',
      action: 'error',
      data: null,
      timestamp: new Date()
    })
  }
})

// 메시지 전송
const send = async () => {
  if (!userInput.value.trim() || isLoading.value || !sessionId.value) return

  const message = userInput.value.trim()
  
  messages.value.push({
    role: 'user',
    ment: message,
    action: null,
    data: null,
    timestamp: new Date()
  })

  userInput.value = ''

  await nextTick()
  scrollToBottom()

  try {
    // 모든 요청을 agent로 전달
    const response = await sendAgentMessage(sessionId.value, message)
    console.log('response', response)

    // add_to_cart 액션이면 localStorage에 저장
    if (response.action === 'add_to_cart' && response.data) {
      addToCart(response.data)
    }

    // delete_to_cart 액션이면 localStorage에서 제거
    if (response.action === 'delete_to_cart' && response.data && !response.data.error) {
      const productId = Number(response.data.id ?? response.data.product_id)
      if (!Number.isNaN(productId)) {
        removeFromCart(productId)
      }
    }

    if (response.action === 'init_payment' && response.data && !response.data.error) {
      const paymentProducts = getPaymentProducts(response.data)
      executeKcpPayment(paymentProducts)
    }

    const displayData = ['show_cart', 'add_to_cart', 'delete_to_cart'].includes(response.action)
      ? cloneCartItems()
      : response.data

    messages.value.push({
      role: 'assistant',
      ment: response.ment,
      action: response.action,
      data: displayData,
      timestamp: new Date()
    })

    scrollToBottom()

  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      ment: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      action: 'error',
      data: null,
      timestamp: new Date()
    })
  } finally {
    await nextTick()
    scrollToBottom()
  }
}

// 스크롤을 맨 아래로
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 시간 포맷팅
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 새 대화 시작
const startNewChat = () => {
  messages.value = [
    {
      role: 'assistant',
      ment: '안녕하세요! Fit-Finder입니다. 어떤 옷을 찾으시나요? 😊',
      action: null,
      data: null,
      timestamp: new Date()
    }
  ]
  userInput.value = ''
}

const getPaymentProducts = (actionData) => {
  if (!actionData) return []
  if (Array.isArray(actionData)) return actionData
  if (Array.isArray(actionData.products)) return actionData.products
  if (actionData.product) return [actionData.product]
  if (actionData.id && actionData.name && actionData.price) return [actionData]
  return []
}

const executeKcpPayment = (products) => {
  if (!form.value || !products.length) return

  const goodName = products.map(product => product.name).join(',')
  const goodMny = products.reduce((sum, product) => sum + Number(product.price || 0), 0)

  const goodNameInput = form.value.querySelector('input[name="good_name"]')
  const goodMnyInput = form.value.querySelector('input[name="good_mny"]')

  if (goodNameInput) goodNameInput.value = goodName
  if (goodMnyInput) goodMnyInput.value = String(goodMny)

  if (typeof window.KCP_Pay_Execute_Web === 'function') {
    window.KCP_Pay_Execute_Web(form.value)
  } else {
    console.error('KCP_Pay_Execute_Web 함수가 로드되지 않았습니다.')
  }
}
</script>

<template>
  <div class="chat-wrapper">
    <!-- KCP 결제창 전달 정보 -->
    <form name="order_info" method="post" action="/" ref="form">
      <input type="hidden" name="site_cd" value="T0000">
      <input type="hidden" name="site_name" value="TEST SITE">
      <input type="hidden" name="pay_method" value="100000000000">
      <input type="hidden" name="ordr_idxx" value="TEST123456789">
      <input type="hidden" name="good_name" value="운동화">
      <input type="hidden" name="good_cd" value="00">
      <input type="hidden" name="good_mny" value="1000">
      <input type="hidden" name="payco_direct" value="Y">
    </form>
    <!-- 사이드바 -->
    <aside class="sidebar" :class="{ collapsed: !showSidebar }">
      <div class="sidebar-header">
        <h2 class="app-title">Fit-Finder</h2>
        <button class="toggle-sidebar" @click="showSidebar = !showSidebar">
          ☰
        </button>
      </div>

      <button class="new-chat-btn" @click="startNewChat">
        <span class="icon">➕</span>
        <span class="label">새 대화</span>
      </button>

      <div class="sidebar-divider"></div>

      <div class="sidebar-section">
        <h3 class="section-title">최근 검색</h3>
        <div class="chat-history">
          <div class="chat-item">
            <span class="chat-text">패딩 검색</span>
          </div>
          <div class="chat-item">
            <span class="chat-text">가을 옷</span>
          </div>
          <div class="chat-item">
            <span class="chat-text">청바지</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 메인 채팅 영역 -->
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-group', msg.role]"
        >
          <div class="message-avatar">
            <span v-if="msg.role === 'user'" class="avatar-icon">👤</span>
            <span v-else class="avatar-icon">🛍️</span>
          </div>

          <div class="message-bubble">
            <div class="message-header">
              <span class="message-role">{{ msg.role === 'user' ? '당신' : 'Fit-Finder' }}</span>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>

            <div class="message-content">
              <!-- 메시지 (ment) - text가 있을 때만 표시 -->
              <p v-if="msg.ment" class="message-text">{{ msg.ment }}</p>
              
              <!-- action 기반 UI 렌더링 -->
              <!-- 상품 검색 결과 (search_products) -->
              <div v-if="msg.action === 'search_products' && msg.data && msg.data.length > 0" class="products-grid">
                <ProductCard
                  v-for="product in msg.data"
                  :key="product.id"
                  :product="product"
                />
              </div>
              
              <!-- 상품 상세 보기 -->
              <div v-else-if="msg.action === 'show_product_detail' && msg.data" class="product-detail">
                <ProductCard :product="msg.data" />
              </div>

              <!-- 장바구니 조회 -->
              <CartDisplay v-else-if="msg.action === 'show_cart'" :items="msg.data || []" />

              <!-- 장바구니 추가 알림 -->
              <div v-else-if="msg.action === 'add_to_cart'" class="cart-added-notification">
                <p class="notification-text">✅ 장바구니에 추가되었습니다!</p>
                <CartDisplay :items="msg.data || []" />
              </div>

              <!-- 장바구니 삭제 알림 -->
              <div v-else-if="msg.action === 'delete_to_cart'" class="cart-removed-notification">
                <p class="notification-text">🗑️ 장바구니에서 제거되었습니다!</p>
                <CartDisplay :items="msg.data || []" />
              </div>

              <!-- 결제 초기화 안내 -->
              <div v-else-if="msg.action === 'init_payment'" class="payment-notification">
                <p class="notification-text">💳 해당 상품 결제를 위해 PAYCO 결제창을 띄워드리겠습니다.</p>
              </div>
              
              <!-- 에러 메시지 -->
              <div v-else-if="msg.action === 'error' && msg.data" class="error-message">
                <p>❌ {{ msg.data.error || '오류가 발생했습니다.' }}</p>
              </div>
              
              <!-- 상품이 없을 때 -->
              <p v-else-if="msg.action === 'search_products' && msg.data && msg.data.length === 0" class="no-products">
                조건에 맞는 상품을 찾지 못했습니다.
              </p>
            </div>
          </div>
        </div>
        
        <!-- 로딩 인디케이터 -->
        <div v-if="isLoading" class="message-group assistant">
          <div class="message-avatar">
            <span class="avatar-icon">🛍️</span>
          </div>
          <div class="message-bubble">
            <div class="loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <form @submit.prevent="send" class="chat-input-form">
          <input
            v-model="userInput"
            type="text"
            placeholder="예: 10만원 이하 검은색 패딩 찾아줘"
            class="chat-input"
            :disabled="isLoading"
          />
          <button type="submit" class="send-button" :disabled="isLoading || !userInput.trim()">
            ➤
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.chat-wrapper {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

/* ===== 사이드바 ===== */
.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  overflow-y: auto;
  transition: width 0.3s ease, margin-left 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
  padding: 0;
  border-right: none;
  margin-left: 0;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.app-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.toggle-sidebar {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #667eea;
  padding: 0.25rem;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.new-chat-btn .icon {
  font-size: 1.1rem;
}

.sidebar-divider {
  height: 1px;
  background: #e5e7eb;
}

.sidebar-section {
  flex: 1;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chat-history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.chat-item:hover {
  background: #f3f4f6;
  border-left-color: #667eea;
}

.chat-text {
  display: block;
  font-size: 0.9rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 메인 채팅 컨테이너 ===== */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.chat-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.chat-header p {
  margin: 0.4rem 0 0 0;
  opacity: 0.95;
  font-size: 0.95rem;
  font-weight: 400;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.message-group {
  display: flex;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-group.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-top: 0.25rem;
}

.message-group.user .message-avatar {
  background: #e0e7ff;
}

.message-bubble {
  flex: 1;
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.message-group.user .message-bubble {
  align-items: flex-end;
}

.message-header {
  display: flex;
  gap: 0.8rem;
  font-size: 0.8rem;
  color: #6b7280;
  padding: 0 0.75rem;
}

.message-group.user .message-header {
  justify-content: flex-end;
}

.message-role {
  font-weight: 600;
  color: #374151;
}

.message-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.message-content {
  background: #f3f4f6;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.message-group.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 4px;
}

.message-text {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.products-grid {
  margin-top: 1rem;
}

.no-products {
  margin: 0;
  color: #6b7280;
  font-style: italic;
  font-size: 0.95rem;
}



.product-detail {
  margin-top: 1rem;
  max-width: 400px;
}

.cart-added-notification {
  margin: 0;
  padding: 0.75rem;
  background: #dcfce7;
  border-left: 4px solid #22c55e;
  border-radius: 4px;
  color: #166534;
  font-size: 0.95rem;
}

.cart-added-notification p {
  margin: 0;
}

.cart-removed-notification {
  margin: 0;
  padding: 0.75rem;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 4px;
  color: #991b1b;
  font-size: 0.95rem;
}

.cart-removed-notification p {
  margin: 0;
}

.payment-notification {
  margin: 0;
  padding: 0.75rem;
  background: #e0f2fe;
  border-left: 4px solid #0284c7;
  border-radius: 4px;
  color: #075985;
  font-size: 0.95rem;
}

.payment-notification p {
  margin: 0;
}

.error-message {
  margin: 0;
  padding: 0.75rem;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 4px;
  color: #991b1b;
  font-size: 0.95rem;
}

.error-message p {
  margin: 0;
}

.loading {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.loading span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* ===== 입력 영역 ===== */
.chat-input-container {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
}

.chat-input-form {
  display: flex;
  gap: 0.75rem;
  max-width: 900px;
  margin: 0 auto;
}

.chat-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  resize: none;
  max-height: 120px;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input:disabled {
  background: #f9fafb;
  cursor: not-allowed;
  color: #9ca3af;
}

.send-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* ===== 스크롤바 스타일링 ===== */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ===== 반응형 디자인 ===== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    width: 240px;
  }

  .sidebar.collapsed {
    margin-left: -240px;
  }

  .chat-wrapper {
    position: relative;
  }

  .chat-container {
    width: 100%;
  }

  .toggle-sidebar {
    display: block;
  }

  .message-bubble {
    max-width: 90%;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .chat-messages {
    padding: 1rem;
  }

  .chat-input-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
  }

  .chat-header h1 {
    font-size: 1.5rem;
  }

  .message-bubble {
    max-width: 95%;
  }

  .chat-input {
    padding: 0.75rem;
    font-size: 16px;
  }

  .send-button {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}
</style>
