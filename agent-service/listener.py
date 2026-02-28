"""
Listener Agent.
Extracts structured intent and slots from raw text input.
Pattern-based NLP for hackathon — LLM-ready interface.
"""

import re
from schemas import ListenRequest, ListenResponse, ExtractedSlots
from delivery_config import DELIVERY_AGENTS
from market_data import CROP_INFO


# ─── Known values for matching ────────────────────────────────────────────────
KNOWN_CROPS = list(CROP_INFO.keys())
KNOWN_DISTRICTS = list(DELIVERY_AGENTS.keys())

# ─── Intent patterns ─────────────────────────────────────────────────────────
INTENT_PATTERNS = {
    "create_listing": [
        r"\b(sell|list|post|offer|put up|want to sell|selling)\b",
        r"\b(create|new|add)\b.*\b(listing|lot|stock)\b",
    ],
    "check_price": [
        r"\b(price|rate|cost|worth|value|going for)\b",
        r"\b(how much|what is|current)\b.*\b(price|rate)\b",
        r"\b(market|mandi)\b.*\b(price|rate)\b",
    ],
    "accept_offer": [
        r"\b(accept|agree|yes|ok|done|confirm|take)\b.*\b(offer|deal|bid)\b",
        r"\b(go ahead|proceed)\b",
    ],
    "counter_offer": [
        r"\b(counter|negotiate|higher|more|increase|raise)\b",
        r"\b(not enough|too low|want more)\b",
        r"\b(can you do|at least)\b.*\b(\d+)\b",
    ],
}

# ─── Quantity patterns ─────────────────────────────────────────────────────────
QUANTITY_PATTERNS = [
    # "500 kg" or "500kg" or "500 kilos"
    r"(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)\b",
    # "5 quintal" or "5 quintals"
    r"(\d+(?:\.\d+)?)\s*(?:quintals?|qtl)\b",
    # "2 tonnes" or "2 tons"
    r"(\d+(?:\.\d+)?)\s*(?:tonnes?|tons?|mt)\b",
    # Plain number near a crop mention (fallback)
    r"\b(\d+(?:\.\d+)?)\b",
]

UNIT_MULTIPLIERS = {
    "kg": 1,
    "kilo": 1, "kilos": 1, "kilogram": 1, "kilograms": 1,
    "quintal": 100, "quintals": 100, "qtl": 100,
    "tonne": 1000, "tonnes": 1000, "ton": 1000, "tons": 1000, "mt": 1000,
}


def _detect_intent(text: str) -> tuple[str, float]:
    """Detect the most likely intent from text. Returns (intent, confidence)."""
    text_lower = text.lower()
    scores: dict[str, int] = {}

    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                scores[intent] = scores.get(intent, 0) + 1

    if not scores:
        return "unknown", 0.0

    best_intent = max(scores, key=scores.get)
    # Confidence based on number of matching patterns
    max_patterns = len(INTENT_PATTERNS[best_intent])
    confidence = min(scores[best_intent] / max_patterns, 1.0)
    return best_intent, round(confidence, 2)


def _extract_crop(text: str) -> str | None:
    """Find a known crop name in the text."""
    text_lower = text.lower()
    for crop in KNOWN_CROPS:
        if crop.lower() in text_lower:
            return crop
    return None


def _extract_quantity(text: str) -> tuple[float | None, str | None]:
    """Extract quantity and unit from text. Returns (quantity_in_kg, original_unit)."""
    text_lower = text.lower()

    for pattern in QUANTITY_PATTERNS[:-1]:  # Skip the plain number fallback first
        match = re.search(pattern, text_lower)
        if match:
            value = float(match.group(1))
            # Determine unit from the matched text
            matched_text = match.group(0).lower()
            for unit_name, multiplier in UNIT_MULTIPLIERS.items():
                if unit_name in matched_text:
                    return value * multiplier, unit_name
            return value, "kg"

    # Fallback: plain number (only if crop is also mentioned)
    if _extract_crop(text) is not None:
        match = re.search(QUANTITY_PATTERNS[-1], text)
        if match:
            return float(match.group(1)), "kg"

    return None, None


def _extract_district(text: str) -> str | None:
    """Find a known district name in the text (case-insensitive)."""
    text_lower = text.lower()
    for district in KNOWN_DISTRICTS:
        if district.lower() in text_lower:
            return district
    return None


def extract_intent(request: ListenRequest) -> ListenResponse:
    """
    Extract structured intent and slots from raw text.

    Returns intent type, extracted slots, missing slots, and confidence.
    """
    text = request.rawText

    # Detect intent
    intent, confidence = _detect_intent(text)

    # Extract slots
    crop = _extract_crop(text)
    quantity, unit = _extract_quantity(text)
    district = _extract_district(text)

    slots = ExtractedSlots(
        crop=crop,
        quantity=quantity,
        unit=unit or "kg",
        district=district,
    )

    # Determine missing slots (for listing creation)
    missing = []
    if crop is None:
        missing.append("crop")
    if quantity is None:
        missing.append("quantity")
    if district is None:
        missing.append("district")

    # Build reasoning
    parts = [f"Detected intent: '{intent}' (confidence: {confidence})."]
    if crop:
        parts.append(f"Crop: {crop}.")
    if quantity:
        parts.append(f"Quantity: {quantity} kg.")
    if district:
        parts.append(f"District: {district}.")
    if missing:
        parts.append(f"Missing: {', '.join(missing)}.")

    return ListenResponse(
        intent=intent,
        extractedSlots=slots,
        missingSlots=missing,
        confidence=confidence,
        reasoning=" ".join(parts),
    )
