import TextMenu from "@/components/admin/text/TextMenu"
import Header from "@/components/admin/Header"

export default function AdminMedia(){
    return(
        <>
            <Header title="Texty" href="/admin"/>

            <div className="p-6">
                <TextMenu/>
            </div>
        </>
    )
}