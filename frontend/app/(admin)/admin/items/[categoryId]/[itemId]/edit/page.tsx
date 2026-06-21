import Header from "@/components/admin/Header"
import EditItem from "@/components/admin/EditItem"

export default async function EditItemPage({ params }: { params: Promise<{ categoryId: string; itemId: string }> }) {
    const { categoryId, itemId } = await params
    return (
        <>
            <Header title="Upravit předmět" href={`/admin/items`} />
            <div className="p-6">
                <EditItem categoryId={Number(categoryId)} itemId={Number(itemId)} />
            </div>
        </>
    )
}