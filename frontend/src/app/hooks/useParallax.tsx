"use client";
import { useEffect, useRef } from "react";

export function useParallax(speed = 0.3) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (!ref.current) return;

                    const offset = window.scrollY * speed;
                    ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;

                    ticking = false;
                });
                ticking = true;
            }
        };

        // initial position
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [speed]);

    return ref;
}