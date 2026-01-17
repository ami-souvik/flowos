"use client";

import Link from "next/link";
import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/styles/tailwind";

interface ScrollLinkProps extends ButtonHTMLAttributes<HTMLAnchorElement> {
    primary?: boolean;
    route: string;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

/**
 * ScrollLink
 * - actionType="id"   → smooth scroll to element id on the same page
 * - actionType="link" → Next.js route navigation
 */
export function ScrollLink({
    primary = false,
    route,
    className,
    children,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ScrollLinkProps) {
    return (
        <Link
            href={route}
            className={cn(
                "whitespace-nowrap rounded-4xl hover:opacity-90",
                "h-10 px-4 py-2 inline-flex items-center justify-center gap-2",
                primary ? "bg-teal-700 text-white" : "bg-gray-200 dark:bg-zinc-700",
                className
            )}
            aria-disabled={disabled || loading}
            {...props}
        >
            {leftIcon && !loading && leftIcon}
            {children}
            {rightIcon && !loading && rightIcon}
        </Link>
    );
}
