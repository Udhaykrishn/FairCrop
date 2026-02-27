"""
Orchestrator — the agentic brain.
Chains Listener → Market Analyst → Negotiator agents into a
goal-driven pipeline based on the requested action.
"""

import time
from schemas import (
    OrchestrateRequest,
    OrchestrateResponse,
    PipelineStep,
    ListenRequest,
    MarketAnalysisRequest,
    EvaluateRequest,
    NegotiationRequest,
    Farmer,
    MarketContext,
    Offer,
)
from listener import extract_intent
from market_analyst import analyze_market
from evaluator import evaluate_offers
from negotiation import negotiate


def run_pipeline(request: OrchestrateRequest) -> OrchestrateResponse:
    """
    Run the appropriate agent pipeline based on the action.

    Actions:
        full_evaluation  → Listener → Market Analyst → Negotiator
        evaluate_offers  → Market Analyst → Negotiator (structured input)
        analyze_only     → Market Analyst only
        negotiate        → Market Analyst → Negotiator (with reserve enforcement)
    """
    action = request.action
    trace: list[PipelineStep] = []
    pipeline: list[str] = []

    listener_result = None
    market_result = None
    eval_result = None
    negotiation_result = None
    final_decision = ""
    reasoning_parts = []

    # Resolve fields — either from structured input or from listener extraction
    crop = request.crop
    quantity = request.quantity
    farmer = request.farmer
    offers = request.offers
    listing_id = request.listingId

    # ══════════════════════════════════════════════════════════════════════
    #  STEP 1: LISTENER (only for full_evaluation with rawText)
    # ══════════════════════════════════════════════════════════════════════
    if action == "full_evaluation" and request.rawText:
        pipeline.append("listener")
        t0 = time.time()

        try:
            listen_req = ListenRequest(rawText=request.rawText)
            listener_result = extract_intent(listen_req)

            # Use extracted slots to fill missing fields
            slots = listener_result.extractedSlots
            if slots.crop and crop is None:
                crop = slots.crop
            if slots.quantity and quantity is None:
                quantity = slots.quantity
            if slots.district and farmer is None:
                # Use a default lat/lon for the district (from delivery_config)
                from delivery_config import DELIVERY_AGENTS
                hub = DELIVERY_AGENTS.get(slots.district, {})
                farmer = Farmer(
                    district=slots.district,
                    lat=hub.get("lat", 0),
                    lon=hub.get("lon", 0),
                )

            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="listener",
                status="success",
                durationMs=elapsed,
                message=f"Intent: {listener_result.intent}, confidence: {listener_result.confidence}",
            ))
            reasoning_parts.append(f"Listener: {listener_result.reasoning}")

        except Exception as e:
            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="listener", status="error", durationMs=elapsed, message=str(e)
            ))
            final_decision = "error"

    # ══════════════════════════════════════════════════════════════════════
    #  STEP 2: MARKET ANALYST
    # ══════════════════════════════════════════════════════════════════════
    if action in ("full_evaluation", "evaluate_offers", "analyze_only", "negotiate") and crop:
        pipeline.append("market_analyst")
        t0 = time.time()

        try:
            market_req = MarketAnalysisRequest(
                crop=crop,
                quantity=quantity or 100,
                farmerDistrict=farmer.district if farmer else "Unknown",
            )
            market_result = analyze_market(market_req)

            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="market_analyst",
                status="success",
                durationMs=elapsed,
                message=f"Reserve: ₹{market_result.recommendedReservePrice}/kg from {market_result.totalMarkets} markets",
            ))
            reasoning_parts.append(f"Market Analyst: {market_result.reasoning}")

        except Exception as e:
            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="market_analyst", status="error", durationMs=elapsed, message=str(e)
            ))

    if action == "analyze_only":
        final_decision = "analyzed"
        return OrchestrateResponse(
            listingId=listing_id,
            action=action,
            pipeline=pipeline,
            pipelineTrace=trace,
            listenerResult=listener_result,
            marketAnalysis=market_result,
            finalDecision=final_decision,
            reasoning=" | ".join(reasoning_parts),
        )

    # ══════════════════════════════════════════════════════════════════════
    #  STEP 3: NEGOTIATOR / EVALUATOR
    # ══════════════════════════════════════════════════════════════════════
    if action in ("full_evaluation", "evaluate_offers") and offers and farmer and crop and quantity:
        pipeline.append("negotiator")
        t0 = time.time()

        try:
            reserve = market_result.recommendedReservePrice if market_result else None
            avg_price = market_result.avgPricePerKg if market_result else 0

            eval_req = EvaluateRequest(
                listingId=listing_id,
                crop=crop,
                quantity=quantity,
                farmer=farmer,
                marketContext=MarketContext(averageMandiPrice=avg_price),
                offers=offers,
                reservePrice=reserve,
            )
            eval_result = evaluate_offers(eval_req)
            final_decision = eval_result.status

            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="negotiator",
                status="success",
                durationMs=elapsed,
                message=f"Decision: {eval_result.status}",
            ))
            reasoning_parts.append(f"Negotiator: {eval_result.reasoning}")

        except Exception as e:
            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="negotiator", status="error", durationMs=elapsed, message=str(e)
            ))
            final_decision = "error"

    elif action == "negotiate" and offers and farmer and crop and quantity:
        pipeline.append("negotiator")
        t0 = time.time()

        try:
            reserve = market_result.recommendedReservePrice if market_result else 0
            avg_price = market_result.avgPricePerKg if market_result else 0

            neg_req = NegotiationRequest(
                listingId=listing_id,
                crop=crop,
                quantity=quantity,
                farmer=farmer,
                marketContext=MarketContext(averageMandiPrice=avg_price),
                offers=offers,
                reservePrice=reserve,
                roundNumber=request.roundNumber,
            )
            negotiation_result = negotiate(neg_req)
            final_decision = negotiation_result.status

            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="negotiator",
                status="success",
                durationMs=elapsed,
                message=f"Decision: {negotiation_result.status}",
            ))
            reasoning_parts.append(f"Negotiator: {negotiation_result.reasoning}")

        except Exception as e:
            elapsed = round((time.time() - t0) * 1000, 1)
            trace.append(PipelineStep(
                agent="negotiator", status="error", durationMs=elapsed, message=str(e)
            ))
            final_decision = "error"

    if not final_decision:
        final_decision = "incomplete"
        reasoning_parts.append("Pipeline incomplete — missing required fields (crop, quantity, farmer, or offers).")

    return OrchestrateResponse(
        listingId=listing_id,
        action=action,
        pipeline=pipeline,
        pipelineTrace=trace,
        listenerResult=listener_result,
        marketAnalysis=market_result,
        evaluation=eval_result,
        negotiation=negotiation_result,
        finalDecision=final_decision,
        reasoning=" | ".join(reasoning_parts),
    )
