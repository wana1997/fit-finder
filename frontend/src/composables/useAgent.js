/**
 * ADK Agent 통신을 위한 Composable
 */

import { ref } from 'vue'
import axios from 'axios'

export function useAgent() {
  const isLoading = ref(false)

  /**
   * 세션 ID 발급
   */
  const createAgentSession = async () => {
    try {
      const response = await axios.post('api/apps/root_agent/users/user/sessions')
      console.log('세션 생성:', response.data.id)
      return response.data.id
    } catch (error) {
      console.error('세션 생성 오류:', error)
      throw new Error('세션 생성에 실패했습니다.')
    }
  }

  /**
   * 에이전트에게 메시지 전송
   */
  const sendAgentMessage = async (sessionId, message) => {
    if (!sessionId) {
      throw new Error('세션이 생성되지 않았습니다.')
    }

    isLoading.value = true

    try {
      // ADK API 호출
      const aiMode = false
      let response = null
      
      if (aiMode) {
        response = await axios.post('/api/run',
          {
            appName: 'root_agent',
            new_message: {
              role: 'user',
              parts: [{ text: message }]
            },
            sessionId: sessionId,
            userId: 'user'
          }
        )
      } else {
        // Mock response for testing - API 응답과 동일한 형식
        response = {
					data: [
    {
        "modelVersion": "gemini-2.5-flash",
        "content": {
            "parts": [
                {
                    "functionCall": {
                        "id": "adk-cfe19dea-4fa7-4953-932c-55af64bd1efe",
                        "args": {
                            "max_price": 100000,
                            "color": "black",
                            "category": "패딩"
                        },
                        "name": "search_products"
                    },
                    "thoughtSignature": "CsoBAb4-9vvaCOXYQYZT_5U3aha0v6yr7XRznTKWftXbZpMFyC5PL_KjKMxARr5Dn3wTy9QxKVQ3oGx4A43LV2-prA2ND3Iug4XueuoAcTXeqCu8TMOoxuUcRxDbuYPyPBdr1VHSu-wLHxbtj_PZ-bHqRPq9BL5eeLQkvVQ_y1i_vK-VrYUoCM5N66lXVMxlN4JVIYw6GILPnFjO8SdSbTgmooJHbIKxg9CGNF0Elhzl9rHqTKLRQCkMu9_oJnzjMSqHUIG2FOGxGNx7uw=="
                }
            ],
            "role": "model"
        },
        "finishReason": "STOP",
        "usageMetadata": {
            "candidatesTokenCount": 33,
            "promptTokenCount": 712,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 712
                }
            ],
            "thoughtsTokenCount": 55,
            "totalTokenCount": 800
        },
        "invocationId": "e-29854166-547e-4e01-9420-5afc4e8a9c95",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "longRunningToolIds": [],
        "id": "f9e09500-c52d-44eb-a8ce-3d49e80dcac8",
        "timestamp": 1771316629.871225
    },
    {
        "content": {
            "parts": [
                {
                    "functionResponse": {
                        "id": "adk-cfe19dea-4fa7-4953-932c-55af64bd1efe",
                        "name": "search_products",
                        "response": {
                            "result": "{\n  \"action\": \"search_products\",\n  \"data\": [\n    {\n      \"id\": 1,\n      \"name\": \"노스페이스 롱 패딩\",\n      \"category\": \"패딩\",\n      \"color\": \"black\",\n      \"price\": 89000,\n      \"image\": \"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400\",\n      \"description\": \"따뜻하고 스타일리시한 롱 패딩\"\n    },\n    {\n      \"id\": 2,\n      \"name\": \"MLB 숏 패딩\",\n      \"category\": \"패딩\",\n      \"color\": \"black\",\n      \"price\": 95000,\n      \"image\": \"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400\",\n      \"description\": \"활동성 좋은 숏 패딩\"\n    },\n    {\n      \"id\": 3,\n      \"name\": \"유니클로 경량 패딩\",\n      \"category\": \"패딩\",\n      \"color\": \"black\",\n      \"price\": 79000,\n      \"image\": \"https://images.unsplash.com/photo-1548126032-079166fe3c39?w=400\",\n      \"description\": \"가볍고 휴대성 좋은 패딩\"\n    }\n  ]\n}"
                        }
                    }
                }
            ],
            "role": "user"
        },
        "invocationId": "e-29854166-547e-4e01-9420-5afc4e8a9c95",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "id": "ffd4bff3-f51a-45dd-b957-029cff1899dd",
        "timestamp": 1771316632.310788
    },
    {
        "modelVersion": "gemini-2.5-flash",
        "content": {
            "parts": [
                {
                    "text": "블랙 색상의 10만원 이하 패딩을 찾으시는군요! 고객님께 딱 맞는 상품들이 있어서 기뻐요. 😊\n\n여기 세 가지 상품을 추천해 드립니다:\n\n*   **노스페이스 롱 패딩**: 따뜻하고 스타일리시하며 가격은 89,000원입니다.\n*   **MLB 숏 패딩**: 활동성 좋은 숏 패딩으로 95,000원입니다.\n*   **유니클로 경량 패딩**: 가볍고 휴대성 좋은 패딩이며 79,000원입니다.\n\n어떤 패딩이 가장 마음에 드시나요? 더 궁금한 점이 있으시면 언제든지 말씀해주세요!"
                }
            ],
            "role": "model"
        },
        "finishReason": "STOP",
        "usageMetadata": {
            "candidatesTokenCount": 157,
            "promptTokenCount": 1148,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 1148
                }
            ],
            "totalTokenCount": 1305
        },
        "invocationId": "e-29854166-547e-4e01-9420-5afc4e8a9c95",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "id": "49355f6c-25cc-4d64-a868-deb368222d81",
        "timestamp": 1771316632.33664
    }
]
				}
      }

      // API 응답 데이터 추출 (axios는 자동으로 JSON 파싱)
      const data = response.data
      console.log('data', data)

      // 응답에서 텍스트 추출
      let responseText = ''
      if (data && Array.isArray(data)) {
        for (const event of data) {
          if (event.content && event.content.parts) {
            for (const part of event.content.parts) {
              if (part.text) {
                responseText += part.text
              }
            }
          }
        }
      }

      // action과 data 구조 추출
      let action = null
      let actionData = null
      let cleanText = responseText

      // {"action": "...", "data": ...} 형식의 JSON 찾기
      const actionJsonMatch = responseText.match(/\{\s*"action"\s*:\s*"[^"]+"\s*,\s*"data"\s*:[^}]*\}/s)
      if (actionJsonMatch) {
        try {
          const parsed = JSON.parse(actionJsonMatch[0])
          action = parsed.action
          actionData = parsed.data
          // JSON 부분 제거
          cleanText = responseText.replace(actionJsonMatch[0], '').trim()
        } catch (e) {
          console.error('Action JSON 파싱 오류:', e)
        }
      }

      // action이 없는 경우 기존 방식으로 상품 배열 파싱 시도
      if (!action) {
        const jsonMatch = responseText.match(/\[\s*\{[^\]]*\}\s*\]/s)
        if (jsonMatch) {
          try {
            const products = JSON.parse(jsonMatch[0])
            action = 'search_products'
            actionData = products
            cleanText = responseText.replace(/\[\s*\{[^\]]*\}\s*\]/s, '').trim()
          } catch (e) {
            console.error('JSON 파싱 오류:', e)
          }
        }
      }

      return {
        text: cleanText || '응답을 처리했습니다.',
        action: action,
        data: actionData,
        // 하위 호환성을 위한 products 필드
        products: action === 'search_products' ? actionData : [],
        rawResponse: data
      }

    } catch (error) {
      console.error('메시지 전송 오류:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
		isLoading,
    createAgentSession,
    sendAgentMessage
  }
}
