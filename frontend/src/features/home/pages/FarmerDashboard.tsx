import { useState } from 'react'
import {
    Search,
    Mic,
    MapPin,
    TrendingDown,
    TrendingUp,
    CheckCircle2,
    Navigation,
    ChevronDown,
    Sparkles,
    Sprout,
} from 'lucide-react'

const BRAND = '#17CF45'

const CROPS = [
    'Tomato', 'Onion', 'Potato', 'Banana',
    'Coconut', 'Ginger', 'Pepper', 'Tapioca', 'Rubber', 'Coffee',
]

export function FarmerDashboard() {
    const [crop, setCrop] = useState('Tomato')
    const [quantity, setQuantity] = useState('')

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

                {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
                <div className="flex flex-col gap-6 lg:col-span-3">

                    {/* Greeting */}
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: '#edfff3', color: BRAND }}>
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: BRAND }} />
                            Live market data · Kerala
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Hello Farmer 👋
                        </h1>
                        <p className="mt-2 text-base font-normal text-gray-500">
                            Sell your crops at the best market price in Kerala
                        </p>
                    </div>

                    {/* Crop Input Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        {/* Card header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: '#edfff3' }}>
                                    <Sprout size={14} style={{ color: BRAND }} />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800">Add Your Listing</h2>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: '#edfff3', color: BRAND }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                                Live Prices
                            </span>
                        </div>

                        {/* Crop + Quantity row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400">Select Crop</label>
                                <div className="relative">
                                    <select
                                        value={crop}
                                        onChange={(e) => setCrop(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-8 text-sm font-medium text-gray-800 outline-none transition focus:ring-2"
                                        style={{ ['--tw-ring-color' as string]: BRAND } as React.CSSProperties}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                                    >
                                        {CROPS.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400">Quantity (kg)</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="e.g. 100"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 outline-none transition"
                                    onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mt-3 flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400">Your Location</label>
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
                                <MapPin size={14} className="shrink-0 text-gray-400" />
                                <input
                                    type="text"
                                    defaultValue="Wayanad, Kerala"
                                    className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none"
                                />
                                <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: BRAND }}>
                                    <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: BRAND }} />
                                    Verified
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-5 h-px bg-gray-100" />

                        {/* CTAs */}
                        <div className="flex flex-col gap-2.5">
                            <button
                                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
                                style={{ backgroundColor: BRAND, boxShadow: `0 4px 14px 0 ${BRAND}55` }}
                            >
                                <Search size={15} />
                                Find Best Price
                            </button>
                            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-200 active:scale-[0.98]">
                                <Mic size={14} />
                                Speak Instead
                            </button>
                        </div>
                    </div>

                    {/* AI Tip */}
                    <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5">
                        <Sparkles size={15} className="mt-0.5 shrink-0 text-amber-500" />
                        <p className="text-xs leading-relaxed text-amber-800">
                            <span className="font-semibold">AI Tip:</span>{' '}
                            Tomato prices are expected to rise <span className="font-semibold">8%</span> next week due to low supply in Kozhikode. Consider holding stock if possible.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
                <div className="flex flex-col gap-4 lg:col-span-2">

                    {/* Market Insights Card */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">Market Insights</h3>
                            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: BRAND }}>
                                <TrendingUp size={13} />
                                Live
                            </span>
                        </div>

                        {/* Today's avg price */}
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                Today's Avg Mandi Price
                            </p>
                            <div className="mt-1.5 flex items-end gap-1.5">
                                <span className="text-3xl font-bold text-gray-900">₹42.50</span>
                                <span className="mb-0.5 text-sm text-gray-400">/kg</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                                <TrendingDown size={12} />
                                −2.4% from yesterday
                            </div>
                        </div>

                        {/* Reserve price */}
                        <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: '#edfff3' }}>
                            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: BRAND }}>
                                Suggested Reserve Price
                            </p>
                            <div className="mt-1.5 flex items-end justify-between">
                                <div className="flex items-end gap-1.5">
                                    <span className="text-3xl font-bold" style={{ color: '#0ea840' }}>₹48.00</span>
                                    <span className="mb-0.5 text-sm" style={{ color: BRAND }}>/kg</span>
                                </div>
                                <CheckCircle2 size={20} style={{ color: BRAND }} />
                            </div>
                            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                                Based on 3-day trend analysis, transport costs & nearby mandi demand.
                            </p>
                        </div>
                    </div>

                    {/* Mini Map Card */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Map area */}
                        <div className="relative h-40 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                            {/* SVG grid */}
                            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="mapgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#17CF45" strokeWidth="0.4" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#mapgrid)" />
                            </svg>
                            {/* Road lines */}
                            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0 80 Q 90 65 180 85 T 360 75" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
                                <path d="M 130 0 Q 140 55 135 160" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            {/* Pin */}
                            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-full">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white shadow-lg" style={{ backgroundColor: BRAND }}>
                                    <Navigation size={14} className="text-white" />
                                </div>
                                <div className="mx-auto mt-0.5 h-2.5 w-0.5" style={{ backgroundColor: BRAND }} />
                            </div>
                            {/* Badge */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-md">
                                    <MapPin size={10} style={{ color: BRAND }} />
                                    Closest Mandi: 4.2 km
                                </div>
                            </div>
                        </div>

                        {/* Nearby Buyers */}
                        <div className="p-4">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                Nearby Buyers
                            </p>

                            {[
                                { initials: 'KM', name: 'Kerala Markets Co-op', dist: '3.8 km away · Picks up today', price: '₹46/kg', gradient: `linear-gradient(135deg, ${BRAND}, #0ea840)` },
                                { initials: 'WF', name: 'Wayanad FreshMart', dist: '5.1 km away · Tomorrow', price: '₹44/kg', gradient: 'linear-gradient(135deg, #60a5fa, #6366f1)' },
                            ].map((buyer) => (
                                <div key={buyer.name} className="flex items-center gap-3 py-2">
                                    <div
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                                        style={{ background: buyer.gradient }}
                                    >
                                        {buyer.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-800">{buyer.name}</p>
                                        <p className="text-[11px] text-gray-400">{buyer.dist}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold" style={{ color: BRAND }}>{buyer.price}</p>
                                        <p className="text-[10px] text-gray-400">Avg offer</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
