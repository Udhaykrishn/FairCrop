"""
FastAPI entrypoint for the agent-service.
Clean endpoints matching the exact backend integration contract.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    MarketAnalysisRequest, MarketAnalysisResponse,
    NegotiateRequest, NegotiateResponse,
    ChatRequest, ChatResponse,
    ListenRequest, ListenResponse,
)
from market_analyst import analyze_market
from negotiation import negotiate
from buyer_chat import handle_buyer_chat
from listener import extract_intent

app = FastAPI(
    title="FairCrop Agent Service",
    description=(
        "Stateless multi-agent crop evaluation microservice.\n\n"
        "**Endpoints:**\n"
        "- 📊 `/agent/analyze-market` — Reserve price from real Agmarknet data\n"
        "- 🤝 `/agent/negotiate` — Accept / counter / reject decision\n"
        "- 💬 `/agent/chat` — LLM-powered buyer negotiation chat\n"
        "- 🎧 `/agent/listen` — Text → intent extraction"
    ),
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── 1. Health Check ─────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health_check():
    """Let backend know the service is alive."""
    return {"status": "ok", "version": "3.0.0"}


# ─── 2. Market Analyst (Farmer Backend → Agent) ─────────────────────────────

@app.post("/agent/analyze-market", response_model=MarketAnalysisResponse, tags=["Market Analyst"])
async def analyze(request: MarketAnalysisRequest):
    """
    Compute recommended reserve price for a farmer's listing.

    Farmer backend stores this in Mongo and sends to farmer frontend.
    """
    result = analyze_market(request)
    if result.recommendedReservePrice == 0:
        raise HTTPException(
            status_code=404,
            detail=f"No market data for crop '{request.crop}'. Supported: Tomato."
        )
    return result


# ─── 3. Negotiation Engine (Buyer Backend → Agent) ──────────────────────────

@app.post("/agent/negotiate", response_model=NegotiateResponse, tags=["Negotiation"])
async def negotiate_endpoint(request: NegotiateRequest):
    """
    Core decision endpoint. Accepts/counters/rejects a buyer's offer.

    Buyer backend stores counter in Redis. If accepted, stores final price in Mongo.
    """
    try:
        result = negotiate(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ─── 4. Buyer Chat — LLM Communication Layer (Buyer Backend → Agent) ────────

@app.post("/agent/chat", response_model=ChatResponse, tags=["Buyer Chat"])
async def chat(request: ChatRequest):
    """
    LLM-powered buyer negotiation chat.

    1. LLM extracts offer from buyer's natural language
    2. Engine decides accept / counter / reject
    3. LLM generates polite response message

    Buyer backend stores counter price and sends chatMessage to frontend.
    """
    try:
        result = handle_buyer_chat(request)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# ─── Listener Agent (optional) ───────────────────────────────────────────────

@app.post("/agent/listen", response_model=ListenResponse, tags=["Listener"])
async def listen(request: ListenRequest):
    """Extract structured intent and slots from raw text."""
    return extract_intent(request)
