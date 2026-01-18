'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface RingData {
    value: number;
    max: number;
    color: string;
    icon: React.ElementType;
    label: string;
}

interface RingChartProps {
    rings: RingData[];
    delay?: number;
}

export const RingChart = ({ rings, delay = 0.4 }: RingChartProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const circumference = 251.2; // 2 * PI * 40

    return (
        <div ref={ref} className="flex justify-around items-center">
        {rings.map((ring, index) => (
            <div key={index} className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <motion.circle
                cx="48" cy="48" r="40"
                stroke={ring.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={isInView ? { 
                    strokeDashoffset: circumference * (1 - ring.value / ring.max) 
                } : {}}
                transition={{ duration: 1.2, delay: delay + index * 0.2 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ring.icon className="w-6 h-6" style={{ color: ring.color }} />
                <span className="text-xs font-bold">{ring.label}</span>
            </div>
            </div>
        ))}
        </div>
    );
};