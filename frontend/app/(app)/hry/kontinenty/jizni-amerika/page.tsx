import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={5}
                regionName="Jižní Amerika"
                regionColor="#076D3C"
                regionHeader="/img/background/jizni-amerika-hero.png"
                regionFirstAnimal="/img/photo-no-bg/wolf.png"
                regionSecondAnimal="/img/photo-no-bg/wolf-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/etiopic-ornament.svg"
            />
        </>
    )
}