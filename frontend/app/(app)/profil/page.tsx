"use client";

import { useState, useEffect } from "react"; // Přidán useEffect
import { useSearchParams } from "next/navigation"; // Přidán hook pro parametry
import { SlidingTabBar } from "@/components/ui/SlidingTabBar";
import ProfileTab from "./_tabs/ProfileTab";
import BackpackTab from "./_tabs/BackpackTab";
import MedalTab from "./_tabs/MedalTab";

const tabs = [
  { id: "profil",    name: "Profil" },
  { id: "batoh",     name: "Batoh" },
  //{ id: "medaile",   name: "Medaile" },
];

export default function Profile() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  // useEffect se spustí po načtení stránky a zkontroluje parametr v URL
  useEffect(() => {
    const tabParam = searchParams.get("tab"); // hledá ?tab=něco
    if (tabParam) {
      const index = tabs.findIndex((t) => t.id === tabParam);
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [searchParams]);

  return (
    <main className="py-20">
      <div className="pb-5">
        <SlidingTabBar
          tabs={tabs}
          activeIndex={activeTab}
          setActiveIndex={setActiveTab}
        />
      </div>

      <div className={activeTab === 0 ? "block" : "hidden"}><ProfileTab /></div>
      <div className={activeTab === 1 ? "block" : "hidden"}><BackpackTab /></div>
      <div className={activeTab === 2 ? "block" : "hidden"}><MedalTab /></div>
    </main>
  );
}