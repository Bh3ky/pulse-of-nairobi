"""
FastAPI backend for Nairobi Urban Stress Model.
Serves city vitals data as physiological states for visualization.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional

from data_proxies import get_city_vitals, get_all_vitals
from models import (
    CityVitals, PhysiologicalSystem, AccumulatedStress,
    TimelineResponse, StressLevel,
    get_stress_level, get_system_description
)
from stress_calculator import calculate_accumulated_stress, get_daily_summary

app = FastAPI(
    title="Nairobi Urban Stress API",
    description="API serving Nairobi's urban data as physiological states for scrollytelling visualization",
    version="2.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def build_physiological_system(name: str, urban_source: str, value: float) -> dict:
    """Build a physiological system object from urban data."""
    return {
        "name": name,
        "urban_source": urban_source,
        "value": value,
        "status": get_stress_level(value).value,
        "description": get_system_description(name, value)
    }


def build_city_vitals(hour: int) -> dict:
    """Build complete city vitals with physiological mapping."""
    raw = get_city_vitals(hour)
    
    return {
        "hour": hour,
        "arteries": build_physiological_system("arteries", "traffic", raw["traffic"]),
        "lungs": build_physiological_system("lungs", "airQuality", raw["airQuality"]),
        "neural": build_physiological_system("neural", "power", raw["power"]),
        "immune": build_physiological_system("immune", "emergency", raw["emergency"]),
        "overall_stress": raw["overall"],
        "organism_status": get_stress_level(raw["overall"]).value
    }


# ============== API Endpoints ==============

@app.get("/")
async def root():
    """Health check and API info."""
    return {
        "status": "healthy",
        "service": "Nairobi Urban Stress API",
        "version": "2.0.0",
        "description": "Nairobi modeled as a living organism"
    }


@app.get("/api/vitals/{hour}")
async def get_vitals_by_hour(hour: int) -> dict:
    """
    Get city vitals for a specific hour (0-23).
    
    Returns physiological states mapped from urban data:
    - arteries: Traffic → Blood flow
    - lungs: Air quality → Respiration  
    - neural: Power grid → Nervous system
    - immune: Emergency response → Immune system
    """
    if not 0 <= hour <= 23:
        raise HTTPException(status_code=400, detail="Hour must be between 0 and 23")
    
    return build_city_vitals(hour)


@app.get("/api/vitals")
async def get_all_vitals_endpoint() -> List[dict]:
    """
    Get city vitals for all 24 hours.
    Useful for preloading data on the frontend for smooth scrolling.
    """
    return [build_city_vitals(hour) for hour in range(24)]


@app.get("/api/timeline")
async def get_timeline() -> dict:
    """
    Get complete 24-hour timeline with daily summary.
    Includes stress data for all hours plus aggregate statistics.
    """
    hours = [build_city_vitals(hour) for hour in range(24)]
    summary = get_daily_summary()
    
    return {
        "hours": hours,
        "daily_summary": summary
    }


@app.get("/api/stress/accumulated")
async def get_accumulated_stress(
    from_hour: int = Query(0, ge=0, le=23, description="Starting hour"),
    to_hour: int = Query(23, ge=0, le=23, description="Ending hour")
) -> dict:
    """
    Calculate accumulated stress between two hours.
    
    Stress accumulates when systems are under load and
    only partially recovers during low-stress periods.
    
    Returns:
    - Per-system accumulated load
    - Peak stress hour and value
    - Recovery capacity remaining
    """
    return calculate_accumulated_stress(from_hour, to_hour)


@app.get("/api/stress/current")
async def get_current_stress() -> dict:
    """
    Get stress accumulated from midnight to current simulated hour.
    Simulates real-time progression through the day.
    """
    # For demo, use a default progression. In production, could use actual time.
    import datetime
    current_hour = datetime.datetime.now().hour
    
    return calculate_accumulated_stress(0, current_hour)


@app.get("/api/systems/{system}")
async def get_system_timeline(system: str) -> dict:
    """
    Get 24-hour data for a specific physiological system.
    
    Valid systems: arteries, lungs, neural, immune
    """
    valid_systems = ["arteries", "lungs", "neural", "immune"]
    if system not in valid_systems:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid system. Must be one of: {valid_systems}"
        )
    
    all_vitals = [build_city_vitals(hour) for hour in range(24)]
    
    # Extract just the requested system
    system_data = [
        {
            "hour": v["hour"],
            **v[system]
        }
        for v in all_vitals
    ]
    
    # Calculate summary for this system
    values = [d["value"] for d in system_data]
    
    return {
        "system": system,
        "data": system_data,
        "summary": {
            "average": round(sum(values) / len(values), 3),
            "peak_value": max(values),
            "peak_hour": values.index(max(values)),
            "min_value": min(values),
            "min_hour": values.index(min(values))
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check with all available endpoints."""
    return {
        "status": "ok",
        "endpoints": {
            "vitals_by_hour": "/api/vitals/{hour}",
            "all_vitals": "/api/vitals",
            "timeline": "/api/timeline",
            "accumulated_stress": "/api/stress/accumulated?from_hour=0&to_hour=23",
            "current_stress": "/api/stress/current",
            "system_timeline": "/api/systems/{system}",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
