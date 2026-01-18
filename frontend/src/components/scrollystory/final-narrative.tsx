/**
 * Final Narrative Component
 * Location: components/scrollystory/final-narrative.tsx
 * 
 * Closing section that wraps up the 24-hour journey
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function FinalNarrative() {
    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-8 text-center">
            <Card className="border-2 border-purple-300 shadow-2xl">
            <CardContent className="p-12">
                <h2 className="text-4xl font-bold text-purple-900 mb-6">
                A City's Heartbeat
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                    Through 24 hours, we have witnessed the ebb and flow of urban life—from 
                    the quiet dawn to the frenetic midday rush, and back to the tranquil 
                    embrace of night.
                </p>
                <p>
                    Each data point tells a story: of commuters navigating their journeys, 
                    of systems straining and recovering, of a living organism that breathes, 
                    pulses, and adapts.
                </p>
                <p className="text-xl font-semibold text-purple-800 pt-4">
                    This is more than data. This is our city's soul, visualized.
                </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    );
}