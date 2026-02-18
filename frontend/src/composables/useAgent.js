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
                        "id": "adk-1c8a62bc-da68-4f8e-b322-55515c2a6930",
                        "args": {},
                        "name": "show_cart"
                    },
                    "thoughtSignature": "CtIBAb4-9vtMW5MSuh3uDOpc0Uoe5qUuVeohKjjq3e6fQm3VFXvcMKPM64db_cfr92xGL5axEwjlI2bHiJLfGg6mhHaeyOUSbcaRGKWs3jHotFYjrzPWSf-vpxNauNJydSlgn3PARFjOGOJj-hOMycfF8_NzxJh4o85-6Uwv0f_SKeO58eYx1NLNt7orr1HeFJST80dURF5zcNz-w-mprrpixxda1HXNfIV2cQLLVwzcE07NSO1mQaT3JoDkiOg-XNeoqR-hqzFGNIX8BuRlMZKsf0Un"
                }
            ],
            "role": "model"
        },
        "finishReason": "STOP",
        "usageMetadata": {
            "candidatesTokenCount": 10,
            "promptTokenCount": 1748,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 1748
                }
            ],
            "thoughtsTokenCount": 43,
            "totalTokenCount": 1801
        },
        "invocationId": "e-234b6f96-f79a-4fc9-9bdb-0e89b1b8548f",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "longRunningToolIds": [],
        "id": "fc945745-c08f-40a1-83e0-35f0cd819023",
        "timestamp": 1771408790.213753
    },
    {
        "content": {
            "parts": [
                {
                    "functionResponse": {
                        "id": "adk-1c8a62bc-da68-4f8e-b322-55515c2a6930",
                        "name": "show_cart",
                        "response": {
                            "result": "{\"message\": \"장바구니 조회\", \"action_only\": true}"
                        }
                    }
                }
            ],
            "role": "user"
        },
        "invocationId": "e-234b6f96-f79a-4fc9-9bdb-0e89b1b8548f",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "id": "9b63a497-7ff8-4c74-83b7-becc936345c1",
        "timestamp": 1771408792.865809
    },
    {
        "modelVersion": "gemini-2.5-flash",
        "content": {
            "parts": [
                {
                    "text": "장바구니를 확인해보세요!"
                }
            ],
            "role": "model"
        },
        "finishReason": "STOP",
        "usageMetadata": {
            "candidatesTokenCount": 9,
            "promptTokenCount": 1789,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 1789
                }
            ],
            "totalTokenCount": 1798
        },
        "invocationId": "e-234b6f96-f79a-4fc9-9bdb-0e89b1b8548f",
        "author": "root_agent",
        "actions": {
            "stateDelta": {},
            "artifactDelta": {},
            "requestedAuthConfigs": {},
            "requestedToolConfirmations": {}
        },
        "id": "a66e0106-bb54-4a9f-a88d-6314f95568f6",
        "timestamp": 1771408792.886453
    }
]
				}
      }

      // API 응답 데이터 추출 (axios는 자동으로 JSON 파싱)
      const data = response.data

      // ADK 응답 처리
      let actionData = null
      let ment = ''
      let toolName = null

      if (data && Array.isArray(data)) {
        // 1. functionCall 찾기 (어떤 tool을 호출했는지)
        for (const event of data) {
          if (event.content?.parts) {
            for (const part of event.content.parts) {
              if (part.functionCall) {
                toolName = part.functionCall.name
                break
              }
            }
          }
        }

        // 2. functionResponse 찾기 (tool의 응답)
        for (const event of data) {
          if (event.content?.parts) {
            for (const part of event.content.parts) {
              if (part.functionResponse) {
                try {
                  const resultStr = part.functionResponse.response.result
                  // tools.py는 데이터만 반환함
                  actionData = JSON.parse(resultStr)
                } catch (e) {
                  console.error('functionResponse 파싱 오류:', e)
                }
                break
              }
            }
          }
        }

        // 3. 최종 메시지 찾기 (agent의 text 응답)
        for (const event of data) {
          if (event.content?.parts) {
            for (const part of event.content.parts) {
              if (part.text) {
                ment = part.text
              }
            }
          }
        }
      }

      return {
        action: toolName === 'add_to_cart' ? 'add_cart' : toolName,
        data: actionData,
        ment: ment,
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
