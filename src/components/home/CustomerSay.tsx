"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/styles/tailwind";
import { type Testimonial as TestimonialType, testimonials } from "./data";
import { Section, SectionHeader } from "./Section";

const SLIDE_WIDTH = 336; // 320 + 16 gap

function Testimonial({ data }: { data: TestimonialType }) {
    return (
        <div className="w-80 flex-shrink-0 p-6 bg-white dark:bg-black rounded-xl">
            <div className="mb-2 space-y-2">
                <div className="relative w-14 h-14">
                    <Image
                        fill
                        src={data.image}
                        alt={data.name}
                        className="rounded-2xl object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-xs font-bold">{data.name}</h3>
                    <p className="text-xs">
                        {data.position}, {data.company}
                    </p>
                </div>
                <Quote className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-sm font-light leading-relaxed">
                {data.testimonial}
            </p>
        </div>
    );
}

export default function CustomerSay() {
    const [index, setIndex] = useState(0);
    const [withTransition, setWithTransition] = useState(true);
    const trackRef = useRef<HTMLDivElement>(null);

    const duplicated = [...testimonials, ...testimonials];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (index === testimonials.length) {
            // Wait for animation to finish, then reset instantly
            setTimeout(() => {
                setWithTransition(false);
                setIndex(0);
            }, 500);
        } else {
            // Avoid synchronous state update if already true or to prevent loop
            if (!withTransition) {
                setTimeout(() => setWithTransition(true), 0);
            }
        }
    }, [index, withTransition]);

    return (
        <Section id="customersay" className="bg-zinc-100 dark:bg-zinc-900">
            <SectionHeader
                label="Testimonials"
                texts={[
                    "Don't just take our word for it!",
                    "Hear it from our Customers."
                ]}
            />
            <div className="overflow-hidden relative">
                <div
                    ref={trackRef}
                    className={cn(
                        "flex space-x-4",
                        withTransition && "transition-transform duration-500 ease-in-out"
                    )}
                    style={{
                        transform: `translateX(-${index * SLIDE_WIDTH}px)`
                    }}
                >
                    {duplicated.map((t, i) => (
                        <Testimonial key={`${t.id}-${i}`} data={t} />
                    ))}
                </div>
            </div>
        </Section>
    );
}
