import { createFileRoute } from '@tanstack/react-router'
import { BidPage } from '@/features/buyer/pages/BidPage'

interface BidSearch {
    cropId?: string
    cropName?: string
    quantity?: number
    lat?: number
    lon?: number
}

export const Route = createFileRoute('/buyer/bid')({
    validateSearch: (search: Record<string, unknown>): BidSearch => {
        return {
            cropId: search.cropId as string | undefined,
            cropName: search.cropName as string | undefined,
            quantity: Number(search.quantity) || undefined,
            lat: Number(search.lat) || undefined,
            lon: Number(search.lon) || undefined,
        }
    },
    component: BidPage,
})
