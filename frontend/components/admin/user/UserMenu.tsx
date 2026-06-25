"use client"

import { MenuCard, MenuCardProps } from "../MenuCard";
import { RiAddFill } from "react-icons/ri";
import UserList from "./UserList";

export default function UserMenu(){

    const menuItems: MenuCardProps[] = [
      { label: "Vytvořit uživatele", icon: RiAddFill, href: "/admin/users/create"},
    ];

    return(
        <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {menuItems.map((item) => (
                    <MenuCard key={item.href} {...item} />
                ))}
            </div>

            <div className="py-5">
                <UserList/>
            </div>
               
        </>
    )
}