import { Sidebar } from '@/features/buyer/components/Sidebar'
import { NegotiationChat } from '@/features/buyer/components/NegotiationChat'

export function NegotiationChatPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <NegotiationChat />
            </div>
        </div>
    )
}
