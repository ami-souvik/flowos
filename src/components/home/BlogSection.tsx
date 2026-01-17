import { blogs } from "@/lib/blog";
import BlogCard from "../blog/BlogCard";
import { Section, SectionHeader } from "./Section";

export default function BlogSection() {
    return (
        <Section id="blog">
            <SectionHeader label="blog" texts={["From Interior Design Blog"]} />
            <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.values(blogs).slice(0, 3).map(b => <BlogCard key={b.slug} blog={b} />)}
            </div>
        </Section>
    );
}
