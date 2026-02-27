import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import { LandingPage } from '@/features/home/pages/LandingPage'

export const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
})
