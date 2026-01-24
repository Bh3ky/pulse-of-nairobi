/**
 * Vitals Dashboard Component
 * Location: components/scrollystory/vitals-dashboard.tsx
 * 
 * Three-card layout displaying city vitals data
 * Top 2 cards: Traffic/Environment & Infrastructure
 * Bottom card: Environmental metrics with chart placeholders
 */

'use client';

import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VitalsDashboardProps } from '@/lib/types/scrollystory';

export function VitalsDashboard({ vitals }: VitalsDashboardProps) {
    const aqiValue = Number(vitals.topLeft[1]?.value) || 0;
    const aqiPercent = Math.min(100, Math.max(0, Math.round((aqiValue / 200) * 100)));

    const transportRaw = [
        { name: 'Public', value: Number(vitals.topRight[1]?.value) || 0 },
        { name: 'Private', value: Number(vitals.topLeft[0]?.value) || 0 },
        { name: 'Walk', value: Math.max(1, Math.round((Number(vitals.topRight[0]?.value) || 0) / 10)) }
    ];
    const transportTotal = transportRaw.reduce((sum, item) => sum + item.value, 0) || 1;
    const transportData = transportRaw.map(item => ({
        name: item.name,
        value: Math.round((item.value / transportTotal) * 100)
    }));

    const stressMax = Math.max(1, ...vitals.bottom.map(vital => Number(vital.value) || 0));
    const stressData = vitals.bottom.map((vital) => ({
        name: vital.label,
        value: Math.round(((Number(vital.value) || 0) / stressMax) * 100)
    }));

    return (
        <div className="grid grid-cols-2 gap-6">
            
            {/* Card 1 — Atmosphere */}
            <Card className="h-[220px] border border-slate-800/70 bg-slate-950/70 shadow-xl backdrop-blur">
                <CardHeader>
                <CardTitle className="text-xs font-semibold text-slate-300 tracking-[0.2em] uppercase">
                    Atmosphere
                </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={10}
                        data={[{ name: 'AQI', value: aqiPercent }]}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <RadialBar dataKey="value" cornerRadius={8} fill="#f59e0b" />
                    </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="text-lg font-semibold text-slate-100">
                        {vitals.topLeft[1]?.value ?? '--'}{vitals.topLeft[1]?.unit ?? ''}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400">
                        AQI
                        </div>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                    {vitals.topLeft.map((vital, idx) => (
                    <div key={idx} className="flex justify-between gap-4">
                        <span className="text-slate-400">{vital.label}</span>
                        <span className="font-semibold text-slate-100">
                        {vital.value}{vital.unit}
                        </span>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>

            {/* Card 2 — Mobility */}
            <Card className="h-[220px] border border-slate-800/70 bg-slate-950/70 shadow-xl backdrop-blur">
                <CardHeader>
                <CardTitle className="text-xs font-semibold text-slate-300 tracking-[0.2em] uppercase">
                    Transport Split
                </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                <div className="h-24 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={transportData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="55%"
                        outerRadius="100%"
                        paddingAngle={2}
                        >
                        <Cell fill="#22c55e" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#ef4444" />
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                    {vitals.topRight.map((vital, idx) => (
                    <div key={idx} className="flex justify-between gap-4">
                        <span className="text-slate-400">{vital.label}</span>
                        <span className="font-semibold text-slate-100">
                        {vital.value}{vital.unit}
                        </span>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>

            {/* Card 3 — Congestion (Wide) */}
            <div className="col-span-2">
                <Card className="h-[240px] border border-slate-800/70 bg-slate-950/70 shadow-xl backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xs font-semibold text-slate-300 tracking-[0.2em] uppercase">
                    Arterial Stress Level
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stressData} layout="vertical" margin={{ left: 24, right: 16 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            width={90}
                        />
                        <Bar dataKey="value" radius={[8, 8, 8, 8]} fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs text-slate-400">
                    {vitals.bottom.map((vital, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                        <span>{vital.label}</span>
                        <span className="text-slate-100">{vital.value}{vital.unit}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </div>

        </div>

    );
}
