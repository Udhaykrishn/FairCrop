import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { offerService } from '@/services/api'

interface PlaceBidModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
    cropName?: string
    cropId?: string
    quantity?: number
    location?: { lat: number; lon: number }
}

export function PlaceBidModal({
    isOpen,
    onClose,
    onSubmit,
    cropName = 'Premium Wayanad Pepper',
    cropId = 'crop_001',
    quantity = 0,
    location = { lat: 0, lon: 0 }
}: PlaceBidModalProps) {
    const [district, setDistrict] = useState('')
    const [price, setPrice] = useState('')
    const [bidQuantity, setBidQuantity] = useState(quantity.toString())
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Sync bidQuantity with quantity prop when modal opens/crop changes
    useEffect(() => {
        setBidQuantity(quantity.toString())
    }, [quantity, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const requestedQty = Number(bidQuantity)

        if (!price || Number(price) <= 0) {
            setError('Please enter a valid price.')
            return
        }

        if (!bidQuantity || requestedQty <= 0) {
            setError('Please enter a valid quantity.')
            return
        }

        if (requestedQty > quantity) {
            setError(`Requested quantity cannot exceed available stock (${quantity} kg).`)
            return
        }

        setIsSubmitting(true)
        try {
            // Ensure location is in the format the backend expects {lat, lon}
            // even if it was passed as a string from the parent
            const locationPayload = (location && typeof location === 'object' && 'lat' in location)
                ? location
                : { lat: 0, lon: 0 }

            const payload: any = {
                cropId,
                quantity: requestedQty,
                price: Number(price),
                location: locationPayload
            }

            const res = await offerService.create(payload)

            console.log('Offer placed:', res)
            onSubmit()
            onClose()

            // The backend returns { success: true, message: "...", data: { negotiationId, ... } }
            // offerService.create returns res.data
            const negotiationId = res.negotiationId || res._id || res.id
            if (!negotiationId) {
                console.warn('No negotiation ID returned, staying on page')
                return
            }

            navigate({
                to: '/buyer/negotiate',
                search: { id: negotiationId }
            })
        } catch (err: any) {
            console.error('Bid error:', err)
            setError(err.message || 'An unexpected error occurred.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
                    <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
                    <p className="mt-1 text-sm text-gray-500">Negotiating for <span className="font-semibold text-green-600">{cropName}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6">
                    <div className="space-y-5">
                        {/* Quantity Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Available Quantity
                                </label>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 font-medium">
                                    {quantity} kg
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    Your Requested Quantity (kg)
                                </label>
                                <input
                                    type="number"
                                    required
                                    max={quantity}
                                    min={1}
                                    value={bidQuantity}
                                    onChange={(e) => setBidQuantity(e.target.value)}
                                    placeholder="Qty in kg"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    District
                                </label>
                                <input
                                    type="text"
                                    value={district || 'Wayanad'}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    placeholder="Enter district"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        </div>

                        {/* Price Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Your Price (per kg)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Enter your offer price"
                                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500">Suggested: ₹{quantity ? '65-75' : '---'}/kg</p>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Message (Optional)
                            </label>
                            <textarea
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Any specific requirements or questions..."
                                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 flex items-center gap-2 text-xs text-red-600 border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-1">
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-50 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Confirm Bid'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
