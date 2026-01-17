import Image from "next/image";
import Link from "next/link";
import { type Blog } from "@/lib/blog";

export default function BlogCard({ blog: { slug, imgSrc, title, date, content } }: { blog: Blog }) {
    function markdownToPlainText() {
        return content
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, "")
            // Remove inline code
            .replace(/`[^`]*`/g, "")
            // Remove images
            .replace(/!\[.*?\]\(.*?\)/g, "")
            // Remove links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            // Remove headings
            .replace(/^#{1,6}\s+/gm, "")
            // Remove blockquotes
            .replace(/^>\s+/gm, "")
            // Remove emphasis
            .replace(/[*_~]/g, "")
            // Collapse newlines
            .replace(/\n+/g, " ")
            .trim();
    }

    return (
        <Link href={`/blog/${slug}`}>
            <article className="h-full flex flex-col items-start justify-between p-2 rounded-xl cursor-pointer dark:bg-zinc-900 shadow-md hover:shadow-lg dark:shadow-zinc-800 transition-transform duration-200 ease-in-out hover:scale-102">
                <div className="relative w-full h-60">
                    <Image fill src={imgSrc} alt={title} className="object-cover rounded-lg mb-2" />
                </div>
                <div className="flex items-center gap-x-4 text-xs p-1">
                    <time dateTime={`${new Date(date).getFullYear()}-${new Date(date).getMonth().toString().padStart(2, '0')}-${new Date(date).getDate().toString().padStart(2, '0')}`} className="text-gray-400">
                        {new Date(date).toDateString()}
                    </time>
                </div>
                <div className="group relative grow p-1 min-w-0">
                    <h3 className="mt-3 text-lg font-semibold line-clamp-2 break-normal hyphens-auto">
                        <span className="absolute inset-0" />
                        {title}
                    </h3>

                    <p className="mt-5 text-sm text-gray-400 line-clamp-3 break-normal overflow-hidden">
                        {markdownToPlainText()}
                    </p>
                </div>
            </article>
        </Link>
    )
}