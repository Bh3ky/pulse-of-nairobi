"""
Pydantic models for Nairobi Urban Stress API.
Maps urban data to physiological states.
"""

from pydantic import BaseModel, Field
from typing import List
from enum import Enum


class StressLevel(str, Enum):
    """Categorical stress levels for the organism."""
    CALM = "calm"           # 0-0.3
    MODERATE = "moderate"   # 0.3-0.6
    STRESSED = "stressed"   # 0.6-0.8
    CRITICAL = "critical"   # 0.8-1.0


class PhysiologicalSystem(BaseModel):
    """A single physiological system's state."""
    name: str = Field(..., description="System name (e.g., 'arteries')")
    urban_source: str = Field(..., description="Urban data source (e.g., 'traffic')")
    value: float = Field(..., ge=0, le=1, description="Stress level 0-1")
    status: StressLevel = Field(..., description="Categorical status")
    description: str = Field(..., description="Human-readable status description")


class CityVitals(BaseModel):
    """Complete city vitals at a specific hour."""
    hour: int = Field(..., ge=0, le=23, description="Hour of day (0-23)")
    
    # Physiological systems
    arteries: PhysiologicalSystem = Field(..., description="Traffic → Blood flow")
    lungs: PhysiologicalSystem = Field(..., description="Air quality → Respiration")
    neural: PhysiologicalSystem = Field(..., description="Power → Nervous system")
    immune: PhysiologicalSystem = Field(..., description="Emergency → Immune response")
    
    # Overall metrics
    overall_stress: float = Field(..., ge=0, le=1, description="Average stress")
    organism_status: StressLevel = Field(..., description="Overall organism state")
    

class AccumulatedStress(BaseModel):
    """Stress accumulated over time."""
    from_hour: int = Field(..., ge=0, le=23)
    to_hour: int = Field(..., ge=0, le=23)
    
    # Cumulative stress per system
    arteries_load: float = Field(..., description="Cumulative arterial stress")
    lungs_load: float = Field(..., description="Cumulative respiratory stress")
    neural_load: float = Field(..., description="Cumulative neural stress")
    immune_load: float = Field(..., description="Cumulative immune activation")
    
    # Peak stress moments
    peak_hour: int = Field(..., description="Hour of maximum stress")
    peak_stress: float = Field(..., description="Maximum stress value")
    
    # Recovery indicators
    recovery_capacity: float = Field(..., ge=0, le=1, description="Remaining recovery capacity")


class TimelineResponse(BaseModel):
    """Full 24-hour timeline with stress data."""
    hours: List[CityVitals]
    daily_summary: dict = Field(..., description="Summary statistics for the day")


def get_stress_level(value: float) -> StressLevel:
    """Convert numeric stress to categorical level."""
    if value < 0.3:
        return StressLevel.CALM
    elif value < 0.6:
        return StressLevel.MODERATE
    elif value < 0.8:
        return StressLevel.STRESSED
    else:
        return StressLevel.CRITICAL


def get_system_description(system: str, value: float) -> str:
    """Get human-readable description for a system's state."""
    level = get_stress_level(value)
    
    descriptions = {
        "arteries": {
            StressLevel.CALM: "Smooth traffic flow, healthy circulation",
            StressLevel.MODERATE: "Moderate congestion, some arterial strain",
            StressLevel.STRESSED: "Heavy congestion, restricted blood flow",
            StressLevel.CRITICAL: "Severe gridlock, arterial blockage risk"
        },
        "lungs": {
            StressLevel.CALM: "Clean air, easy breathing",
            StressLevel.MODERATE: "Mild pollution, slight respiratory effort",
            StressLevel.STRESSED: "Poor air quality, labored breathing",
            StressLevel.CRITICAL: "Hazardous air, respiratory distress"
        },
        "neural": {
            StressLevel.CALM: "Stable power, calm neural activity",
            StressLevel.MODERATE: "Moderate load, increased neural firing",
            StressLevel.STRESSED: "Power strain, erratic neural signals",
            StressLevel.CRITICAL: "Grid overload, neural overstimulation"
        },
        "immune": {
            StressLevel.CALM: "Low emergency activity, dormant immune",
            StressLevel.MODERATE: "Normal response activity",
            StressLevel.STRESSED: "Elevated emergency calls, immune activation",
            StressLevel.CRITICAL: "Emergency overload, hyperactive immune response"
        }
    }
    
    return descriptions.get(system, {}).get(level, "Unknown state")
