"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPencilAlt, FaDice, FaLock, FaCheck } from "react-icons/fa";

const unlockedAvatars = [
  "/img/startpage-1.png",
  "/img/startpage-2.png",
  "/img/startpage-3.png",
];

const adjectives = ["Rychlý", "Chytrý", "Veselý", "Modrý", "Silný", "Tichý", "Barevný"];
const animals    = ["Papoušek", "Lev", "Vlk", "Tygr", "Medvěd", "Sokol", "Delfín"];

export default function SettingsTab() {
  const [avatarUrl,  setAvatarUrl]  = useState("/img/startpage-1.png");
  const [firstName,  setFirstName]  = useState("Eliška");
  const [lastName,   setLastName]   = useState("Šťastná");
  const [nickname,   setNickname]   = useState("Barevný Papoušek 127");
  const [age,        setAge]        = useState(9);
  const [difficulty, setDifficulty] = useState("Lehká");

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempPass,     setTempPass]     = useState("");
  const [passError,    setPassError]    = useState(false);

  const generateRandomNickname = () => {
    const adj  = adjectives[Math.floor(Math.random() * adjectives.length)];
    const anim = animals[Math.floor(Math.random() * animals.length)];
    const num  = Math.floor(100 + Math.random() * 900);
    setNickname(`${adj} ${anim} ${num}`);
  };

  const handleNameChange = () => {
    if (tempPass === "heslo123") {
      setEditingField(null);
      setTempPass("");
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const SettingsRow = ({ label, value, onClick, isLocked = false }: any) => (
    <div
      onClick={onClick}
      className="group flex flex-row py-3 bg-gray-300 md:w-xl w-screen rounded-2xl px-10 justify-between transition-colors hover:bg-[#8B4513] cursor-pointer"
    >
      <span className="cus-text-beige-dark uppercase font-bold text-xl flex items-center gap-2 group-hover:text-white">
        {label}
        {isLocked && <FaLock size={14} className="opacity-50" />}
      </span>
      <div className="flex flex-row gap-4 text-black group-hover:text-white transition-colors items-center">
        <span className="font-bold text-xl">{value}</span>
        <span className="font-bold text-green-600 group-hover:text-white text-2xl">{">"}</span>
      </div>
    </div>
  );

  return (
    <div className="py-20 min-h-screen bg-white">
      {/* AVATAR SEKCE */}
      <div
        className="relative flex justify-self-center cursor-pointer group"
        onClick={() => setEditingField("avatar")}
      >
        <div className="relative w-50 h-50">
          <Image
            src={avatarUrl}
            alt="Profilový avatar"
            fill
            className="rounded-full object-cover border-4 border-gray-200 group-hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="absolute bottom-0 right-0 flex items-center justify-center bg-green-600 rounded-full w-16 h-16 shadow-lg group-hover:scale-110 transition-transform">
          <FaPencilAlt size="28" className="text-gray-800" />
        </div>
      </div>

      <div className="my-20 px-4">
        <h1 className="uppercase cus-text-beige cus-font-impacted-2 text-6xl text-center mb-10">
          Nastavení účtu
        </h1>
        <div className="grid gap-4 justify-center">
          <SettingsRow label="Jméno"      value={`${firstName} ${lastName}`} isLocked onClick={() => setEditingField("name")} />
          <SettingsRow label="Přezdívka"  value={nickname}                            onClick={() => setEditingField("nickname")} />
          <SettingsRow label="Věk"        value={age}                                 onClick={() => setEditingField("age")} />
          <SettingsRow label="Obtížnost"  value={difficulty}                          onClick={() => setEditingField("difficulty")} />
        </div>
      </div>

      {/* MODÁLNÍ OKNO */}
      {editingField && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-[#8B4513]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase text-center">
              {editingField === "avatar" ? "Vyber si fotku" : `Změna: ${editingField}`}
            </h2>

            {editingField === "avatar" && (
              <div className="grid grid-cols-3 gap-4 py-4">
                {unlockedAvatars.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => { setAvatarUrl(img); setEditingField(null); }}
                    className={`relative w-20 h-20 cursor-pointer rounded-full overflow-hidden border-4 transition-all ${
                      avatarUrl === img ? "border-green-500 scale-110" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt="Odemknutý avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {editingField === "name" && (
              <div className="space-y-4">
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border-2 rounded-xl" placeholder="Jméno" />
                <input type="text" value={lastName}  onChange={(e) => setLastName(e.target.value)}  className="w-full p-3 border-2 rounded-xl" placeholder="Příjmení" />
                <div className="pt-4 border-t">
                  <p className="text-xs text-red-500 mb-2 font-bold uppercase">Pro potvrzení zadej heslo:</p>
                  <input
                    type="password"
                    value={tempPass}
                    onChange={(e) => setTempPass(e.target.value)}
                    className={`w-full p-3 border-2 rounded-xl ${passError ? "border-red-500" : ""}`}
                    placeholder="Heslo (heslo123)"
                  />
                </div>
                <button onClick={handleNameChange} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">ULOŽIT</button>
              </div>
            )}

            {editingField === "nickname" && (
              <div className="text-center space-y-6">
                <div className="text-2xl font-bold p-4 bg-gray-100 rounded-2xl">{nickname}</div>
                <button onClick={generateRandomNickname} className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600">
                  <FaDice size={24} /> NOVÁ PŘEZDÍVKA
                </button>
                <button onClick={() => setEditingField(null)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">HOTOVO</button>
              </div>
            )}

            {editingField === "age" && (
              <div className="space-y-4 text-center">
                <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value) || 0)} className="w-full text-4xl text-center p-4 border-2 rounded-xl font-bold" />
                <button onClick={() => setEditingField(null)} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl">POTVRDIT</button>
              </div>
            )}

            {editingField === "difficulty" && (
              <div className="grid gap-3">
                {["Lehká", "Střední", "Těžká"].map((level) => (
                  <button
                    key={level}
                    onClick={() => { setDifficulty(level); setEditingField(null); }}
                    className={`py-4 rounded-xl font-bold text-xl transition-all ${
                      difficulty === level ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setEditingField(null)} className="mt-6 w-full text-gray-400 font-bold hover:text-gray-600 uppercase text-sm tracking-widest">
              Zrušit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}