const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
// Farmer routes live at /api/farmer — separate prefix from /api
const FARMER_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api')
    .replace('/api', '/api/farmer')

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers as Record<string, string>),
        },
        ...options,
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(error || `HTTP error ${response.status}`)
    }

    return response.json() as Promise<T>
}

async function farmerRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${FARMER_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) },
        ...options,
    })
    if (!response.ok) {
        const error = await response.text()
        throw new Error(error || `HTTP error ${response.status}`)
    }
    return response.json() as Promise<T>
}

// --- Crops API ---

export interface Crop {
    _id: string
    farmerId: string
    crop: string
    quantity: number
    location: {
        lat: number
        lon: number
    }
    isSold: boolean
    reservedPrice: number
    finalPrice: number
    createdAt: string
    updatedAt: string
}

export const cropsService = {
    getAll: (): Promise<Crop[]> => request<Crop[]>('/crops'),
    getById: (id: string): Promise<Crop> => request<Crop>(`/crops/${id}`),
}

// --- Farmer API ---

export interface Farmer {
    _id: string
    name: string
    role: string
    phone: string
    createdAt: string
    updatedAt: string
}

interface FarmerListResponse {
    success: boolean
    message: string
    data: Farmer[]
}

interface FarmerCropsResponse {
    success: boolean
    data: Crop[]
}

export const farmerService = {
    getallCrops: async (): Promise<Crop[]> => {
        const res = await request<FarmerCropsResponse>('/farmer/get-crops')
        return res.data
    },
    /** GET /api/farmer/get-farmer — returns all farmers */
    getAll: async (): Promise<Farmer[]> => {
        const res = await farmerRequest<FarmerListResponse>('/get-farmer')
        return res.data
    },
}

// --- Negotiation API ---

export interface Message {
    id: string
    role: 'ai' | 'buyer'
    text: string
    timestamp: string
}

export interface Negotiation {
    _id: string
    crop: {
        crop: string
    }
    currentPrice: number
    quantity: number
    status: string
}

interface MessagesResponse {
    success: boolean
    data: Message[]
}

interface NegotiationResponse {
    success: boolean
    data: Negotiation
}

interface SendMessageResponse {
    success: boolean
    data: Message
}

export const negotiationService = {
    /** GET /api/negotiations/:id/messages */
    getMessages: async (negotiationId: string): Promise<Message[]> => {
        const res = await request<MessagesResponse>(`/negotiations/${negotiationId}/messages`)
        // Map backend ChatMessage to frontend Message
        return (res.data as any[]).map((msg: any, idx: number) => ({
            id: msg.id || `${idx}`,
            role: msg.role === 'user' ? 'buyer' : 'ai',
            text: msg.content,
            timestamp: msg.timestamp || new Date().toISOString()
        }))
    },

    /** GET /api/negotiations/:id */
    getById: async (negotiationId: string): Promise<Negotiation> => {
        const res = await request<NegotiationResponse>(`/negotiations/${negotiationId}`)
        const data = res.data as any
        return {
            _id: negotiationId,
            crop: { crop: data.cropDetails?.crop || 'Unknown' },
            currentPrice: data.currentPrice || 0,
            quantity: data.cropDetails?.quantity || 0,
            status: data.status || 'active'
        }
    },

    /** POST /api/negotiations/:id/messages */
    sendMessage: async (negotiationId: string, text: string): Promise<Message> => {
        const res = await request<SendMessageResponse>(`/negotiations/${negotiationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message: text }), // Backend uses 'message' field
        })
        const data = res.data as any
        // Backend returns the full updated session or the last message
        // Based on NegotiatonController, it returns updatedSession
        const lastMsg = data.messages[data.messages.length - 1]
        return {
            id: lastMsg.id || `${Date.now()}`,
            role: lastMsg.role === 'user' ? 'buyer' : 'ai',
            text: lastMsg.content,
            timestamp: lastMsg.timestamp || new Date().toISOString()
        }
    },
}

// --- Offer API ---

interface OfferResponse {
    success: boolean
    message: string
    data: any
}

export const offerService = {
    create: async (data: any): Promise<any> => {
        const res = await request<OfferResponse>('/offers', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        return res.data
    },
}
