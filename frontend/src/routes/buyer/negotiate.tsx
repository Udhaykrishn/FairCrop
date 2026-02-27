import { createFileRoute } from '@tanstack/react-router'
import { NegotiationChatPage } from '@/features/buyer/pages/NegotiationChatPage'

export const Route = createFileRoute('/buyer/negotiate')({
  component: NegotiationChatPage,
})
