"use client";

import { useEffect, useRef } from "react";

type Tab = {
  id: string | number;
  name: string;
};

type SlidingTabBarProps = {
  tabs: Tab[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const SlidingTabBar = ({
  tabs,
  activeIndex,
  setActiveIndex,
}: SlidingTabBarProps) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const current = tabsRef.current[activeIndex];
    if (!current || !underlineRef.current) return;

    underlineRef.current.style.left = current.offsetLeft + "px";
    underlineRef.current.style.width = current.offsetWidth + "px";
  }, [activeIndex, tabs]);

  return (
    <div className="flex justify-center w-full">
      <div className="relative flex gap-6 border-b border-gray-200">

        {/* moving underline */}
        <span
          ref={underlineRef}
          className="absolute bottom-0 h-[2px] bg-black transition-all duration-300 ease-in-out"
        />

        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el: HTMLButtonElement | null) => {
            tabsRef.current[i] = el;
            }}
            onClick={() => setActiveIndex(i)}
            className={`relative px-3 py-3 text-sm sm:text-base transition-colors ${
              activeIndex === i
                ? "text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};