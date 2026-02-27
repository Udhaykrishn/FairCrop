import { RouterProvider } from '@tanstack/react-router'
import { QueryProvider } from './QueryProvider'
import { router } from '@/app/router'

export function AppProviders() {
    return (
        <QueryProvider>
            <RouterProvider router={router} />
        </QueryProvider>
    )
}
