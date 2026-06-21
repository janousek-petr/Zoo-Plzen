import ItemList from "@/components/admin/ItemList"
import Header from "@/components/admin/Header"

export default function HatList(){
    return(
        <>
            <Header title="Doplňky" href="/admin/items"/>

            <div className="p-6">
                <ItemList categoryId={2}/>
            </div>
        </>
    )
}