"""
LLM Message Generator — Communication layer powered by Google Gemini.

CRITICAL DESIGN PRINCIPLE:
    LLM NEVER decides prices, accepts/rejects, or calculates anything.
    LLM ONLY generates human-style messages using numbers provided by the engine.

Two functions:
    1. generate_negotiation_message() — Turn a machine decision into polite text
    2. extract_offer_from_text()       — Parse buyer's natural language into structured offer
"""

import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file from the same directory
load_dotenv()

# ─── Gemini setup ─────────────────────────────────────────────────────────────

_model = None


def _get_model():
    """Lazy-init the Gemini model using GEMINI_API_KEY env var."""
    global _model
    if _model is None:
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY environment variable not set. "
                "Set it to your Google Gemini API key."
            )
        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel("gemini-2.0-flash")
    return _model


# ═════════════════════════════════════════════════════════════════════════════
#  1. GENERATE NEGOTIATION MESSAGE
# ═════════════════════════════════════════════════════════════════════════════

NEGOTIATION_SYSTEM_PROMPT = """You are a professional agricultural trade negotiation agent representing a farmer in Kerala, India. You must:

- Be polite, warm, and professional
- Be firm on the numbers provided — NEVER change any price, cost, or profit figure
- NEVER invent or calculate new values
- Use the exact numbers given to you
- Keep responses to 2-3 sentences maximum
- Use ₹ symbol for Indian Rupees
- Reference the crop and district naturally
- If status is "accepted", express gratitude and confirm the deal
- If status is "counter_offer", politely decline and suggest the counter price
- If status is "rejected", firmly but politely decline and encourage a better offer"""


def generate_negotiation_message(decision: dict, context: dict) -> str:
    """
    Generate a human-style negotiation message using Gemini.

    Args:
        decision: Machine-readable output from negotiation engine:
            {
                "status": "counter_offer" | "accepted" | "rejected",
                "counter_price": 24.8,        # only if counter_offer
                "effective_reserve": 25.0,
            }
        context: Negotiation context:
            {
                "crop": "Tomato",
                "quantity": 500,
                "farmer_district": "Palakkad",
                "buyer_district": "Malappuram",
                "buyer_offer": 22.0,
                "delivery_cost": 1500.0,
                "net_profit_at_offer": 8000.0,
                "net_profit_at_counter": 11000.0,  # only if counter
                "reserve_price": 25.0,
                "round_number": 1,
            }

    Returns:
        Human-readable negotiation message string.
    """
    status = decision.get("status", "rejected")
    counter_price = decision.get("counter_price")

    # Build the user prompt with all numbers pre-computed
    user_parts = [
        f"Status: {status}",
        f"Crop: {context.get('crop', 'produce')}",
        f"Quantity: {context.get('quantity', 0)} kg",
        f"Farmer location: {context.get('farmer_district', 'Kerala')}",
        f"Buyer location: {context.get('buyer_district', 'Kerala')}",
        f"Buyer offered: ₹{context.get('buyer_offer', 0)}/kg",
        f"Reserve price: ₹{context.get('reserve_price', 0)}/kg",
        f"Delivery cost: ₹{context.get('delivery_cost', 0):,.2f}",
        f"Net profit at buyer's offer: ₹{context.get('net_profit_at_offer', 0):,.2f}",
    ]

    if counter_price is not None:
        user_parts.append(f"Suggested counter price: ₹{counter_price}/kg")
        if context.get("net_profit_at_counter"):
            user_parts.append(
                f"Net profit at counter price: ₹{context['net_profit_at_counter']:,.2f}"
            )

    user_parts.append(f"Negotiation round: {context.get('round_number', 1)}")
    user_parts.append("\nGenerate a short, professional negotiation response.")

    user_prompt = "\n".join(user_parts)

    try:
        model = _get_model()
        response = model.generate_content(
            [
                {"role": "user", "parts": [{"text": NEGOTIATION_SYSTEM_PROMPT + "\n\n" + user_prompt}]}
            ],
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=200,
            ),
        )
        return response.text.strip()
    except Exception as e:
        # Fallback to template if LLM fails
        return _template_fallback(decision, context)


def _template_fallback(decision: dict, context: dict) -> str:
    """Deterministic fallback if Gemini is unavailable."""
    status = decision.get("status")
    offer = context.get("buyer_offer", 0)
    crop = context.get("crop", "produce")

    if status == "accepted":
        return (
            f"Thank you for your offer of ₹{offer}/kg for {crop}. "
            f"We are happy to accept this deal. "
            f"Please proceed with the order confirmation."
        )
    elif status == "counter_offer":
        counter = decision.get("counter_price", 0)
        return (
            f"Thank you for your offer of ₹{offer}/kg for {crop}. "
            f"Based on current Kerala mandi prices and delivery costs, "
            f"we would like to propose ₹{counter}/kg, which ensures a fair "
            f"return for the farmer while remaining competitive. "
            f"Let us know if this works for you."
        )
    else:
        return (
            f"Thank you for your interest in our {crop}. "
            f"Unfortunately, the offer of ₹{offer}/kg does not meet the "
            f"minimum viable price after accounting for logistics costs. "
            f"We would appreciate a revised offer closer to market rates."
        )


# ═════════════════════════════════════════════════════════════════════════════
#  2. EXTRACT OFFER FROM BUYER TEXT
# ═════════════════════════════════════════════════════════════════════════════

EXTRACTION_SYSTEM_PROMPT = """Extract the buyer's offer from the following message. Return ONLY valid JSON with these fields:
- offerPricePerKg (number or null)
- quantity (number or null)
- buyerDistrict (string or null)
- intent (string): one of "new_offer", "accept_counter", "reject", "question"

Rules:
- If a price is mentioned per quintal, convert to per kg by dividing by 100
- If no quantity is mentioned, return null
- If no district is mentioned, return null
- Return ONLY the JSON object, no markdown, no explanation

Examples:
Input: "I can do 25 per kg for 500 kg"
Output: {"offerPricePerKg": 25, "quantity": 500, "buyerDistrict": null, "intent": "new_offer"}

Input: "Ok deal, I accept"
Output: {"offerPricePerKg": null, "quantity": null, "buyerDistrict": null, "intent": "accept_counter"}

Input: "That's too high, I'll pass"
Output: {"offerPricePerKg": null, "quantity": null, "buyerDistrict": null, "intent": "reject"}"""


def extract_offer_from_text(buyer_text: str) -> dict:
    """
    Use Gemini to extract structured offer data from buyer's natural language.

    Args:
        buyer_text: Raw text from the buyer, e.g. "I can offer ₹22 per kg for 500kg"

    Returns:
        dict with keys: offerPricePerKg, quantity, buyerDistrict, intent
    """
    try:
        model = _get_model()
        response = model.generate_content(
            [
                {"role": "user", "parts": [{"text": EXTRACTION_SYSTEM_PROMPT + "\n\nBuyer message: " + buyer_text}]}
            ],
            generation_config=genai.types.GenerationConfig(
                temperature=0.0,
                max_output_tokens=150,
            ),
        )
        raw = response.text.strip()

        # Clean potential markdown wrapping
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1]  # remove first line
            raw = raw.rsplit("```", 1)[0]  # remove closing
            raw = raw.strip()

        return json.loads(raw)
    except Exception as e:
        # Fallback: try basic regex extraction
        return _regex_fallback(buyer_text)


def _regex_fallback(text: str) -> dict:
    """Regex-based fallback for offer extraction."""
    import re

    price = None
    quantity = None

    # Try to find price
    price_match = re.search(r"₹?\s*(\d+(?:\.\d+)?)\s*(?:per\s*kg|/kg|per\s*kilo)", text, re.IGNORECASE)
    if price_match:
        price = float(price_match.group(1))

    # Try to find quantity
    qty_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:kg|kilo|quintal)", text, re.IGNORECASE)
    if qty_match:
        quantity = float(qty_match.group(1))

    # Detect intent
    text_lower = text.lower()
    if any(w in text_lower for w in ["accept", "ok", "deal", "agree", "yes"]):
        intent = "accept_counter"
    elif any(w in text_lower for w in ["no", "pass", "reject", "too high", "too much"]):
        intent = "reject"
    elif price is not None:
        intent = "new_offer"
    else:
        intent = "question"

    return {
        "offerPricePerKg": price,
        "quantity": quantity,
        "buyerDistrict": None,
        "intent": intent,
    }
