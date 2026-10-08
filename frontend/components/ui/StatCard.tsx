export default function StatCard({
  label,
  current,
  total,
  bgColor,
}: {
  label: string;
  current: number;
  total: number;
  bgColor: string;
}) {
  return (
    <div
      className={`${bgColor} w-full max-w-80 h-28 sm:h-40 rounded-lg relative p-2 shadow-xl overflow-hidden mx-auto`}
    >
      <span className="text-white text-4xl sm:text-6xl cus-font-impacted-2 uppercase block leading-none truncate">
        {label}
      </span>
      <span className="text-white/80 text-4xl sm:text-6xl cus-font-impacted-2 absolute bottom-0 right-2 leading-none">
        {current}/{total}
      </span>
    </div>
  );
}