import { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { negotiationService, type Message, type Negotiation } from '@/services/api'

// ─── Icons ───────────────────────────────────────────────────────
function SendIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function BotIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="8" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="14" r="1.5" fill="currentColor" />
            <circle cx="15" cy="14" r="1.5" fill="currentColor" />
            <path d="M12 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="2" r="1" fill="currentColor" />
            <path d="M1 14h2M21 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}


// ─── Typing Indicator ────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="flex items-end gap-2.5 animate-[fadeInUp_0.3s_ease]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-sm">
                <BotIcon />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-white px-5 py-3.5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-[typingBounce_1.4s_ease-in-out_infinite]" />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-[typingBounce_1.4s_ease-in-out_0.2s_infinite]" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-[typingBounce_1.4s_ease-in-out_0.4s_infinite]" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    )
}

// ─── Message Bubble ──────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
    const isAI = message.role === 'ai'

    // parse simple **bold** markdown
    const parts = message.text.split(/(\*\*[^*]+\*\*)/g)
    const rendered = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
    })

    return (
        <div className={`flex items-end gap-2.5 animate-[fadeInUp_0.3s_ease] ${isAI ? '' : 'flex-row-reverse'}`}>
            {isAI ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-sm">
                    <BotIcon />
                </div>
            ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm text-xs font-bold">
                    B
                </div>
            )}
            <div className={`max-w-[75%] ${isAI ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl rounded-br-md'}`}>
                <div
                    className={`px-4 py-3 text-sm leading-relaxed ${isAI
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        } ${isAI ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl rounded-br-md'}`}
                >
                    {rendered}
                </div>
                <p className={`mt-1 text-[10px] text-gray-400 ${isAI ? 'ml-1' : 'mr-1 text-right'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
            </div>
        </div>
    )
}

// ─── Main Component ──────────────────────────────────────────────
export function NegotiationChat() {
    const search = useSearch({ from: '/buyer/negotiate' }) as { id?: string }
    const negotiationId = search.id
    const queryClient = useQueryClient()

    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fetch messages
    const { data: messages = [], isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', negotiationId],
        queryFn: () => negotiationService.getMessages(negotiationId!),
        enabled: !!negotiationId,
    })

    // Fetch negotiation details
    const { data: negotiation, isLoading: negotiationLoading } = useQuery({
        queryKey: ['negotiation', negotiationId],
        queryFn: () => negotiationService.getById(negotiationId!),
        enabled: !!negotiationId,
    })

    // Send message mutation
    const { mutate: sendMessage, isPending: isSending } = useMutation({
        mutationFn: (text: string) => negotiationService.sendMessage(negotiationId!, text),
        onSuccess: () => {
            setInput('')
            queryClient.invalidateQueries({ queryKey: ['messages', negotiationId] })
        },
    })

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-send initial message if chat is empty
    const initialSentRef = useRef(false)
    useEffect(() => {
        if (!messagesLoading && !negotiationLoading && messages.length === 0 && negotiation && !initialSentRef.current) {
            initialSentRef.current = true
            const initialMessageText = `I would like to offer ₹${negotiation.currentPrice}/kg for ${negotiation.quantity} kg.`
            sendMessage(initialMessageText)
        }
    }, [messages, messagesLoading, negotiation, negotiationLoading, sendMessage])

    const handleSendMessage = useCallback(() => {
        if (!input.trim() || isSending) return
        sendMessage(input.trim())
    }, [input, isSending, sendMessage])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!negotiationId) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 text-gray-500">
                Please select a valid negotiation.
            </div>
        )
    }

    if (negotiationLoading || messagesLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-500 text-sm">Initializing secure chat...</p>
                </div>
            </div>
        )
    }

    const isTyping = messages.length > 0 && messages[messages.length - 1].role === 'buyer'

    return (
        <div className="flex h-full flex-col">
            {/* ── Chat Header ─────────────────────────────── */}
            <div className="border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md">
                                <BotIcon />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">FairCrop AI Agent</h3>
                            <p className="text-xs text-green-500 font-medium">Online · Negotiating for {negotiation?.crop.crop}</p>
                        </div>
                    </div>
                </div>

                {/* Crop info bar */}
                {negotiation && (
                    <div className="mt-3 flex items-center gap-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 border border-green-100">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Crop</span>
                            <span className="text-xs font-semibold text-gray-800">{negotiation.crop.crop}</span>
                        </div>
                        <div className="h-3 w-px bg-green-200" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Target Price</span>
                            <span className="text-xs font-semibold text-green-700">₹{negotiation.currentPrice}/kg</span>
                        </div>
                        <div className="h-3 w-px bg-green-200" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Qty</span>
                            <span className="text-xs font-semibold text-gray-800">{negotiation.quantity} kg</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Messages Area ───────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6">
                <div className="mx-auto max-w-2xl space-y-5">
                    {messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ── Input Bar ───────────────────────────────── */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
                <div className="mx-auto flex max-w-2xl items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                        placeholder={isSending ? 'Sending...' : 'Type your negotiation message...'}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isSending}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}
