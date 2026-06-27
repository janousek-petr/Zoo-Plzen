import ItemList from "@/components/admin/item/ItemList"
import Header from "@/components/admin/Header"

export default function HatList(){
    return(
        <>
            <Header title="Fotky" href="/admin/items"/>

            <div className="p-6">
                <ItemList categoryId={4}/>
            </div>
        </>
    )
}