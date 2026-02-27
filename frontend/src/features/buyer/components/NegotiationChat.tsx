import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────
interface Message {
    id: number
    role: 'buyer' | 'ai'
    text: string
    timestamp: string
}

interface Crop {
    id: number
    name: string
    priceRange: string
    quantity: string
    location: string
}

// ─── Mock Data ───────────────────────────────────────────────────
const CROPS: Crop[] = [
    { id: 1, name: 'Premium Wayanad Pepper', priceRange: '₹480 - ₹560', quantity: '500 kg', location: 'Wayanad, Kerala' },
    { id: 2, name: 'Idukki Cardamom', priceRange: '₹1,200 - ₹1,450', quantity: '200 kg', location: 'Idukki, Kerala' },
    { id: 3, name: 'Wayanad Robusta Coffee', priceRange: '₹220 - ₹280', quantity: '1,000 kg', location: 'Wayanad, Kerala' },
    { id: 4, name: 'Kerala Red Rice', priceRange: '₹65 - ₹85', quantity: '2,000 kg', location: 'Palakkad, Kerala' },
    { id: 5, name: 'Wayanad Vanilla', priceRange: '₹25,000 - ₹35,000', quantity: '50 kg', location: 'Wayanad, Kerala' },
    { id: 6, name: 'Thrissur Turmeric', priceRange: '₹120 - ₹160', quantity: '300 kg', location: 'Thrissur, Kerala' },
]

const AI_RESPONSES: Record<string, string[]> = {
    greeting: [
        "Hello! I'm FairCrop's AI negotiation agent. I see you're interested in **{crop}**. The current market range is **{price}** for **{qty}** available. What price per kg are you considering?",
    ],
    counter_lower: [
        "I appreciate the offer, but **{crop}** has strong demand this season. I can bring it down to the mid-range at **{price}** — that's already 5% below the average market rate. Shall we close at this price?",
        "That's a competitive offer! However, considering the premium quality and organic certification, I'd suggest **{price}** as a fair middle ground. This still saves you about 8% compared to other buyers.",
    ],
    accept: [
        "Excellent! 🎉 We have a deal. I'll lock in your order for **{crop}** at the agreed price. You'll receive a confirmation with pickup/delivery details within 24 hours.",
    ],
    bulk_discount: [
        "Great thinking! For a bulk order of the full **{qty}**, I can offer an additional **3% discount**, bringing the effective price to roughly **{price}** per kg. This is our best bulk rate.",
        "Bulk orders are always welcome! If you commit to the entire **{qty}** lot, I can negotiate a **4% volume discount** from the seller. That would put your cost at approximately **{price}** per kg.",
    ],
    general: [
        "That's an interesting point. Based on current ONDC market data, similar quality **{crop}** is trading at **{price}**. I'll see if the farmer is flexible — would you be open to a slight increase from your side?",
        "I understand your position. Let me check what the farmer says. In the meantime, I should mention that **{crop}** from **{location}** tends to have 15-20% higher curcumin content, which justifies a premium.",
        "Good point! Let me factor that in. Considering logistics to your location and the current supply, I think we can find a middle ground. How about we split the difference?",
    ],
}

function getAIResponse(crop: Crop, type: string): string {
    const templates = AI_RESPONSES[type] || AI_RESPONSES.general
    const template = templates[Math.floor(Math.random() * templates.length)]
    return template
        .replace(/\{crop\}/g, crop.name)
        .replace(/\{price\}/g, crop.priceRange)
        .replace(/\{qty\}/g, crop.quantity)
        .replace(/\{location\}/g, crop.location)
}

function classifyMessage(text: string): string {
    const lower = text.toLowerCase()
    if (lower.includes('accept') || lower.includes('deal') || lower.includes('agree')) return 'accept'
    if (lower.includes('lower') || lower.includes('less') || lower.includes('reduce') || lower.includes('counter')) return 'counter_lower'
    if (lower.includes('bulk') || lower.includes('discount') || lower.includes('volume')) return 'bulk_discount'
    return 'general'
}

function formatTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// ─── Quick Action Chips ──────────────────────────────────────────
const QUICK_ACTIONS = [
    { label: 'Counter ₹50 lower', text: "I'd like to counter with a price ₹50 lower per kg." },
    { label: 'Request bulk discount', text: 'Can I get a bulk discount if I buy the entire lot?' },
    { label: 'Accept offer', text: "I accept the current offer. Let's close the deal!" },
    { label: 'Ask market price', text: 'What is the current market price trend for this crop?' },
]

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

function ChevronDownIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
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
                    {message.timestamp}
                </p>
            </div>
        </div>
    )
}

// ─── Main Component ──────────────────────────────────────────────
export function NegotiationChat() {
    const [selectedCrop, setSelectedCrop] = useState<Crop>(CROPS[0])
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [negotiationStarted, setNegotiationStarted] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    let nextId = useRef(1)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Start negotiation when crop is selected
    const startNegotiation = useCallback((crop: Crop) => {
        setSelectedCrop(crop)
        setMessages([])
        setNegotiationStarted(true)
        setIsTyping(true)

        setTimeout(() => {
            const greeting: Message = {
                id: nextId.current++,
                role: 'ai',
                text: getAIResponse(crop, 'greeting'),
                timestamp: formatTime(),
            }
            setMessages([greeting])
            setIsTyping(false)
        }, 1200)
    }, [])

    // Start on mount
    useEffect(() => {
        if (!negotiationStarted) {
            startNegotiation(CROPS[0])
        }
    }, [negotiationStarted, startNegotiation])

    const sendMessage = useCallback((text: string) => {
        if (!text.trim() || isTyping) return

        const buyerMsg: Message = {
            id: nextId.current++,
            role: 'buyer',
            text: text.trim(),
            timestamp: formatTime(),
        }
        setMessages(prev => [...prev, buyerMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        const delay = 1000 + Math.random() * 1500
        setTimeout(() => {
            const type = classifyMessage(text)
            const aiMsg: Message = {
                id: nextId.current++,
                role: 'ai',
                text: getAIResponse(selectedCrop, type),
                timestamp: formatTime(),
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
            inputRef.current?.focus()
        }, delay)
    }, [isTyping, selectedCrop])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const crop = CROPS.find(c => c.id === Number(e.target.value))
        if (crop) startNegotiation(crop)
    }

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
                            <p className="text-xs text-green-500 font-medium">Online · Ready to negotiate</p>
                        </div>
                    </div>

                    {/* Crop selector */}
                    <div className="relative">
                        <select
                            value={selectedCrop.id}
                            onChange={handleCropChange}
                            className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                        >
                            {CROPS.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>

                {/* Crop info bar */}
                <div className="mt-3 flex items-center gap-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 border border-green-100">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Crop</span>
                        <span className="text-xs font-semibold text-gray-800">{selectedCrop.name}</span>
                    </div>
                    <div className="h-3 w-px bg-green-200" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Price</span>
                        <span className="text-xs font-semibold text-green-700">{selectedCrop.priceRange}</span>
                    </div>
                    <div className="h-3 w-px bg-green-200" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Qty</span>
                        <span className="text-xs font-semibold text-gray-800">{selectedCrop.quantity}</span>
                    </div>
                    <div className="h-3 w-px bg-green-200" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Location</span>
                        <span className="text-xs font-semibold text-gray-800">{selectedCrop.location}</span>
                    </div>
                </div>
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

            {/* ── Quick Actions ────────────────────────────── */}
            <div className="border-t border-gray-100 bg-white px-6 py-2.5">
                <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto pb-0.5">
                    {QUICK_ACTIONS.map(action => (
                        <button
                            key={action.label}
                            onClick={() => sendMessage(action.text)}
                            disabled={isTyping}
                            className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-700 transition-all hover:bg-green-100 hover:border-green-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {action.label}
                        </button>
                    ))}
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
                        disabled={isTyping}
                        placeholder={isTyping ? 'AI is responding...' : 'Type your negotiation message...'}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}
