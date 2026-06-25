import AddItem from "@/components/admin/item/AddItem"
import Header from "@/components/admin/Header"

export default async function AddNewItem({ params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params

    return (
        <>
            <Header title="Přidat předmět" href="/admin/items" />
            <div className="p-6">
                <AddItem categoryId={Number(categoryId)} />
            </div>
        </>
    )
}