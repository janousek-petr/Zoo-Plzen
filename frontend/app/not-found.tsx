import Link from "next/link"

export default function NotFound(){
    return(
    <>
        <main className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
            <div>
                <h1 className="text-8xl cus-font-impacted-2 text-sky-700">404</h1>
                <h2 className="text-3xl cus-font-impacted text-sky-700 uppercase">Stránka nenalezena</h2>
            </div>

            <div>
                <p className="text-lg">Ups, tak moc jsi hledal, až ses ztratil.😁</p>
            </div>
            <Link
                href="/domov"
                className="bg-sky-600 text-white text-center px-6 py-5 sm:px-8 sm:py-3 md:px-10
                        rounded-md font-bold sm:text-lg md:text-xl border-3 border-sky-600 cus-font-swiss-10
                        transition-all duration-150 cursor-pointer
                        hover:bg-sky-800 hover:border-sky-800"
            >
                Vrátit zpátky
            </Link>
        </main>
    </>
    )
}