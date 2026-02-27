import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { AboutPage } from '@/features/about/pages/AboutPage'
import { BuyerDashboardPage } from '@/features/buyer/pages/BuyerDashboardPage'
import { BidPage } from '@/features/buyer/pages/BidPage'
import { CropListingPage } from '@/features/buyer/pages/CropListingPage'
import { NegotiationChatPage } from '@/features/buyer/pages/NegotiationChatPage'

// Root route with layout
const rootRoute = createRootRoute({
    component: () => <Outlet />,
})

// Layout route for public pages
const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    component: () => (
        <RootLayout>
            <Outlet />
        </RootLayout>
    ),
})

// Child routes under public layout
const homeRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/',
    component: HomePage,
})

const aboutRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/about',
    component: AboutPage,
})

// Buyer dashboard route (has its own sidebar layout)
const buyerDashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/buyer/dashboard',
    component: BuyerDashboardPage,
})

// Buyer bid route
const buyerBidRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/buyer/bid',
    component: BidPage,
})

// Buyer crop listing route
const buyerCropsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/buyer/crops',
    component: CropListingPage,
})

// Buyer negotiation chat route
const buyerNegotiateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/buyer/negotiate',
    component: NegotiationChatPage,
})

const routeTree = rootRoute.addChildren([
    publicLayoutRoute.addChildren([homeRoute, aboutRoute]),
    buyerDashboardRoute,
    buyerBidRoute,
    buyerCropsRoute,
    buyerNegotiateRoute,
])

export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
