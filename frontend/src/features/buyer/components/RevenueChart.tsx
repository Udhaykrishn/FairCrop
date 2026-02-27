import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

const data = [
    { name: 'WHEAT', current: 45, previous: 30 },
    { name: 'RICE', current: 65, previous: 50 },
    { name: 'MAIZE', current: 55, previous: 35 },
    { name: 'COTTON', current: 85, previous: 70 },
    { name: 'PULSES', current: 75, previous: 55 },
]

export function RevenueChart() {
    return (
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                    Revenue Breakdown (Crop Categories)
                </h3>
                <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500">
                    Last 30 Days
                </span>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={4} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                        />
                        <YAxis hide />
                        <Bar dataKey="previous" radius={[4, 4, 0, 0]} barSize={24}>
                            {data.map((_, index) => (
                                <Cell key={`prev-${index}`} fill="#dcfce7" />
                            ))}
                        </Bar>
                        <Bar dataKey="current" radius={[4, 4, 0, 0]} barSize={24}>
                            {data.map((_, index) => (
                                <Cell key={`curr-${index}`} fill="#22c55e" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
