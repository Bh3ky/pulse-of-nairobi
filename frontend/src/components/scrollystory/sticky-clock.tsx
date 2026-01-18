/**
 * Sticky Clock Component with Animated Timeline
 * Location: components/scrollystory/sticky-clock.tsx
 * 
 * Beautiful animated clock showing time progression with scroll
 * Adapted from ScrollClock to work with section-specific time ranges
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { StickyClockProps } from '@/lib/types/scrollystory';

// Helper function to parse time string to minutes
function timeToMinutes(timeStr: string): number {
    const [time, period] = timeStr.split(' ');
    const [hours, mins] = time.split(':').map(Number);
    
    let totalHours = hours;
    if (period === 'PM' && hours !== 12) totalHours += 12;
    if (period === 'AM' && hours === 12) totalHours = 0;
    
    return totalHours * 60 + (mins || 0);
    }

    // Helper function to convert minutes to formatted time string
    function minutesToTime(totalMins: number): string {
    const mins = Math.floor(totalMins) % (24 * 60);
    const hours = Math.floor(mins / 60) % 24;
    const minutes = mins % 60;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    // Helper function to format duration
    function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
    }

    export function StickyClock({ 
    period, 
    timeRange, 
    textColor, 
    isActive 
    }: StickyClockProps) {
    // Parse time range (e.g., "06:00 - 09:00" → start and end times)
    const { startTime, endTime, totalDuration } = useMemo(() => {
        const [start, end] = timeRange.split(' - ');
        
        // Add AM/PM based on 24-hour format
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        
        const startPeriod = startHour < 12 ? 'AM' : 'PM';
        const endPeriod = endHour < 12 ? 'AM' : 'PM';
        
        const startFormatted = `${start} ${startPeriod}`;
        const endFormatted = `${end} ${endPeriod}`;
        
        const startMins = timeToMinutes(startFormatted);
        const endMins = timeToMinutes(endFormatted);
        
        // Handle cases where end time crosses midnight
        let duration = endMins - startMins;
        if (duration < 0) duration += 24 * 60;
        
        return {
        startTime: startFormatted,
        endTime: endFormatted,
        startMinutes: startMins,
        endMinutes: endMins,
        totalDuration: duration
        };
    }, [timeRange]);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { 
        stiffness: 100, 
        damping: 30 
    });
    
    const timeValue = useTransform(
        smoothProgress, 
        [0, 1], 
        [timeToMinutes(startTime), timeToMinutes(startTime) + totalDuration]
    );
    
    const [currentTime, setCurrentTime] = useState(startTime);
    const [elapsed, setElapsed] = useState("0h 0m");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        return timeValue.onChange((v) => {
        const totalMins = Math.floor(v);
        setCurrentTime(minutesToTime(totalMins));
        
        const elapsedMins = totalMins - timeToMinutes(startTime);
        setElapsed(formatDuration(Math.max(0, elapsedMins)));
        
        const progressPercent = (elapsedMins / totalDuration) * 100;
        setProgress(Math.max(0, Math.min(100, progressPercent)));
        });
    }, [timeValue, startTime, totalDuration]);

    // Dynamic color scheme based on period
    const colorScheme = useMemo(() => {
        const schemes: Record<string, { from: string; to: string; glow: string }> = {
        'Morning': { from: 'from-orange-500', to: 'to-amber-500', glow: 'rgba(251,146,60,0.9)' },
        'Mid-Morning': { from: 'from-yellow-500', to: 'to-orange-500', glow: 'rgba(234,179,8,0.9)' },
        'Midday': { from: 'from-amber-500', to: 'to-red-500', glow: 'rgba(245,158,11,0.9)' },
        'Afternoon': { from: 'from-orange-500', to: 'to-pink-500', glow: 'rgba(251,146,60,0.9)' },
        'Evening': { from: 'from-rose-500', to: 'to-purple-500', glow: 'rgba(244,63,94,0.9)' },
        'Night': { from: 'from-indigo-500', to: 'to-purple-600', glow: 'rgba(99,102,241,0.9)' },
        };
        return schemes[period] || schemes['Morning'];
    }, [period]);

    return (
        <div 
        className={`sticky top-8 z-20 flex justify-center mb-8 transition-opacity duration-500 ${
            isActive ? 'opacity-100' : 'opacity-40'
        }`}
        >
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${colorScheme.from}/5 via-transparent ${colorScheme.to}/5`} />
            
            {/* Duration badge */}
            <motion.div 
            className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r ${colorScheme.from} ${colorScheme.to} px-6 py-2 rounded-full shadow-lg`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            >
            <span className="text-white font-bold text-sm tracking-wide">
                {period} • {elapsed}
            </span>
            </motion.div>

            {/* Main timeline container */}
            <div className="flex items-center justify-between w-full mt-6 relative z-10">
            {/* Current Time */}
            <div className="flex flex-col items-center bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-700/30">
                <span className="text-white font-mono font-bold text-3xl md:text-4xl tracking-tight">
                {currentTime}
                </span>
                <span className="text-slate-400 text-xs mt-1 uppercase tracking-wider">Now</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-6 relative">
                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    className={`absolute inset-y-0 left-0 bg-linear-to-r ${colorScheme.from} ${colorScheme.to} rounded-full`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
                </div>
                
                {/* Tick marks */}
                <div className="absolute inset-0 flex justify-between items-center px-1">
                {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                    key={i} 
                    className={`w-0.5 ${i % 5 === 0 ? 'h-6 bg-slate-600' : 'h-3 bg-slate-700'} rounded-full`}
                    />
                ))}
                </div>
                
                {/* Animated progress indicator */}
                <motion.div 
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full`}
                style={{ 
                    left: `${progress}%`, 
                    marginLeft: '-6px',
                    backgroundColor: colorScheme.glow.includes('orange') ? '#f97316' : 
                                colorScheme.glow.includes('indigo') ? '#6366f1' : '#ec4899',
                    boxShadow: `0 0 16px ${colorScheme.glow}`
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

            {/* End Time */}
            <div className="flex flex-col items-center bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-700/30">
                <span className="text-slate-400 font-mono font-bold text-3xl md:text-4xl tracking-tight">
                {endTime}
                </span>
                <span className="text-slate-500 text-xs mt-1 uppercase tracking-wider">End</span>
            </div>
            </div>

            {/* Status indicator */}
            <div className={`mt-6 text-xs flex items-center justify-center gap-2 relative z-10 ${textColor.replace('text-', 'text-')}`}>
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: colorScheme.glow.replace('0.9', '0.6') }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: colorScheme.glow.replace('0.9', '1') }}></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-slate-400">
                Timeline Active
            </span>
            </div>
        </motion.div>
        </div>
    );
}