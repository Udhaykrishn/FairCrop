export function HomePage() {
    return (
        <div className="flex flex-col items-center gap-8 py-16 text-center">
            <div className="flex flex-col items-center gap-4">
                <span className="text-6xl">🌾</span>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome to <span className="text-green-600 dark:text-green-400">FairCrop</span>
                </h1>
                <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
                    Empowering farmers with AI-driven insights to get fair prices for their crops and make
                    smarter decisions.
                </p>
            </div>

            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { icon: '📊', title: 'Market Insights', desc: 'Real-time crop price analytics' },
                    { icon: '🤖', title: 'AI Predictions', desc: 'Smart price forecasting' },
                    { icon: '🤝', title: 'Fair Trade', desc: 'Connect with trusted buyers' },
                ].map((card) => (
                    <div
                        key={card.title}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="mb-2 text-3xl">{card.icon}</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
