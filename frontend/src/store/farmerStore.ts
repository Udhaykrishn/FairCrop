import type { Farmer } from '@/services/api'

const STORAGE_KEY = 'faircrop_farmer'

/**
 * Lightweight localStorage-backed farmer store.
 * No external dependencies — just JSON in/out.
 */
export const farmerStore = {
    /** Persist farmer to localStorage */
    save(farmer: Farmer): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(farmer))
    },

    /** Load farmer from localStorage (null if not set) */
    load(): Farmer | null {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? (JSON.parse(raw) as Farmer) : null
        } catch {
            return null
        }
    },

    /** Clear farmer session */
    clear(): void {
        localStorage.removeItem(STORAGE_KEY)
    },

    /** True if a farmer session exists */
    isLoggedIn(): boolean {
        return Boolean(localStorage.getItem(STORAGE_KEY))
    },
}
