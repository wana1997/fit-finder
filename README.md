# Fit-Finder 🛍️

Google ADK (Agent Development Kit)와 Vue 3를 사용한 대화형 의류 쇼핑몰 에이전트

## 📋 프로젝트 개요

Fit-Finder는 사용자가 자연어로 의류를 검색하고 추천받을 수 있는 대화형 커머스 애플리케이션입니다.

**주요 기능:**
- 자연어 기반 상품 검색 ("10만원 이하 검은색 패딩 찾아줘")
- Google Gemini AI를 활용한 지능형 대화
- 실시간 상품 필터링 (카테고리, 색상, 가격)
- 반응형 UI/UX

## 🏗️ 기술 스택

### Backend
- **Language:** Python 3.10+
- **AI Framework:** Google ADK (Agent Development Kit)
- **API Server:** FastAPI
- **Features:** Agent-based Architecture, Tool Integration, Function Calling

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

## 📁 프로젝트 구조

```
fit-finder/
├── backend/
│   ├── root_agent/             # ADK 에이전트 디렉토리
│   │   ├── agent.py            # Google ADK 에이전트 정의
│   │   └── tools.py            # 상품 검색 함수 및 Mock 데이터
│   ├── server.py               # FastAPI 서버
│   ├── requirements.txt        # Python 의존성
│   └── .env.example            # 환경 변수 템플릿
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.vue  # 채팅 인터페이스
│   │   │   └── ProductCard.vue # 상품 카드 UI
│   │   ├── composables/
│   │   │   └── useAgent.js     # Agent API 통신 로직
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Vite 설정 (API 프록시 포함)
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

## 🚀 설치 및 실행 방법

### 1. Google API Key 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. API Key 생성
3. API Key 복사

### 2. Backend 설정

```bash
# backend 디렉토리로 이동
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# .env 파일을 열어서 Google API Key 입력
# GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Frontend 설정

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install
```

### 4. 실행

**터미널 1 - Backend 서버:**
```bash
cd backend
python server.py
```
서버가 http://localhost:8000 에서 실행됩니다.

**터미널 2 - Frontend 개발 서버:**
```bash
cd frontend
npm run dev
```
프론트엔드가 http://localhost:5173 에서 실행됩니다.

### 5. 브라우저에서 접속

http://localhost:5173 을 열어서 Fit-Finder를 사용해보세요!

## 💬 사용 예시

### 검색 예시:
- "10만원 이하 검은색 패딩 찾아줘"
- "네이비색 패딩 있어?"
- "5만원대 검은색 옷 보여줘"
- "15만원 넘는 패딩 추천해줘"

## 🛠️ Mock 데이터

현재 프로젝트는 6개의 Mock 상품 데이터를 사용합니다:
- 검은색 패딩 4개 (가격대: 79,000원 ~ 150,000원)
- 네이비색 패딩 1개
- 총 10만원 이하 검은색 패딩 3개

실제 프로덕션에서는 `tools.py`의 `MOCK_PRODUCTS`를 실제 데이터베이스로 교체하면 됩니다.

## 🔧 주요 컴포넌트 설명

### Backend

**backend/root_agent/agent.py**
- Google Gemini 모델(`gemini-3-flash-preview`)을 사용한 에이전트 정의
- Function Calling을 통한 상품 검색 기능
- 자연어를 파라미터로 변환
- ADK 디렉토리 구조 준수 (`root_agent/`)

**backend/root_agent/tools.py**
- `search_products()`: 카테고리, 색상, 가격으로 상품 필터링
- `get_product_detail()`: 특정 상품 상세 정보 조회
- **Action 기반 응답**: `{"action": "search_products", "data": [...]}`
- Mock 데이터 관리

**backend/server.py**
- FastAPI 기반 API 서버
- `get_fast_api_app()`을 사용한 ADK 통합
- CORS 미들웨어로 프론트엔드와 통신
- ADK 세션 API: `/api/apps/root_agent/users/<user>/sessions`
- 메시지 API: `/api/run`

### Frontend

**src/composables/useAgent.js**
- Agent API 통신을 위한 재사용 가능한 Composable
- `createAgentSession()`: 세션 생성
- `sendAgentMessage()`: 메시지 전송 및 응답 파싱
- Action 기반 응답 처리

**src/components/ChatWindow.vue**
- 사용자와 AI 간의 대화 인터페이스
- 메시지 히스토리 관리
- Action에 따른 동적 UI 렌더링:
  - `search_products`: 상품 그리드 표시
  - `show_product_detail`: 상품 상세 정보
  - `error`: 에러 메시지 표시

**src/components/ProductCard.vue**
- 개별 상품 정보 표시
- 이미지, 이름, 가격, 색상 렌더링
- 호버 효과 및 반응형 디자인

**vite.config.js**
- `/api` 프록시 설정으로 CORS 우회
- 개발 서버가 `localhost:8000`의 백엔드로 요청 전달

## 🎨 커스터마이징

### 상품 데이터 추가
`backend/root_agent/tools.py`의 `MOCK_PRODUCTS` 리스트에 상품 추가:

```python
{
    "id": 7,
    "name": "새로운 상품",
    "category": "자켓",
    "color": "blue",
    "price": 85000,
    "image": "https://example.com/image.jpg",
    "description": "상품 설명"
}
```

### 새로운 Tool 추가
`backend/root_agent/tools.py`에 함수 추가 후 `agent.py`의 tools 리스트에 등록:
```python
# tools.py
def new_tool(param: str) -> str:
    """Tool 설명"""
    return json.dumps({"action": "new_action", "data": {...}})

# agent.py
from .tools import search_products, get_product_detail, new_tool
Agent(model='gemini-3-flash-preview', tools=[search_products, get_product_detail, new_tool])
```

### AI 프롬프트 수정
`backend/root_agent/agent.py`의 `SYSTEM_INSTRUCTION` 변수를 수정하여 에이전트 행동 조정

### UI 스타일 변경
`frontend/src/components/` 폴더의 Vue 컴포넌트에서 스타일 수정

## � Git 사용법

### 첫 커밋 및 푸시

```bash
# Git 초기화 (아직 안했다면)
git init

# 모든 파일 스테이징
git add .

# 첫 커밋
git commit -m "Initial commit: Fit-Finder agentic commerce"

# GitHub 원격 저장소 연결
git remote add origin https://github.com/your-username/fit-finder.git

# 푸시
git branch -M main
git push -u origin main
```

### 주의사항
- `.env` 파일은 `.gitignore`에 포함되어 있어 커밋되지 않습니다
- Google API Key는 절대 Git에 올리지 마세요
- `.env.example` 파일을 참고하여 각자 `.env` 파일을 생성하세요

## �🐛 문제 해결

### Backend 서버 오류
- Google API Key가 올바르게 설정되었는지 확인
- `.env` 파일이 `backend/` 폴더에 있는지 확인
- Python 패키지가 모두 설치되었는지 확인

### CORS 오류
- Backend 서버가 8000 포트에서 실행 중인지 확인
- Frontend가 5173 포트에서 실행 중인지 확인

### 상품이 표시되지 않음
- Backend API가 정상 응답하는지 브라우저 콘솔 확인
- Network 탭에서 API 호출 상태 확인

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Fit-Finder Team

---

**Note:** 이 프로젝트는 학습 및 데모 목적으로 만들어졌습니다. 실제 프로덕션 환경에서 사용하려면 추가적인 보안, 에러 핸들링, 데이터베이스 연동이 필요합니다.
