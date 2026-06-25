import MediaPage from "@/components/admin/MediaPage"
import ItemList from "@/components/admin/item/ItemList"
import Header from "@/components/admin/Header"

export default function WallpaperList(){
    return(
        <>
            <Header title="Tapety" href="/admin/items"/>

            <div className="p-6">
                <ItemList categoryId={3}/>
            </div>
        </>
    )
}