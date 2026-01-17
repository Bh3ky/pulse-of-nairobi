"use client";
import { useEffect, useState } from "react";

export function IntroText() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // delay intro text animation slightly after page load
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-4xl mx-auto space-y-8">
                <div 
                    className={`
                        transform transition-all duration-1000 ease-out
                        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}
                        `}
                >
                    {/* TODO: Customise the intro text */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white">
                        Nairobi
                    </h1>
                </div>

                <div 
                    className={`
                        transform transition-all duration-1000 delay-200 ease-out
                        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
                    `}
                >
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                        This is your scrollytelling experience. Add your introduction text here
                        explaining what the project entails and why visitors should keep scrolling.
                    </p>
                </div>
            </div>
        </section>
    )
}