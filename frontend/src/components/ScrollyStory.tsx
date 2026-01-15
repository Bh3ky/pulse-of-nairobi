'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import CityOrganism from './CityOrganism';
import { CityVitals } from '@/types/vitals';
import styles from './ScrollyStory.module.css';

interface StoryStep {
  hour: number;
  title: string;
  description: string;
}

const storySteps: StoryStep[] = [
  {
    hour: 0,
    title: 'Midnight - The City Rests',
    description: 'At midnight, Nairobi breathes slowly. Traffic arteries are calm, the lungs recover from the day\'s pollution, and the neural grid hums quietly. The immune system patrols at a steady pace.',
  },
  {
    hour: 3,
    title: 'Deep Night - Minimal Activity',
    description: 'The deepest rest. Emergency services remain vigilant, but the city\'s systems are at their most relaxed state. This is when recovery happens.',
  },
  {
    hour: 6,
    title: 'Dawn - The City Awakens',
    description: 'As the sun rises, the city begins to stir. Power demand increases as households wake. The neural network starts to flicker with activity.',
  },
  {
    hour: 8,
    title: 'Morning Rush - Arteries Constrict',
    description: 'Rush hour hits. Traffic arteries pulse rapidly, constricting under the pressure. Thousands of vehicles flood the roads. The city\'s cardiovascular system is under stress.',
  },
  {
    hour: 10,
    title: 'Mid-Morning - Industrial Breath',
    description: 'Factories and businesses are in full operation. Air quality deteriorates as pollution accumulates. The lungs begin to strain, struggling to process the contaminated air.',
  },
  {
    hour: 12,
    title: 'Noon - Peak Activity',
    description: 'The city is fully awake. All systems are active. Power consumption peaks, neural signals fire constantly, and the immune system responds to incidents across the urban landscape.',
  },
  {
    hour: 14,
    title: 'Afternoon - Sustained Pressure',
    description: 'The stress continues. There\'s no respite. The organism maintains high alert, managing continuous demands on all systems.',
  },
  {
    hour: 17,
    title: 'Evening Rush - Maximum Stress',
    description: 'The worst hour. Everyone heads home simultaneously. Arteries are maximally constricted, lungs gasp for clean air, power grid strains under peak demand, and emergency services are overwhelmed.',
  },
  {
    hour: 19,
    title: 'Early Evening - Gradual Relief',
    description: 'The pressure begins to ease. Traffic slowly disperses. The city starts its recovery process, though pollution lingers in the air.',
  },
  {
    hour: 21,
    title: 'Night - Winding Down',
    description: 'Households settle in. Power demand shifts from industrial to residential. The arteries relax, and the lungs begin to clear.',
  },
  {
    hour: 23,
    title: 'Late Night - Approaching Rest',
    description: 'The cycle nears completion. The city prepares for its brief rest before the pattern repeats. This is urban life—a constant rhythm of stress and recovery.',
  },
];

export default function ScrollyStory() {
  const [currentStep, setCurrentStep] = useState(0);
  const [vitalsData, setVitalsData] = useState<CityVitals[]>([]);
  const [currentVitals, setCurrentVitals] = useState<CityVitals>({
    hour: 0,
    traffic: 0.2,
    airQuality: 0.1,
    power: 0.15,
    emergency: 0.2,
    overall: 0.16,
  });

  // Fetch all vitals data on mount
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vitals');
        const data = await response.json();
        setVitalsData(data);
        setCurrentVitals(data[0]);
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
        // Use default data if API is not available
      }
    };

    fetchVitals();
  }, []);

  const onStepEnter = ({ data }: { data: number }) => {
    setCurrentStep(data);
    const step = storySteps[data];
    if (vitalsData.length > 0) {
      const newVitals = vitalsData[step.hour];
      setCurrentVitals(newVitals);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sticky visualization */}
      <div className={styles.graphic}>
        <CityOrganism vitals={currentVitals} />
      </div>

      {/* Scrolling narrative */}
      <div className={styles.scroller}>
        <Scrollama offset={0.5} onStepEnter={onStepEnter}>
          {storySteps.map((step, index) => (
            <Step data={index} key={index}>
              <div className={styles.step}>
                <div className={styles.stepContent}>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            </Step>
          ))}
        </Scrollama>
        
        {/* Final section */}
        <div className={styles.finale}>
          <div className={styles.finaleContent}>
            <h1>The City Never Stops</h1>
            <p>
              This is Nairobi. A living, breathing organism under constant stress.
              Every day, millions of people depend on these systems—arteries that carry them,
              lungs that struggle to breathe, a neural network that powers their lives,
              and an immune system that keeps them safe.
            </p>
            <p>
              The invisible stress is now visible. The question is: what do we do about it?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
