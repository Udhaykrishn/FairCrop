"""
Pydantic models for the agent-service API.
Matches the exact backend integration contract.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ═════════════════════════════════════════════════════════════════════════════
#  MARKET ANALYST (Farmer Backend → Agent)
# ═════════════════════════════════════════════════════════════════════════════

class MarketAnalysisRequest(BaseModel):
    crop: str
    quantity: float = Field(..., gt=0)
    farmerDistrict: str


class MarketAnalysisResponse(BaseModel):
    recommendedReservePrice: float


# ─── Internal model for detailed analysis (used by other agents) ─────────────

class MandiPrice(BaseModel):
    district: str
    market: str
    minPricePerKg: float
    maxPricePerKg: float
    modalPricePerKg: float
    arrivalTonnes: float
    date: str


class MarketAnalysisDetail(BaseModel):
    """Full analysis used internally by negotiation & chat agents."""
    crop: str
    totalMarkets: int
    mandiPrices: list[MandiPrice] = []
    avgPricePerKg: float
    minPricePerKg: float
    maxPricePerKg: float
    recommendedReservePrice: float
    perishability: str
    shelfLifeDays: int
    reasoning: str = ""


# ═════════════════════════════════════════════════════════════════════════════
#  NEGOTIATE (Buyer Backend → Agent)
# ═════════════════════════════════════════════════════════════════════════════

class NegotiateFarmer(BaseModel):
    district: str


class NegotiateBuyer(BaseModel):
    district: str


class NegotiateRequest(BaseModel):
    crop: str
    quantity: float = Field(..., gt=0)
    farmer: NegotiateFarmer
    buyer: NegotiateBuyer
    offerPricePerKg: float = Field(..., gt=0)
    reservePrice: float = Field(..., gt=0)


class NegotiateCounterOffer(BaseModel):
    counterPrice: float


class NegotiateResponse(BaseModel):
    status: str  # "accepted" | "counter_offer" | "rejected"
    ReservePrice: float
    finalPrice: Optional[float] = None  # Set when status == "accepted"
    counterOffer: Optional[NegotiateCounterOffer] = None
    reasoning: str = ""


# ═════════════════════════════════════════════════════════════════════════════
#  BUYER CHAT (Buyer Backend → Agent, with LLM)
# ═════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    listingId: str = Field(default="L1")
    buyerMessage: str = Field(..., min_length=1)
    buyerId: str = Field(default="B1")
    buyerDistrict: str
    crop: str = Field(default="Tomato")
    quantity: float = Field(default=500, gt=0)
    farmerDistrict: str = Field(default="Palakkad")
    roundNumber: int = Field(default=1, ge=1)
    currentOfferPrice: Optional[float] = None
    lastCounterPrice: Optional[float] = None


class ChatDecision(BaseModel):
    status: str  # "accepted" | "counter_offer" | "rejected" | "buyer_rejected" | "need_info"
    finalPrice: Optional[float] = None  # Set when status == "accepted"
    counterPrice: Optional[float] = None


class ChatResponse(BaseModel):
    decision: ChatDecision
    chatMessage: str
    ReservePrice: Optional[float] = None


# ═════════════════════════════════════════════════════════════════════════════
#  LISTENER AGENT (internal/optional)
# ═════════════════════════════════════════════════════════════════════════════

class ListenRequest(BaseModel):
    rawText: str = Field(..., min_length=1)
    language: str = Field(default="en")


class ExtractedSlots(BaseModel):
    crop: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    district: Optional[str] = None


class ListenResponse(BaseModel):
    intent: str
    extractedSlots: ExtractedSlots
    missingSlots: list[str] = []
    confidence: float = 0.0
    reasoning: str = ""
