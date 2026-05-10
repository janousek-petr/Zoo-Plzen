"use client"

import { RiLayoutGridLine, RiUserLine, RiImageLine } from "react-icons/ri";
import { MenuCard, MenuCardProps } from "./MenuCard";


const menuItems: MenuCardProps[] = [
  { label: "Kvízy", icon: RiLayoutGridLine, href: "/admin/quizzes"},
  { label: "Uživatelé", icon: RiUserLine, href: "/admin/users"},
  { label: "Média", icon: RiImageLine, href: "/admin/media"}
];

export default function QuickMenu() {
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