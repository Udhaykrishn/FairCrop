import { Link, useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { farmerStore } from '@/store/farmerStore'

const BRAND = '#17CF45'

interface RootLayoutProps {
    children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    const navigate = useNavigate()
    const farmer = farmerStore.load()
    const avatarLetter = farmer?.name?.charAt(0).toUpperCase() ?? 'U'
    const isLoggedIn = farmerStore.isLoggedIn()

    function handleSignOut() {
        farmerStore.clear()
        navigate({ to: '/' })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 no-underline">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="12" y1="22" x2="12" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 14 C9 14 7 12 7 9 C9 9 12 11 12 14Z" fill="white" />
                                <path d="M12 10 C15 10 17 8 17 5 C15 5 12 7 12 10Z" fill="white" />
                                <path d="M12 18 C9 18 7 16 7 13 C9 13 12 15 12 18Z" fill="rgba(255,255,255,0.7)" />
                                <circle cx="18" cy="6" r="2" fill="rgba(255,255,255,0.9)" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-extrabold tracking-tight text-gray-900">
                                Fair<span style={{ color: BRAND }}>Crop</span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                AI Marketplace
                            </span>
                        </div>
                    </Link>

                    {/* Nav links */}
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/"
                            className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            activeProps={{ className: 'rounded-full px-4 py-1.5 text-sm font-semibold bg-green-50', style: { color: BRAND } }}
                            activeOptions={{ exact: true }}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            activeProps={{ className: 'rounded-full px-4 py-1.5 text-sm font-semibold bg-green-50', style: { color: BRAND } }}
                        >
                            About
                        </Link>

                        {/* Live badge — only on dashboard */}
                        {isLoggedIn && (
                            <div
                                className="ml-2 hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                                style={{ backgroundColor: '#edfff3', color: BRAND }}
                            >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: BRAND }} />
                                Live · Kerala
                            </div>
                        )}
                    </nav>

                    {/* Right: avatar + signout (logged in) OR avatar placeholder */}
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition hover:opacity-90 select-none"
                            style={{ background: `linear-gradient(135deg, ${BRAND}, #0ea840)` }}
                            title={farmer?.name ?? 'User'}
                        >
                            {avatarLetter}
                        </div>

                        {isLoggedIn && (
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                                <LogOut size={11} />
                                Sign out
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 w-full overflow-x-hidden">
                {children}
            </main>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <line x1="12" y1="22" x2="12" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M12 14 C9 14 7 12 7 9 C9 9 12 11 12 14Z" fill="white" />
                                <path d="M12 10 C15 10 17 8 17 5 C15 5 12 7 12 10Z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-gray-800">
                                Fair<span style={{ color: BRAND }}>Crop</span>
                            </span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">AI Marketplace</span>
                        </div>
                    </div>
                    {/* Links */}
                    <div className="flex items-center gap-6 text-xs text-gray-400">
                        <Link to="/" className="transition hover:text-gray-700">Home</Link>
                        <Link to="/about" className="transition hover:text-gray-700">About</Link>
                        <a href="mailto:support@faircrop.ai" className="transition hover:text-gray-700">Contact</a>
                    </div>
                    {/* Copy */}
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} FairCrop AI — Empowering Farmers across Kerala
                    </p>
                </div>
            </footer>
        </div>
    )
}
