{/*import Image from "next/image";

export default function Inventory() {
    // 1. SIMULACE DATABÁZE
    const players = [
        { id: 1, name: "David M.", points: 32, avatar: "/img/startpage-2.png" },
        { id: 2, name: "Klára V.", points: 29, avatar: "/img/startpage-1.png" },
        { id: 3, name: "Jakub T.", points: 28, avatar: "/img/startpage-3.png" },
        { id: 4, name: "Karel N.", points: 24, avatar: "/img/startpage-1.png" },
        { id: 5, name: "Eva K.", points: 23, avatar: "/img/startpage-1.png" },
        { id: 6, name: "Tomáš H.", points: 21, avatar: "/img/startpage-1.png" },
        { id: 7, name: "Lucie M.", points: 19, avatar: "/img/startpage-1.png" },
        { id: 8, name: "Jan S.", points: 18, avatar: "/img/startpage-1.png" },
        { id: 9, name: "Petra B.", points: 17, avatar: "/img/startpage-1.png" },
        { id: 10, name: "Martin F.", points: 15, avatar: "/img/startpage-1.png" },
    ];

    // Simulace dat aktuálně přihlášeného uživatele (Toho, co si stránku prohlíží)
    const currentUser = {
        id: 99,
        rank: 53,
        name: "Jan M.",
        points: 5,
        avatar: "/img/startpage-1.png"
    };

    // 2. ROZDĚLENÍ DAT
    const firstPlace = players[0];
    const secondPlace = players[1];
    const thirdPlace = players[2];
    const restOfPlayers = players.slice(3);

    return (
        <>
            <main className="py-20 max-w-3xl mx-auto px-4">
                
                {/* TVOJE HLAVIČKA A IKONA *//*}
                <div className="p-8 bg-fuchsia-800 rounded-full flex justify-self-center w-max mx-auto shadow-lg">
                    <Image
                        src="/img/icons/leaderboards-button.png"
                        alt="Tlačítko - Žebříček"
                        width={64}
                        height={64}
                    />
                </div>

                <h1 className="text-fuchsia-800 cus-font-impacted-2 uppercase text-center text-7xl my-10 drop-shadow-sm">
                    Žebříček
                </h1>

                {/* STUPNĚ VÍTĚZŮ (1. - 3. místo) *//*}
                <div className="flex flex-row justify-center items-end mb-16">
                    
                    {/* 2. MÍSTO *//*}
                    {secondPlace && (
                        <div className="flex flex-col items-center">
                            <Image src={secondPlace.avatar} alt={secondPlace.name} width={64} height={64} className="rounded-full mb-1 z-20 shadow-md object-cover" />
                            <span className="text-sm font-semibold text-gray-700 mb-2 truncate max-w-20">{secondPlace.name}</span>
                            <div className="bg-gray-400 h-32 w-35 flex flex-col items-center pt-4 shadow-lg z-10 text-xl">
                                <p className="font-bold text-xl text-white mb-2">2.</p>
                                {/* PŘIDÁNY PAČKY PRO 2. MÍSTO *//*}
                                <div className="flex items-center gap-1 font-mono font-bold text-white">
                                    <span>{secondPlace.points}</span>
                                    <Image src="/img/startpage-1.png" alt="Ikona pačky" width={30} height={30} className="rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1. MÍSTO *//*}
                    {firstPlace && (
                        <div className="flex flex-col items-center">
                            <Image src={firstPlace.avatar} alt={firstPlace.name} width={80} height={80} className="rounded-full mb-1 z-20 shadow-md object-cover" />
                            <span className="text-base font-bold text-gray-800 mb-2 truncate max-w-20">{firstPlace.name}</span>
                            <div className="bg-amber-400 h-48 w-35 flex flex-col items-center pt-4 shadow-xl z-20">
                                <p className="font-bold text-2xl text-white mb-2">1.</p>
                                {/* PŘIDÁNY PAČKY PRO 1. MÍSTO *//*}
                                <div className="flex items-center gap-1 font-mono font-bold text-white text-xl">
                                    <span>{firstPlace.points}</span>
                                    <Image src="/img/startpage-1.png" alt="Ikona pačky" width={30} height={30} className="rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. MÍSTO *//*}
                    {thirdPlace && (
                        <div className="flex flex-col items-center">
                            <Image src={thirdPlace.avatar} alt={thirdPlace.name} width={64} height={64} className="rounded-full mb-1 z-20 shadow-md object-cover" />
                            <span className="text-sm font-semibold text-gray-700 mb-2 truncate max-w-20">{thirdPlace.name}</span>
                            <div className="bg-[#cd7f32] h-24 w-35 flex flex-col items-center pt-4 shadow-md z-10">
                                <p className="font-bold text-lg text-white mb-2">3.</p>
                                {/* PŘIDÁNY PAČKY PRO 3. MÍSTO *//*}
                                <div className="flex items-center gap-1 font-mono font-bold text-white text-xl">
                                    <span>{thirdPlace.points}</span>
                                    <Image src="/img/startpage-1.png" alt="Ikona pačky" width={30} height={30} className="rounded-full object-cover" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SEZNAM OSTATNÍCH (4. až 10. místo) *//*}
                <div className="bg-gray-600/30 p-5 rounded-3xl">
                    <div className="flex flex-col gap-3">
                        {restOfPlayers.map((player, index) => {
                            const rank = index + 4; 
                            return (
                                <div key={player.id} className="flex items-center justify-between bg-white p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-gray-400 w-8 text-right">{rank}.</span>
                                        <Image src={player.avatar} alt={player.name} width={48} height={48} className="rounded-full object-cover" />
                                        <span className="font-semibold text-gray-800">{player.name}</span>
                                    </div>
                                    <div className="pr-4 font-mono font-bold text-amber-500 flex items-center gap-1.5">
                                        <span className="text-lg">{player.points}</span>
                                        <Image 
                                            src="/img/startpage-1.png" 
                                            alt="Ikona packy" 
                                            width={35} 
                                            height={35} 
                                            className="rounded-full object-cover" 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                
                    {/* ODDĚLOVAČ *//*}
                    <hr className="my-8 text-gray-50"/>
                    {/* TVOJE OSOBNÍ POZICE *//*}
                    <div className="flex items-center justify-between bg-fuchsia-800 p-3 shadow-md sticky bottom-4 z-30">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-white w-8 text-right">
                                {currentUser.rank}.
                            </span>
                            <Image 
                                src={currentUser.avatar} 
                                alt={currentUser.name} 
                                width={48} 
                                height={48} 
                                className="rounded-full object-cover border-2 border-white"
                            />
                            <span className="font-bold text-white">
                                {currentUser.name + " (Ty)"}
                            </span>
                        </div>
                        <div className="pr-4 font-mono font-bold text-white flex items-center gap-1.5">
                            <span className="text-lg">{currentUser.points}</span>
                            <Image 
                                src="/img/startpage-1.png" 
                                alt="Ikona pačky" 
                                width={34} 
                                height={34} 
                                className="rounded-full object-cover border" 
                            />
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}*/}