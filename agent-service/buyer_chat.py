"""
Buyer Chat Flow — LLM-powered negotiation chat.

Flow:
    1. LLM extracts structured offer from buyer text
    2. Python engine makes the decision (accept / counter / reject)
    3. LLM generates human-style response
    4. Returns decision + chatMessage + ReservePrice

LLM = communication layer.
Python engine = decision layer.
"""

from schemas import (
    ChatRequest,
    ChatResponse,
    ChatDecision,
    NegotiateRequest,
    NegotiateFarmer,
    NegotiateBuyer,
    MarketAnalysisRequest,
)
from llm_message_generator import generate_negotiation_message, extract_offer_from_text
from negotiation import negotiate
from market_analyst import analyze_market_full
from delivery_config import DELIVERY_AGENTS, PRICE_PER_KM
from distance import haversine


def handle_buyer_chat(request: ChatRequest) -> ChatResponse:
    """
    Process a buyer's chat message through the full negotiation pipeline.
    """
    # ── Step 1: Extract offer from buyer text ─────────────────────────────
    extracted = extract_offer_from_text(request.buyerMessage)

    offer_price = extracted.get("offerPricePerKg") or request.currentOfferPrice
    buyer_intent = extracted.get("intent", "new_offer")

    # Buyer is accepting a previous counter-offer
    if buyer_intent == "accept_counter" and request.lastCounterPrice:
        return ChatResponse(
            decision=ChatDecision(
                status="accepted",
                finalPrice=request.lastCounterPrice,
                counterPrice=None,
            ),
            chatMessage=(
                f"Wonderful! The deal is confirmed at ₹{request.lastCounterPrice}/kg "
                f"for {request.quantity} kg of {request.crop}. "
                f"Thank you for choosing FairCrop!"
            ),
            ReservePrice=None,
        )

    # Buyer is rejecting / walking away
    if buyer_intent == "reject":
        return ChatResponse(
            decision=ChatDecision(
                status="buyer_rejected",
                counterPrice=None,
            ),
            chatMessage=(
                "We understand. Thank you for your interest. "
                "If you reconsider, our listing remains open."
            ),
            ReservePrice=None,
        )

    # Couldn't extract a price
    if offer_price is None:
        return ChatResponse(
            decision=ChatDecision(
                status="need_info",
                counterPrice=None,
            ),
            chatMessage=(
                f"Thank you for your interest in our {request.crop}! "
                f"Could you please share your offer price per kg?"
            ),
            ReservePrice=None,
        )

    # ── Step 2: Get market analysis for reserve price ─────────────────────
    market = analyze_market_full(MarketAnalysisRequest(
        crop=request.crop,
        quantity=request.quantity,
        farmerDistrict=request.farmerDistrict,
    ))
    reserve_price = market.recommendedReservePrice

    # ── Step 3: Run negotiation engine ────────────────────────────────────
    neg_result = negotiate(NegotiateRequest(
        crop=request.crop,
        quantity=request.quantity,
        farmer=NegotiateFarmer(district=request.farmerDistrict),
        buyer=NegotiateBuyer(district=request.buyerDistrict),
        offerPricePerKg=offer_price,
        reservePrice=reserve_price,
    ))

    # ── Step 4: Compute context for LLM ───────────────────────────────────
    farmer_hub = DELIVERY_AGENTS.get(request.farmerDistrict, {})
    buyer_hub = DELIVERY_AGENTS.get(request.buyerDistrict, {})
    dist_km = haversine(
        farmer_hub.get("lat", 0), farmer_hub.get("lon", 0),
        buyer_hub.get("lat", 0), buyer_hub.get("lon", 0),
    )
    delivery_cost = round(dist_km * PRICE_PER_KM, 2)
    net_profit = round(offer_price * request.quantity - delivery_cost, 2)

    counter_price = (
        neg_result.counterOffer.counterPrice
        if neg_result.counterOffer else None
    )

    decision_dict = {
        "status": neg_result.status,
        "counter_price": counter_price,
    }

    context_dict = {
        "crop": request.crop,
        "quantity": request.quantity,
        "farmer_district": request.farmerDistrict,
        "buyer_district": request.buyerDistrict,
        "buyer_offer": offer_price,
        "delivery_cost": delivery_cost,
        "net_profit_at_offer": net_profit,
        "reserve_price": reserve_price,
        "round_number": request.roundNumber,
    }

    if counter_price:
        counter_gross = counter_price * request.quantity
        context_dict["net_profit_at_counter"] = round(counter_gross - delivery_cost, 2)

    # ── Step 5: Generate human-style message ──────────────────────────────
    chat_message = generate_negotiation_message(decision_dict, context_dict)

    return ChatResponse(
        decision=ChatDecision(
            status=neg_result.status,
            finalPrice=neg_result.finalPrice,
            counterPrice=counter_price,
        ),
        chatMessage=chat_message,
        ReservePrice=reserve_price,
    )
