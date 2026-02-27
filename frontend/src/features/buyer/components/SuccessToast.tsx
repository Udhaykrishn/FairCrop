import { useEffect } from 'react'

interface SuccessToastProps {
    message: string
    subtitle?: string
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export function SuccessToast({
    message,
    subtitle,
    isVisible,
    onClose,
    duration = 4000,
}: SuccessToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose, duration])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3.5 shadow-2xl">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{message}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400">{subtitle}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="ml-3 text-gray-400 transition-colors hover:text-gray-200"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
