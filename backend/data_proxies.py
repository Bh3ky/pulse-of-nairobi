"""
Data generation module for Nairobi Pulse scrollytelling.
Generates a single 24-hour timeline cached in memory, with all endpoints deriving from it.
Based on circadian curves + controlled noise for believable city data.
"""

from typing import Dict, List
import math
import random
from datetime import datetime, timezone

# Seed for deterministic generation - same refresh = same story
random.seed(42)

# Cache for the 24-hour timeline
_TIMELINE_CACHE: List[Dict] = []


def _generate_circadian_value(
    hour: int,
    base: float,
    morning_peak: float = 0.0,
    evening_peak: float = 0.0,
    daytime_boost: float = 0.0,
    peak_hour_morning: int = 8,
    peak_hour_evening: int = 18
) -> float:
    """
    Generate a value following circadian rhythm patterns.
    
    Args:
        hour: Hour of day (0-23)
        base: Base value (0-1)
        morning_peak: Morning peak amplitude
        evening_peak: Evening peak amplitude
        daytime_boost: Additional boost during daytime hours
        peak_hour_morning: When morning peak occurs
        peak_hour_evening: When evening peak occurs
    """
    value = base
    
    # Morning peak (gaussian curve)
    if morning_peak > 0:
        value += morning_peak * math.exp(-((hour - peak_hour_morning) ** 2) / 3)
    
    # Evening peak (gaussian curve)
    if evening_peak > 0:
        value += evening_peak * math.exp(-((hour - peak_hour_evening) ** 2) / 3)
    
    # Daytime boost (6 AM - 10 PM)
    if daytime_boost > 0 and 6 <= hour <= 22:
        value += daytime_boost
    
    # Add controlled noise to avoid "too perfect" visuals
    noise = random.uniform(-0.05, 0.05)
    value += noise
    
    # Clamp to [0, 1]
    return max(0.0, min(1.0, value))


def _generate_mobility_data() -> List[float]:
    """
    Mobility: Morning + evening peaks (rush hours).
    High stress during commute times.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.2,
            morning_peak=0.65,
            evening_peak=0.75,
            peak_hour_morning=8,
            peak_hour_evening=18
        )
        for hour in range(24)
    ]


def _generate_energy_data() -> List[float]:
    """
    Energy: High daytime, low at night.
    Peaks during business hours and early evening.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.15 if hour < 6 or hour > 22 else 0.35,
            daytime_boost=0.35,
            evening_peak=0.25,
            peak_hour_evening=19
        )
        for hour in range(24)
    ]


def _generate_social_data() -> List[float]:
    """
    Social: Evening-heavy.
    Low during work hours and night, peaks in evening (social time).
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.1,
            evening_peak=0.65,
            peak_hour_evening=20,
            daytime_boost=0.15 if 12 <= hour <= 16 else 0
        )
        for hour in range(24)
    ]


def _generate_economic_data() -> List[float]:
    """
    Economic: Business hours pattern.
    High during 9-5, moderate during extended hours, low at night.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.1,
            daytime_boost=0.5 if 9 <= hour <= 17 else 0.2 if 7 <= hour <= 20 else 0
        )
        for hour in range(24)
    ]


def _generate_environmental_data() -> List[float]:
    """
    Environmental stress: Pollution, waste, air quality.
    Correlates with traffic and industrial activity.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.15,
            morning_peak=0.35,
            evening_peak=0.45,
            daytime_boost=0.2,
            peak_hour_morning=9,
            peak_hour_evening=19
        )
        for hour in range(24)
    ]


def _generate_transport_system() -> List[float]:
    """
    Transport system load: Very similar to mobility but represents infrastructure strain.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.25,
            morning_peak=0.70,
            evening_peak=0.80,
            peak_hour_morning=8,
            peak_hour_evening=18
        )
        for hour in range(24)
    ]


def _generate_healthcare_system() -> List[float]:
    """
    Healthcare system load: Moderate daytime, some emergency activity at night.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.3 if 22 <= hour or hour <= 4 else 0.2,
            daytime_boost=0.3,
            evening_peak=0.15,
            peak_hour_evening=17
        )
        for hour in range(24)
    ]


def _generate_internet_system() -> List[float]:
    """
    Internet system load: High during daytime and evening, lower at night.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.25,
            daytime_boost=0.35,
            evening_peak=0.30,
            peak_hour_evening=21
        )
        for hour in range(24)
    ]


def _generate_power_system() -> List[float]:
    """
    Power grid load: Morning and evening peaks when everyone is home/active.
    """
    return [
        _generate_circadian_value(
            hour,
            base=0.25,
            morning_peak=0.45,
            evening_peak=0.60,
            daytime_boost=0.15,
            peak_hour_morning=7,
            peak_hour_evening=20
        )
        for hour in range(24)
    ]


def _calculate_stress_deltas(vitals_timeline: List[Dict], systems_timeline: List[Dict]) -> List[float]:
    """
    Calculate stress delta for each hour based on vitals and system overload.
    
    stress_delta = (mobility * 0.4 + avg_system_load * 0.6) - recovery
    """
    deltas = []
    
    for hour in range(24):
        vitals = vitals_timeline[hour]
        systems = systems_timeline[hour]
        
        # Mobility is a primary stress driver
        mobility_stress = vitals['mobility'] * 0.4
        
        # System overload contributes to stress
        avg_system_load = (
            systems['transport'] + 
            systems['healthcare'] + 
            systems['internet'] + 
            systems['power']
        ) / 4
        system_stress = avg_system_load * 0.6
        
        # Recovery occurs late night (22-5)
        recovery = 0.15 if (22 <= hour or hour <= 5) else 0.0
        
        delta = mobility_stress + system_stress - recovery
        deltas.append(round(max(0, delta), 3))
    
    return deltas


def _generate_timeline() -> List[Dict]:
    """
    Generate the complete 24-hour timeline.
    This is the single source of truth for all data.
    """
    # Generate all vitals
    mobility = _generate_mobility_data()
    energy = _generate_energy_data()
    social = _generate_social_data()
    economic = _generate_economic_data()
    environmental = _generate_environmental_data()
    
    # Generate all systems
    transport = _generate_transport_system()
    healthcare = _generate_healthcare_system()
    internet = _generate_internet_system()
    power = _generate_power_system()
    
    # Build vitals and systems objects
    vitals_timeline = [
        {
            'mobility': round(mobility[h], 3),
            'energy': round(energy[h], 3),
            'social': round(social[h], 3),
            'economic': round(economic[h], 3),
            'environmental': round(environmental[h], 3)
        }
        for h in range(24)
    ]
    
    systems_timeline = [
        {
            'transport': round(transport[h], 3),
            'healthcare': round(healthcare[h], 3),
            'internet': round(internet[h], 3),
            'power': round(power[h], 3)
        }
        for h in range(24)
    ]
    
    # Calculate stress deltas
    stress_deltas = _calculate_stress_deltas(vitals_timeline, systems_timeline)
    
    # Build complete timeline
    base_date = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    timeline = []
    
    for hour in range(24):
        timestamp = base_date.replace(hour=hour)
        timeline.append({
            'hour': hour,
            'timestamp': timestamp.isoformat(),
            'vitals': vitals_timeline[hour],
            'systems': systems_timeline[hour],
            'stress_delta': stress_deltas[hour]
        })
    
    return timeline


def get_timeline() -> List[Dict]:
    """
    Get the cached 24-hour timeline.
    Generates on first call, then serves from cache.
    """
    global _TIMELINE_CACHE
    
    if not _TIMELINE_CACHE:
        _TIMELINE_CACHE = _generate_timeline()
    
    return _TIMELINE_CACHE


def get_hour_data(hour: int) -> Dict:
    """Get data for a specific hour from the cached timeline."""
    if not 0 <= hour <= 23:
        raise ValueError("Hour must be between 0 and 23")
    
    timeline = get_timeline()
    return timeline[hour]


def get_city_vitals(hour: int) -> Dict:
    """
    Get city vitals for a specific hour.
    
    This maintains backward compatibility with the old API structure
    by mapping new vitals to the old structure.
    """
    hour_data = get_hour_data(hour)
    
    # Map new structure to old structure for backward compatibility
    # traffic = mobility (arteries)
    # airQuality = environmental (lungs)
    # power = power system (neural)
    # emergency = healthcare system (immune)
    
    vitals = hour_data['vitals']
    systems = hour_data['systems']
    
    traffic = vitals['mobility']
    air_quality = vitals['environmental']
    power = systems['power']
    emergency = systems['healthcare']
    
    overall = round((traffic + air_quality + power + emergency) / 4, 3)
    
    return {
        'hour': hour,
        'traffic': traffic,
        'airQuality': air_quality,
        'power': power,
        'emergency': emergency,
        'overall': overall
    }


def get_all_vitals() -> List[Dict]:
    """Get city vitals for all 24 hours (backward compatible format)."""
    return [get_city_vitals(hour) for hour in range(24)]
