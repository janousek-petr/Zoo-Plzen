"use client"

import { RiUserLine, RiMagicLine, RiImageLine, RiMedalLine } from "react-icons/ri";
import { MenuCard, MenuCardProps } from "./MenuCard";


const menuItems: MenuCardProps[] = [
  { label: "Profilovky", icon: RiUserLine, href: "/admin/items/profile-images" },
  { label: "Doplňky",    icon: RiMagicLine, href: "/admin/items/hats" },
  { label: "Tapety",     icon: RiImageLine, href: "/admin/items/wallpapers" },
  { label: "Medaile",    icon: RiMedalLine, href: "/admin/items/medals" },
];

export default function ItemMenu() {
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