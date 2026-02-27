import { createFileRoute } from '@tanstack/react-router'
import { NegotiationChatPage } from '@/features/buyer/pages/NegotiationChatPage'

interface NegotiationSearch {
  id?: string
}

export const Route = createFileRoute('/buyer/negotiate')({
  validateSearch: (search: Record<string, unknown>): NegotiationSearch => {
    return {
      id: search.id as string | undefined,
    }
  },
  component: NegotiationChatPage,
})
