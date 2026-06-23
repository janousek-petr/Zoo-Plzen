import Image from "next/image";
import Link from "next/link";

export default function Home(){
    return(
        <>
            <main className="py-20">
                <h1 className="uppercase cus-font-impacted-2 text-7xl text-green-700 text-center">Pojďme hrát</h1>

                <section className="grid sm:grid-cols-4 grid-cols-2 flex-col gap-5 justify-self-center my-20">

                    {/* Každé tlačítko je nyní Link místo divu */}
                    <Link href="/hry" className="flex w-30 h-30 bg-red-800 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/play-button.png"
                            alt="Tlačítko - Hrát"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="/profil?tab=batoh" className="flex w-30 h-30 bg-yellow-500 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/inventory-button.png"
                            alt="Tlačítko - Inventář"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="/profil?tab=medaile" className="flex w-30 h-30 bg-indigo-400 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/gallery-button.png"
                            alt="Tlačítko - Galerie"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="vyzvy" className="flex w-30 h-30 bg-green-500 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/tasks-button.png"
                            alt="Tlačítko - Úkoly"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="zebricek" className="flex w-30 h-30 bg-fuchsia-800 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/leaderboards-button.png"
                            alt="Tlačítko - Žebříčky"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="obchod" className="flex w-30 h-30 bg-slate-800 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/shop-button.png"
                            alt="Tlačítko - Obchod"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="profil" className="flex w-30 h-30 bg-amber-900 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/profile-button.png"
                            alt="Tlačítko - Profil"
                            width={64}
                            height={64}
                        />
                    </Link>

                    <Link href="nastaveni" className="flex w-30 h-30 bg-gray-500 rounded-full justify-center items-center hover:opacity-80 transition-opacity">
                        <Image
                            src="/img/icons/settings-button.png"
                            alt="Tlačítko - Nastavení"
                            width={64}
                            height={64}
                        />
                    </Link>

                </section>

                <section>
                    <h2 className="uppercase cus-font-impacted-2 text-center text-5xl">Novinky u nás</h2>

                    <div className="flex md:flex-row flex-col justify-center items-center gap-10 md:p-20 p-5">
    
                        {/* --- PRVNÍ NOVINKA --- */}
                        <div className="flex flex-col items-center max-w-lg">
                            <Image
                                src="/img/photo/image-2.JPG"
                                alt="Novinka - Lev"
                                width={400}
                                height={400}
                                className="shadow-xl select-none"
                                draggable={false}
                            />
                            <h3 className="uppercase cus-font-impacted-2 text-orange-500 text-4xl mt-6 mb-3">
                                Lev je doma!
                            </h3>
                            <p className="leading-relaxed">
                                Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text při vytváření pracovních ukázek grafických návrhů. Lipsum tak pracovně znázorňuje text v ukázkových maketách předtím, než bude do hotového návrhu vložen smysluplný obsah.
                            </p>
                        </div>

                        {/* --- DRUHÁ NOVINKA --- */}
                        <div className="flex flex-col items-center max-w-lg">
                            {/* Přidáno zaoblení a stín */}
                            <Image
                                src="/img/photo/image-1.JPG"
                                alt="Novinka - Tygr"
                                width={400}
                                height={400}
                                className="shadow-xl select-none"
                                draggable={false}
                            />
                            <h3 className="uppercase cus-font-impacted-2 text-red-600 text-4xl mt-6 mb-3">
                                Tygr je taky doma!
                            </h3>
                            {/* Odstraněno pe-20 */}
                            <p className="leading-relaxed">
                                Lorem ipsum je označení pro standardní pseudolatinský text užívaný v grafickém designu a navrhování jako demonstrativní výplňový text při vytváření pracovních ukázek grafických návrhů. Lipsum tak pracovně znázorňuje text v ukázkových maketách předtím, než bude do hotového návrhu vložen smysluplný obsah.
                            </p>
                        </div>

                    </div>
                </section>

        

                
            </main>
            
        </>
    )
}