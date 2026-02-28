"""
Market data loader — reads real Agmarknet CSV for Tomato prices in Kerala.
Parses the downloaded daily price CSV and provides lookup functions.
"""

import csv
import os
from pathlib import Path

# ─── Crop metadata (static) ──────────────────────────────────────────────────

CROP_INFO = {
    "Tomato": {
        "category": "Vegetables",
        "perishability": "high",
        "shelfLifeDays": 5,
        "season": "year-round",
        "unit": "kg",
    },
}

# ─── District name normalization ──────────────────────────────────────────────
# Agmarknet CSV uses different spellings than our delivery_config.py
DISTRICT_ALIASES = {
    "Palakad": "Palakkad",
    "Thirssur": "Thrissur",
    "Kozhikode(Calicut)": "Kozhikode",
    "Kasargod": "Kasaragod",
    "Thiruvananthapuram": "Thiruvananthapuram",
    "Alappuzha": "Alappuzha",
    "Ernakulam": "Ernakulam",
    "Kannur": "Kannur",
    "Kollam": "Kollam",
    "Kottayam": "Kottayam",
    "Malappuram": "Malappuram",
    "Idukki": "Idukki",
    "Wayanad": "Wayanad",
    "Pathanamthitta": "Pathanamthitta",
}

# Path to CSV file
CSV_DIR = Path(__file__).parent
CSV_FILES = {
    "Tomato": CSV_DIR / "Tomato_price.csv",
}


def _parse_price(value: str) -> float:
    """Parse a price string like '3,500.00' → 3500.0"""
    return float(value.replace(",", "").strip())


def _normalize_district(raw_district: str) -> str:
    """Map Agmarknet district name to our standard name."""
    return DISTRICT_ALIASES.get(raw_district.strip(), raw_district.strip())


def load_mandi_prices(crop: str) -> list[dict]:
    """
    Load mandi prices from the Agmarknet CSV for a given crop.

    Returns a list of dicts, one per market row:
        {
            "district": "Palakkad",       # normalized
            "market": "Pattambi APMC",
            "minPricePerKg": 20.0,        # converted from Rs/Quintal
            "maxPricePerKg": 24.0,
            "modalPricePerKg": 22.0,
            "arrivalTonnes": 0.80,
            "date": "26-02-2026",
        }
    """
    csv_path = CSV_FILES.get(crop)
    if csv_path is None or not csv_path.exists():
        return []

    results = []

    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)

        # Skip header row (line 1 is a title row, line 2 is the actual header)
        next(reader, None)  # skip title row
        header_row = next(reader, None)  # skip header row

        if header_row is None:
            return []

        for row in reader:
            # Skip empty rows
            if len(row) < 14 or not row[0].strip():
                continue

            try:
                district_raw = row[1].strip()
                market = row[2].strip()
                min_price_quintal = _parse_price(row[7])
                max_price_quintal = _parse_price(row[8])
                modal_price_quintal = _parse_price(row[9])
                arrival_qty = float(row[11].strip()) if row[11].strip() else 0.0
                arrival_date = row[13].strip()

                results.append({
                    "district": _normalize_district(district_raw),
                    "market": market,
                    "minPricePerKg": round(min_price_quintal / 100, 2),
                    "maxPricePerKg": round(max_price_quintal / 100, 2),
                    "modalPricePerKg": round(modal_price_quintal / 100, 2),
                    "arrivalTonnes": arrival_qty,
                    "date": arrival_date,
                })
            except (ValueError, IndexError):
                continue  # skip malformed rows

    return results


def get_district_avg_prices(crop: str) -> dict[str, float]:
    """
    Aggregate mandi prices by district → weighted average modal price per kg.
    Weights by arrival tonnage.

    Returns: {"Palakkad": 22.5, "Ernakulam": 33.0, ...}
    """
    prices = load_mandi_prices(crop)
    if not prices:
        return {}

    district_data: dict[str, dict] = {}
    for p in prices:
        d = p["district"]
        if d not in district_data:
            district_data[d] = {"total_weighted": 0.0, "total_weight": 0.0}
        weight = max(p["arrivalTonnes"], 0.01)  # min weight to avoid zero
        district_data[d]["total_weighted"] += p["modalPricePerKg"] * weight
        district_data[d]["total_weight"] += weight

    return {
        d: round(data["total_weighted"] / data["total_weight"], 2)
        for d, data in district_data.items()
        if data["total_weight"] > 0
    }


def get_crop_info(crop: str) -> dict | None:
    """Get static crop metadata (perishability, shelf life, etc.)."""
    return CROP_INFO.get(crop)


def get_overall_stats(crop: str) -> dict:
    """
    Get overall price stats across all markets in Kerala.

    Returns: {"avgPrice": X, "minPrice": Y, "maxPrice": Z, "totalMarkets": N}
    """
    prices = load_mandi_prices(crop)
    if not prices:
        return {"avgPrice": 0, "minPrice": 0, "maxPrice": 0, "totalMarkets": 0}

    modal_prices = [p["modalPricePerKg"] for p in prices]
    return {
        "avgPrice": round(sum(modal_prices) / len(modal_prices), 2),
        "minPrice": min(p["minPricePerKg"] for p in prices),
        "maxPrice": max(p["maxPricePerKg"] for p in prices),
        "totalMarkets": len(prices),
    }
