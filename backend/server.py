"""
FastAPI Server for Fit-Finder Agent (ADK Integration)
"""

import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from google.adk.cli.fast_api import get_fast_api_app

# 현재 디렉토리의 부모 디렉토리 (backend 폴더)
# agents_dir은 root_agent 폴더가 있는 위치를 가리켜야 함
AGENT_DIR = os.path.dirname(os.path.abspath(__file__))

# ADK로부터 FastAPI 앱 생성
app = get_fast_api_app(
    agents_dir=AGENT_DIR,
    web=False  # 웹 UI 비활성화
)

# CORS 설정 (Vue 프론트엔드와 통신을 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    # app 라우트 확인
    print("Registered routes:")
    for route in app.routes:
        print(route.path)
    # 서버 실행
    uvicorn.run(app, host="0.0.0.0", port=8000)
