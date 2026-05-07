"use client";

import Image from "next/image";

interface UserSelection {
  id: number;
  name: string;
  avatarUrl: string;
}

export default function ProfileSelection() {
  const profiles: UserSelection[] = [
    { id: 1, name: "Eliška", avatarUrl: "/img/startpage-1.png" },
    { id: 2, name: "Pavel", avatarUrl: "/img/startpage-1.png" },
    { id: 3, name: "Děti", avatarUrl: "/img/startpage-1.png" },
    { id: 4, name: "Host", avatarUrl: "/img/startpage-1.png" },
  ];

  const customHexColors = [
    "#0072BC", // palearktická
    "#ED1C24", // australská
    "#00A65D", // netropická
    "#BD9554", // etiopská
    "#FDB913", // orientální
    "#8E5233", // nearktická
  ];

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-white p-10">
      <h1 className="text-7xl text-center cus-font-impacted-2 uppercase leading-none text-sky-600 pt-5 p-5">
        Zvol si profil
      </h1>
      <h3 className="text-3xl text-center font-bold leading-none text-black pb-10">
        Kdo si dnes zahraje?
      </h3>

      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map((profile, index) => {
          const hexColor = customHexColors[index % customHexColors.length];

          return (
            /* HLAVNÍ OBAL - Tady hlídáme hover pro celou skupinu */
            <div 
              key={profile.id} 
              className="group flex flex-col items-center cursor-pointer"
              onMouseEnter={(e) => {
                // Najdeme vnořený rámeček a text a obarvíme je naráz
                const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                const nameSpan = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                if (borderDiv) borderDiv.style.borderColor = hexColor;
                if (nameSpan) nameSpan.style.color = hexColor;
              }}
              onMouseLeave={(e) => {
                // Vratíme barvy do původního stavu
                const borderDiv = e.currentTarget.querySelector('.profile-border') as HTMLElement;
                const nameSpan = e.currentTarget.querySelector('.profile-name') as HTMLElement;
                if (borderDiv) borderDiv.style.borderColor = 'transparent';
                if (nameSpan) nameSpan.style.color = '#374151'; // Původní gray-700
              }}
            >
              {/* Rámeček - přidali jsme třídu 'profile-border' pro snadné zacílení */}
              <div className="profile-border relative w-32 h-32 md:w-48 md:h-48 border-8 border-transparent rounded-full p-1 transition-all duration-300">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>

              {/* Jméno - přidali jsme třídu 'profile-name' */}
              <span className="profile-name mt-4 text-2xl font-bold text-gray-700 transition-colors duration-300">
                {profile.name}
              </span>
            </div>
          );
        })}

        {/* PLUSKO - Zůstává jednodušší přes group-hover, protože barva je statická */}
        <div className="group flex flex-col items-center cursor-pointer">
          <div className="relative w-32 h-32 md:w-48 md:h-48 border-4 border-dashed border-gray-300 group-hover:border-sky-600 group-hover:bg-sky-50 rounded-full flex items-center justify-center transition-all duration-300">
            <span className="text-9xl text-gray-300 group-hover:text-sky-600 transition-all duration-300 leading-none pb-3 select-none">
              +
            </span>
          </div>
          <span className="mt-4 text-xl font-medium text-gray-400 group-hover:text-sky-600 transition-colors">
            Přidat profil
          </span>
        </div>
      </div>

      <button className="mt-16 border-2 font-bold border-gray-400 text-gray-500 px-8 py-3 uppercase tracking-widest hover:border-sky-600 hover:text-sky-600 transition-all">
        Spravovat profily
      </button>
    </main>
  );
}