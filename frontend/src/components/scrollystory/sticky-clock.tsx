/**
 * Sticky Clock Component with Animated Timeline
 * Location: components/scrollystory/sticky-clock.tsx
 * 
 * Pill layout based on frontend/example/exampe.md
 */

'use client';

import React, { useMemo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { StickyClockProps } from '@/lib/types/scrollystory';

function toAmPm(time24: string): string {
    const [hourStr, minStr] = time24.split(':');
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minStr || '0', 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function StickyClock({ 
    timeRange, 
    textColor, 
    quote,
    isActive,
    scrollProgress
}: StickyClockProps) {
    const [startTime, endTime] = useMemo(() => {
        const [start, end] = timeRange.split(' - ');
        return [toAmPm(start), toAmPm(end)];
    }, [timeRange]);

    const smoothProgress = useSpring(scrollProgress, { 
        stiffness: 120, 
        damping: 30 
    });

    const progress = useTransform(smoothProgress, (value) => `${Math.max(0, Math.min(100, value * 100))}%`);

    return (
        <div 
        className={`sticky top-12 z-30 flex flex-col items-center transition-opacity duration-500 ${
            isActive ? 'opacity-100' : 'opacity-30'
        }`}
        >
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1.5 shadow-2xl flex items-center gap-4">
            <div className="px-4 py-1.5 bg-slate-800 rounded-lg min-w-[100px] text-center">
            <span className="font-mono text-lg text-slate-100 font-bold tracking-tight">
                {startTime}
            </span>
            </div>

            <div className="relative w-56 h-8 flex items-center">
            <div className="absolute inset-0 flex justify-between items-center px-1">
                {Array.from({ length: 20 }).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-[1px] ${i % 5 === 0 ? 'h-4 bg-slate-500' : 'h-2 bg-slate-700'}`} 
                />
                ))}
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 w-full px-1">
                <motion.div 
                className="absolute -top-6 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap z-10 shadow-lg"
                style={{ left: progress }}
                >
                Now
                </motion.div>
                <motion.div 
                className="h-4 w-[2px] bg-orange-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                style={{ left: progress }}
                />
            </div>
            </div>

            <div className="px-4 py-1.5 bg-slate-800 rounded-lg min-w-[100px] text-center">
            <span className="font-mono text-lg text-slate-100 font-bold tracking-tight">
                {endTime}
            </span>
            </div>
        </div>

        <motion.div 
            key={timeRange}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-black/50 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10"
        >
            <p className={`text-xs ${textColor} font-medium uppercase tracking-widest text-center`}>
            {quote}
            </p>
        </motion.div>
        </div>
    );
}
