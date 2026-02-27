import type { ReactNode } from 'react'

interface StatCardProps {
    label: string
    value: string
    change: string
    icon: ReactNode
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    {label}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-500">
                    {icon}
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-green-500">📈</span>
                <span className="text-sm font-medium text-green-500">{change}</span>
            </div>
        </div>
    )
}
