import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={1}
                regionName="Afrika"
                regionColor="#BD9554"
                regionHeader="/img/background/etiopic-hero.jpg"
                regionFirstAnimal="/img/photo-no-bg/giraffe.png"
                regionSecondAnimal="/img/photo-no-bg/giraffe-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/etiopic-ornament.svg"
            />
        </>
    )
}