import Image from "next/image";
import { segments } from "./data";

export default function Segments() {
    return (
        <div className="w-full relative flex justify-center">
            <div className="w-full max-w-3xl md:max-w-5xl xl:max-w-6xl mb-12">
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    {
                        segments.map(({ badge, label, background: bg, description }) => (
                            <div key={label} className="group relative h-72 md:h-100 lg:rounded-4xl overflow-hidden">
                                <div className="absolute z-1 top-6 left-4 bg-white dark:bg-zinc-800 rounded-2xl">
                                    <p className="px-3 py-1 text-xs md:text-sm">{badge}</p>
                                </div>
                                <div className="absolute z-1 w-full h-full bottom-0 bg-linear-to-t from-gray-900/70 px-4 pb-7 flex justify-end items-end">
                                    <p className="text-2xl md:text-4xl text-white font-thin tracking-wide">{label}</p>
                                </div>
                                <div className="absolute z-1 bottom-20 px-4 transition duration-600 ease-in-out opacity-100 lg:opacity-0 group-hover:opacity-100">
                                    <p className="text-sm md:text-xl text-white font-extralight tracking-wide">{description}</p>
                                </div>
                                <Image src={bg} fill alt={label} className="object-cover transition duration-300 ease-in-out transform group-hover:scale-125" />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
