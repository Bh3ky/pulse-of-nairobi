'use client';

import { VitalCard } from '../VitalCard';
import { BarChart } from '../visualizations/BarChart';

export const CongestionVital = () => {
    const bars = [
        { label: '06:00', value: 35 },
        { label: '07:00', value: 68 },
        { label: '08:00', value: 92 },
        { label: '09:00', value: 78 },
        { label: '10:00', value: 55 }
    ];

    return (
        <VitalCard title="Traffic Congestion" delay={0.6}>
        <BarChart 
            bars={bars} 
            minLabel="Low Congestion" 
            maxLabel="High Congestion" 
        />
        </VitalCard>
    );
};