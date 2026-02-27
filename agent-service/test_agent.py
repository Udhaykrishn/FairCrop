"""End-to-end tests matching the exact backend API contract."""
import requests
import json

BASE = "http://localhost:8001"


def test_health():
    print("=== 1. Health Check ===")
    r = requests.get(f"{BASE}/health")
    d = r.json()
    print(json.dumps(d, indent=2))
    assert r.status_code == 200
    assert d["status"] == "ok"
    assert d["version"] == "3.0.0"
    print("PASS\n")


def test_analyze_market():
    print("=== 2. Market Analyst (Reserve Price) ===")
    r = requests.post(f"{BASE}/agent/analyze-market", json={
        "crop": "Tomato",
        "quantity": 500,
        "farmerDistrict": "Palakkad",
    })
    d = r.json()
    print(json.dumps(d, indent=2))
    assert r.status_code == 200
    assert "recommendedReservePrice" in d
    assert d["recommendedReservePrice"] > 0
    # Should ONLY have recommendedReservePrice
    assert list(d.keys()) == ["recommendedReservePrice"]
    print("PASS\n")


def test_negotiate_accept():
    print("=== 3a. Negotiate — Accept ===")
    r = requests.post(f"{BASE}/agent/negotiate", json={
        "crop": "Tomato",
        "quantity": 500,
        "farmer": {"district": "Palakkad"},
        "buyer": {"district": "Malappuram"},
        "offerPricePerKg": 30,
        "reservePrice": 25,
    })
    d = r.json()
    print(json.dumps(d, indent=2))
    assert r.status_code == 200
    assert d["status"] == "accepted"
    assert d["ReservePrice"] == 25
    assert d["counterOffer"] is None
    print("PASS\n")


def test_negotiate_counter():
    print("=== 3b. Negotiate — Counter Offer ===")
    r = requests.post(f"{BASE}/agent/negotiate", json={
        "crop": "Tomato",
        "quantity": 500,
        "farmer": {"district": "Palakkad"},
        "buyer": {"district": "Malappuram"},
        "offerPricePerKg": 22,
        "reservePrice": 25,
    })
    d = r.json()
    print(json.dumps(d, indent=2))
    assert r.status_code == 200
    assert d["status"] == "counter_offer"
    assert d["ReservePrice"] == 25
    assert d["counterOffer"]["counterPrice"] > 0
    print("PASS\n")


def test_negotiate_reject():
    print("=== 3c. Negotiate — Reject ===")
    r = requests.post(f"{BASE}/agent/negotiate", json={
        "crop": "Tomato",
        "quantity": 500,
        "farmer": {"district": "Palakkad"},
        "buyer": {"district": "Malappuram"},
        "offerPricePerKg": 5,
        "reservePrice": 25,
    })
    d = r.json()
    print(json.dumps(d, indent=2))
    assert r.status_code == 200
    assert d["status"] == "rejected"
    assert d["ReservePrice"] == 25
    print("PASS\n")


def test_chat():
    print("=== 4. Buyer Chat (LLM) ===")
    r = requests.post(f"{BASE}/agent/chat", json={
        "listingId": "L1",
        "buyerMessage": "I can offer 22 per kg",
        "buyerId": "B1",
        "buyerDistrict": "Malappuram",
        "crop": "Tomato",
        "quantity": 500,
        "farmerDistrict": "Palakkad",
        "roundNumber": 2,
        "currentOfferPrice": 22,
        "lastCounterPrice": 24,
    })
    d = r.json()
    print(json.dumps(d, indent=2, ensure_ascii=False))
    assert r.status_code == 200
    assert "decision" in d
    assert d["decision"]["status"] in ("accepted", "counter_offer", "rejected")
    assert "chatMessage" in d
    assert len(d["chatMessage"]) > 0
    assert "ReservePrice" in d
    print("PASS\n")


if __name__ == "__main__":
    test_health()
    test_analyze_market()
    test_negotiate_accept()
    test_negotiate_counter()
    test_negotiate_reject()
    test_chat()
    print("=" * 40)
    print("ALL 6 TESTS PASSED")
    print("=" * 40)
