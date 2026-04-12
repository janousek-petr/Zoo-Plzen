import Image from "next/image";

export default function Inventory(){
    return(
        <>
            <main className="py-20">
                <div className="p-8 bg-yellow-500 rounded-full flex justify-self-center">
                    <Image
                        src="/img/icons/inventory-button.png"
                        alt="Tlačítko - Inventář"
                        width={64}
                        height={64}
                    />
                </div>

                <h1 className="text-yellow-500 cus-font-impacted-2 uppercase text-center text-7xl my-10">Tvůj batoh</h1>
                
                <div>
                    <h2 className="text-yellow-500 cus-font-impacted-2 uppercase text-center text-4xl">Tvoje sbírka</h2>


                    <div className="bg-gray-800 opacity-20 py-5 my-10">

                    </div>

                    
                    <div className="bg-gray-800 opacity-20 py-5 my-10">
                        
                    </div>
                </div>
            </main>
        </>
    )
}