"""
Tools for the Fit-Finder agent.
Contains product search functionality with mock data.
"""

from typing import List, Dict, Any, Optional


# Mock Data: 의류 상품 데이터
MOCK_PRODUCTS = [
    {
        "id": 1,
        "name": "노스페이스 롱 패딩",
        "category": "패딩",
        "color": "black",
        "price": 89000,
        "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
        "description": "따뜻하고 스타일리시한 롱 패딩"
    },
    {
        "id": 2,
        "name": "MLB 숏 패딩",
        "category": "패딩",
        "color": "black",
        "price": 95000,
        "image": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
        "description": "활동성 좋은 숏 패딩"
    },
    {
        "id": 3,
        "name": "유니클로 경량 패딩",
        "category": "패딩",
        "color": "black",
        "price": 79000,
        "image": "https://images.unsplash.com/photo-1548126032-079166fe3c39?w=400",
        "description": "가볍고 휴대성 좋은 패딩"
    },
    {
        "id": 4,
        "name": "자라 오버핏 패딩",
        "category": "패딩",
        "color": "black",
        "price": 120000,
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        "description": "트렌디한 오버핏 디자인"
    },
    {
        "id": 5,
        "name": "코오롱스포츠 패딩",
        "category": "패딩",
        "color": "navy",
        "price": 98000,
        "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        "description": "기능성 패딩"
    },
    {
        "id": 6,
        "name": "라코스테 후드 패딩",
        "category": "패딩",
        "color": "black",
        "price": 150000,
        "image": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
        "description": "프리미엄 패딩"
    }
]


def search_products(
    category: Optional[str] = None,
    color: Optional[str] = None,
    max_price: Optional[int] = None,
    min_price: Optional[int] = None
) -> str:
    """
    사용자의 조건에 맞는 의류 상품을 검색합니다.
    
    Args:
        category: 상품 카테고리 (예: 패딩, 자켓, 코트 등)
        color: 색상 영문명 (예: black, navy, white, red 등)
        max_price: 최대 가격 (원 단위)
        min_price: 최소 가격 (원 단위)
    
    Returns:
        JSON 형식의 응답 (action과 data 포함)
    """
    results = MOCK_PRODUCTS.copy()
    
    # 카테고리 필터링
    if category:
        category_lower = category.lower()
        results = [
            p for p in results 
            if category_lower in p["category"].lower()
        ]
    
    # 색상 필터링
    if color:
        color_lower = color.lower()
        results = [
            p for p in results 
            if color_lower in p["color"].lower()
        ]
    
    # 가격 필터링
    if max_price is not None:
        results = [p for p in results if p["price"] <= max_price]
    
    if min_price is not None:
        results = [p for p in results if p["price"] >= min_price]
    
    # action과 data를 포함한 응답 구조
    import json
    response = {
        "action": "search_products",
        "data": results
    }
    return json.dumps(response, ensure_ascii=False, indent=2)


def get_product_detail(product_id: int) -> str:
    """
    특정 상품의 상세 정보를 조회합니다.
    
    Args:
        product_id: 상품 ID
    
    Returns:
        JSON 형식의 응답 (action과 data 포함)
    """
    import json
    
    for product in MOCK_PRODUCTS:
        if product["id"] == product_id:
            response = {
                "action": "show_product_detail",
                "data": product
            }
            return json.dumps(response, ensure_ascii=False, indent=2)
    
    # 상품을 찾지 못한 경우
    response = {
        "action": "error",
        "data": {"error": "상품을 찾을 수 없습니다.", "product_id": product_id}
    }
    return json.dumps(response, ensure_ascii=False, indent=2)
    
    return json.dumps({"error": "상품을 찾을 수 없습니다."}, ensure_ascii=False)
