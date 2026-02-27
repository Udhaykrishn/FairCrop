import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '@/app/layout/RootLayout'

export const Route = createFileRoute('/_public')({
    component: () => (
        <RootLayout>
            <Outlet />
        </RootLayout>
    ),
})
