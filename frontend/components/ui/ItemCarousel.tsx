"use client";

import Image from "next/image";

export interface CarouselItem {
  id: number;
  src: string;
  alt: string;
  unlocked: boolean;
}

interface ItemCarouselProps {
  title: string;
  items: CarouselItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  /** round = pro profilovky, square = pro doplňky */
  shape?: "round" | "square";
}

export default function ItemCarousel({
  title,
  items,
  selectedId,
  onSelect,
  shape = "round",
}: ItemCarouselProps) {
  const isRound = shape === "round";

  return (
    <section className="mt-6">
      <h2
        className="text-center text-blue-600 font-extrabold text-lg uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-impacted, sans-serif)" }}
      >
        {title}
      </h2>

      {/* Scrollovatelný řádek */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => item.unlocked && onSelect(item.id)}
              className={[
                "relative flex-shrink-0 transition-all duration-200",
                isRound ? "rounded-full" : "rounded-xl",
                isSelected
                  ? "ring-4 ring-amber-400 ring-offset-2 scale-105"
                  : "opacity-80 hover:opacity-100 hover:scale-105",
                !item.unlocked ? "grayscale cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
              style={{ width: isRound ? 72 : 80, height: isRound ? 72 : 80 }}
              title={item.unlocked ? item.alt : "Zamčeno"}
            >
              <div
                className={[
                  "w-full h-full overflow-hidden relative",
                  isRound ? "rounded-full" : "rounded-xl",
                ].join(" ")}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Zamčený overlay */}
              {!item.unlocked && (
                <div
                  className={[
                    "absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg",
                    isRound ? "rounded-full" : "rounded-xl",
                  ].join(" ")}
                >
                  🔒
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}