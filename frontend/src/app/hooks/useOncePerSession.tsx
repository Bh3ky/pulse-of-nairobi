"use client";
import { useEffect, useState } from "react";

export function useOncePerSession(key: string) {
    // initialize to null to detect first render (prevent hydration mismatch)
    const [shouldShow, setShouldShow] = useState<boolean | null>(null);

    useEffect(() => {
        const hasRun = sessionStorage.getItem(key);

        if (!hasRun) {
            sessionStorage.setItem(key, "true");
            setShouldShow(true);
        } else {
            setShouldShow(false);
        }
    }, [key]);

    // return null during SSR/first render to avoid hydration issues
    return shouldShow;

}


