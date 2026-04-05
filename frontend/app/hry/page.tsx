import Image from "next/image"

export default function Games(){
    return(
        <>
            <main className="my-40 w-full">
                <section>
                    <div className="flex sm:flex-row flex-col justify-center items-center gap-6 min-h-60 bg-emerald-500 my-15">
                        <Image
                            src="/img/icons/quiz-icon.png"
                            alt="Ikona - Kvízy kontinentů"
                            width={128}
                            height={128}
                        />
                        <h2 className="uppercase cus-font-impacted text-gray-50 sm:text-7xl text-4xl">
                            Kvízy kontinentů
                        </h2>
                    </div>

                    <div className="flex sm:flex-row flex-col justify-center items-center gap-6 h-60 bg-emerald-500 my-15">
                        <Image
                            src="/img/icons/answer-icon.png"
                            alt="Ikona - Kvízy kontinentů"
                            width={128}
                            height={128}
                        />
                        <h2 className="uppercase cus-font-impacted text-gray-50 sm:text-7xl text-4xl">
                            Kvízy se zvířaty
                        </h2>
                    </div>

                    <div className="flex sm:flex-row flex-col justify-center items-center gap-6 h-60 bg-emerald-500 my-15">
                        <Image
                            src="/img/icons/pexeso-icon.png"
                            alt="Ikona - Pexeso"
                            width={128}
                            height={128}
                        />
                        <h2 className="uppercase cus-font-impacted text-gray-50 sm:text-7xl text-4xl">
                            Pexeso
                        </h2>
                    </div>

                    <div className="flex sm:flex-row flex-col justify-center items-center gap-6 h-60 bg-emerald-500 my-15">
                        <Image
                            src="/img/icons/controller-icon.png"
                            alt="Ikona - Minihry"
                            width={128}
                            height={128}
                        />
                        <h2 className="uppercase cus-font-impacted text-gray-50 sm:text-7xl text-4xl">
                            Minihry
                        </h2>
                    </div>

                    
                </section>
            </main>
        </>
    )
}