"use client"

import { RiAddFill } from "react-icons/ri";
import { MenuCard, MenuCardProps } from "../MenuCard";
import QuizList from '@/components/admin/quiz/QuizList'


const menuItems: MenuCardProps[] = [
  { label: "Vytvořit kvíz", icon: RiAddFill, href: "/admin/quizzes/create"},
];

export default function QuizMenu() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {menuItems.map((item) => (
          <MenuCard key={item.href} {...item} />
        ))}
      </div>

      <div className="py-6">
        <QuizList/>
      </div>
    </div>
  );
}

