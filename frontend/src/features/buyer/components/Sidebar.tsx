import { Link, useRouterState } from '@tanstack/react-router'

const navItems = [
    { label: 'Dashboard', icon: DashboardIcon, path: '/buyer/dashboard', activePath: '/buyer/dashboard' },
    { label: 'Crops', icon: CropsIcon, path: '/buyer/crops', activePath: '/buyer/crops' },
    { label: 'Negotiate', icon: NegotiateIcon, path: '/buyer/negotiate', activePath: '/buyer/negotiate' },
]

function DashboardIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    )
}

function CropsIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7 20h10M12 20V10M17 5c0 3-2.5 5-5 5S7 8 7 5c2.5 0 5 1.5 5 5 0-3.5 2.5-5 5-5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function NegotiateIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 10h8M8 14h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    )
}


function LogoutIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function Sidebar() {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-base font-bold text-gray-900">FairCrop AI</h1>
                    <p className="text-xs text-gray-400">Agri Marketplace</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-1 px-4">
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-300">Menu</p>
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = currentPath === item.activePath
                        return (
                            <li key={item.label}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${isActive
                                        ? 'bg-green-50 text-green-600 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                >
                                    <item.icon />
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Bottom section */}
            <div className="mt-auto border-t border-gray-100 px-4 pb-5 pt-4">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
                    <LogoutIcon />
                    Logout
                </button>
            </div>
        </aside>
    )
}
