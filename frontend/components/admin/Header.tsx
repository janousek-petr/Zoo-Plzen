import Link from 'next/link'
import { RiArrowLeftLine } from 'react-icons/ri'

export default function Header({title, href} : {title : string, href : string}){
    return(
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-8">
            <div className="flex items-center gap-4">
                <Link href={href} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors">
                    <RiArrowLeftLine className="text-xl" />
                </Link>
                <h1 className="text-3xl cus-font-impacted uppercase">{title}</h1>
            </div>
        </header>
    )
}