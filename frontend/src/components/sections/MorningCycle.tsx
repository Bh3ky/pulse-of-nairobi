"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { WeatherVital } from "@/components/vitals/morning/WeatherVital";
import { TransportVital } from "@/components/vitals/morning/TransportVital";
import { CongestionVital } from "@/components/vitals/morning/CongestionVital";

interface ClockState {
  start: number;
  end: number;
  progress: number;
  quote?: string;
}

interface MorningCycleProps {
  onClockUpdate: (data: ClockState) => void;
}

export default function MorningCycle({ onClockUpdate }: MorningCycleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateClock = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isInView = rect.top < windowHeight && rect.bottom > 0;

      const progress = isInView
        ? Math.max(
            0,
            Math.min(
              1,
              (windowHeight - rect.top) / (rect.height + windowHeight)
            )
          )
        : 0;

      onClockUpdate({
        start: 6,
        end: 10,
        progress,
        quote: "The vibrant city awakens to a new day",
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateClock();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    updateClock(); // initial sync

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="morning-cycle"
      className="min-h-[200vh] bg-gradient-to-b from-orange-50 to-amber-50"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            {/* LEFT COLUMN */}
            <motion.div
              className="rounded-xl overflow-hidden border-2 border-gray-300 shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[700px] bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center">
                <div className="text-white text-center p-8 opacity-90">
                  <h2 className="text-5xl font-bold mb-4">
                    Rush Hour Nairobi
                  </h2>
                  <p className="text-xl">
                    Morning commute in the heart of the city
                  </p>
                  <p className="text-sm mt-4 italic">
                    Replace this div with your actual image
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              <WeatherVital />
              <TransportVital />
              <CongestionVital />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
