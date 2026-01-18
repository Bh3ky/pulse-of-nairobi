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
    imageUrl: '/morning.jpg', 
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
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-900'
  },
  {
    id: 'midmorning',
    period: 'Mid-Morning',
    timeRange: '10:00 - 12:00',
    quote: 'Productivity peaks as the urban rhythm finds its stride.',
    imageUrl: '/building5.jpg',
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
    backgroundColor: 'bg-yellow-50',
    textColor: 'text-yellow-900'
  },
  {
    id: 'midday',
    period: 'Midday',
    timeRange: '12:00 - 14:00',
    quote: 'Under the zenith sun, the city pulses with maximum intensity.',
    imageUrl: '/midday.jpg',
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
    backgroundColor: 'bg-amber-50',
    textColor: 'text-amber-900'
  },
  {
    id: 'afternoon',
    period: 'Afternoon',
    timeRange: '14:00 - 16:00',
    quote: 'The heat softens, yet the momentum continues unabated.',
    imageUrl: '/afternoon.jpg',
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
    backgroundColor: 'bg-orange-50',
    textColor: 'text-orange-900'
  },
  {
    id: 'evening',
    period: 'Evening',
    timeRange: '17:00 - 20:00',
    quote: 'Golden hour bathes the city in warm light as people journey home.',
    imageUrl: '/evening.jpg',
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
    backgroundColor: 'bg-rose-50',
    textColor: 'text-rose-900'
  },
  {
    id: 'night',
    period: 'Night',
    timeRange: '21:00 - 05:00',
    quote: 'Darkness falls, yet the city never truly sleeps.',
    imageUrl: '/night.jpg',
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
    backgroundColor: 'bg-indigo-50',
    textColor: 'text-indigo-900'
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
    <div className="relative bg-gray-50">
      {timeSlots.map((slot, index) => (
        <section 
          key={slot.id}
          ref={setRef(index)}
          className='min-h-screen flex items-center'
        >
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


