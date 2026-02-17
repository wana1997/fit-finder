<script setup>
import { ref, nextTick, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useAgent } from '../composables/useAgent'

const messages = ref([
  {
    role: 'assistant',
    text: '안녕하세요! Fit-Finder입니다. 어떤 옷을 찾으시나요? 😊',
    action: null,
    data: null,
    products: []
  }
])

const userInput = ref('')
const messagesContainer = ref(null)
const sessionId = ref(null)

// Agent composable 사용
const { isLoading, createAgentSession, sendAgentMessage } = useAgent()

// 컴포넌트 마운트 시 세션 생성
onMounted(async () => {
  try {
    if (sessionId.value) return
    sessionId.value = await createAgentSession()
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      text: '세션 생성에 실패했습니다. 페이지를 새로고침해주세요.',
      action: 'error',
      data: null,
      products: []
    })
  }
})

// 메시지 전송
const send = async () => {
  if (!userInput.value.trim() || isLoading.value || !sessionId.value) return

  const message = userInput.value.trim()
  
  // 사용자 메시지 추가
  messages.value.push({
    role: 'user',
    text: message,
    action: null,
    data: null,
    products: []
  })

  userInput.value = ''

  await nextTick()
  scrollToBottom()

  try {
    // Agent에게 메시지 전송 (composable 사용)
    const response = await sendAgentMessage(sessionId.value, message)

    // 응답 추가
    messages.value.push({
      role: 'assistant',
      text: response.text,
      action: response.action,
      data: response.data,
      products: response.products // 하위 호환성
    })

  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      text: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      action: 'error',
      data: null,
      products: []
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
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <h1>🛍️ Fit-Finder</h1>
      <p>스마트 패션 검색 도우미</p>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role]"
      >
        <div class="message-content">
          <p class="message-text">{{ msg.text }}</p>
          
          <!-- action 기반 UI 렌더링 -->
          <!-- 상품 검색 결과 -->
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
      
      <!-- 로딩 인디케이터 -->
      <div v-if="isLoading" class="message assistant">
        <div class="message-content">
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
          전송
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #f9fafb;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.chat-header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
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

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 1rem;
  border-radius: 12px;
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message.assistant .message-content {
  background: white;
  color: #111827;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-text {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.no-products {
  margin-top: 0.5rem;
  color: #6b7280;
  font-style: italic;
}

.product-detail {
  margin-top: 1rem;
  max-width: 400px;
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 4px;
  color: #991b1b;
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

.chat-input-container {
  padding: 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.chat-input-form {
  display: flex;
  gap: 0.75rem;
  max-width: 100%;
}

.chat-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-button {
  padding: 0.875rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* 스크롤바 스타일링 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
