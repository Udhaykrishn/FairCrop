import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/features/home/pages/LandingPage'

export const Route = createFileRoute('/_public/')({
    component: LandingPage,
})
