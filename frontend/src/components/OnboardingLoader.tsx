// components/OnboardingLoader.tsx
"use client";
import { useEffect, useState } from "react";

interface OnboardingLoaderProps {
    onDone: () => void;
    duration?: number;
}

export function OnboardingLoader({ 
    onDone, 
    duration = 1200 
}: OnboardingLoaderProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let rafId: number;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const percent = Math.min((elapsed / duration) * 100, 100);
            setProgress(Math.floor(percent));

            if (percent < 100) {
                rafId = requestAnimationFrame(animate);
            } else {
                setTimeout(onDone, 150);
            }
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [onDone, duration]);

    return (
    <div 
        className="fixed inset-0 z-[9999]"
        role="status"
        aria-live="polite"
        aria-label={`Loading ${progress}%`}
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("/images/building8.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 9999,
        }}
        >
        {/* Animated background gradient */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div 
            style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.3,
                background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
                transform: `scale(${1 + progress / 100})`,
                transition: 'transform 0.3s ease-out',
            }}
            />
        </div>

        {/* Main content container */}
        <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '2rem',
            padding: '0 1rem'
        }}>
            {/* Progress circle */}
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
            {/* Outer glow ring */}
            <svg 
                viewBox="0 0 200 200"
                style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)',
                    overflow: 'visible',
                }}
                >
                {/* Background circle */}
                <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="12"
                />

                {/* Progress circle */}
                <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                style={{
                    transition: 'stroke-dashoffset 0.3s ease-out',
                }}
                />


                {/* Gradient definition */}
                <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9bf019" />
                    <stop offset="100%" stopColor="#4bd200" />
                </linearGradient>
                </defs>
            </svg>

            {/* Center percentage */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'sans-serif'
            }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.025em' }}>
                {progress}
                <span style={{ fontSize: '1.25rem', fontWeight: 300, marginLeft: '2px' }}>%</span>
                </span>
            </div>
            </div>

            {/* Loading text */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ 
                margin: 0,
                fontSize: '0.75rem', 
                color: '#94a3b8', 
                letterSpacing: '0.25rem', 
                textTransform: 'uppercase', 
                fontWeight: 300,
                fontFamily: 'sans-serif'
            }}>
                Loading Experience
            </p>
            
            {/* Animated dots */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#60a5fa',
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                />
                ))}
            </div>
            </div>
        </div>

        {/* CSS for dot animation */}
        <style jsx>{`
            @keyframes pulse {
            0%, 100% {
                opacity: 0.2;
                transform: scale(0.8);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
            }
        `}</style>
        </div>
    );
}