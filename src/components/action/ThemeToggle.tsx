"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
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
        <label aria-label="Toggle theme" className="inline-flex items-center space-x-2 cursor-pointer">
            <Sun width={24} height={24} className={currentTheme === "light" ? 'p-1 rounded-full bg-yellow-600' : 'p-1 rounded-full'} />
            <input type="checkbox" value="" className="sr-only peer" checked={currentTheme === "dark"} onChange={() => setTheme(currentTheme === "dark" ? "light" : "dark")} />
            <div className="relative w-9 h-5 peer-focus:outline-none peer-hover:ring-4 peer-hover:ring-brand-soft dark:peer-hover:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"
                style={{
                    backgroundColor: currentTheme === "light" ? 'var(--color-yellow-600)' : 'var(--color-sky-900)'
                }} />
            <Moon width={24} height={24} className={currentTheme === "dark" ? 'p-1 rounded-full bg-sky-900' : 'p-1 rounded-full'} />
        </label>
    );
}
