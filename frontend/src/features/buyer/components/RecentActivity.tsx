const activities = [
    {
        icon: '🔵',
        iconBg: 'bg-blue-50',
        title: 'Simulation #482 Completed',
        detail: '2 mins ago • Result: +4.2% yield',
    },
    {
        icon: '⚠️',
        iconBg: 'bg-amber-50',
        title: 'Price Drift Detected',
        detail: '1 hour ago • buyer_103 segment',
    },
    {
        icon: '🟢',
        iconBg: 'bg-green-50',
        title: 'AI Model Updated',
        detail: '5 hours ago • Version v2.41',
    },
]

export function RecentActivity() {
    return (
        <div className="w-80 shrink-0 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-gray-900">Recent Activity</h3>
            <div className="flex flex-col gap-5">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconBg} text-sm`}
                        >
                            {activity.icon}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{activity.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                View All Logs
            </button>
        </div>
    )
}
