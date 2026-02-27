"""
Market Analyst Agent.
Analyzes real Agmarknet mandi prices for a crop and computes
a recommended reserve price based on perishability and quantity.
"""

from schemas import (
    MarketAnalysisRequest,
    MarketAnalysisResponse,
    MarketAnalysisDetail,
    MandiPrice,
)
from market_data import load_mandi_prices, get_crop_info, get_overall_stats


# ─── Perishability discount factors ──────────────────────────────────────────
PERISHABILITY_FACTOR = {
    "high": 0.85,      # high spoilage risk → lower reserve to move fast
    "medium": 0.90,
    "low": 0.95,
}

# ─── Quantity discount (bulk = slight discount) ──────────────────────────────
def _quantity_factor(quantity_kg: float) -> float:
    if quantity_kg > 1000:
        return 0.95
    elif quantity_kg > 500:
        return 0.97
    return 1.0


def analyze_market_full(request: MarketAnalysisRequest) -> MarketAnalysisDetail:
    """
    Full internal analysis — used by other agents (negotiation, chat).
    Returns detailed breakdown with all mandi prices and reasoning.
    """
    crop = request.crop
    crop_info = get_crop_info(crop)

    if crop_info is None:
        return MarketAnalysisDetail(
            crop=crop,
            totalMarkets=0,
            mandiPrices=[],
            avgPricePerKg=0,
            minPricePerKg=0,
            maxPricePerKg=0,
            recommendedReservePrice=0,
            perishability="unknown",
            shelfLifeDays=0,
            reasoning=f"No market data available for crop '{crop}'. Supported: Tomato.",
        )

    raw_prices = load_mandi_prices(crop)
    stats = get_overall_stats(crop)

    mandi_list = [
        MandiPrice(
            district=p["district"],
            market=p["market"],
            minPricePerKg=p["minPricePerKg"],
            maxPricePerKg=p["maxPricePerKg"],
            modalPricePerKg=p["modalPricePerKg"],
            arrivalTonnes=p["arrivalTonnes"],
            date=p["date"],
        )
        for p in raw_prices
    ]

    perishability = crop_info["perishability"]
    shelf_life = crop_info["shelfLifeDays"]
    avg_price = stats["avgPrice"]

    p_factor = PERISHABILITY_FACTOR.get(perishability, 0.90)
    q_factor = _quantity_factor(request.quantity)
    reserve_price = round(avg_price * p_factor * q_factor, 2)

    reasoning_parts = [
        f"Analyzed {stats['totalMarkets']} markets across Kerala for {crop}.",
        f"Price range: ₹{stats['minPrice']}/kg to ₹{stats['maxPrice']}/kg, "
        f"average ₹{avg_price}/kg.",
        f"Perishability: {perishability} (shelf life {shelf_life} days) — factor {p_factor}.",
        f"Quantity {request.quantity} kg — factor {q_factor}.",
        f"Recommended reserve price: ₹{reserve_price}/kg.",
    ]

    return MarketAnalysisDetail(
        crop=crop,
        totalMarkets=stats["totalMarkets"],
        mandiPrices=mandi_list,
        avgPricePerKg=avg_price,
        minPricePerKg=stats["minPrice"],
        maxPricePerKg=stats["maxPrice"],
        recommendedReservePrice=reserve_price,
        perishability=perishability,
        shelfLifeDays=shelf_life,
        reasoning=" ".join(reasoning_parts),
    )


def analyze_market(request: MarketAnalysisRequest) -> MarketAnalysisResponse:
    """
    Public API response — returns only the recommended reserve price.
    Backend stores this in Mongo and sends to farmer frontend.
    """
    detail = analyze_market_full(request)
    return MarketAnalysisResponse(
        recommendedReservePrice=detail.recommendedReservePrice,
    )
