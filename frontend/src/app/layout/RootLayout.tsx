import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface RootLayoutProps {
    children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Navigation */}
            <header className="border-b border-gray-200 dark:border-gray-800">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link to="/" className="text-xl font-bold text-green-600 dark:text-green-400">
                        🌿 FairCrop
                    </Link>
                    <ul className="flex gap-6">
                        <li>
                            <Link
                                to="/"
                                className="text-sm font-medium text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 [&.active]:text-green-600 [&.active]:dark:text-green-400"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="text-sm font-medium text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 [&.active]:text-green-600 [&.active]:dark:text-green-400"
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Page content */}
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                © {new Date().getFullYear()} FairCrop — Empowering Farmers
            </footer>
        </div>
    )
}
