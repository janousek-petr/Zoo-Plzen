import ContinentArea from "@/components/area/ContinentArea";

export default function AfricaPage(){
    return(
        <>
            <ContinentArea
                regionId={6}
                regionName="Severní Amerika"
                regionColor="#8E5233"
                regionHeader="/img/background/jizni-amerika-hero.png"
                regionFirstAnimal="/img/photo-no-bg/bison.png"
                regionSecondAnimal="/img/photo-no-bg/bison-2.png"
                regionMap="/img/maps/etiopic-map.png"
                regionArea="/img/maps/etiopic-area.png"
                regionOrnament="/img/ornaments/etiopic-ornament.svg"
            />
        </>
    )
}