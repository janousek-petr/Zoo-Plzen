import Link from "next/link";
import { RiPlayFill } from "react-icons/ri";
import { BsFillBackpack4Fill } from "react-icons/bs";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const items = [
    { href: "/hry/kontinenty", label: "Hrát", icon: RiPlayFill, color: "bg-red-600 hover:bg-red-700" },
    { href: "/profil?tab=batoh", label: "Batoh", icon: BsFillBackpack4Fill, color: "bg-green-500 hover:bg-green-600", width: "30%", pos: { left: "-6%", bottom: "4%" } },
    { href: "/obchod", label: "Obchod", icon: FaShoppingCart, color: "bg-orange-500 hover:bg-orange-600", width: "30%", pos: { left: "50%", bottom: "-6%", transform: "translateX(-50%)" } },
    { href: "/profil", label: "Profil", icon: FaUser, color: "bg-sky-500 hover:bg-sky-600", width: "30%", pos: { right: "-6%", bottom: "4%" } },
];

export default function Home() {
    return (
        <main className="py-16 sm:py-20">
            <h1 className="uppercase cus-font-impacted-2 text-5xl sm:text-6xl md:text-7xl text-green-700 text-center px-4">
                Pojďme hrát
            </h1>

            {/* Mobil (pod sm) - klasická mřížka s viditelnými labely */}
            <section className="sm:hidden grid grid-cols-2 gap-6 max-w-xs mx-auto my-16 px-6">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href} className="group flex flex-col items-center gap-2">
                            <span
                                className={`flex items-center justify-center w-20 h-20 rounded-full ${item.color} text-gray-50 shadow-lg
                                            transition-all duration-200 ease-out
                                            group-hover:-translate-y-1 group-hover:shadow-xl
                                            outline-none group-focus-visible:ring-4 group-focus-visible:ring-sky-400`}
                            >
                                <Icon className="w-9 h-9" />
                            </span>
                            <span className="cus-font-impacted-2 uppercase text-md text-gray-700 tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </section>

            {/* Nad sm - kruhová kompozice s labelem na hover/tap */}
            <section className="hidden sm:block relative mx-auto w-full max-w-sm aspect-8/7 my-20">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isMain = !item.pos;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={isMain ? { width: "50%" } : { width: item.width, ...item.pos }}
                            className={`group absolute aspect-square rounded-full ${item.color} text-gray-50 shadow-lg
                                        flex items-center justify-center
                                        transition-all duration-200 ease-out motion-reduce:transition-none
                                        hover:-translate-y-1 hover:shadow-xl
                                        outline-none focus-visible:ring-4 focus-visible:ring-sky-400
                                        ${isMain ? "top-0 left-1/2 -translate-x-1/2" : ""}`}
                        >
                            <Icon className={isMain ? "w-2/3 h-2/3 -translate-x-1" : "w-2/5 h-2/5"} />

                            {!isMain && (
                                <span
                                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                                               cus-font-impacted-2 uppercase text-lg text-gray-700
                                               opacity-0 translate-y-[-4px]
                                               transition-all duration-150 ease-out motion-reduce:transition-none
                                               group-hover:opacity-100 group-hover:translate-y-0
                                               group-focus:opacity-100 group-focus:translate-y-0"
                                >
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </section>
        </main>
    );
}