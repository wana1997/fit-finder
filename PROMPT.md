# Project Request: Fit-Finder (Agentic Commerce using Google ADK)

나는 Google ADK (Agent Development Kit)와 Vue 3를 사용하여 의류 쇼핑몰 에이전트를 만들고 싶어.
아래 명세에 따라 프로젝트 구조를 잡고 코드를 작성해줘.

## 1. Project Overview
* **Project Name:** Fit-Finder
* **Goal:** 사용자가 자연어로 의류를 검색하고 추천받는 대화형 커머스 구축.
* **Primary Scenario:** 사용자가 "10만원 이하 검은색 패딩 찾아줘"라고 입력하면, 조건에 맞는 상품을 JSON 데이터에서 검색하여 보여준다.

## 2. Tech Stack & Architecture
* **Backend (Agent Logic):**
    * Language: Python 3.10+
    * Framework: Google ADK (https://google.github.io/adk-docs/)
    * **Structure:**
        * `agent.py`: 에이전트 정의 및 설정.
        * `tools.py`: 상품 검색, 상세 조회 기능을 수행하는 함수 정의 (Mock Data 사용).
        * `server.py`: ADK 에이전트를 API로 서빙 (Flask 또는 FastAPI 활용).
* **Frontend (UI):**
    * Framework: Vue 3 (Composition API, Script Setup).
    * Styling: Tailwind CSS (권장) 또는 Scoped CSS.
    * **Components:**
        * `ChatWindow.vue`: 대화창 컴포넌트.
        * `ProductCard.vue`: 검색된 상품을 보여주는 카드 UI.

## 3. Implementation Steps

### Step 1: Backend (Google ADK Setup)
1.  `tools.py`에 다음 함수를 구현해줘. (실제 DB 대신 간단한 리스트형 Mock Data를 사용할 것)
    * `search_products(category: str, color: str, max_price: int)`: 조건에 맞는 상품 리스트 반환.
2.  `agent.py`에서 Google ADK를 초기화하고, 위에서 만든 Tool을 등록해줘.
    * System Prompt: "당신은 스마트한 패션 검색 도우미 'Fit-Finder'입니다. 사용자의 예산, 색상, 스타일 요구사항에 맞춰 상품을 검색해 주세요."
3.  사용자의 멘트("10만원 이하 검은색 패딩 찾아줘")가 들어왔을 때, ADK가 파라미터(100000, black, padding)를 추출하여 `search_products`를 호출하는 로직이 작동해야 해.

### Step 2: Frontend (Vue 3 Implementation)
1.  사용자와 에이전트 간의 채팅 인터페이스를 구현해줘.
2.  에이전트의 응답에 텍스트뿐만 아니라 `products` 데이터가 포함되어 있다면, `ProductCard` 컴포넌트를 통해 이미지와 가격을 렌더링해줘.

## 4. Specific Requirement
* 최초 실행 시, Mock Data에는 최소 3개의 검은색 패딩 데이터(가격 10만원 이하)가 들어있어야 함.
* 프로젝트 폴더명은 `fit-finder`로 생성해줘.
* 코드는 바로 실행 가능한 형태로 작성해줘.