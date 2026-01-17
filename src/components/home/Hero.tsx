"use client"

import _ from 'lodash'
import { useState, useEffect, useRef, useCallback } from "react"
import { MoveRight } from "lucide-react"
import Image from 'next/image'
import { cn } from '@/styles/tailwind'
import { hero } from './data'

type TileProps = {
    depth: number,
    img?: string,
    title?: string,
    description?: string
}

const Tile = ({ depth, ...props }: TileProps) => {
    const tileClasses = [
        "flex-shrink-0 rounded-4xl overflow-hidden",
        "relative w-[18rem] md:w-[20rem] h-[27rem] md:h-[30rem]",
        // Add transition for smooth scaling
        "ease-in-out"
    ]
    const imgClasses = [
        "object-cover rounded-lg",
        "ease-in-out", // base easing
    ]

    switch (depth) {
        case -2:
        case 2:
            tileClasses.push("scale-90 transition-transform duration-700")
            imgClasses.push("opacity-50 transition-opacity duration-700")
            break;
        case -1:
        case 1:
            tileClasses.push("scale-95 transition-transform duration-500")
            imgClasses.push("opacity-50 transition-opacity duration-500")
            break
        default:
            tileClasses.push("scale-100 transition-transform duration-300 mr-4")
            imgClasses.push("opacity-100 transition-opacity duration-300")
            break;
    }
    if (_.isEmpty(props)) return <div className={cn(...tileClasses)} />
    const { img, title } = props
    tileClasses.push("border-3 border-white")
    return (
        <div className={cn(...tileClasses)} style={{ transform: 'translateX(50%)', scrollSnapAlign: 'center' }}>
            {img && title && <Image src={img} alt={title} fill className={cn(...imgClasses)} sizes="(max-width: 768px) 100vw, 300px" priority={depth === 0} />}
            <h1 className="absolute z-1 left-6 bottom-6 text-4xl text-white uppercase">{title}</h1>
            <div className="absolute left-0 bottom-0 h-2/3 w-full bg-linear-to-t from-black/70" />
        </div>
    )
}

export default function Hero() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>(null);
    const [currentIndex, setCurrentIndex] = useState(1);

    // Navigate to specific slide
    const scrollToSlide = (index: number) => {
        setCurrentIndex(index)
        const container = carouselRef.current;
        if (container) {
            const slideWidth = container.scrollWidth / hero.length;
            container.scrollTo({
                left: slideWidth * index,
                behavior: 'smooth'
            });
        }
    };

    // Navigate to next slide
    const goToNext = () => {
        const newIndex = currentIndex < hero.length - 2 ? currentIndex + 1 : 1;
        scrollToSlide(newIndex);
    };

    const nextSlide = goToNext;
    
    const prevSlide = () => {
         const newIndex = currentIndex > 1 ? currentIndex - 1 : hero.length - 2;
         scrollToSlide(newIndex);
    }

    // Auto play functionality
    const startAutoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            goToNext();
        }, 2000); // Faster auto-play (2 seconds instead of 3)
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Auto-play functionality
    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [startAutoPlay]); // Add startAutoPlay to dependency array

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []); // Remove hero.length from dependency array

    return (
        <div className="relative max-w-3xl md:max-w-5xl xl:max-w-6xl overflow-hidden mb-6 rounded-4xl mx-4 lg:mx-auto bg-black">
            <div className="h-full grid grid-cols-1 md:grid-cols-[720px_1fr] items-center">
                <div
                    ref={carouselRef}
                    className="my-4 flex overflow-x-auto scrollbar-hide"
                    style={{
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'auto',
                        // Hide scrollbar
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {
                        hero.map((t, i) => (
                            <Tile
                                key={i} // Key helps with re-rendering
                                depth={i !== currentIndex ? -1 : 0}
                                {...t}
                            />
                        ))
                    }
                </div>
                <div className='h-full z-1 px-6 pb-4 flex flex-col justify-end bg-black'>
                    <button
                        className="relative w-60 p-4 cursor-pointer flex justify-between items-center text-xl text-white font-light mb-2 bg-teal-700"
                        onClick={() => document.getElementById('getquote')?.scrollIntoView({ behavior: "smooth" })}>
                        <p>Get Started</p>
                        <MoveRight />
                    </button>
                    <p className="h-[72px] md:h-[120px] text-sm md:text-lg font-thin text-white">
                        {hero[Math.max(0, Math.min(hero.length - 1, currentIndex))]?.description}
                    </p>
                </div>
            </div>
        </div>
    )
}