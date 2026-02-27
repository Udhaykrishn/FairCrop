import { createFileRoute } from '@tanstack/react-router'
import { CropListingPage } from '@/features/buyer/pages/CropListingPage'

export const Route = createFileRoute('/buyer/crops')({
    component: CropListingPage,
})
