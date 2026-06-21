import ItemMenu from "@/components/admin/ItemMenu"
import Header from "@/components/admin/Header"

export default function AdminItems(){
    return(
        <>
            <Header title="Předměty" href="/admin"/>

            <div className="p-6">
                <ItemMenu/>
            </div>
        </>
    )
}