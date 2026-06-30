import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={3}
                regionName="Evropa"
                regionColor="#0072BC"
                regionHeader="/img/background/evropa-hero.png"
                regionFirstAnimal="/img/photo-no-bg/bear.png"
                regionSecondAnimal="/img/photo-no-bg/bear-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/etiopic-ornament.svg"
            />
        </>
    )
}