"use client";
import Image from "next/image";
import { useParallax } from "@/app/hooks/useParallax";

export function ParallaxHero() {
    const parallaxRef =  useParallax(0.4);

    return (
        <section className="relative h-screen overflow-hidden">
            <div
                ref={parallaxRef}
                className="absolute inset-0 -top-20 will-change-transform"
            >
                <Image
                    src="/building.jpg"
                    alt="Nairobi - Building"
                    fill
                    priority
                    className="object-cover"
                    quality={90}
                    sizes="100vw"
                />
            </div>

            <div className="
                absolute inset-0
                bg-transparent-to-b
                from-transparent
                to-black/30
                pointer-events-none
                "
            />
        </section>
    );
}