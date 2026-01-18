/**
 * Type definitions for ScrollyStory components
 * Location: lib/types/scrollystory.ts
 */

export type TrendDirection = 'up' | 'down' | 'stable';

export type IconType = 'sunrise' | 'sun' | 'sun-filled' | 'sunset' | 'moon';

export interface CityVital {
    label: string;
    value: string | number;
    unit?: string;
    trend?: TrendDirection;
}

// Helper type for creating vitals with proper type inference
export type CreateCityVital = CityVital;

export interface VitalsData {
    topLeft: CityVital[];
    topRight: CityVital[];
    bottom: CityVital[];
}

export interface TimeSlot {
    id: string;
    period: string;
    timeRange: string;
    quote: string;
    imageUrl: string;
    iconType: IconType;
    vitals: VitalsData;
    backgroundColor: string;
    textColor: string;
}

export interface TimeSectionProps {
    data: TimeSlot;
    isActive: boolean;
}

export interface StickyClockProps {
    period: string;
    timeRange: string;
    iconType: IconType;
    textColor: string;
    isActive: boolean;
}

export interface VitalsDashboardProps {
    vitals: VitalsData;
}