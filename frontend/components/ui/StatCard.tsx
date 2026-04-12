export default function StatCard({ label, current, total, bgColor }: { label: string, current: number, total: number, bgColor: string }) {
    return (
        <div className={`${bgColor} w-80 h-40 rounded-lg relative p-2 shadow-xl`}>
            <span className="text-white text-6xl cus-font-impacted-2 uppercase block leading-none">
                {label}
            </span>
            <span className="text-white/80 text-6xl cus-font-impacted-2 absolute bottom-0 right-2">
                {current}/{total}
            </span>
        </div>
    );
}