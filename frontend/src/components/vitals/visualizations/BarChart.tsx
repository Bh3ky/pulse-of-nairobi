'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface BarData {
    label: string;
    value: number;
}

interface BarChartProps {
    bars: BarData[];
    height?: number;
    delay?: number;
    minLabel?: string;
    maxLabel?: string;
    color?: string;
}

export const BarChart = ({ 
    bars, 
    height = 192, 
    delay = 0.8, 
    minLabel = "Low",
    maxLabel = "High",
    color = "from-orange-500 to-orange-300"
    }: BarChartProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref}>
        <div className="flex items-end justify-between gap-4" style={{ height: `${height}px` }}>
            {bars.map((bar, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <motion.div
                className={`w-full bg-gradient-to-t ${color} rounded-t-lg`}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${bar.value}%` } : {}}
                transition={{ duration: 1, delay: delay + i * 0.1, ease: "easeOut" }}
                />
                <span className="text-xs font-medium text-gray-600">{bar.label}</span>
            </div>
            ))}
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
        </div>
        </div>
    );
};