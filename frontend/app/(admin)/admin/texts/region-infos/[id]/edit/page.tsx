
import RegionInfoUpdate from '@/components/admin/text/region-infos/RegionInfoUpdate'
import Header from '@/components/admin/Header'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return(
    <>
        <Header title="Aktualizovat region info" href="/admin/texts/region-infos"/>
        <RegionInfoUpdate id={Number(id)} />
    </>
  ) 
}