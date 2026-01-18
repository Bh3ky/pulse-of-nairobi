'use client';

import { VitalCard } from '../VitalCard';
import { RingChart } from '../visualizations/RingChart';
import { Cloud, Droplets, Wind } from 'lucide-react';

export const WeatherVital = () => {
    const rings = [
        { value: 24, max: 40, color: '#f59e0b', icon: Cloud, label: '24°C' },
        { value: 65, max: 100, color: '#3b82f6', icon: Droplets, label: '65%' },
        { value: 78, max: 100, color: '#10b981', icon: Wind, label: 'AQI 78' }
    ];

    return (
        <VitalCard title="Environmental Vitals" delay={0.2}>
        <RingChart rings={rings} />
        </VitalCard>
    );
};