
interface SpeechBalloonProps{
    title: string;
    text: string;
    bgColorClass: string;
}


export default function SpeechBalloon({title, text, bgColorClass} : SpeechBalloonProps) {
    

    return (
        <div className="relative md:translate-y-1/4 md:left-20 inline-block max-w-[90%] md:max-w-125 md:-top-80 z-10">
            <div className="relative rounded-4xl p-5 z-20" style={{background: bgColorClass}}>
                <h4 className="text-white uppercase text-xl sm:text-2xl md:text-3xl mb-2 cus-font-impacted">
                    {title}
                </h4>
                <p className="text-white text-sm sm:text-base md:text-lg">
                    {text}
                </p>
            </div>
        <div className="absolute z-10 w-10 h-10 sm:w-10 sm:h-10 rotate-45 md:top-10 md:-left-5 -bottom-5 left-15" style={{background: bgColorClass}}></div>
        </div>
    );
}