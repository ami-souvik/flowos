import type { MetadataRoute } from "next";
import { blogs } from "@/lib/blog";

type SingleSitemap = {
    url: string;
    lastModified?: string | Date | undefined;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
    priority?: number | undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reflectyourvibe.in";

    const staticRoutes: Array<SingleSitemap> = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    const blogRoutes: Array<SingleSitemap> = Object.keys(blogs).map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(blogs[slug].date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
}
