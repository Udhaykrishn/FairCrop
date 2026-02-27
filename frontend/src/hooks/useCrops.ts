import { useQuery } from '@tanstack/react-query'
import { cropsService, type Crop } from '@/services/api'

export const cropKeys = {
    all: ['crops'] as const,
    detail: (id: string) => ['crops', id] as const,
}

/**
 * Fetch all crops from the API.
 * Usage: const { data, isLoading, error } = useCrops()
 */
export function useCrops() {
    return useQuery<Crop[], Error>({
        queryKey: cropKeys.all,
        queryFn: cropsService.getAll,
    })
}

/**
 * Fetch a single crop by ID.
 * Usage: const { data } = useCrop('crop-123')
 */
export function useCrop(id: string) {
    return useQuery<Crop, Error>({
        queryKey: cropKeys.detail(id),
        queryFn: () => cropsService.getById(id),
        enabled: Boolean(id),
    })
}
