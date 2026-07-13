import { Sources } from '@/features/sources';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sources/')({
  component: Sources,
})
