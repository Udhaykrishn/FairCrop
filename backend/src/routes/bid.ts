import { Router } from 'express'
import type { Request, Response } from 'express'

// ─── Types ───────────────────────────────────────────────────────
interface OfferRequest {
    cropId: string
    totalQuantity: string
    district: string
    offerPrice: number
}

interface StoredOffer extends OfferRequest {
    id: string
    status: 'pending' | 'accepted' | 'rejected'
    createdAt: string
}

// ─── In-memory store ─────────────────────────────────────────────
const offers: StoredOffer[] = []
let offerCounter = 1

// ─── Validation ──────────────────────────────────────────────────
function validateOffer(body: unknown): { valid: true; data: OfferRequest } | { valid: false; errors: string[] } {
    const errors: string[] = []
    const b = body as Record<string, unknown>

    if (!b || typeof b !== 'object') {
        return { valid: false, errors: ['Request body must be a JSON object'] }
    }

    if (!b.cropId || typeof b.cropId !== 'string') {
        errors.push('cropId is required and must be a string')
    }

    if (!b.totalQuantity || typeof b.totalQuantity !== 'string') {
        errors.push('totalQuantity is required and must be a string')
    }

    if (!b.district || typeof b.district !== 'string') {
        errors.push('district is required and must be a string')
    }

    if (b.offerPrice === undefined || typeof b.offerPrice !== 'number' || b.offerPrice <= 0) {
        errors.push('offerPrice is required and must be a positive number')
    }

    if (errors.length > 0) {
        return { valid: false, errors }
    }

    return {
        valid: true,
        data: {
            cropId: b.cropId as string,
            totalQuantity: b.totalQuantity as string,
            district: b.district as string,
            offerPrice: b.offerPrice as number,
        },
    }
}

// ─── Router ──────────────────────────────────────────────────────
export const offersRouter = Router()

// POST /api/v1/offers — Create a new offer
offersRouter.post('/', (req: Request, res: Response) => {
    const result = validateOffer(req.body)

    if (!result.valid) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: result.errors,
        })
        return
    }

    const offer: StoredOffer = {
        id: `OFFER-${String(offerCounter++).padStart(4, '0')}`,
        ...result.data,
        status: 'pending',
        createdAt: new Date().toISOString(),
    }

    offers.push(offer)

    res.status(201).json({
        success: true,
        message: 'Offer placed successfully',
        data: offer,
    })
})

// GET /api/v1/offers — List all offers
offersRouter.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: offers,
        total: offers.length,
    })
})
