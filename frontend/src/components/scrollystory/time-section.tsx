'use client';

/**
 * Time Section Component
 * Location: components/scrollystory/time-section.tsx
 * 
 * Main section displaying a single time period with:
 * - Sticky clock header
 * - Quote
 * - Split layout: City image (left) + Vitals dashboard (right)
 */

import React, { useRef } from 'react';
import Image from 'next/image'; 
import { motion, useScroll } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { StickyClock } from './sticky-clock';
import { VitalsDashboard } from './vitals-dashboard';
import { TimeSectionProps } from '@/lib/types/scrollystory';

export function TimeSection({ data, isActive }: TimeSectionProps) {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    return (
        <div ref={sectionRef} className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex flex-col items-center">
            <StickyClock
            timeRange={data.timeRange}
            textColor={data.textColor}
            quote={data.quote}
            isActive={isActive}
            scrollProgress={scrollYProgress}
            />
        </div>

        <div className="grid grid-cols-12 gap-6 mt-10">

            {/* LEFT: Image Card */}
            <motion.div
            className="col-span-12 lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
            transition={{ duration: 0.6 }}
            >
            <Card className="relative h-[520px] overflow-hidden border border-slate-800/70 bg-slate-950/70 shadow-2xl">
                <div className="absolute inset-0">
                    <Image
                    src={data.imageUrl}
                    alt={`${data.period} cityscape`}
                    fill
                    priority={isActive}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h3 className="text-3xl font-semibold text-white mb-2">
                    {data.period}
                    </h3>
                    <p className="text-sm text-slate-200/80 max-w-sm">
                    {data.quote}
                    </p>
                </div>
            </Card>
            </motion.div>

            {/* RIGHT: Vitals */}
            <motion.div
            className="col-span-12 lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            >
            <div className="lg:max-h-[520px] lg:overflow-y-auto lg:pr-2">
                <VitalsDashboard vitals={data.vitals} />
            </div>
            </motion.div>

        </div>
        </div>
    );
}
