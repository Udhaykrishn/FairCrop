"""
Delivery configuration for Kerala districts.
Each district maps to a logistics hub with GPS coordinates.
"""

# Cost per kilometre for delivery (INR)
PRICE_PER_KM: float = 15.0

# Logistics hub coordinates for all 14 Kerala districts
DELIVERY_AGENTS: dict[str, dict] = {
    "Thiruvananthapuram": {
        "hub": "Thiruvananthapuram Central Hub",
        "lat": 8.5241,
        "lon": 76.9366,
    },
    "Kollam": {
        "hub": "Kollam District Hub",
        "lat": 8.8932,
        "lon": 76.6141,
    },
    "Pathanamthitta": {
        "hub": "Pathanamthitta District Hub",
        "lat": 9.2648,
        "lon": 76.7870,
    },
    "Alappuzha": {
        "hub": "Alappuzha District Hub",
        "lat": 9.4981,
        "lon": 76.3388,
    },
    "Kottayam": {
        "hub": "Kottayam District Hub",
        "lat": 9.5916,
        "lon": 76.5222,
    },
    "Idukki": {
        "hub": "Idukki District Hub",
        "lat": 9.8894,
        "lon": 76.9720,
    },
    "Ernakulam": {
        "hub": "Ernakulam Central Hub",
        "lat": 9.9816,
        "lon": 76.2999,
    },
    "Thrissur": {
        "hub": "Thrissur District Hub",
        "lat": 10.5276,
        "lon": 76.2144,
    },
    "Palakkad": {
        "hub": "Palakkad District Hub",
        "lat": 10.7867,
        "lon": 76.6548,
    },
    "Malappuram": {
        "hub": "Malappuram District Hub",
        "lat": 11.0510,
        "lon": 76.0711,
    },
    "Kozhikode": {
        "hub": "Kozhikode District Hub",
        "lat": 11.2588,
        "lon": 75.7804,
    },
    "Wayanad": {
        "hub": "Wayanad District Hub",
        "lat": 11.6854,
        "lon": 76.1320,
    },
    "Kannur": {
        "hub": "Kannur District Hub",
        "lat": 11.8745,
        "lon": 75.3704,
    },
    "Kasaragod": {
        "hub": "Kasaragod District Hub",
        "lat": 12.4996,
        "lon": 74.9869,
    },
}
