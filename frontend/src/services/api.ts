const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
// Farmer routes use a different prefix: /api/farmer (not /api/v1)
const FARMER_BASE_URL = '/api/farmer'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
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
        headers: { 'Content-Type': 'application/json', ...options?.headers },
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

export interface CropListing {
    _id: string
    farmerId: string
    crop: string
    quantity: number
    location: { lat: number; lon: number }
    reservedPrice: number
    finalPrice: number
    isSold: boolean
    createdAt: string
    updatedAt: string
}

export interface ListCropPayload {
    farmerId: string
    crop: string
    quantity: number
    location: { lat: number; lon: number }
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

interface ListCropResponse {
    success: boolean
    message: string
    data: CropListing
}

export const farmerService = {
    getAllCrops: async (): Promise<Crop[]> => {
        const res = await request<FarmerCropsResponse>('/farmer/get-crops')
        return res.data
    },
    /** GET /api/farmer/get-farmer — returns all farmers */
    getAll: async (): Promise<Farmer[]> => {
        const res = await farmerRequest<FarmerListResponse>('/get-farmer')
        return res.data
    },
    /** POST /api/farmer/list-crop — create new crop listing, returns crop with reservedPrice */
    listCrop: async (payload: ListCropPayload): Promise<CropListing> => {
        const res = await farmerRequest<ListCropResponse>('/list-crop', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
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
    /** GET /api/v1/negotiations/:id/messages */
    getMessages: async (negotiationId: string): Promise<Message[]> => {
        const res = await request<MessagesResponse>(`/negotiations/${negotiationId}/messages`)
        return res.data
    },

    /** GET /api/v1/negotiations/:id */
    getById: async (negotiationId: string): Promise<Negotiation> => {
        const res = await request<NegotiationResponse>(`/negotiations/${negotiationId}`)
        return res.data
    },

    /** POST /api/v1/negotiations/:id/messages */
    sendMessage: async (negotiationId: string, text: string): Promise<Message> => {
        const res = await request<SendMessageResponse>(`/negotiations/${negotiationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        })
        return res.data
    },
}
