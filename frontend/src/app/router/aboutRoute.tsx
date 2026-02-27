import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './rootRoute'
import { AboutPage } from '@/features/about/pages/AboutPage'

export const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: AboutPage,
})
