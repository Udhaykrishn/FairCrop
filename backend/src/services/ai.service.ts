import axios from "axios";
import { injectable } from "inversify";

export interface AiNegotiationRequest {
    buyerMessage: string;
    buyerDistrict?: string;
    crop?: string;
    quantity?: number;
    farmerLocation?: string;
    reservePrice?: number;
    lastCounterPrice?: number;
}

export interface AiNegotiationResponse {
    decision: {
        status: "counter_offer" | "accepted" | "rejected";
        counterPrice: number;
    };
    chatMessage: string;
    ReservePrice: number;
}

@injectable()
export class AiService {
    private readonly fastApiUrl =
        process.env.FASTAPI_URL || "http://localhost:8000/agent/chat";

    public async generateResponse(
        negotiationData: AiNegotiationRequest,
        history: any[],
    ): Promise<AiNegotiationResponse> {
        try {
            const response = await axios.post(
                this.fastApiUrl,
                {
                    buyerMessage: negotiationData.buyerMessage,
                    buyerDistrict: negotiationData.buyerDistrict || "Unknown",
                    crop: negotiationData.crop || "Tomato",
                    quantity: negotiationData.quantity || 500,
                    farmerDistrict: negotiationData.farmerLocation || "Palakkad",
                    roundNumber: 1,
                    currentOfferPrice: negotiationData.lastCounterPrice || null,
                    lastCounterPrice: negotiationData.lastCounterPrice || null,
                },
            );

            // The external AI service should return the structured response
            return response.data;
        } catch (error: any) {
            console.error(
                "Error communicating with External AI service:",
                error.message,
            );
            return {
                decision: { status: "counter_offer", counterPrice: negotiationData.lastCounterPrice || 0 },
                chatMessage: `Sorry, I couldn't reach the backend LLM service (${error.message}).`,
                ReservePrice: negotiationData.reservePrice || 0
            };
        }
    }
}
