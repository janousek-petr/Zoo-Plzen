// app/admin/users/create/page.tsx
import Header from '@/components/admin/Header'
import CreateUser from '@/components/admin/user/AddUser'

export default function CreateUserPage() {
  return (
    <>
      <Header title="Vytvořit uživatele" href="/admin/users" />
      <div className="p-6">
        <CreateUser />
      </div>
    </>
  )
}