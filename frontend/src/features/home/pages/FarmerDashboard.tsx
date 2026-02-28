import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
    Search,
    Mic,
    MapPin,
    CheckCircle2,
    ChevronDown,
    Sprout,
    Phone,
    Loader2,
    AlertCircle,
    Tag,
    TrendingUp,
    Package,
} from 'lucide-react'
import { farmerStore } from '@/store/farmerStore'
import { farmerService } from '@/services/api'
import type { Farmer, CropListing } from '@/services/api'

const BRAND = '#17CF45'

const CROPS = [
    'Tomato', 'Onion', 'Potato', 'Banana',
    'Coconut', 'Ginger', 'Pepper', 'Tapioca', 'Rubber', 'Coffee',
]

// ── All 14 Kerala districts with centre coordinates ──────────────────────────
const KERALA_DISTRICTS = [
    { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 },
    { name: 'Kollam', lat: 8.8932, lon: 76.6141 },
    { name: 'Pathanamthitta', lat: 9.2648, lon: 76.7870 },
    { name: 'Alappuzha', lat: 9.4981, lon: 76.3388 },
    { name: 'Kottayam', lat: 9.5916, lon: 76.5222 },
    { name: 'Idukki', lat: 9.9189, lon: 77.1025 },
    { name: 'Ernakulam', lat: 9.9816, lon: 76.2999 },
    { name: 'Thrissur', lat: 10.5276, lon: 76.2144 },
    { name: 'Palakkad', lat: 10.7867, lon: 76.6548 },
    { name: 'Malappuram', lat: 11.0730, lon: 76.0740 },
    { name: 'Kozhikode', lat: 11.2588, lon: 75.7804 },
    { name: 'Wayanad', lat: 11.6854, lon: 76.1320 },
    { name: 'Kannur', lat: 11.8745, lon: 75.3704 },
    { name: 'Kasaragod', lat: 12.4996, lon: 74.9869 },
]

export function FarmerDashboard() {
    const navigate = useNavigate()
    const [crop, setCrop] = useState('Tomato')
    const [quantity, setQuantity] = useState('')
    const [farmer, setFarmer] = useState<Farmer | null>(null)

    // Location state — district dropdown
    const [district, setDistrict] = useState(KERALA_DISTRICTS[11]) // default: Wayanad
    const coords = { lat: district.lat, lon: district.lon }

    // Form submission state
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [listedCrop, setListedCrop] = useState<CropListing | null>(null)

    useEffect(() => {
        const stored = farmerStore.load()
        if (!stored) {
            navigate({ to: '/' })
            return
        }
        setFarmer(stored)
    }, [])

    // Submit crop listing
    async function handleFindBestPrice() {
        if (!farmer) return
        if (!quantity || Number(quantity) <= 0) {
            setSubmitError('Please enter a valid quantity (kg).')
            return
        }

        setSubmitting(true)
        setSubmitError(null)
        setListedCrop(null)

        try {
            const result = await farmerService.listCrop({
                farmerId: farmer._id,
                crop,
                quantity: Number(quantity),
                location: coords,
            })
            setListedCrop(result)
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit listing.')
        } finally {
            setSubmitting(false)
        }
    }

    return (

        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

                {/* ── LEFT COLUMN ──────────────────────────────────────── */}
                <div className="flex flex-col gap-6 lg:col-span-3">

                    {/* Greeting */}
                    <div>
                        <div
                            className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ backgroundColor: '#edfff3', color: BRAND }}
                        >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: BRAND }} />
                            Live market data · Kerala
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Hello, {farmer?.name ?? 'Farmer'} 👋
                        </h1>
                        {farmer?.phone && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-400">
                                <Phone size={12} />
                                <span>{farmer.phone}</span>
                                <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND }}>
                                    <CheckCircle2 size={11} />
                                    Verified
                                </span>
                            </div>
                        )}
                        <p className="mt-2 text-base font-normal text-gray-500">
                            Sell your crops at the best market price in Kerala
                        </p>
                    </div>

                    {/* ── Crop Listing Card ───────────────────────────── */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        {/* Card header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: '#edfff3' }}>
                                    <Sprout size={14} style={{ color: BRAND }} />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-800">Add Your Listing</h2>
                            </div>
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                style={{ backgroundColor: '#edfff3', color: BRAND }}
                            >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                                Live Prices
                            </span>
                        </div>

                        {/* Crop + Quantity */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-400">Select Crop</label>
                                <div className="relative">
                                    <select
                                        value={crop}
                                        onChange={(e) => { setCrop(e.target.value); setListedCrop(null) }}
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-8 text-sm font-medium text-gray-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
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
                                    min={1}
                                    onChange={(e) => { setQuantity(e.target.value); setListedCrop(null) }}
                                    placeholder="e.g. 100"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        {/* Location — Kerala district dropdown */}
                        <div className="mt-3 flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-400">District (Kerala)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                                    <MapPin size={14} className="text-gray-400" />
                                </div>
                                <select
                                    value={district.name}
                                    onChange={(e) => {
                                        const found = KERALA_DISTRICTS.find(d => d.name === e.target.value)
                                        if (found) { setDistrict(found); setListedCrop(null) }
                                    }}
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-8 text-sm font-medium text-gray-800 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                >
                                    {KERALA_DISTRICTS.map((d) => (
                                        <option key={d.name} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            <p className="text-[10px] text-gray-400">
                                Lat: {district.lat.toFixed(4)}, Lon: {district.lon.toFixed(4)}
                            </p>
                        </div>

                        <div className="my-5 h-px bg-gray-100" />

                        {/* Error */}
                        {submitError && (
                            <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                                <AlertCircle size={13} className="shrink-0" />
                                {submitError}
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={handleFindBestPrice}
                                disabled={submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ backgroundColor: BRAND, boxShadow: `0 4px 14px 0 ${BRAND}55` }}
                            >
                                {submitting
                                    ? <><Loader2 size={15} className="animate-spin" /> Finding Best Price…</>
                                    : <><Search size={15} /> Find Best Price</>
                                }
                            </button>
                            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-200 active:scale-[0.98]">
                                <Mic size={14} />
                                Speak Instead
                            </button>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                        </svg>
                        <p className="text-xs leading-relaxed text-blue-800">
                            <span className="font-semibold">Note:</span>{' '}
                            The reserved price is AI-calculated based on current market trends, your selected district, and crop quantity. Fill in all details and click <span className="font-semibold">"Find Best Price"</span> to get your price.
                        </p>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
                <div className="flex flex-col gap-4 lg:col-span-2">

                    {/* ── Reserved Price Card ──────────────────────────── */}
                    <div
                        className="rounded-2xl border p-5 shadow-sm transition-all duration-500"
                        style={{
                            borderColor: listedCrop ? `${BRAND}50` : '#f3f4f6',
                            backgroundColor: listedCrop ? '#f0fdf4' : '#ffffff',
                        }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: listedCrop ? '#dcfce7' : '#f3f4f6' }}
                                >
                                    <Tag size={14} style={{ color: listedCrop ? BRAND : '#9ca3af' }} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800">Reserved Price</h3>
                            </div>
                            {listedCrop && (
                                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND }}>
                                    <CheckCircle2 size={13} />
                                    AI Calculated
                                </span>
                            )}
                        </div>

                        {listedCrop ? (
                            /* ── Result state ── */
                            <div className="space-y-4">
                                {/* Price display */}
                                <div className="rounded-xl p-4" style={{ backgroundColor: '#dcfce7' }}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: BRAND }}>
                                        Your Reserved Price
                                    </p>
                                    <div className="mt-1.5 flex items-end gap-1.5">
                                        <span className="text-4xl font-extrabold" style={{ color: '#0ea840' }}>
                                            ₹{listedCrop.reservedPrice.toFixed(2)}
                                        </span>
                                        <span className="mb-1 text-sm font-medium" style={{ color: BRAND }}>/kg</span>
                                    </div>
                                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">
                                        Based on 3-day trend analysis, transport costs &amp; nearby mandi demand.
                                    </p>
                                </div>

                                {/* Listing summary */}
                                <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Listing Summary</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Sprout size={12} style={{ color: BRAND }} /> Crop
                                        </span>
                                        <span className="font-semibold text-gray-800">{listedCrop.crop}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Package size={12} style={{ color: BRAND }} /> Quantity
                                        </span>
                                        <span className="font-semibold text-gray-800">{listedCrop.quantity} kg</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <TrendingUp size={12} style={{ color: BRAND }} /> Potential Earnings
                                        </span>
                                        <span className="font-bold" style={{ color: BRAND }}>
                                            ₹{(listedCrop.reservedPrice * listedCrop.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-center text-[10px] text-gray-400">
                                    Listing ID: <span className="font-mono">{listedCrop._id.slice(-8).toUpperCase()}</span>
                                </p>
                            </div>
                        ) : (
                            /* ── Empty / idle state ── */
                            <div className="flex flex-col items-center gap-3 py-8 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <Tag size={22} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400">No listing yet</p>
                                    <p className="mt-1 text-xs text-gray-300 leading-relaxed">
                                        Fill in your crop details and click<br />
                                        <span className="font-semibold">"Find Best Price"</span> to get your AI-calculated reserved price.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Mini Map Card ─────────────────────────────────── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="relative h-40 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="mapgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#17CF45" strokeWidth="0.4" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#mapgrid)" />
                            </svg>
                            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 0 80 Q 90 65 180 85 T 360 75" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
                                <path d="M 130 0 Q 140 55 135 160" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-full">
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white shadow-lg"
                                    style={{ backgroundColor: BRAND }}
                                >
                                    <MapPin size={14} className="text-white" />
                                </div>
                                <div className="mx-auto mt-0.5 h-2.5 w-0.5" style={{ backgroundColor: BRAND }} />
                            </div>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-md">
                                    <MapPin size={10} style={{ color: BRAND }} />
                                    {district.name}, Kerala
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
