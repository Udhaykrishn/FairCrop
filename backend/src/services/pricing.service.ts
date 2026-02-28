import { injectable } from "inversify";

export interface IPricingResponse {
    crop: string;
    quantity: number;
    reservedPrice: number;
    currency: string;
    source: string;
}

@injectable()
export class PricingService {
    /**
     * Fetches a reserved price for a crop.
     *
     * TODO: Replace the mock below with a real external API call, e.g.:
     *   const { data } = await apiClient.post("/pricing/reserved", { crop, quantity, location });
     *   return data;
     */
    public async getReservedPrice(
        crop: string,
        quantity: number,
        location: string
    ): Promise<IPricingResponse> {
        // ── Mock external API call ──────────────────────────────────────────
        // Simulates a slight network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Base price per kg (mock rate per crop type)
        const basePrices: Record<string, number> = {
            tomato: 18,
            potato: 14,
            onion: 22,
            rice: 35,
            wheat: 25,
            banana: 30,
            coconut: 25,
            ginger: 60,
            pepper: 550,
            tapioca: 12,
            rubber: 180,
            coffee: 300,
            default: 20,
        };

        const key = crop.toLowerCase();
        const pricePerKg = basePrices[key] ?? basePrices["default"];
        const reservedPrice = Math.round(pricePerKg * quantity);

        return {
            crop,
            quantity,
            reservedPrice,
            currency: "INR",
            source: "mock-pricing-api",
        };
    }
}
