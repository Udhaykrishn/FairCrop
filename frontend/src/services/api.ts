const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
// Farmer routes live at /api/farmer — separate prefix from /api/v1
const FARMER_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1')
    .replace('/api/v1', '/api/farmer')

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
    id: string
    name: string
    pricePerKg: number
    unit: string
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

export const farmerService = {
    /** GET /api/farmer/get-farmer — returns all farmers */
    getAll: async (): Promise<Farmer[]> => {
        const res = await farmerRequest<FarmerListResponse>('/get-farmer')
        return res.data
    },
}
