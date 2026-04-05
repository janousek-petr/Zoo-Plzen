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
                <div className="flex flex-row justify-center md:gap-8 gap-2">
                    <Link 
                        href="/prihlaseni"
                        className="bg-sky-600 text-white p-7 rounded-md font-bold sm:text-xl border-sky-600 border-3 cus-font-swiss-10
                                        hover:bg-sky-800 hover:border-sky-800 duration-100 cursor-pointer">
                        Přihlásit se
                    </Link>

                    <Link
                        href="/" 
                        className="text-sky-600 p-7 border-sky-600 border-3 rounded-md font-bold sm:text-xl cus-font-swiss-10
                                        hover:bg-sky-800 hover:border-sky-800 hover:text-white duration-100 cursor-pointer">
                        Prozkoumat
                    </Link>
                </div>
            </div>

            <div className="flex md:flex-row flex-col justify-center gap-10 md:p-20 p-5">
            
                <div >
                    <Image
                        src="/img/startpage-1.png"
                        alt="1. fotka na úvodní stránced"
                        width={128}
                        height={128}
                        className="justify-self-center"
                    />

                    <h2 className="text-3xl cus-font-impacted-2 uppercase my-2 text-sky-600">
                        Přihlaš se
                    </h2>
                    <p className="md:pe-5">
                        Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text
                    </p>
                </div>

                <div>
                    <Image
                        src="/img/startpage-2.png"
                        alt="1. fotka na úvodní stránced"
                        width={128}
                        height={128}
                        className="justify-self-center"
                    />

                    <h2 className="text-3xl cus-font-impacted-2 uppercase my-2 text-amber-900">
                        Prozkoumávej
                    </h2>
                     <p className="md:pe-5">
                        Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text
                    </p>
                </div>

                <div>
                    <Image
                        src="/img/startpage-3.png"
                        alt="1. fotka na úvodní stránced"
                        width={128}
                        height={128}
                        className="justify-self-center"
                    />

                    <h2 className="text-3xl cus-font-impacted-2 uppercase my-2 text-amber-400">
                        Hraj
                    </h2>
                     <p className="">
                        Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text
                    </p>
                </div>

            </div>

            
             
        </>
    )
}