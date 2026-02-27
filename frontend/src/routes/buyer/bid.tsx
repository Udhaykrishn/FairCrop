import { createFileRoute } from '@tanstack/react-router'
import { BidPage } from '@/features/buyer/pages/BidPage'

export const Route = createFileRoute('/buyer/bid')({
    component: BidPage,
})
