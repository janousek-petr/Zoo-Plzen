import Image from "next/image";

export default function Areas() {
  return (
    <>
      <main className="my-30">
        <section>

            {/* PALEARKTICKÁ OBLAST */}
            <div className="relative w-full bg-sky-700 my-30 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex items-center overflow-visible">

                <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                    src="/img/maps/palearctic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="object-contain select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Palearktická oblast
                </h2>
                </div>

                <Image
                src="/img/photo-no-bg/bear.png"
                alt="Medvěd hnědý"
                className="absolute right-0 bottom-0 h-[130%] max-h-none w-auto object-bottom z-0 select-none"
                draggable={false}
                width={400}
                height={400}
                priority
                />
            </div>

            {/* NEARKTICKÁ OBLAST */}
            <div className="relative w-full bg-amber-900 my-20 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex justify-end items-center overflow-visible">

                <div className="overflow-hidden absolute right-0 inset-0 z-0">
                    <Image
                    src="/img/maps/nonarctic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="absolute right-0 object-cover select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Nearktická oblast
                </h2>
                </div>

                <Image
                src="/img/photo-no-bg/bison.png"
                alt="Medvěd hnědý"
                className="absolute left-0 bottom-0 rotate-y-180 h-[130%] max-h-none w-auto object-cover z-0 select-none"
                draggable={false}
                width={400}
                height={400}
                priority
                />

          </div>

            {/* NEOTROPICKÁ OBLAST */}
            <div className="relative w-full bg-green-700 my-30 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex items-center overflow-visible">

                <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                    src="/img/maps/neotropic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="object-contain select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Neotropická oblast
                </h2>
                </div>

                <Image
                src="/img/photo-no-bg/wolf.png"
                alt="Medvěd hnědý"
                className="absolute right-0 bottom-0 h-[130%] max-h-none w-auto object-bottom z-0 select-none"
                draggable={false}
                width={400}
                height={400}
                priority
                />
            </div>

            {/* ETIOPSKÁ OBLAST */}
            <div className="relative w-full cus-bg-beige my-20 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex justify-end items-center overflow-visible">

                <div className="overflow-hidden absolute right-0 inset-0 z-0">
                    <Image
                    src="/img/maps/etiopic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="absolute right-0 object-cover select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Etiopská<br/> oblast
                </h2>
                </div>

                <Image
                    src="/img/photo-no-bg/giraffe.png"
                    alt="Medvěd hnědý"
                    className="absolute left-0 bottom-0 rotate-y-180 h-[130%] max-h-none w-auto object-cover z-0 select-none"
                    draggable={false}
                    width={400}
                    height={400}
                    priority
                />

          </div>

          {/* NEOTROPICKÁ OBLAST */}
            <div className="relative w-full bg-red-500 my-30 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex items-center overflow-visible">

                <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                    src="/img/maps/neotropic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="object-contain select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Australská oblast
                </h2>
                </div>

                <Image
                src="/img/photo-no-bg/kangaroo.png"
                alt="Medvěd hnědý"
                className="absolute right-0 bottom-0 h-[130%] max-h-none w-auto object-bottom z-0 select-none"
                draggable={false}
                width={400}
                height={400}
                priority
                />
            </div>

            {/* ETIOPSKÁ OBLAST */}
            <div className="relative w-full bg-yellow-500 my-20 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex justify-end items-center overflow-visible">

                <div className="overflow-hidden absolute right-0 inset-0 z-0">
                    <Image
                    src="/img/maps/etiopic-area.png"
                    alt="Mapa Palearktické oblasti"
                    className="absolute right-0 object-cover select-none"
                    width={700}
                    height={700}
                    draggable={false}
                    priority
                    />
                </div>
                
                <div className="relative z-10 max-w-2xl text-white">
                <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                    Nearktická oblast
                </h2>
                </div>

                <Image
                    src="/img/photo-no-bg/monkey.png"
                    alt="Medvěd hnědý"
                    className="absolute left-0 bottom-0 rotate-y-180 h-[130%] max-h-none w-auto object-cover z-0 select-none"
                    draggable={false}
                    width={400}
                    height={400}
                    priority
                />

          </div>

          

        </section>

        
      </main>
    </>
  );
}