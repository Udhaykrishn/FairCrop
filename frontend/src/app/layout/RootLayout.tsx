import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface RootLayoutProps {
    children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation — no border, clean float */}
            <header className="bg-white shadow-sm">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 no-underline">
                        {/* Logo mark — wheat stalk + circuit dot (agriculture + AI) */}
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Main stalk */}
                                <line x1="12" y1="22" x2="12" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                {/* Left grain */}
                                <path d="M12 14 C9 14 7 12 7 9 C9 9 12 11 12 14Z" fill="white" />
                                {/* Right grain */}
                                <path d="M12 10 C15 10 17 8 17 5 C15 5 12 7 12 10Z" fill="white" />
                                {/* Left lower grain */}
                                <path d="M12 18 C9 18 7 16 7 13 C9 13 12 15 12 18Z" fill="rgba(255,255,255,0.7)" />
                                {/* AI dot — top right accent */}
                                <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.9)" />
                            </svg>
                        </div>
                        {/* Wordmark */}
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-extrabold tracking-tight text-gray-900">
                                Fair<span style={{ color: '#16a34a' }}>Crop</span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                AI Marketplace
                            </span>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <ul className="flex items-center gap-1">
                        <li>
                            <Link
                                to="/"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 [&.active]:bg-green-50 [&.active]:font-semibold"
                                style={{ ['--tw-text-opacity' as string]: '1' }}
                                activeProps={{ style: { color: '#17CF45' } }}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                activeProps={{ style: { color: '#17CF45' }, className: 'rounded-lg px-4 py-2 text-sm font-semibold bg-green-50 transition' }}
                            >
                                About
                            </Link>
                        </li>
                        {/* User avatar */}
                        <li className="ml-3">
                            <div
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                                style={{ backgroundColor: '#17CF45' }}
                            >
                                U
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Page content — full width; each page manages its own container */}
            <main className="w-full overflow-x-hidden">{children}</main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} FairCrop AI — Empowering Farmers across Kerala
            </footer>
        </div>
    )
}
