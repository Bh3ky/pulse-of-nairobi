'use client';

import { VitalCard } from '../VitalCard';
import { PieChart } from '../visualizations/PieChart';
import { Bus, Car, Train, Users } from 'lucide-react';

export const TransportVital = () => {
    const segments = [
        { name: 'Matatu', value: 45, color: '#f59e0b', icon: Bus },
        { name: 'Private Car', value: 30, color: '#3b82f6', icon: Car },
        { name: 'Boda Boda', value: 15, color: '#10b981', icon: Train },
        { name: 'Walking', value: 10, color: '#6366f1', icon: Users }
    ];

    return (
        <VitalCard title="Transport Modes" delay={0.4}>
        <PieChart segments={segments} />
        </VitalCard>
    );
};