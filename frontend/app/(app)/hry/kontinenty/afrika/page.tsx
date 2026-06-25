import { FaPlayCircle } from "react-icons/fa";
//import {useAudio} from "@/components/useAudio";
import SpeechBalloon from "@/components/ui/SpeechBalloon";
import Image from "next/image";
import { RiLock2Fill } from "react-icons/ri";
import Link from "next/link";
import { getQuizzesByRegion } from "@/lib/api/quizzes";
import QuizSection from "@/components/quiz/QuizSection";

// smaž: const quizzes = await getQuizzesByRegion(REGION_ID);

const REGION_ID = 1;

export default async function AfricaPage() {

    //const quizzes = await getQuizzesByRegion(REGION_ID);
    
    //const sound1 = useAudio("/sounds/testovaci.mp3");
    //const sound2 = useAudio("/sounds/testovaci2.mp3");

    return (
        <div> {/* Pojistka proti horizontálnímu přetečení celé stránky */}
            
            {/* Header */}
            <header className="relative h-screen flex flex-col items-center justify-center text-center px-6">
                <Image
                    src="/img/background/etiopic-hero.jpg"
                    alt="Pozadí etiopské oblasti"
                    className="object-cover"
                    fill
                />

                <div className="translate-y-10 sm:translate-y-0 mb-20">
                    <h1 className="cus-font-impacted-2 uppercase text-white xl:text-[220px] lg:text-[180px] md:text-[120px] text-[20vw] leading-none">Afrika</h1>
                </div>
            </header>

            <div className="relative w-full h-10 lg:h-14 overflow-hidden my-10">
                <Image
                    src="/img/ornaments/etiopic-ornament.svg"
                    alt="Etiopsky ornament"
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Základní informace */}
            <div className="flex flex-col items-center min-h-screen justify-center py-10">
                {/* Nadpis */}
                <h2 className="text-center uppercase custom-color-etiopska md:text-8xl text-5xl cus-text-beige cus-font-impacted-2">
                    Základní informace
                </h2>

                {/* Text - přidán margin bottom pro oddělení od mapy */}
                <p className="sm:text-justify text-left text-lg px-5 mt-5 mb-10 max-w-5xl">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard text ever since the 1500s...
                </p>

                {/* Kontejner pro mapu - roztažený na maximum */}
                <div className="w-full flex justify-center">
                    <Image
                        src="/img/maps/etiopic-map.png" 
                        alt="mapa etiopske oblasti"
                        width={1200} // Zvýšeno pro lepší kvalitu při zvětšení
                        height={800}
                        className="w-full max-w-7xl h-auto object-cover md:object-contain"
                    />
                </div>
            </div>


            <div className="relative w-full h-10 lg:h-14 overflow-hidden my-10">
                <Image
                    src="/img/ornaments/etiopic-ornament.svg"
                    alt="Etiopsky ornament"
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Další informace */}
            <div className="relative w-full cus-bg-beige-light my-30 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex items-center overflow-visible">
            
                <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                        src="/img/maps/etiopic-area.png"
                        alt="Mapa Etiopské oblasti"
                        className="object-cover select-none"
                        fill
                        draggable={false}
                        priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                    <h2 className="uppercase cus-font-impacted-2 text-4xl sm:text-6xl md:text-8xl">
                        Další informace
                    </h2>
                    <p className="text-gray-800 my-2">
                        Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text při vytváření pracovních ukázek grafických návrhů. Lipsum tak pracovně znázorňuje text v ukázkových maketách předtím, než bude do hotového návrhu vložen smysluplný obsah.
                    </p>
                </div>

                <Image
                    src="/img/photo-no-bg/giraffe.png"
                    alt="Medvěd hnědý"
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
                    text="Martin Brejcha, známý jako Martas Shots, je český fotograf zaměřený na automotive scénu..."
                    bgColorClass="cus-bg-beige"
                />
                <Image
                    src="/img/photo-no-bg/giraffe-2.png"
                    alt="Žirafa"
                    width={600}
                    height={600}
                    className="md:absolute left-0 xl:left-35 bottom-0 object-contain self-start"
                />
            </div>

            {/* Kvíz sekce */}
            <div className="flex flex-col lg:flex-row cus-bg-beige-light overflow-visible" id="kviz-sekce">

                <div className="flex w-full flex-col items-center py-20 px-4 lg:w-3/5">
                    <h2 className="w-full wrap-break-word text-center text-5xl uppercase md:text-8xl cus-text-beige cus-font-impacted-2">
                        Etiopský kvíz
                    </h2>
                    <p className="my-5 text-center text-3xl font-bold uppercase">
                        Vyber si obtížnost
                    </p>

                    <QuizSection
                        regionId={REGION_ID}
                        quizHref="/hry/kontinenty/afrika/kviz"
                    />
                </div>

                <div className="relative flex w-full items-end justify-end min-h-87 lg:w-2/5 lg:min-h-full">
                    <Image
                        src="/img/photo-no-bg/giraffe.png"
                        alt="Žirafa"
                        width={600}
                        height={600}
                        className="object-cover"
                        draggable="false"
                    />
                </div>

            </div>

            <div className="relative w-full h-10 lg:h-14 overflow-hidden my-10">
                <Image
                    src="/img/ornaments/etiopic-ornament.svg"
                    alt="Etiopsky ornament"
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