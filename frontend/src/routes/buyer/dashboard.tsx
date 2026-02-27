import { createFileRoute } from '@tanstack/react-router'
import { BuyerDashboardPage } from '@/features/buyer/pages/BuyerDashboardPage'

export const Route = createFileRoute('/buyer/dashboard')({
    component: BuyerDashboardPage,
})
