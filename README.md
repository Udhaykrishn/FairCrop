# FairCrop AI 🌱

FairCrop AI is an intelligent "Agentic AI Marketplace" that connects farmers and buyers across Kerala. It leverages a multi-agent AI system to negotiate profitable crop deals—evaluating price, distance, and delivery costs in real-time to bridge the gap between farmers and buyers, ensuring fair prices and transparent logistics.

---

## 🚀 Features

### For Farmers
- **List Crops:** Easily list available crops (e.g., Tomatoes) with quantity and location.
- **AI-Powered Market Analyst:** The system automatically calculates a fair "Reserve Price" based on real Agmarknet data.
- **Automated AI Agent Negotiation:** Sit back while your personal AI agent negotiates with buyers on your behalf.
- **Real-Time Notifications:** Get instant WebSocket notifications when a deal is accepted or rejected.

### For Buyers
- **Explore Marketplace:** Browse available crops from farmers across different districts.
- **Place Bids:** Submit a requested quantity and offer price.
- **Chat with AI:** Negotiate directly with the farmer's AI representative in a real-time chat interface.

### The AI Engine (Multi-Agent System)
- **Market Analyst Agent:** Sets the baseline reserve price using historical/real market data.
- **Listener / Intent Agent:** Extracts structured intents and offers from natural buyer language.
- **Decision Engine:** Computes distance, logistics costs, and profitability to algorithmically decide whether to accept, counter, or reject an offer.
- **LLM Communicator (Google Gemini):** Translates the strict numerical decisions back into pleasant, human-like negotiation messages.

---

## 🛠️ Tech Stack

The architecture is composed of three main microservices:

### 1. Frontend (`/frontend`)
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **Routing & State:** TanStack Router, TanStack Query
- **UI Components:** Lucide Icons, Recharts (for analytics dashboards)
- **Language:** TypeScript

### 2. Backend API (`/backend`)
- **Framework:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Caching & Sessions:** Redis (IORedis)
- **Real-time:** Socket.IO / WebSockets
- **Architecture:** Controller/Service architectural pattern injected via **InversifyJS** (Dependency Injection).
- **Language:** TypeScript

### 3. Agent Service (`/agent-service`)
- **Framework:** Python, FastAPI
- **LLM Integration:** Google Gemini
- **Validation:** Pydantic
- **Role:** Pure stateless decision engine executing the multi-agent negotiation logic.

---

## 📋 Prerequisites

To run this project locally, you will need:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+)
- **MongoDB** (Local or Atlas URI)
- **Redis** (Local or Cloud instance)
- **Google Gemini API Key**

---

## 🏃‍♂️ How to Run Locally

### 1. Start the Backend Service
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (refer to `.env.example` if available) with Mongo, Redis, and Port variables.
4. Run the development server:
   ```bash
   npm run dev
   ```

### 2. Start the Agent Service (Python)
1. Navigate to the agent-service directory:
   ```bash
   cd agent-service
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up `.env` with your `GEMINI_API_KEY`.
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Start the Frontend App
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 💡 How the Negotiation Flow Works

1. **Farmer creates listing:** Hits backend `/api/farmer/add-crop`. Backend calls Agent Service `/agent/analyze-market` to calculate the Reserve Price.
2. **Buyer places a bid:** Hits backend `/api/offers`. An offer document is created.
3. **Chat Initialization:** Frontend redirects to the Chat UI and automatically sends the initial bid message to backend `/api/negotiations/:id/messages`.
4. **Agent Processing:** Backend forwards the message and negotiation state (stored in Redis) to the Python Agent Service (`/agent/chat`).
5. **Decision & Response:** The Agent decides to Counter/Accept/Reject. The LLM generates a text response.
6. **Deal Finalized:** If the agent accepts the deal based on the computed threshold, the backend automatically updates the crop quantity, marks the deal as confirmed, and triggers a WebSocket notification to the farmer's dashboard!

---

## 🤝 Contributing
Built during the KSUM Hackathon. Contributions, issues, and feature requests are welcome!
