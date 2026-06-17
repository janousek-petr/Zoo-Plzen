// app/admin/users/[id]/profiles/[profileId]/page.tsx
import ProfileDetail from '@/components/admin/ProfileDetail'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; profileId: string }>
}) {
  const { id, profileId } = await params
  return <ProfileDetail userId={Number(id)} profileId={Number(profileId)} />
}