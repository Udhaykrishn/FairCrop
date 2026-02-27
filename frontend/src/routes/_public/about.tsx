import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/features/about/pages/AboutPage'

export const Route = createFileRoute('/_public/about')({
    component: AboutPage,
})
