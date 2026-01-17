"use client";

import Image from "next/image";
import { partners } from "./data";
import { Section } from "./Section";

export default function Partners() {
    return (
        <Section id="partners" className="bg-zinc-100 dark:bg-zinc-500">
            <div className="flex w-max gap-10 px-6 animate-partner-scroll">
                {[...partners, ...partners].map(({ title, img, objectFit }, index) => (
                    <div
                        key={`${title}-${index}`}
                        className="relative flex-shrink-0 h-16 w-28 sm:h-18 sm:w-32 md:h-20 md:w-40">
                        <Image
                            src={img}
                            alt={title}
                            fill
                            className="object-contain"
                            style={{ objectFit }}
                            sizes="160px"
                        />
                    </div>
                ))}
            </div>
        </Section >
    );
}
