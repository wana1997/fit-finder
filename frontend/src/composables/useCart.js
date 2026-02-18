import { ref, computed } from 'vue'

const CART_KEY = 'fit_finder_cart'

export function useCart() {
  // localStorage에서 장바구니 데이터 로드
  const getCartFromStorage = () => {
    try {
      const cart = localStorage.getItem(CART_KEY)
      return cart ? JSON.parse(cart) : []
    } catch (error) {
      console.error('장바구니 로드 실패:', error)
      return []
    }
  }

  const cartItems = ref(getCartFromStorage())

  // 장바구니를 localStorage에 저장
  const saveCartToStorage = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems.value))
    } catch (error) {
      console.error('장바구니 저장 실패:', error)
    }
  }

  // 장바구니에 상품 추가
  const addToCart = (product) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      // 이미 있으면 수량 증가
      existingItem.quantity += 1
    } else {
      // 새로운 상품 추가
      cartItems.value.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      })
    }
    
    saveCartToStorage()
    return {
      success: true,
      message: `"${product.name}"을(를) 장바구니에 추가했습니다.`,
      product: product
    }
  }

  // 장바구니에서 상품 제거
  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      const removed = cartItems.value[index]
      cartItems.value.splice(index, 1)
      saveCartToStorage()
      return {
        success: true,
        message: `"${removed.name}"을(를) 장바구니에서 제거했습니다.`,
        product: removed
      }
    }
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.'
    }
  }

  // 장바구니에서 상품 수량 변경
  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      item.quantity = quantity
      saveCartToStorage()
      return {
        success: true,
        message: `수량을 ${quantity}개로 변경했습니다.`
      }
    }
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.'
    }
  }

  // 장바구니 비우기
  const clearCart = () => {
    const count = cartItems.value.length
    cartItems.value = []
    saveCartToStorage()
    return {
      success: true,
      message: `${count}개의 상품을 제거했습니다.`,
      removedCount: count
    }
  }

  // 장바구니 총 상품 수
  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 장바구니 총 가격
  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  // 장바구니 상품 검색 (상품명이나 id로)
  const findProduct = (query) => {
    const lowerQuery = query.toLowerCase()
    return cartItems.value.find(
      item => item.name.toLowerCase().includes(lowerQuery) || item.id.toString() === query
    )
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    findProduct
  }
}
