'use client';

import { motion } from 'framer-motion';
import { calculateCurrentTime, formatTime } from '@/utils/time';

interface ClockProps {
    startHour: number;
    endHour: number;
    progress: number;
    quote?: string;
}

export const Clock = ({ startHour, endHour, progress, quote }: ClockProps) => {
    const currentTime = calculateCurrentTime(startHour, endHour, progress);
    const timeString = formatTime(currentTime);
    
    // Only show clock when progress is active (user is in a cycle section)
    const isVisible = progress > 0.01 && progress < 0.99;

    return (
        <motion.div 
        className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pt-24 pb-4" // Added top-24 to avoid header overlap
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
        {/* Background Card */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-transparent backdrop-blur-sm border-b border-gray-200/50" />
        
        {/* Content */}
        <div className="relative flex flex-col items-center gap-3">
            {/* Glass Container */}
            <div className="flex items-center gap-6 rounded-full bg-black/70 border border-white/20 backdrop-blur-xl px-6 py-4 shadow-2xl">
            
            {/* Left Time Label */}
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-sm border border-white/10">
                {formatTime(startHour)}
            </div>
            
            {/* Scrubber Track */}
            <div className="relative w-64 h-12 flex items-center">
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white/20 rounded-full" />
                
                {/* Ticks */}
                <div className="absolute inset-0 flex justify-between px-1">
                {[...Array(20)].map((_, i) => (
                    <div 
                    key={i} 
                    className={`w-[1px] ${i % 5 === 0 ? 'bg-white/50 h-5' : 'bg-white/20 h-3'}`}
                    />
                ))}
                </div>
                
                {/* Active Bar */}
                <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-orange-500 rounded-full transition-all duration-100 ease-linear shadow-lg shadow-orange-500/50"
                style={{ width: `${progress * 100}%` }}
                />
                
                {/* Indicator */}
                <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-100"
                style={{ left: `${progress * 100}%` }}
                >
                <div className="mb-4 bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl shadow-orange-500/30 border border-orange-400">
                    {timeString}
                </div>
                <div className="w-[3px] h-8 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
                </div>
            </div>
            
            {/* Right Time Label */}
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-sm border border-white/10">
                {formatTime(endHour)}
            </div>
            </div>
            
            {/* Quote */}
            {quote && (
            <p className="text-base text-gray-700 italic max-w-md text-center px-4 font-medium">
                `{quote}`
            </p>
            )}
        </div>
        </motion.div>
    );
};
