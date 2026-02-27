"""
Negotiation engine.
Handles reserve price enforcement, counter-offer generation,
and decision logic (accept / counter / reject).
"""

from schemas import (
    NegotiateRequest,
    NegotiateResponse,
    NegotiateCounterOffer,
)
from delivery_config import DELIVERY_AGENTS, PRICE_PER_KM
from distance import haversine


# ─── Constants ────────────────────────────────────────────────────────────────
COUNTER_THRESHOLD = 0.15       # offer within 15% of reserve → counter instead of reject


def negotiate(request: NegotiateRequest) -> NegotiateResponse:
    """
    Run the negotiation decision engine.

    Logic:
        1. Look up farmer and buyer district hubs
        2. Compute delivery cost via haversine distance
        3. Compute net profit
        4. If offer >= reserve AND profitable → ACCEPT
        5. If offer within 15% of reserve AND profitable → COUNTER-OFFER
        6. Otherwise → REJECT
    """
    reserve = request.reservePrice

    # Look up hubs
    farmer_hub = DELIVERY_AGENTS.get(request.farmer.district)
    buyer_hub = DELIVERY_AGENTS.get(request.buyer.district)

    if farmer_hub is None:
        return NegotiateResponse(
            status="rejected",
            ReservePrice=reserve,
            reasoning=f"Unknown farmer district: '{request.farmer.district}'.",
        )

    if buyer_hub is None:
        return NegotiateResponse(
            status="rejected",
            ReservePrice=reserve,
            reasoning=f"Unknown buyer district: '{request.buyer.district}'.",
        )

    # Compute distance and costs
    dist_km = haversine(
        farmer_hub["lat"], farmer_hub["lon"],
        buyer_hub["lat"], buyer_hub["lon"],
    )
    gross_revenue = round(request.offerPricePerKg * request.quantity, 2)
    delivery_cost = round(dist_km * PRICE_PER_KM, 2)
    net_profit = round(gross_revenue - delivery_cost, 2)

    offer = request.offerPricePerKg

    # ── Decision logic ────────────────────────────────────────────────────

    if offer >= reserve and net_profit > 0:
        # ACCEPT
        return NegotiateResponse(
            status="accepted",
            ReservePrice=reserve,
            finalPrice=offer,
            reasoning=(
                f"Accepted offer of ₹{offer}/kg from {request.buyer.district}. "
                f"Meets reserve price of ₹{reserve}/kg. "
                f"Net profit: ₹{net_profit:,.2f} after ₹{delivery_cost:,.2f} delivery "
                f"({dist_km:.1f} km)."
            ),
        )

    # Check if within counter-offer range
    price_gap = (reserve - offer) / reserve if reserve > 0 else 1.0

    if price_gap <= COUNTER_THRESHOLD and net_profit > 0:
        # COUNTER-OFFER — midpoint between offer and reserve
        counter_price = round((offer + reserve) / 2, 2)
        return NegotiateResponse(
            status="counter_offer",
            ReservePrice=reserve,
            counterOffer=NegotiateCounterOffer(counterPrice=counter_price),
            reasoning=(
                f"Offer of ₹{offer}/kg is {price_gap:.0%} below reserve ₹{reserve}/kg. "
                f"Counter-offer at ₹{counter_price}/kg (midpoint). "
                f"Delivery: ₹{delivery_cost:,.2f} ({dist_km:.1f} km). "
                f"Net profit at offer: ₹{net_profit:,.2f}."
            ),
        )

    # REJECT
    return NegotiateResponse(
        status="rejected",
        ReservePrice=reserve,
        reasoning=(
            f"Rejected offer of ₹{offer}/kg from {request.buyer.district}. "
            f"Reserve: ₹{reserve}/kg (gap: {price_gap:.0%}). "
            f"Net profit: ₹{net_profit:,.2f} after ₹{delivery_cost:,.2f} delivery."
        ),
    )
