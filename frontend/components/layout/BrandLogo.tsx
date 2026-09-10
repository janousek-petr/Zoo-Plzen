'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
    href?: string;
    className?: string;
}

export default function BrandLogo({href = '/', className = ''}: BrandLogoProps) {
    const content = (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            {/* Logo ZOO Plzeň */}
            <div className="relative w-14 h-14 shrink-0">
                <Image
                    src="/img/logos/zoo-color.png" // Uprav název podle tvého souboru
                    alt="ZOO Plzeň"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Oddělovací čára */}
            <div className="w-[3px] h-10 bg-gray-900 rounded-full shrink-0"/>

            {/* Logo ZOO v Kapse - ukotvené vlevo těsně u čáry */}
            <Image
                src="/img/logos/zoo_v_kapse_logo.png" // Uprav název podle tvého souboru
                alt="ZOO v Kapse"
                width={140}
                height={48}
                className="h-12 w-auto shrink-0 object-contain"
                priority
            />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block">
                {content}
            </Link>
        );
    }

    return content;
}