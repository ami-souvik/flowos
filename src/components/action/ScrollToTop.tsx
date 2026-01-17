"use client";

import { ChevronsUp } from "lucide-react";

export function ScrollToTop() {
    return (
        <button
            onClick={() => scrollTo(0, 0)}
            className="
                w-48 py-2 pr-2
                flex justify-center items-center
                bg-teal-700 font-normal
                cursor-pointer
            "
        >
            <ChevronsUp />
            <p className="-mb-[2px]">BACK TO TOP</p>
        </button>
    );
}
