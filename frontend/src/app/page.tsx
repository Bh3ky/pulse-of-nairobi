// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import ScrollyStory from "@/components/ScrollyStory";
import { Clock } from "@/components/Clock";
import { OnboardingLoader } from "@/components/OnboardingLoader";
import { useOncePerSession } from "./hooks/useOncePerSession";
import { useParallax } from "./hooks/useParallax";
import styles from "./page.module.css";

interface ClockState {
  start: number;
  end: number;
  progress: number;
  quote?: string;
}

export default function Home() {
  const showOnboarding = useOncePerSession("nairobi-onboarding-v1");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const parallaxRef = useParallax(0.4);

  const [clockState, setClockState] = useState<ClockState>({
    start: 6,
    end: 10,
    progress: 0,
    quote: "The vibrant city awakens to a new day",
  });

  // ✅ STABLE + GUARDED CALLBACK
  const handleClockUpdate = useCallback((data: ClockState) => {
    setClockState((prev) => {
      if (
        prev.start === data.start &&
        prev.end === data.end &&
        prev.progress === data.progress &&
        prev.quote === data.quote
      ) {
        return prev;
      }
      return data;
    });
  }, []);

  if (showOnboarding === null) {
    return null;
  }

  const isContentVisible = !showOnboarding || onboardingDone;

  return (
    <>
      {showOnboarding && !onboardingDone && (
        <OnboardingLoader
          onDone={() => setOnboardingDone(true)}
          duration={5000}
        />
      )}

      <Clock
        startHour={clockState.start}
        endHour={clockState.end}
        progress={clockState.progress}
        quote={clockState.quote}
      />

      <main
        className={styles.main}
        style={{
          opacity: isContentVisible ? 1 : 0,
          transition: "opacity 0.8s ease-out",
        }}
      >
        <div className={styles.intro}>
          <div
            ref={parallaxRef}
            className={styles.parallaxBg}
            style={{
              position: "absolute",
              inset: "-10% 0",
              zIndex: 0,
              willChange: "transform",
            }}
          >
            <Image
              src="/building.jpg"
              alt="Nairobi cityscape with trees and modern architecture"
              fill
              priority
              quality={95}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
                zIndex: 1,
              }}
            />
          </div>

          <div
            className={styles.introContent}
            style={{
              position: "relative",
              zIndex: 10,
              transform: isContentVisible
                ? "translateY(0)"
                : "translateY(30px)",
              opacity: isContentVisible ? 1 : 0,
              transition: "all 1s ease-out 0.4s",
            }}
          >
            <h1 className={styles.title}>
              What if a city <span className={styles.highlight}>breathed</span>?
            </h1>
            <p className={styles.subtitle}>
              A scrollytelling data-visualization project that reimagines Nairobi
              as a living body, revealing patterns of urban stress across a
              24-hour cycle.
            </p>
            <div className={styles.scrollIndicator}>
              <span>Scroll to begin</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M12 5v14M19 12l-7 7-7-7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <ScrollyStory onClockUpdate={handleClockUpdate} />
      </main>
    </>
  );
}


