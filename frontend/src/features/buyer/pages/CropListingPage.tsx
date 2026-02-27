import { useState, useCallback } from 'react'
import { CropCard } from '@/features/buyer/components/CropCard'
import { PlaceBidModal } from '@/features/buyer/components/PlaceBidModal'
import { SuccessToast } from '@/features/buyer/components/SuccessToast'
import { Sidebar } from '@/features/buyer/components/Sidebar'

const CROPS = [
    {
        id: 1,
        name: 'Premium Wayanad Pepper',
        variety: 'Malabar Black Pepper',
        location: 'Wayanad, Kerala',
        quantity: '500 kg',
        priceRange: '₹480 - ₹560',
        farmer: 'Rajan Kumar',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&h=300&fit=crop',
        tags: ['Organic', 'Premium'],
    },
    {
        id: 2,
        name: 'Idukki Cardamom',
        variety: 'Elettaria Cardamomum',
        location: 'Idukki, Kerala',
        quantity: '200 kg',
        priceRange: '₹1,200 - ₹1,450',
        farmer: 'Suresh Menon',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
        tags: ['Grade A', 'Export'],
    },
    {
        id: 3,
        name: 'Wayanad Robusta Coffee',
        variety: 'Robusta Cherry AB',
        location: 'Wayanad, Kerala',
        quantity: '1,000 kg',
        priceRange: '₹220 - ₹280',
        farmer: 'Priya Nair',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
        tags: ['Fair Trade'],
    },
    {
        id: 4,
        name: 'Kerala Red Rice',
        variety: 'Matta Rice (Palakkadan)',
        location: 'Palakkad, Kerala',
        quantity: '2,000 kg',
        priceRange: '₹65 - ₹85',
        farmer: 'Vijay Krishnan',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
        tags: ['Traditional', 'GI Tagged'],
    },
    {
        id: 5,
        name: 'Wayanad Vanilla',
        variety: 'Planifolia',
        location: 'Wayanad, Kerala',
        quantity: '50 kg',
        priceRange: '₹25,000 - ₹35,000',
        farmer: 'Lakshmi Devi',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1631209121750-a9f656d30ce6?w=400&h=300&fit=crop',
        tags: ['Rare', 'Premium'],
    },
    {
        id: 6,
        name: 'Kannur Coconut',
        variety: 'West Coast Tall',
        location: 'Kannur, Kerala',
        quantity: '5,000 units',
        priceRange: '₹18 - ₹25',
        farmer: 'Mohan Das',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
        tags: ['Bulk'],
    },
    {
        id: 7,
        name: 'Kottayam Rubber',
        variety: 'RRII 105',
        location: 'Kottayam, Kerala',
        quantity: '800 kg',
        priceRange: '₹155 - ₹180',
        farmer: 'Thomas Cherian',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
        tags: ['Industrial'],
    },
    {
        id: 8,
        name: 'Thrissur Turmeric',
        variety: 'Lakadong',
        location: 'Thrissur, Kerala',
        quantity: '300 kg',
        priceRange: '₹120 - ₹160',
        farmer: 'Anitha Balan',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',
        tags: ['Organic', 'Medicinal'],
    },
]

const DISTRICTS = ['All Districts', 'Wayanad', 'Idukki', 'Palakkad', 'Kannur', 'Kottayam', 'Thrissur']

export function CropListingPage() {
    const [activeDistrict, setActiveDistrict] = useState('All Districts')
    const [searchQuery, setSearchQuery] = useState('')
    const [bidModalOpen, setBidModalOpen] = useState(false)
    const [selectedCrop, setSelectedCrop] = useState<(typeof CROPS)[0] | null>(null)
    const [showToast, setShowToast] = useState(false)

    const filteredCrops = CROPS.filter((crop) => {
        const matchesDistrict =
            activeDistrict === 'All Districts' || crop.location.includes(activeDistrict)
        const matchesSearch =
            !searchQuery ||
            crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crop.variety.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesDistrict && matchesSearch
    })

    const handlePlaceBid = useCallback((crop: (typeof CROPS)[0]) => {
        setSelectedCrop(crop)
        setBidModalOpen(true)
    }, [])

    const handleBidSubmit = useCallback(() => {
        setShowToast(true)
    }, [])

    const handleCloseToast = useCallback(() => {
        setShowToast(false)
    }, [])

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
