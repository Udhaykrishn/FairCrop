const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

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
