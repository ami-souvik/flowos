import { cn } from "@/styles/tailwind";

export function Section({
    id,
    className,
    children,
}: Readonly<{
    id: string,
    className?: string,
    children: React.ReactNode;
}>) {
    return (
        <div id={id} className={cn("w-full relative flex justify-center", className)}>
            <div className="w-full max-w-3xl md:max-w-5xl xl:max-w-6xl overflow-hidden px-4 py-12">
                {children}
            </div>
        </div>
    )
}

export function SectionHeader({
    label,
    texts,
}: {
    label: string,
    texts?: Array<string>
}) {
    return (
        <div className="pt-4 pb-6">
            <h1 className="pb-4 uppercase font-light text-xs">{label}</h1>
            {texts?.map(l => <p key={l} className="text-3xl md:text-4xl">{l}</p>)}
        </div>
    )
}
