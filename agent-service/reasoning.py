"""
Generates human-readable reasoning strings for all agents.
Deterministic template-based — no LLM dependency.
"""

from schemas import BuyerComparison
from typing import Optional


def generate_reasoning(
    best: BuyerComparison,
    all_comparisons: list[BuyerComparison],
    reserve_price: Optional[float] = None,
) -> str:
    """
    Build a concise explanation of why the best buyer was selected.
    """
    total_offers = len(all_comparisons)
    viable_count = sum(1 for c in all_comparisons if c.netProfit > 0 and not c.belowReserve)

    parts = [
        f"Selected {best.buyerDistrict} buyer ({best.buyerId}) "
        f"with net profit ₹{best.netProfit:,.2f}.",
    ]

    parts.append(
        f"Delivery distance {best.distanceKm:.1f} km costs ₹{best.deliveryCost:,.2f}, "
        f"yielding the highest return among {total_offers} offer(s)."
    )

    if reserve_price is not None:
        parts.append(f"Reserve price: ₹{reserve_price}/kg.")
        below_reserve_count = sum(1 for c in all_comparisons if c.belowReserve)
        if below_reserve_count > 0:
            parts.append(f"{below_reserve_count} offer(s) below reserve were excluded.")

    rejected = total_offers - viable_count
    if rejected > 0 and reserve_price is None:
        parts.append(f"{rejected} offer(s) were rejected due to negative net profit.")

    # Runner-up
    viable_sorted = sorted(
        [c for c in all_comparisons if c.netProfit > 0 and not c.belowReserve],
        key=lambda c: -c.netProfit,
    )
    if len(viable_sorted) >= 2:
        runner = viable_sorted[1]
        diff = best.netProfit - runner.netProfit
        parts.append(
            f"Runner-up: {runner.buyerDistrict} ({runner.buyerId}) "
            f"with ₹{runner.netProfit:,.2f} net profit "
            f"(₹{diff:,.2f} less)."
        )

    return " ".join(parts)
