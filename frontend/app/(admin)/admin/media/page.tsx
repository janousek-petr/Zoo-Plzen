import MediaPage from "@/components/admin/media/MediaPage"
import Header from "@/components/admin/Header"

export default function AdminMedia(){
    return(
        <>
            <Header title="Média" href="/admin"/>

            <div className="p-6">
                <MediaPage/>
            </div>
        </>
    )
}