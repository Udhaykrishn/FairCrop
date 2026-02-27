import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import { homeRoute } from './homeRoute'
import { dashboardRoute } from './dashboardRoute'
import { aboutRoute } from './aboutRoute'

// Assemble the route tree from individual route modules
const routeTree = rootRoute.addChildren([homeRoute, dashboardRoute, aboutRoute])

export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
