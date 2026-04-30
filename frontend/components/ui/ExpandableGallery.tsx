"use client";

import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

interface ExpandableGalleryProps {
  title: string;
  items: GalleryItem[];
  collectedCount: number;
  totalCount: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
  highlightedIds?: number[];
  previewCount?: number;
}

export default function ExpandableGallery({
  title,
  items,
  collectedCount,
  totalCount,
  selectedId,
  onSelect,
  highlightedIds = [],
  previewCount = 3,
}: ExpandableGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, previewCount);

  return (
    <section className="mt-6">
      {/*<h2
        className="text-center font-extrabold text-lg uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-impacted, sans-serif)" }}
      >
        {title}
      </h2>*/}

      <div className="flex justify-center mb-4">
        <StatCard
          label={title}
          current={collectedCount}
          total={totalCount}
          bgColor="cus-bg-beige"
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 px-4">
        {visible.map((item) => {
          const isHighlighted = highlightedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="relative aspect-square rounded-full overflow-hidden transition-all duration-200 hover:opacity-90"
            >
              {/* Obrázek — zvýrazněný je menší aby border nepřekrýval sousedy */}
              <div
                className={[
                  "absolute inset-0 transition-all duration-200",
                  isHighlighted ? "scale-100" : "scale-[0.82]",
                ].join(" ")}
                style={{ borderRadius: "inherit" }}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover rounded-full" />
              </div>

              {/* Border — inset, takže nikdy nepřekryje sousedy */}
              {isHighlighted && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 0 3px #fbbf24",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {items.length > previewCount && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex flex-col items-center mx-auto mt-4 text-gray-700 font-bold text-sm uppercase tracking-wider gap-1 hover:text-amber-600 transition-colors"
        >
          <span className="cus-font-impacted-2 uppercase tracking-widest text-4xl font-extrabold">{expanded ? "Skrýt" : "Zobrazit vše"}</span>
          <span
            className="transition-transform duration-300 text-lg"
            style={{ display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </button>
      )}
    </section>
  );
}