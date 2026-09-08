"use client";

import { RiSearchLine } from "react-icons/ri";

export type TypeFilter = "all" | "image" | "audio";
export type SortOption = "newest" | "oldest" | "name" | "size";

interface MediaFilterBarProps {
    searchQuery: string;
    typeFilter: TypeFilter;
    sortBy: SortOption;
    onSearchChange: (value: string) => void;
    onTypeFilterChange: (filter: TypeFilter) => void;
    onSortChange: (sort: SortOption) => void;
    hideTypeFilter?: boolean;
}

export default function MediaFilterBar({
                                           searchQuery,
                                           typeFilter,
                                           sortBy,
                                           onSearchChange,
                                           onTypeFilterChange,
                                           onSortChange,
                                           hideTypeFilter = false,
                                       }: MediaFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Vyhledat podle názvu..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 outline-none focus:border-sky-500 transition-colors shadow-sm"
                />
            </div>

            <div className="flex items-center gap-2">
                {/* Zobrazí se pouze v případě, že filtry nejsou skryté */}
                {!hideTypeFilter && (
                    <select
                        value={typeFilter}
                        onChange={(e) => onTypeFilterChange(e.target.value as TypeFilter)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-sky-500 shadow-sm cursor-pointer h-full"
                    >
                        <option value="all">Vše</option>
                        <option value="image">Obrázky</option>
                        <option value="audio">Audio</option>
                    </select>
                )}

                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:border-sky-500 shadow-sm cursor-pointer h-full"
                >
                    <option value="newest">Nejnovější</option>
                    <option value="oldest">Nejstarší</option>
                    <option value="name">Název (A–Z)</option>
                    <option value="size">Velikost</option>
                </select>
            </div>
        </div>
    );
}
