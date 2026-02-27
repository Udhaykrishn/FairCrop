import { useState } from 'react'

interface PlaceBidModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
    cropName?: string
    cropId?: string
    totalQuantity?: string
}

export function PlaceBidModal({
    isOpen,
    onClose,
    onSubmit,
    cropName = 'Premium Wayanad Pepper',
    cropId = 'crop_001',
    totalQuantity = '500 kg',
}: PlaceBidModalProps) {
    const [district, setDistrict] = useState('')
    const [price, setPrice] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async () => {
        setError('')

        if (!district) {
            setError('Please select a delivery district.')
            return
        }
        if (!price || Number(price) <= 0) {
            setError('Please enter a valid offer price.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('http://localhost:4000/api/v1/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cropId,
                    totalQuantity,
                    district,
                    offerPrice: Number(price),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.errors?.join(', ') || 'Failed to submit offer.')
                return
            }

            console.log('Offer placed:', data)
            onSubmit()
            onClose()
        } catch {
            setError('Network error. Please check if the server is running.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white px-8 py-7 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 transition-colors hover:text-gray-600"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Header */}
                <h2 className="text-xl font-bold text-gray-900">Place a Bid</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Submit your offer to the ONDC agricultural network.
                </p>

                {/* Form */}
                <div className="mt-6 space-y-5">
                    {/* Crop Name + Total Quantity */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                Crop Name
                            </label>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700">
                                {cropName}
                            </div>
                        </div>
                        <div className="w-32">
                            <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                Total Quantity
                            </label>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700">
                                {totalQuantity}
                            </div>
                        </div>
                    </div>

                    {/* Kerala District / Delivery Location */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                Kerala District / Delivery Location
                            </label>
                            <button className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-green-500 uppercase hover:text-green-600">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v8M8 12h8" />
                                </svg>
                                Manage Districts
                            </button>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
                                </svg>
                            </span>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            >
                                <option value="">Select Delivery District</option>
                                <option value="thiruvananthapuram">Thiruvananthapuram</option>
                                <option value="kollam">Kollam</option>
                                <option value="pathanamthitta">Pathanamthitta</option>
                                <option value="alappuzha">Alappuzha</option>
                                <option value="kottayam">Kottayam</option>
                                <option value="idukki">Idukki</option>
                                <option value="ernakulam">Ernakulam</option>
                                <option value="thrissur">Thrissur</option>
                                <option value="palakkad">Palakkad</option>
                                <option value="malappuram">Malappuram</option>
                                <option value="kozhikode">Kozhikode</option>
                                <option value="wayanad">Wayanad</option>
                                <option value="kannur">Kannur</option>
                                <option value="kasaragod">Kasaragod</option>
                            </select>
                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            Select where the crop will be delivered for logistics calculation.
                        </p>
                    </div>

                    {/* Offer Price Per KG */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                            Offer Price Per KG (₹)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                            />
                        </div>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            Recommended market price: ₹480 - ₹560
                        </p>
                    </div>

                    {/* Message to Farmer */}
                    <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                            Message to Farmer (Optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Add any specific requirements or logistics notes..."
                            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                        {!isSubmitting && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
