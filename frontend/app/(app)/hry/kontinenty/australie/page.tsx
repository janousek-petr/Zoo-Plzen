import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={6}
                regionName="Austrálie"
                regionColor="#ED1C24"
                regionHeader="/img/background/australie-hero.png"
                regionFirstAnimal="/img/photo-no-bg/kangaroo.png"
                regionSecondAnimal="/img/photo-no-bg/kangaroo-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/etiopic-ornament.svg"
            />
        </>
    )
}