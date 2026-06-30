import SpeechBalloon from "@/components/ui/SpeechBalloon";
import Image from "next/image";
import Link from "next/link";
import { getTextsByRegion } from "@/lib/api/texts";
import QuizSection from "@/components/quiz/QuizSection";
import { generatePalette } from "./ColorPaletteGenerator";
import type { RegionInfo } from "@/lib/types";

interface ContinentAreaProps{
    regionId : number;
    regionName : string;
    regionColor : string;
    regionHeader: string;
    regionFirstAnimal: string;
    regionSecondAnimal: string;
    regionMap: string;
    regionArea: string;
    regionOrnament: string;
}

const FALLBACK_TEXT = "Text se připravuje...";

/**
 * Vybere náhodný text z pole pro danou úroveň, s fallbackem pokud je pole prázdné/chybí.
 */
function pickRandomText(items: RegionInfo[] | undefined | null): string {
    if (!items || items.length === 0) return FALLBACK_TEXT;
    const random = items[Math.floor(Math.random() * items.length)];
    return random?.text ?? FALLBACK_TEXT;
}

export function getHrefName(regionName : string){
    return regionName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
}

export default async function ContinentArea({regionId, regionName, regionColor, regionHeader, regionFirstAnimal, regionSecondAnimal, regionMap, regionArea, regionOrnament} : ContinentAreaProps) {

    const colors = generatePalette(regionColor);
    const primaryColor = colors.primary;
    const secondaryColor = colors.secondary;
    const accentColor = colors.accent;

    const textsByLevel = await getTextsByRegion(regionId);

    const basicInfoText = pickRandomText(textsByLevel?.[1]);
    const extraInfoText = pickRandomText(textsByLevel?.[2]);
    const funFactText = pickRandomText(textsByLevel?.[3]);


    return (
        <div>
            
            {/* Header */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-6">
                <Image
                    src={regionHeader}
                    alt={"Header pozadí " + regionName}
                    className="object-cover"
                    fill
                />

                <div className="translate-y-10 sm:translate-y-0 mb-20">
                    <h1 className="cus-font-impacted-2 uppercase text-white xl:text-[220px] lg:text-[180px] md:text-[120px] text-[20vw] leading-none">
                        {regionName}
                    </h1>
                </div>
            </header>

            {/* Kvíz sekce */}
            <div 
                className="flex flex-col lg:flex-row overflow-visible"
                id="kviz-sekce"
                style={{ background: secondaryColor }}
            
            >

                <div className="flex w-full flex-col items-center py-20 px-4 lg:w-3/5">
                    <h2 className={`w-full wrap-break-word text-center text-5xl uppercase md:text-8xl cus-font-impacted-2`}
                        style={{ color: primaryColor }}
                    >
                        Kvíz
                    </h2>
                    <p className="my-5 text-center text-3xl font-bold uppercase">
                        Vyber si obtížnost
                    </p>

                    <QuizSection
                        regionId={regionId}
                        quizHref={"/hry/kontinenty/" + getHrefName(regionName) + "/kviz"}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                    />
                </div>

                <div className="relative flex w-full items-end justify-end min-h-87 lg:w-2/5 lg:min-h-full">
                    <Image
                        src={regionFirstAnimal}
                        alt={"Zvíře - " + {regionName}}
                        width={600}
                        height={600}
                        className="object-cover"
                        draggable="false"
                    />
                </div>

            </div>

            {/* Základní informace */}
            <div className="flex flex-col items-center min-h-screen justify-center py-10">
                {/* Nadpis */}
                <h2 className="text-center uppercase custom-color-etiopska md:text-8xl text-5xl cus-font-impacted-2" style={{ color: primaryColor }}>
                    Základní informace
                </h2>

                {/* Text - přidán margin bottom pro oddělení od mapy */}
                <p className="sm:text-justify text-left text-lg px-5 mt-5 mb-10 max-w-5xl whitespace-pre-wrap">
                    {basicInfoText}
                </p>

                {/* Kontejner pro mapu - roztažený na maximum */}
                <div className="w-full flex justify-center">
                    <Image
                        src={regionMap}
                    alt={"Mapa" + regionName}
                        width={1200} // Zvýšeno pro lepší kvalitu při zvětšení
                        height={800}
                        className="w-full max-w-7xl h-auto object-cover md:object-contain"
                    />
                </div>
            </div>


            <div className="relative w-full h-10 lg:h-20 overflow-hidden my-10">
                <Image
                    src={regionOrnament}
                    alt={"Ornament" + regionName}
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Další informace */}
            <div className="relative w-full my-30 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex items-center overflow-visible"
                style={{ background: secondaryColor }}
            >
                <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                        src={regionArea}
                        alt={"Oblast" + regionName}
                        className="object-cover select-none"
                        fill
                        draggable={false}
                        priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <h2
                        className="uppercase cus-font-impacted-2 text-4xl sm:text-6xl md:text-8xl text-white"
                    >
                        Další informace
                    </h2>
                    <p className="my-2 text-gray-800 whitespace-pre-wrap">
                        {extraInfoText}
                    </p>
                </div>

                <Image
                    src={regionFirstAnimal}
                    alt={"Zvíře - " + {regionName}}
                    className="absolute right-0 bottom-0 h-[130%] max-h-none w-auto object-bottom z-0 select-none object-cover"
                    draggable={false}
                    width={400}
                    height={400}
                    priority
                />
            </div>

            <div className="relative flex flex-col lg:flex-row items-center md:items-end justify-center h-auto md:h-150 md:p-20">
                <SpeechBalloon
                    title="Věděl jsi, že..."
                    text={funFactText}
                    bgColorClass={primaryColor}
                />
                <Image
                    src={regionSecondAnimal}
                    alt={"Zvíře - " + {regionName}}
                    width={600}
                    height={600}
                    className="md:absolute left-0 xl:left-35 bottom-0 object-contain self-start"
                />
            </div>

            <div className="relative w-full h-10 lg:h-20 overflow-hidden my-10">
                <Image
                    src={regionOrnament}
                    alt={"Ornament" + regionName}
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Kamarádi sekce */}
            {/*<div className="min-h-screen py-20 flex flex-col items-center justify-center px-6 overflow-hidden">
                <h3 className="text-center uppercase cus-text-beige md:text-8xl sm:text-6xl text-5xl cus-font-impacted-2">KAMARÁDI Z ETIOPSKÉ OBLASTI</h3>
                <p className="text-center text-xl md:text-2xl mt-8 max-w-4xl">Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém...</p>

                <button className="px-8 h-20 border-2 custom-border-color-etiopska interactive custom-bg-color-etiopska mt-10 text-xl rounded-2xl font-bold cursor-pointer transition duration-200">
                    <p>
                        Dozvědět se více...
                    </p>
                </button>
            </div>*/}
            
        </div>
    )
}