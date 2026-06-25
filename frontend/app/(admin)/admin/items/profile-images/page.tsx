import MediaPage from "@/components/admin/MediaPage"
import ItemList from "@/components/admin/item/ItemList"
import Header from "@/components/admin/Header"

export default function ProfileImageList(){
    return(
        <>
            <Header title="Profilovky" href="/admin/items"/>

            <div className="p-6">
                <ItemList categoryId={1}/>
            </div>
        </>
    )
}