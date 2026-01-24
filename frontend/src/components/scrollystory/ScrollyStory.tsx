'use client';

import { useState, useEffect, useRef } from 'react';
import { TimeSection } from './time-section';
import { FinalNarrative } from './final-narrative';
import type { TimeSlot, CityVital } from '@/lib/types/scrollystory';

// ============================================================================
// DATA: Using local images from /public folder
// ============================================================================
const PLACEHOLDER_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'morning',
    period: 'Morning',
    timeRange: '06:00 - 09:00',
    quote: 'The city awakens, a symphony of first light and fresh beginnings.',
    imageUrl: '/images/building3.jpg', 
    iconType: 'sunrise',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 45, unit: '%', trend: 'up' } as CityVital,
        { label: 'Air Quality', value: 82, unit: 'AQI' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 320, unit: 'MW', trend: 'up' } as CityVital,
        { label: 'Public Transit', value: 12500, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 18, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 65, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 55, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-amber-950/40',
    textColor: 'text-amber-300'
  },
  {
    id: 'midmorning',
    period: 'Mid-Morning',
    timeRange: '09:00 - 10:00',
    quote: 'Productivity peaks as the urban rhythm finds its stride.',
    imageUrl: '/images/building4.jpg',
    iconType: 'sun',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 78, unit: '%', trend: 'up' } as CityVital,
        { label: 'Air Quality', value: 68, unit: 'AQI', trend: 'down' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 485, unit: 'MW', trend: 'up' } as CityVital,
        { label: 'Public Transit', value: 28900, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 22, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 58, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 68, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-orange-950/40',
    textColor: 'text-orange-300'
  },
  {
    id: 'midday',
    period: 'Midday',
    timeRange: '12:00 - 14:00',
    quote: 'Under the zenith sun, the city pulses with maximum intensity.',
    imageUrl: '/images/building5.jpg',
    iconType: 'sun-filled',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 92, unit: '%', trend: 'up' } as CityVital,
        { label: 'Air Quality', value: 58, unit: 'AQI', trend: 'down' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 590, unit: 'MW', trend: 'up' } as CityVital,
        { label: 'Public Transit', value: 35200, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 26, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 52, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 72, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-red-950/40',
    textColor: 'text-amber-300'
  },
  {
    id: 'afternoon',
    period: 'Afternoon',
    timeRange: '14:00 - 16:00',
    quote: 'The heat softens, yet the momentum continues unabated.',
    imageUrl: '/images/building6.jpg',
    iconType: 'sun',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 85, unit: '%', trend: 'stable' } as CityVital,
        { label: 'Air Quality', value: 62, unit: 'AQI', trend: 'up' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 540, unit: 'MW', trend: 'down' } as CityVital,
        { label: 'Public Transit', value: 31800, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 25, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 55, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 70, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-orange-950/30',
    textColor: 'text-orange-300'
  },
  {
    id: 'evening',
    period: 'Evening',
    timeRange: '17:00 - 20:00',
    quote: 'Golden hour bathes the city in warm light as people journey home.',
    imageUrl: '/images/building7.jpg',
    iconType: 'sunset',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 95, unit: '%', trend: 'up' } as CityVital,
        { label: 'Air Quality', value: 70, unit: 'AQI', trend: 'down' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 620, unit: 'MW', trend: 'up' } as CityVital,
        { label: 'Public Transit', value: 42100, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 21, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 60, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 75, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-rose-950/40',
    textColor: 'text-rose-300'
  },
  {
    id: 'night',
    period: 'Night',
    timeRange: '21:00 - 05:00',
    quote: 'Darkness falls, yet the city never truly sleeps.',
    imageUrl: '/images/building8.jpg',
    iconType: 'moon',
    vitals: {
      topLeft: [
        { label: 'Traffic Flow', value: 22, unit: '%', trend: 'down' } as CityVital,
        { label: 'Air Quality', value: 88, unit: 'AQI', trend: 'up' } as CityVital
      ],
      topRight: [
        { label: 'Energy Usage', value: 280, unit: 'MW', trend: 'down' } as CityVital,
        { label: 'Public Transit', value: 4200, unit: 'riders' } as CityVital
      ],
      bottom: [
        { label: 'Temperature', value: 16, unit: '°C' } as CityVital,
        { label: 'Humidity', value: 68, unit: '%' } as CityVital,
        { label: 'Noise Level', value: 48, unit: 'dB' } as CityVital
      ]
    },
    backgroundColor: 'from-slate-950 via-slate-950 to-indigo-950/50',
    textColor: 'text-indigo-300'
  }
];

// ============================================================================
// HOOKS
// ============================================================================
function useScrollSections(count: number) {
  const [activeSection, setActiveSection] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    refs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return [activeSection, refs] as const;
}

// ============================================================================
// COMPONENT EXPORT
// ============================================================================
export default function ScrollyStory() {
  const timeSlots = PLACEHOLDER_TIME_SLOTS;
  const [activeSection, sectionRefs] = useScrollSections(timeSlots.length + 1);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    if (sectionRefs.current) {
      sectionRefs.current[index] = el;
    }
  };

  return (
    <div className="relative bg-slate-950 text-slate-100">
      {timeSlots.map((slot, index) => (
        <section 
          key={slot.id}
          ref={setRef(index)}
          className='relative min-h-screen py-24'
        >
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${slot.backgroundColor}`} />
          <TimeSection 
            data={slot} 
            isActive={activeSection === index}
          />
        </section>
      ))}
      
      <section ref={setRef(timeSlots.length)} className='min-h-screen flex items-center'>
        <FinalNarrative />
      </section>
    </div>
  );
}
