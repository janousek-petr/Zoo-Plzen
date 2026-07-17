{
/*
"use client";

import { useState } from "react";
import Image from "next/image";
import ExpandableGallery, { GalleryItem } from "@/components/ui/ExpandableGallery";
import SpeechBalloon from "@/components/ui/SpeechBalloon";
import { useProfile } from "@/hooks/useProfile";

// Katalog medailí — id odpovídá medal_id v DB (displayed_medals: number[])
const allMedals: GalleryItem[] = [
  { id: 1, src: "/img/medals/medal-america.png",  alt: "Amerika I"  },
  { id: 2, src: "/img/medals/medal-asia.png",     alt: "Asie I"     },
  { id: 3, src: "/img/medals/medal-africa.png",   alt: "Afrika I"   },
  { id: 4, src: "/img/medals/medal-europe.png",   alt: "Evropa I"   },
  { id: 5, src: "/img/medals/medal-australia.png",alt: "Austrálie I"},
  { id: 6, src: "/img/icons/lock-icon.png",       alt: "Zamčeno"    },
  { id: 7, src: "/img/icons/lock-icon.png",       alt: "Zamčeno"    },
  { id: 8, src: "/img/icons/lock-icon.png",       alt: "Zamčeno"    },
  { id: 9, src: "/img/icons/lock-icon.png",       alt: "Zamčeno"    },
];

const UNLOCKED_COUNT = 5;
const TOTAL_COUNT    = 9;
const MAX_DISPLAYED  = 3;
const PREVIEW_COUNT  = 6;

export default function MedalTab() {
  const { profile, isSaving, update } = useProfile();

  // Inicializuj z profilu — fallback na první dvě odemčené
  const [displayed, setDisplayed] = useState<number[]>(
    profile?.displayed_medals ?? [1, 2]
  );

  const toggleDisplay = (id: number) => {
    if (id > UNLOCKED_COUNT) return; // zamčená medaile

    let next: number[];
    if (displayed.includes(id)) {
      next = displayed.filter((x) => x !== id);
    } else if (displayed.length < MAX_DISPLAYED) {
      next = [...displayed, id];
    } else {
      return; // plno slotů
    }

    setDisplayed(next);
    update({ displayed_medals: next });
  };

  if (!profile) return null;

  return (
    <div className="w-full">
      {isSaving && (
        <div className="fixed top-4 right-4 z-50 bg-amber-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg animate-pulse">
          Ukládám...
        </div>
      )}

      {/* VYSTAVENÉ MEDAILE *//*}
      <SectionBlock title="Vystavené medaile na profilu">
        <div className="flex justify-center items-center gap-6 flex-wrap py-2">
          {Array.from({ length: MAX_DISPLAYED }).map((_, i) => {
            const medalId = displayed[i];
            const medal = allMedals.find((m) => m.id === medalId);
            return (
              <div key={i} className="flex flex-col items-center">
                {medal ? (
                  <button
                    onClick={() => toggleDisplay(medal.id)}
                    className="relative w-40 h-40 ring-4 ring-amber-400 ring-offset-2 rounded-full transition-transform hover:scale-105 active:scale-95"
                    title={`Odebrat ${medal.alt}`}
                  >
                    <Image src={medal.src} alt={medal.alt} fill className="object-contain" />
                  </button>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-300 border-2 border-dashed border-gray-500 flex items-center justify-center">
                    <span className="text-7xl text-gray-500 font-light leading-none">+</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionBlock>

      {/* VLASTNĚNÉ MEDAILE *//*}
      <SectionBlock title="Vlastněné medaile">
        <ExpandableGallery
          title="Medaile"
          items={allMedals}
          collectedCount={UNLOCKED_COUNT}
          totalCount={TOTAL_COUNT}
          selectedId={null}
          highlightedIds={displayed}
          onSelect={(id) => toggleDisplay(id)}
          previewCount={PREVIEW_COUNT}
        />
      </SectionBlock>

      {/* CTA *//*}
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
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-white py-8 px-6">
        <h2 className="text-amber-400 cus-font-impacted-2 uppercase text-center text-6xl tracking-widest">
          {title}
        </h2>
      </div>
      <div className="bg-[#c8bfb0] px-6 py-6">{children}</div>
    </div>
  );
}*/}