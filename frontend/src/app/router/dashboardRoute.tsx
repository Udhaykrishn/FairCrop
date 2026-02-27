import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import { FarmerDashboard } from '@/features/home/pages/FarmerDashboard'

export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: FarmerDashboard,
})
