import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CropCard } from '@/features/buyer/components/CropCard'
import { PlaceBidModal } from '@/features/buyer/components/PlaceBidModal'
import { SuccessToast } from '@/features/buyer/components/SuccessToast'
import { Sidebar } from '@/features/buyer/components/Sidebar'
import { farmerService } from '@/services/api'

const TOMATO_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'

const DISTRICTS = ['All Districts', 'Wayanad', 'Idukki', 'Palakkad', 'Kannur', 'Kottayam', 'Thrissur']

export function CropListingPage() {
    const [activeDistrict, setActiveDistrict] = useState('All Districts')
    const [searchQuery, setSearchQuery] = useState('')
    const [bidModalOpen, setBidModalOpen] = useState(false)
    const [selectedCrop, setSelectedCrop] = useState<any | null>(null)
    const [showToast, setShowToast] = useState(false)

    const { data: rawCrops, isLoading, isError, error } = useQuery({
        queryKey: ['crops'],
        queryFn: farmerService.getallCrops,
    })

    const crops = useMemo(() => {
        if (!rawCrops) return []
        return rawCrops.map((crop) => ({
            id: crop._id,
            name: crop.crop,
            variety: 'Fresh Produce', // Backend doesn't provide variety yet
            location: `${crop.location.lat.toFixed(2)}, ${crop.location.lon.toFixed(2)}`, // Coordinates as location string
            quantity: `${crop.quantity} kg`,
            priceRange: `₹${crop.reservedPrice} - ₹${crop.finalPrice || crop.reservedPrice + 10}`,
            farmer: `Farmer ${crop.farmerId}`,
            rating: 4.5,
            image: TOMATO_IMAGE,
            tags: crop.isSold ? ['Sold'] : ['Available'],
        }))
    }, [rawCrops])

    const filteredCrops = useMemo(() => {
        return crops.filter((crop) => {
            const matchesDistrict =
                activeDistrict === 'All Districts' || crop.location.includes(activeDistrict)
            const matchesSearch =
                !searchQuery ||
                crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.variety.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesDistrict && matchesSearch
        })
    }, [crops, activeDistrict, searchQuery])

    const handlePlaceBid = useCallback((crop: any) => {
        setSelectedCrop(crop)
        setBidModalOpen(true)
    }, [])

    const handleBidSubmit = useCallback(() => {
        setShowToast(true)
    }, [])

    const handleCloseToast = useCallback(() => {
        setShowToast(false)
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500">Loading fresh crops...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <span className="mb-3 block text-4xl">⚠️</span>
                    <h3 className="text-lg font-semibold text-gray-700">Failed to load crops</h3>
                    <p className="mt-1 text-sm text-gray-400">{(error as Error).message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Available Crops</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search crops..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            />
                        </div>
                        <button className="relative text-gray-400 transition-colors hover:text-gray-600">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-green-500" />
                    </div>
                </header>

                {/* District Filter Tabs */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="flex gap-2 px-8 py-3">
                        {DISTRICTS.map((district) => (
                            <button
                                key={district}
                                onClick={() => setActiveDistrict(district)}
                                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${activeDistrict === district
                                    ? 'bg-green-500 text-white'
                                    : 'border border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:text-green-600'
                                    }`}
                            >
                                {district}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Browse Crops</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Fresh produce from verified Kerala farmers on the ONDC network
                            </p>
                        </div>
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-semibold text-gray-700">{filteredCrops.length}</span> crops
                        </p>
                    </div>

                    {/* Crop Grid */}
                    {filteredCrops.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredCrops.map((crop) => (
                                <CropCard
                                    key={crop.id}
                                    {...crop}
                                    onPlaceBid={() => handlePlaceBid(crop)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="mb-3 text-4xl">🌾</span>
                            <h3 className="text-lg font-semibold text-gray-700">No crops found</h3>
                            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Bid Modal */}
            <PlaceBidModal
                isOpen={bidModalOpen}
                onClose={() => setBidModalOpen(false)}
                onSubmit={handleBidSubmit}
                cropName={selectedCrop?.name}
                cropId={selectedCrop ? String(selectedCrop.id) : undefined}
                totalQuantity={selectedCrop?.quantity}
            />

            {/* Success Toast */}
            <SuccessToast
                message="Bid submitted successfully"
                subtitle="The farmer has been notified of your offer."
                isVisible={showToast}
                onClose={handleCloseToast}
            />
        </div>
    )
}
