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
        location: { lat: number; lon: number }
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
            default: 20,
        };

        const key = crop.toLowerCase();
        const pricePerKg = basePrices[key] ?? basePrices["default"];

        // Simple formula: price/kg × quantity, with a small location-based factor
        const locationFactor = 1 + (location.lat % 5) / 100; // tiny regional variation
        const reservedPrice = Math.round(pricePerKg * quantity * locationFactor);

        return {
            crop,
            quantity,
            reservedPrice,
            currency: "INR",
            source: "mock-pricing-api",
        };
    }
}
