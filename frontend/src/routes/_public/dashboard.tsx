import { createFileRoute } from '@tanstack/react-router'
import { FarmerDashboard } from '@/features/home/pages/FarmerDashboard'

export const Route = createFileRoute('/_public/dashboard')({
    component: FarmerDashboard,
})
