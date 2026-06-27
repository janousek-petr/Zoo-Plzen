"use client"

import RegionInfoCreate from "@/components/admin/text/region-infos/RegionInfoCreate"
import Header from "@/components/admin/Header"

export default function RegionInfoCreatePage(){
    return(
        <>
            <Header title="Vytvořit region info" href="/admin/texts/region-infos"/>

            <div className="p-6">
                <RegionInfoCreate />
            </div>
        </>
    )
}