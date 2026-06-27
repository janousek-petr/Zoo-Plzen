import RegionInfoList from "@/components/admin/text/region-infos/RegionInfoList"
import Header from "@/components/admin/Header"

export default function RegionInfosPage(){
    return(
        <>
            <Header title="Texty regionu" href="/admin/texts"/>

            <div className="p-6">
                <RegionInfoList/>
            </div>
        </>
    )
}