/**
 * useScrollSections Hook
 * Location: hooks/use-scroll-sections.ts
 * 
 * Tracks which section is currently active based on scroll position
 * Returns: [activeSection, sectionRefs]
 */

'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

export function useScrollSections(sectionCount: number): [number, RefObject<(HTMLDivElement | null)[]>] {
    const [activeSection, setActiveSection] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sectionRefs.current.forEach((ref, index) => {
            if (ref) {
            const { offsetTop, offsetHeight } = ref;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(index);
            }
            }
        });
        };

        // Set initial active section
        handleScroll();

        // Throttle scroll events for performance
        let ticking = false;
        const throttledScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
            });
            ticking = true;
        }
        };

        window.addEventListener('scroll', throttledScroll);
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [sectionCount]);

    return [activeSection, sectionRefs];
}