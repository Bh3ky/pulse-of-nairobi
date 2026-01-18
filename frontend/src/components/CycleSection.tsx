'use client';

import { useRef, useEffect } from 'react';
import { useScroll } from 'framer-motion';

interface CycleSectionProps {
    id: string;
    startHour: number;
    endHour: number;
    quote?: string;
    children: React.ReactNode;
    onUpdate: (data: { start: number; end: number; progress: number; quote?: string }) => void;
}

const CycleSection = ({ id, startHour, endHour, quote, children, onUpdate }: CycleSectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            if (latest > 0 && latest < 1) {
                onUpdate({ start: startHour, end: endHour, progress: latest, quote });
            }
        });
    }, [scrollYProgress, startHour, endHour, quote, onUpdate]);

    return (
        <section ref={containerRef} id={id} className="min-h-[200vh] relative">
            {children}
        </section>
    );
};