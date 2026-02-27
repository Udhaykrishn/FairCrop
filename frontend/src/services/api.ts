const API_BASE_URL = 'http://localhost:3000/api'

interface BackendResponse<T> {
    success: boolean
    message: string
    data: T
    errors: any
}

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

    const result = (await response.json()) as BackendResponse<T>
    if (!result.success) {
        throw new Error(result.message || 'API request failed')
    }
    return result.data
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

// --- Negotiation API ---

export interface Message {
    id: string
    negotiationId: string
    role: 'buyer' | 'ai'
    text: string
    timestamp: string
}

export interface Negotiation {
    id: string
    cropId: string
    buyerId: string
    status: 'active' | 'completed' | 'cancelled'
    currentPrice: number
    quantity: number
    crop: Crop
}

export const negotiationService = {
    getById: (id: string): Promise<Negotiation> => request<Negotiation>(`/negotiations/${id}`),
    getMessages: (id: string): Promise<Message[]> => request<Message[]>(`/negotiations/${id}/messages`),
    sendMessage: (id: string, text: string): Promise<Message> =>
        request<Message>(`/negotiations/${id}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        }),
}

export const farmerService = {
    getallCrops: (): Promise<Crop[]> => request<Crop[]>('/farmer/get-crops'),
}

export const cropsService = {
    getAll: (): Promise<Crop[]> => request<Crop[]>('/crops'),
    getById: (id: string): Promise<Crop> => request<Crop>(`/crops/${id}`),
}
