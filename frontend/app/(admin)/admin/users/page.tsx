import Header from "@/components/admin/Header"
import UserMenu from "@/components/admin/user/UserMenu"

export default function AdminUsers(){
    return(
        <>
            <Header title="Uživatelé" href="/admin"/>

            <div className="p-6">
                <UserMenu/>
            </div>
        </>
    )
}