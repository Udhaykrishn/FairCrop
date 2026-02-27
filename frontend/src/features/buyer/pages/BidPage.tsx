import { useState, useCallback } from 'react'
import { useSearch } from '@tanstack/react-router'
import { PlaceBidModal } from '@/features/buyer/components/PlaceBidModal'
import { SuccessToast } from '@/features/buyer/components/SuccessToast'

export function BidPage() {
    const search = useSearch({ from: '/buyer/bid' }) as {
        cropId?: string
        cropName?: string
        quantity?: number
        lat?: number
        lon?: number
    }

    const [isModalOpen, setIsModalOpen] = useState(true)
    const [showToast, setShowToast] = useState(false)

    const handleBidSubmit = useCallback(() => {
        setShowToast(true)
    }, [])

    const handleCloseToast = useCallback(() => {
        setShowToast(false)
    }, [])

    return (
        <div className="min-h-screen bg-gray-900/80">
            {/* Background — simulating the blurred page behind the modal */}
            <header className="border-b border-gray-700 bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-white">FairCrop AI</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Filter: Wayanad</span>
                    </div>
                </div>
            </header>
            <div className="flex gap-2 px-6 py-3">
                <span className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-semibold text-white">All Crops</span>
                <span className="rounded-full border border-gray-600 px-4 py-1.5 text-xs font-medium text-gray-400">Wayanad</span>
                <span className="rounded-full border border-gray-600 px-4 py-1.5 text-xs font-medium text-gray-400">More</span>
            </div>

            {/* Modal */}
            <PlaceBidModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleBidSubmit}
                cropId={search.cropId}
                cropName={search.cropName}
                quantity={search.quantity}
                location={search.lat && search.lon ? { lat: search.lat, lon: search.lon } : undefined}
            />

            {/* Reopen button when modal is closed */}
            {!isModalOpen && (
                <div className="flex items-center justify-center pt-32">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                    >
                        Place a Bid
                    </button>
                </div>
            )}

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
