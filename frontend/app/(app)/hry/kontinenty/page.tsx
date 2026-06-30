import Image from "next/image";
import Link from "next/link";

const areas = [
  {
    slug: "afrika",
    name: "Afrika",
    map: "/img/maps/etiopic-area.png",
    mapAlt: "Mapa Afriky",
    animal: "/img/photo-no-bg/giraffe.png",
    animalAlt: "Žirafa",
    bg: "bg-[#BD9554]",
    side: "right",
  },
  {
    slug: "asie",
    name: "Asie",
    map: "/img/maps/palearctic-area.png",
    mapAlt: "Mapa Asie",
    animal: "/img/photo-no-bg/monkey.png",
    animalAlt: "Opice",
    bg: "bg-[#FDB913]",
    side: "left",
  },
  {
    slug: "evropa",
    name: "Evropa",
    map: "/img/maps/palearctic-area.png",
    mapAlt: "Mapa Evropy",
    animal: "/img/photo-no-bg/bear.png",
    animalAlt: "Medvěd",
    bg: "bg-[#0072BC]",
    side: "right",
  },
  {
    slug: "severni-amerika",
    name: "Severní Amerika",
    map: "/img/maps/nonarctic-area.png",
    mapAlt: "Mapa Severní Ameriky",
    animal: "/img/photo-no-bg/bison.png",
    animalAlt: "Bizon",
    bg: "bg-[#8E5233]",
    side: "left",
  },
  {
    slug: "jizni-amerika",
    name: "Jižní Amerika",
    map: "/img/maps/neotropic-area.png",
    mapAlt: "Mapa Jižní Ameriky",
    animal: "/img/photo-no-bg/wolf.png",
    animalAlt: "Vlk",
    bg: "bg-[#076D3C]",
    side: "right",
  },
  {
    slug: "australie",
    name: "Austrálie",
    map: "/img/maps/australia-area.png",
    mapAlt: "Mapa Austrálie",
    animal: "/img/photo-no-bg/kangaroo.png",
    animalAlt: "Klokan",
    bg: "bg-[#ED1C24]",
    side: "left",
  },
];

export default function Areas() {
  return (
    <>
      <main className="my-30">
        <section>
          {areas.map((area) => {
            const animalRight = area.side === "right";

            return (
              <Link key={area.slug} href={`/hry/kontinenty/${area.slug}`}>
                <div
                  className={`relative w-full ${area.bg} my-20 max-sm:py-20 max-sm:p-5 sm:p-20 md:p-25 flex ${
                    animalRight ? "justify-start" : "justify-end"
                  } items-center overflow-visible`}
                >
                  {/* Mapa na pozadí */}
                  <div className="overflow-hidden absolute inset-0 z-0">
                    <Image
                      src={area.map}
                      alt={area.mapAlt}
                      className={`absolute ${animalRight ? "left-0" : "right-0"} object-contain select-none`}
                      width={700}
                      height={700}
                      draggable={false}
                      priority
                    />
                  </div>

                  {/* Název kontinentu */}
                  <div className="relative z-10 max-w-2xl text-white">
                    <h2 className="uppercase cus-font-impacted text-4xl sm:text-6xl md:text-8xl">
                      {area.name}
                    </h2>
                  </div>

                  {/* Zvíře */}
                  <Image
                    src={area.animal}
                    alt={area.animalAlt}
                    className={`absolute ${animalRight ? "right-0" : "left-0"} bottom-0 ${
                      animalRight ? "" : "rotate-y-180"
                    } h-[130%] max-h-none w-auto object-bottom z-0 select-none`}
                    draggable={false}
                    width={400}
                    height={400}
                    priority
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </>
  );
}