export function AboutPage() {
    return (
        <div className="mx-auto max-w-2xl py-12">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">About FairCrop</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                FairCrop is an AI-powered agricultural platform designed to bridge the gap between farmers
                and fair market prices. We leverage machine learning and real-time data to ensure farmers
                receive just compensation for their produce.
            </p>

            <div className="space-y-4">
                {[
                    { label: 'Mission', value: 'Fair prices for every farmer' },
                    { label: 'Vision', value: 'A transparent agricultural economy' },
                    { label: 'Stack', value: 'React · TanStack · Tailwind · FastAPI' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                        <span className="w-24 shrink-0 font-semibold text-green-600 dark:text-green-400">
                            {item.label}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
