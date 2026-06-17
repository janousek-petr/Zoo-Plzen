// app/admin/users/[id]/page.tsx
import UserDetail from '@/components/admin/UserDetail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <UserDetail id={Number(id)} />
}