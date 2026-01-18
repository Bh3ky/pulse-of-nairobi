'use client';

import React, { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface PieSegment {
    name: string;
    value: number;
    color: string;
    icon: React.ElementType;
}

interface PieChartProps {
    segments: PieSegment[];
    delay?: number;
}

export const PieChart = ({ segments, delay = 0.6 }: PieChartProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    let cumulativePercent = 0;

    return (
        <div ref={ref} className="flex items-center gap-8">
        <svg width="140" height="140" viewBox="0 0 140 140">
            {segments.map((segment, i) => {
            const startAngle = (cumulativePercent / 100) * 360;
            const endAngle = ((cumulativePercent + segment.value) / 100) * 360;
            cumulativePercent += segment.value;

            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 70 + 60 * Math.cos(startRad);
            const y1 = 70 + 60 * Math.sin(startRad);
            const x2 = 70 + 60 * Math.cos(endRad);
            const y2 = 70 + 60 * Math.sin(endRad);
            
            const largeArc = segment.value > 50 ? 1 : 0;
            const pathData = `M 70 70 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
                <motion.path
                key={i}
                d={pathData}
                fill={segment.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: delay + i * 0.1 }}
                />
            );
            })}
            <circle cx="70" cy="70" r="30" fill="white" />
        </svg>

        <div className="space-y-3 flex-1">
            {segments.map((segment, i) => (
            <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: delay + 0.2 + i * 0.1 }}
            >
                <segment.icon className="w-5 h-5" style={{ color: segment.color }} />
                <span className="text-sm font-medium flex-1">{segment.name}</span>
                <span className="text-sm font-bold text-gray-700">{segment.value}%</span>
            </motion.div>
            ))}
        </div>
        </div>
    );
};