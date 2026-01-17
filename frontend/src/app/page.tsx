// app/page.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import ScrollyStory from '@/components/ScrollyStory';
import { OnboardingLoader } from '@/components/OnboardingLoader';
import { useOncePerSession } from "./hooks/useOncePerSession";
import { useParallax } from "./hooks/useParallax";
import styles from './page.module.css';

export default function Home() {
  const showOnboarding = useOncePerSession("nairobi-onboarding-v1");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const parallaxRef = useParallax(0.4);

  if (showOnboarding === null) {
    return null;
  }

  const isContentVisible = !showOnboarding || onboardingDone;

  return (
    <>
      {/* Loader renders OUTSIDE main container to avoid CSS inheritance */}
      {showOnboarding && !onboardingDone && (
        <OnboardingLoader 
          onDone={() => setOnboardingDone(true)} 
          duration={5000} // Slightly longer for better UX
        />
      )}

      <main 
        className={styles.main}
        style={{
          opacity: isContentVisible ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
        }}
      >
        <div className={styles.intro}>
          {/* Parallax Background */}
          <div 
            ref={parallaxRef} 
            className={styles.parallaxBg}
            style={{
              position: 'absolute',
              inset: '-10% 0',
              zIndex: 0,
              willChange: 'transform',
            }}
          >
            <Image
              src="/building.jpg" // Your uploaded image
              alt="Nairobi cityscape with trees and modern architecture"
              fill
              priority
              quality={95}
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 40%', // Focus on building, not sky
              }}
            />
            {/* Gradient overlay for text readability */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                zIndex: 1,
              }}
            />
          </div>

          {/* Your existing intro content */}
          <div 
            className={styles.introContent}
            style={{
              position: 'relative',
              zIndex: 10,
              transform: isContentVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isContentVisible ? 1 : 0,
              transition: 'all 1s ease-out 0.4s',
            }}
          >
            <h1 className={styles.title}>
              What if a city <span className={styles.highlight}>breathed</span>?
            </h1>
            <p className={styles.subtitle}>
              A scrollytelling data-visualization project that reimagines Nairobi as a living
              body, revealing patterns of urban stress across a 24-hour cycle.
            </p>
            <div className={styles.scrollIndicator}>
              <span>Scroll to begin</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <ScrollyStory />
      </main>
    </>
  );
}
