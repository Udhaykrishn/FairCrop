interface CropCardProps {
    name: string
    variety: string
    location: string
    quantity: string
    priceRange: string
    farmer: string
    rating: number
    image: string
    tags: string[]
    onPlaceBid: () => void
}

export function CropCard({
    name,
    variety,
    location,
    quantity,
    priceRange,
    farmer,
    rating,
    image,
    tags,
    onPlaceBid,
}: CropCardProps) {
    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700 backdrop-blur-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                    <span className="text-amber-400">★</span>
                    <span className="text-gray-700">{rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-1 flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                        <p className="text-xs text-gray-400">{variety}</p>
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="10" r="3" />
                            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
                        </svg>
                        {location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        {farmer}
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase">Available</p>
                        <p className="text-sm font-semibold text-gray-900">{quantity}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-gray-400 uppercase">Price/KG</p>
                        <p className="text-sm font-semibold text-green-600">{priceRange}</p>
                    </div>
                </div>

                <button
                    onClick={onPlaceBid}
                    className="mt-3 w-full rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                >
                    Place Bid
                </button>
            </div>
        </div>
    )
}
