'use client';

import React from 'react';
import MorningCycle from './sections/MorningCycle';

interface ClockState {
  start: number;
  end: number;
  progress: number;
  quote?: string;
}

interface ScrollyStoryProps {
  onClockUpdate: (data: ClockState) => void;
}

export default function ScrollyStory({ onClockUpdate }: ScrollyStoryProps) {
  return (
    <div className="relative">
      {/* ONLY MORNING CYCLE FOR NOW */}
      <MorningCycle onClockUpdate={onClockUpdate} />

      {/* Temporary placeholder for other cycles */}
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            More cycles coming soon...
          </h2>
          <p className="text-gray-600">
            Mid-morning, afternoon, evening, and night cycles will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}
