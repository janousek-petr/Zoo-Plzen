"use client"

import type { IconType } from "react-icons";
import { useRouter } from "next/navigation";

export interface MenuCardProps {
  label: string;
  icon: IconType;
  href: string;
}

export function MenuCard({ label, icon: Icon, href}: MenuCardProps) {
  const router = useRouter();

  return (
    <button
        onClick={() => router.push(href)}
        className={[
            "flex flex-col items-center gap-3 rounded-xl bg-gray-200 lg:py-10 text-center transition-all hover:shadow-sm hover:text-white hover:bg-gray-300 cursor-pointer"
        ].join(" ")}
        >

        <Icon size={70} className=""/>
        
        <p className="text-md text-gray-500 cus-font-swiss-10">{label}</p>
    </button>
  );
}