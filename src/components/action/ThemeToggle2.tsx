"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/styles/tailwind";

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <label aria-label="Toggle theme" className={cn("group inline-flex items-center space-x-2 cursor-pointer", className)}>
            <input type="checkbox" value="" className="sr-only" checked={currentTheme === "light"} onChange={() => setTheme(currentTheme === "dark" ? "light" : "dark")} />
            <div className="relative w-10 h-10 peer rounded-full overflow-hidden">
                <div
                    className="
                        absolute w-10 h-20 bg-sky-900
                        transition-transform duration-500 ease-in-out
                        -translate-y-[40px]
                        group-has-[:checked]:translate-y-0
                    "
                >
                    <div className="
                        w-10 h-10 bg-yellow-600 rounded-full
                        flex items-center justify-center
                        transition-transform duration-500 ease-in-out
                        scale-0
                        group-has-[:checked]:scale-100">
                        <Sun
                            className="
                                w-6 h-6 text-white
                                transition-transform duration-700 ease-in-out
                                -translate-y-[40px]
                                group-has-[:checked]:translate-y-0
                            "
                        />
                    </div>
                    <div className="
                        w-10 h-10 flex items-center justify-center
                        transition-transform duration-500 ease-in-out
                        scale-100
                        group-has-[:checked]:scale-0">
                        <Moon
                            className="
                                w-6 h-6 text-white
                                transition-transform duration-1000 ease-in-out
                                group-has-[:checked]:translate-y-[20px]
                            "
                        />
                    </div>
                </div>
            </div>
        </label>
    );
}
