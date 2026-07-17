import Image from "next/image";
import Link from "next/link";

export default function StartPage(){
    return(
        <>
            <div className="relative min-h-screen w-full bg-white overflow-hidden">
               <Image
                    src="/img/background/startpage-hero.jpeg"
                    alt="Pozadí úvodní stránky"
                    className="object-cover sm:object-top-left object-bottom z-0 select-none"
                    draggable={false}
                    priority
                    fill
               />

                <div className="relative z-10 flex flex-col justify-center sm:items-end h-full px-5 sm:px-10">
                    <h1 className="cus-font-impacted-2 uppercase text-white drop-shadow-xl xl:text-[220px] lg:text-[180px] md:text-[120px] text-[18vw] leading-[0.85]">
                        Zoo<br className="sm:hidden" /> v kapse
                    </h1>
                </div>

                <svg 
                    viewBox="0 0 1440 320" 
                    className="absolute -bottom-1 left-0 xl:w-full h-90 lg:h-110 z-10"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path 
                        className="fill-white z-30"
                        d="M1440,224L1392,213.3C1344,203,1248,181,1152,181.3C1056,178,960,194,864,203C768,209,672,209,576,189C480,168,384,117,288,106.7C192,96,96,128,48,144L0,160L0,320L48,320C96,320,192,320,288,320C384,320,480,320,576,320C672,320,768,320,864,320C960,320,1056,320,1152,320C1248,320,1344,320,1392,320L1440,320Z"
                    ></path>
                </svg>

                <h1 className="absolute bottom-10 justify-self-center mx-5 z-20 cus-font-impacted-2 text-sky-600 uppercase lg:text-8xl md:text-7xl sm:text-6xl text-5xl">Vstup do světa zvířat</h1>

            </div>

            <div className="relative py-5">
                <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 md:gap-8 px-5">

                    <Link
                        href="/registrace"
                        className="bg-sky-600 text-white text-center px-6 py-5 sm:px-8 sm:py-6 md:px-10
                                rounded-md font-bold sm:text-lg md:text-xl border-3 border-sky-600 cus-font-swiss-10
                                transition-all duration-150 cursor-pointer
                                hover:bg-sky-800 hover:border-sky-800"
                    >
                        Registrovat
                    </Link>

                    <Link
                        href="/prihlaseni"
                        className="text-sky-600 text-center px-6 py-5 sm:px-8 sm:py-6 md:px-10
                                rounded-md font-bold sm:text-lg md:text-xl border-3 border-sky-600 cus-font-swiss-10
                                transition-all duration-150 cursor-pointer
                                hover:bg-sky-800 hover:border-sky-800 hover:text-white"
                    >
                        Přihlásit
                    </Link>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 px-5 py-12 md:px-20 md:py-20">

                {/* Krok 1 */}
                <div className="group relative flex flex-col items-center text-center rounded-3xl p-6 md:p-8 transition-all duration-300 bg-sky-50 shadow-sm">
                    <Image
                        src="/img/startpage-1.png"
                        alt="Registrace hráčského profilu"
                        width={128}
                        height={128}
                        className="mb-2"
                        draggable={false}
                    />
                    <h2 className="text-2xl md:text-3xl cus-font-impacted-2 uppercase my-2 text-sky-600">
                        Zaregistruj se
                    </h2>
                    <p className="text-sm md:text-base text-gray-700">
                        Založ si účet, přihlaš se, vytvoř si hráčský profil a vyraz na dobrodružství!
                    </p>
                </div>

                {/* Krok 2 */}
                <div className="group relative flex flex-col items-center text-center bg-amber-50 rounded-3xl p-6 md:p-8 shadow-sm ">
                    <Image
                        src="/img/startpage-2.png"
                        alt="Prozkoumávání světa"
                        width={128}
                        height={128}
                        className="mb-2"
                        draggable={false}
                    />
                    <h2 className="text-2xl md:text-3xl cus-font-impacted-2 uppercase my-2 text-amber-900">
                        Prozkoumávej
                    </h2>
                    <p className="text-sm md:text-base text-gray-700">
                        Na své cestě získáš vědomosti o přírodě a zvířatech. Podíváš se do každého zakoutí naší Země – od divokých džunglí až po masivní pouště.
                    </p>
                </div>

                {/* Krok 3 */}
                <div className="group relative flex flex-col items-center text-center bg-green-50 rounded-3xl p-6 md:p-8 shadow-sm">
                    <Image
                        src="/img/startpage-3.png"
                        alt="Hraní hry"
                        width={128}
                        height={128}
                        className="mb-2"
                        draggable={false}
                    />
                    <h2 className="text-2xl md:text-3xl cus-font-impacted-2 uppercase my-2 text-green-700">
                        Hraj
                    </h2>
                    <p className="text-sm md:text-base text-gray-700">
                        Odemykej nové předměty, studuj nové zvířata a dostaň se na vrchol!
                    </p>
                </div>

            </div>

            
             
        </>
    )
}