"""
Core evaluation engine.
Computes delivery-aware net profit for each offer and selects the optimal buyer.
Enhanced with optional reserve price awareness.
"""

from schemas import EvaluateRequest, EvaluateResponse, BuyerComparison, BestBuyer, EvaluationSummary
from delivery_config import DELIVERY_AGENTS, PRICE_PER_KM
from distance import haversine
from reasoning import generate_reasoning


def evaluate_offers(request: EvaluateRequest) -> EvaluateResponse:
    """
    Evaluate all offers for a listing and select the best buyer
    based on maximum net profit after delivery costs.

    If reservePrice is provided, offers below it are flagged but
    still included in comparisons for transparency.

    Args:
        request: The validated evaluation request.

    Returns:
        EvaluateResponse with best buyer, breakdown, and reasoning.

    Raises:
        ValueError: If a buyer district is not found in DELIVERY_AGENTS.
    """
    comparisons: list[BuyerComparison] = []
    reserve = request.reservePrice

    for offer in request.offers:
        # Lookup district hub
        hub = DELIVERY_AGENTS.get(offer.buyerDistrict)
        if hub is None:
            raise ValueError(
                f"Unknown buyer district: '{offer.buyerDistrict}'. "
                f"Valid districts: {', '.join(sorted(DELIVERY_AGENTS.keys()))}"
            )

        # Compute distance from farmer to buyer hub
        dist_km = haversine(
            request.farmer.lat, request.farmer.lon,
            hub["lat"], hub["lon"],
        )

        # Financial calculations
        gross_revenue = round(offer.offerPricePerKg * request.quantity, 2)
        delivery_cost = round(dist_km * PRICE_PER_KM, 2)
        net_profit = round(gross_revenue - delivery_cost, 2)

        below_reserve = (reserve is not None and offer.offerPricePerKg < reserve)

        comparisons.append(
            BuyerComparison(
                buyerId=offer.buyerId,
                buyerDistrict=offer.buyerDistrict,
                offerPricePerKg=offer.offerPricePerKg,
                grossRevenue=gross_revenue,
                distanceKm=dist_km,
                deliveryCost=delivery_cost,
                netProfit=net_profit,
                belowReserve=below_reserve,
            )
        )

    # ── Select best buyer ─────────────────────────────────────────────────
    # Filter: positive profit AND meets reserve (if set)
    viable = [
        c for c in comparisons
        if c.netProfit > 0 and not c.belowReserve
    ]

    if not viable:
        # Check if there are offers above zero profit but below reserve
        above_zero = [c for c in comparisons if c.netProfit > 0]
        if above_zero and reserve is not None:
            status = "below_reserve"
            reasoning_text = (
                f"No offer meets the reserve price of ₹{reserve}/kg. "
                f"Best offer: ₹{max(c.offerPricePerKg for c in above_zero)}/kg. "
                f"Consider counter-offering or waiting for better offers."
            )
        else:
            status = "no_viable_offer"
            reasoning_text = "No offer yields a positive net profit after delivery costs."

        return EvaluateResponse(
            listingId=request.listingId,
            status=status,
            bestBuyer=None,
            evaluation=None,
            allComparisons=comparisons,
            reasoning=reasoning_text,
        )

    # Sort by: net_profit DESC → distance ASC → offerPrice DESC
    viable.sort(key=lambda c: (-c.netProfit, c.distanceKm, -c.offerPricePerKg))
    best = viable[0]

    return EvaluateResponse(
        listingId=request.listingId,
        status="evaluated",
        bestBuyer=BestBuyer(
            buyerId=best.buyerId,
            buyerDistrict=best.buyerDistrict,
            offerPricePerKg=best.offerPricePerKg,
        ),
        evaluation=EvaluationSummary(
            quantity=request.quantity,
            grossRevenue=best.grossRevenue,
            distanceKm=best.distanceKm,
            deliveryCost=best.deliveryCost,
            netProfit=best.netProfit,
        ),
        allComparisons=comparisons,
        reasoning=generate_reasoning(best, comparisons, reserve),
    )
