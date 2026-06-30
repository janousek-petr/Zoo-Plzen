import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={2}
                regionName="Asie"
                regionColor="#FDB913"
                regionHeader="/img/background/asie-hero.png"
                regionFirstAnimal="/img/photo-no-bg/monkey.png"
                regionSecondAnimal="/img/photo-no-bg/monkey-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/asie-ornament.png"
            />
        </>
    )
}