"""
Stress calculation module for Nairobi Urban Stress Model.
Handles accumulated stress and recovery calculations.
"""

from typing import List, Dict
from data_proxies import get_all_vitals


def calculate_accumulated_stress(from_hour: int, to_hour: int) -> Dict:
    """
    Calculate accumulated stress between two hours.
    Stress accumulates when values are high and doesn't fully recover.
    """
    all_vitals = get_all_vitals()
    
    # Handle wrap-around (e.g., from 22 to 6)
    if to_hour < from_hour:
        hours = list(range(from_hour, 24)) + list(range(0, to_hour + 1))
    else:
        hours = list(range(from_hour, to_hour + 1))
    
    # Accumulate stress per system
    arteries_load = 0.0
    lungs_load = 0.0
    neural_load = 0.0
    immune_load = 0.0
    
    peak_stress = 0.0
    peak_hour = from_hour
    
    # Recovery factor - stress doesn't accumulate linearly
    # Lower values = harder to recover, higher values = more stress
    ACCUMULATION_RATE = 0.7
    RECOVERY_THRESHOLD = 0.3  # Below this, system recovers slightly
    
    for hour in hours:
        vitals = all_vitals[hour]
        
        # Apply stress or recovery
        if vitals['traffic'] > RECOVERY_THRESHOLD:
            arteries_load += vitals['traffic'] * ACCUMULATION_RATE
        else:
            arteries_load = max(0, arteries_load - 0.1)
            
        if vitals['airQuality'] > RECOVERY_THRESHOLD:
            lungs_load += vitals['airQuality'] * ACCUMULATION_RATE
        else:
            lungs_load = max(0, lungs_load - 0.1)
            
        if vitals['power'] > RECOVERY_THRESHOLD:
            neural_load += vitals['power'] * ACCUMULATION_RATE
        else:
            neural_load = max(0, neural_load - 0.1)
            
        if vitals['emergency'] > RECOVERY_THRESHOLD:
            immune_load += vitals['emergency'] * ACCUMULATION_RATE
        else:
            immune_load = max(0, immune_load - 0.1)
        
        # Track peak
        if vitals['overall'] > peak_stress:
            peak_stress = vitals['overall']
            peak_hour = hour
    
    # Calculate recovery capacity (inverse of accumulated load)
    total_load = arteries_load + lungs_load + neural_load + immune_load
    max_possible_load = len(hours) * 4 * ACCUMULATION_RATE  # Maximum if all systems at 1.0
    recovery_capacity = max(0, 1 - (total_load / max_possible_load))
    
    return {
        "from_hour": from_hour,
        "to_hour": to_hour,
        "arteries_load": round(arteries_load, 3),
        "lungs_load": round(lungs_load, 3),
        "neural_load": round(neural_load, 3),
        "immune_load": round(immune_load, 3),
        "peak_hour": peak_hour,
        "peak_stress": round(peak_stress, 3),
        "recovery_capacity": round(recovery_capacity, 3)
    }


def get_daily_summary() -> Dict:
    """Get summary statistics for the entire 24-hour cycle."""
    all_vitals = get_all_vitals()
    
    # Find peaks and averages for each system
    traffic_values = [v['traffic'] for v in all_vitals]
    air_values = [v['airQuality'] for v in all_vitals]
    power_values = [v['power'] for v in all_vitals]
    emergency_values = [v['emergency'] for v in all_vitals]
    overall_values = [v['overall'] for v in all_vitals]
    
    return {
        "arteries": {
            "avg": round(sum(traffic_values) / 24, 3),
            "peak": round(max(traffic_values), 3),
            "peak_hour": traffic_values.index(max(traffic_values))
        },
        "lungs": {
            "avg": round(sum(air_values) / 24, 3),
            "peak": round(max(air_values), 3),
            "peak_hour": air_values.index(max(air_values))
        },
        "neural": {
            "avg": round(sum(power_values) / 24, 3),
            "peak": round(max(power_values), 3),
            "peak_hour": power_values.index(max(power_values))
        },
        "immune": {
            "avg": round(sum(emergency_values) / 24, 3),
            "peak": round(max(emergency_values), 3),
            "peak_hour": emergency_values.index(max(emergency_values))
        },
        "overall": {
            "avg": round(sum(overall_values) / 24, 3),
            "peak": round(max(overall_values), 3),
            "peak_hour": overall_values.index(max(overall_values)),
            "calm_hours": sum(1 for v in overall_values if v < 0.3),
            "stressed_hours": sum(1 for v in overall_values if v >= 0.6)
        }
    }
