/**
 * Time Section Component
 * Location: components/scrollystory/time-section.tsx
 * 
 * Main section displaying a single time period with:
 * - Sticky clock header
 * - Quote
 * - Split layout: City image (left) + Vitals dashboard (right)
 */

import React from 'react';
import Image from 'next/image'; 
import { Card } from '@/components/ui/card';
import { VitalsDashboard } from './vitals-dashboard';
import { TimeSectionProps } from '@/lib/types/scrollystory';

export function TimeSection({ data, isActive }: TimeSectionProps) {
    return (
        <div className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-12 gap-6">

            {/* LEFT: Image Card */}
            <div className="col-span-5">
            <Card className="relative h-[420px] overflow-hidden border border-gray-300 shadow-lg">
                <Image
                src={data.imageUrl}
                alt={`${data.period} cityscape`}
                fill
                priority={isActive}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                />
            </Card>
            </div>

            {/* RIGHT: Vitals */}
            <div className="col-span-7">
            <VitalsDashboard vitals={data.vitals} />
            </div>

        </div>
        </div>
    );
}