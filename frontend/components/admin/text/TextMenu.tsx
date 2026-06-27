"use client"

import { RiMap2Line } from "react-icons/ri";
import { MenuCard, MenuCardProps } from "../MenuCard";


const menuItems: MenuCardProps[] = [
  { label: "Regiony", icon: RiMap2Line, href: "/admin/texts/region-infos" }
];

export default function TextMenu() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {menuItems.map((item) => (
          <MenuCard key={item.href} {...item} />
        ))}
      </div>
    </div>
  );
}