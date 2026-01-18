/**
 * Vitals Dashboard Component
 * Location: components/scrollystory/vitals-dashboard.tsx
 * 
 * Three-card layout displaying city vitals data
 * Top 2 cards: Traffic/Environment & Infrastructure
 * Bottom card: Environmental metrics with chart placeholders
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VitalsDashboardProps } from '@/lib/types/scrollystory';

export function VitalsDashboard({ vitals }: VitalsDashboardProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            
            {/* Card 1 — Atmosphere */}
            <Card className="h-[180px] border-2 border-gray-300 shadow-md">
                <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">
                    Traffic & Environment
                </CardTitle>
                </CardHeader>
                <CardContent>
                {vitals.topLeft.map((vital, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{vital.label}</span>
                    <span className="text-lg font-bold text-gray-800">
                        {vital.value}{vital.unit}
                    </span>
                    </div>
                ))}
                </CardContent>
            </Card>

            {/* Card 2 — Mobility */}
            <Card className="h-[180px] border-2 border-gray-300 shadow-md">
                <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-700">
                    Infrastructure Load
                </CardTitle>
                </CardHeader>
                <CardContent>
                {vitals.topRight.map((vital, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{vital.label}</span>
                    <span className="text-lg font-bold text-gray-800">
                        {vital.value}{vital.unit}
                    </span>
                    </div>
                ))}
                </CardContent>
            </Card>

            {/* Card 3 — Congestion (Wide) */}
            <div className="col-span-2">
                <Card className="h-[220px] border-2 border-gray-300 shadow-md">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-gray-700">
                    Environmental Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {vitals.bottom.map((vital, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{vital.label}</span>
                        <span className="text-xl font-bold text-gray-800">
                            {vital.value}{vital.unit}
                        </span>
                        </div>

                        <div className="h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        Chart: {vital.label} trend
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>
            </div>

        </div>

    );
}