// app/admin/users/[id]/edit/page.tsx
import Header from '@/components/admin/Header'
import UpdateUser from '@/components/admin/user/UpdateUser'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <Header title="Upravit uživatele" href={`/admin/users/${id}`} />
      <div className="p-6">
        <UpdateUser id={Number(id)} />
      </div>
    </>
  )
}