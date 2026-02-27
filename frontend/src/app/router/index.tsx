import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { AboutPage } from '@/features/about/pages/AboutPage'

// Root route with layout
const rootRoute = createRootRoute({
    component: () => (
        <RootLayout>
            <Outlet />
        </RootLayout>
    ),
})

// Child routes
const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: AboutPage,
})

const routeTree = rootRoute.addChildren([homeRoute, aboutRoute])

export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
