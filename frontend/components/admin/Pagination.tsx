import {RiArrowLeftSLine, RiArrowRightSLine} from 'react-icons/ri'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems?: number
    itemsPerPage?: number
    className?: string
    showCount?: boolean
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                       totalItems,
                                       itemsPerPage = 5,
                                       className = '',
                                       showCount = true,
                                   }: PaginationProps) {
    if (totalPages <= 1) return null

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems ?? 0)

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 ${className}`}>
            {showCount && totalItems !== undefined && (
                <p className="text-sm text-gray-500">
                    Zobrazeno {startIndex + 1}–{endIndex} z {totalItems}
                </p>
            )}

            <div className={`flex items-center gap-1.5 ${!showCount ? 'mx-auto sm:ml-auto sm:mr-0' : ''}`}>
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <RiArrowLeftSLine size={20}/>
                </button>

                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            currentPage === page
                                ? 'bg-sky-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    <RiArrowRightSLine size={20}/>
                </button>
            </div>
        </div>
    )
}