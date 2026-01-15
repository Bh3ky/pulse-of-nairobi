"""
Data proxy module for Nairobi urban stress simulation.
Generates realistic 24-hour cycle data for urban systems.
"""

from typing import Dict, List
import math


def generate_traffic_data() -> List[float]:
    """
    Generate normalized traffic stress data (0-1) for 24 hours.
    Peaks during rush hours: 7-9 AM and 5-7 PM.
    """
    data = []
    for hour in range(24):
        # Morning rush (7-9 AM)
        morning_peak = 0.8 * math.exp(-((hour - 8) ** 2) / 2)
        # Evening rush (5-7 PM)
        evening_peak = 0.9 * math.exp(-((hour - 18) ** 2) / 2)
        # Base traffic
        base = 0.2 + 0.1 * math.sin(hour * math.pi / 12)
        
        stress = min(1.0, morning_peak + evening_peak + base)
        data.append(round(stress, 3))
    
    return data


def generate_air_quality_data() -> List[float]:
    """
    Generate normalized air quality stress data (0-1) for 24 hours.
    Higher pollution during traffic peaks and industrial hours.
    """
    data = []
    for hour in range(24):
        # Correlates with traffic but with delay
        traffic_effect = 0.6 * math.exp(-((hour - 9) ** 2) / 3)
        evening_effect = 0.7 * math.exp(-((hour - 19) ** 2) / 3)
        # Industrial activity (daytime)
        industrial = 0.3 if 6 <= hour <= 18 else 0.1
        # Night recovery
        night_recovery = 0.1 if 22 <= hour or hour <= 5 else 0
        
        stress = min(1.0, traffic_effect + evening_effect + industrial - night_recovery)
        data.append(round(stress, 3))
    
    return data


def generate_power_data() -> List[float]:
    """
    Generate normalized power reliability stress data (0-1) for 24 hours.
    Higher stress during peak consumption hours.
    """
    data = []
    for hour in range(24):
        # Morning peak (6-9 AM)
        morning = 0.6 * math.exp(-((hour - 7.5) ** 2) / 2)
        # Evening peak (6-10 PM) - higher demand
        evening = 0.85 * math.exp(-((hour - 20) ** 2) / 4)
        # Base load
        base = 0.25 if 6 <= hour <= 22 else 0.15
        
        stress = min(1.0, morning + evening + base)
        data.append(round(stress, 3))
    
    return data


def generate_emergency_data() -> List[float]:
    """
    Generate normalized emergency response stress data (0-1) for 24 hours.
    Higher stress when system is overloaded (correlates with traffic and time).
    """
    data = []
    for hour in range(24):
        # Higher incidents during active hours
        activity = 0.5 if 8 <= hour <= 20 else 0.2
        # Traffic-related incidents
        traffic_incidents = 0.4 * math.exp(-((hour - 18) ** 2) / 8)
        # Night incidents (different nature)
        night_factor = 0.3 if 22 <= hour or hour <= 4 else 0
        
        stress = min(1.0, activity + traffic_incidents + night_factor)
        data.append(round(stress, 3))
    
    return data


def get_city_vitals(hour: int) -> Dict[str, float]:
    """
    Get city vitals for a specific hour (0-23).
    Returns normalized stress values (0-1) for all systems.
    """
    if not 0 <= hour <= 23:
        raise ValueError("Hour must be between 0 and 23")
    
    traffic = generate_traffic_data()
    air_quality = generate_air_quality_data()
    power = generate_power_data()
    emergency = generate_emergency_data()
    
    return {
        "hour": hour,
        "traffic": traffic[hour],
        "airQuality": air_quality[hour],
        "power": power[hour],
        "emergency": emergency[hour],
        "overall": round((traffic[hour] + air_quality[hour] + power[hour] + emergency[hour]) / 4, 3)
    }


def get_all_vitals() -> List[Dict[str, float]]:
    """
    Get city vitals for all 24 hours.
    """
    return [get_city_vitals(hour) for hour in range(24)]
