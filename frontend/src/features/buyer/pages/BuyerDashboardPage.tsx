import { Sidebar } from '@/features/buyer/components/Sidebar'
import { StatCard } from '@/features/buyer/components/StatCard'
import { RevenueChart } from '@/features/buyer/components/RevenueChart'
import { RecentActivity } from '@/features/buyer/components/RecentActivity'

function DeliveryCostIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function NetProfitIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 21h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function TotalRevenueIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function BellIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function BuyerDashboardPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-900">Buyer Simulation Dashboard</h2>
                        <span className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            BUYER_101
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                placeholder="Search simulations..."
                                className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            />
                        </div>
                        <button className="relative text-gray-400 transition-colors hover:text-gray-600">
                            <BellIcon />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-green-500" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {/* Title section */}
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Simulation Overview</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Real-time ONDC-style buyer simulation and profit analysis.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Export Data
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                Run Re-Simulation
                            </button>
                        </div>
                    </div>

                    {/* AI Recommendation Preview */}
                    <div className="mb-6">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-lg">✨</span>
                            <h3 className="text-sm font-semibold text-gray-700">AI Recommendation Preview</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <StatCard
                                label="DELIVERY COST"
                                value="$42,850.00"
                                change="+12% efficiency gain"
                                icon={<DeliveryCostIcon />}
                            />
                            <StatCard
                                label="NET PROFIT"
                                value="$42,850.00"
                                change="+8.4% vs last period"
                                icon={<NetProfitIcon />}
                            />
                            <StatCard
                                label="TOTAL REVENUE"
                                value="$128,400.00"
                                change="+5.2% growth rate"
                                icon={<TotalRevenueIcon />}
                            />
                        </div>
                    </div>

                    {/* Revenue Chart + Recent Activity */}
                    <div className="flex gap-5">
                        <RevenueChart />
                        <RecentActivity />
                    </div>
                </main>
            </div>
        </div>
    )
}
