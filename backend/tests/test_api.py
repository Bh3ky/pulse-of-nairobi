"""
Tests for Nairobi Urban Stress API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_root_endpoint(self):
        """Test root endpoint returns healthy status."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
    
    def test_health_endpoint(self):
        """Test detailed health check."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "endpoints" in data


class TestVitalsEndpoints:
    """Test vitals API endpoints."""
    
    def test_vitals_by_hour_valid(self):
        """Test getting vitals for a valid hour."""
        response = client.get("/api/vitals/12")
        assert response.status_code == 200
        data = response.json()
        
        # Check structure
        assert data["hour"] == 12
        assert "arteries" in data
        assert "lungs" in data
        assert "neural" in data
        assert "immune" in data
        assert "overall_stress" in data
        assert "organism_status" in data
        
        # Check physiological system structure
        assert "value" in data["arteries"]
        assert "status" in data["arteries"]
        assert "description" in data["arteries"]
        assert 0 <= data["arteries"]["value"] <= 1
    
    def test_vitals_by_hour_invalid(self):
        """Test getting vitals for an invalid hour."""
        response = client.get("/api/vitals/25")
        assert response.status_code == 400
    
    def test_vitals_boundary_hours(self):
        """Test boundary hours (0 and 23)."""
        for hour in [0, 23]:
            response = client.get(f"/api/vitals/{hour}")
            assert response.status_code == 200
            data = response.json()
            assert data["hour"] == hour
    
    def test_all_vitals(self):
        """Test getting all 24 hours of vitals."""
        response = client.get("/api/vitals")
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) == 24
        assert data[0]["hour"] == 0
        assert data[23]["hour"] == 23


class TestTimelineEndpoints:
    """Test timeline API endpoints."""
    
    def test_timeline(self):
        """Test getting full timeline with summary."""
        response = client.get("/api/timeline")
        assert response.status_code == 200
        data = response.json()
        
        assert "hours" in data
        assert "daily_summary" in data
        assert len(data["hours"]) == 24
        
        # Check summary structure
        summary = data["daily_summary"]
        assert "arteries" in summary
        assert "lungs" in summary
        assert "neural" in summary
        assert "immune" in summary
        assert "overall" in summary


class TestStressEndpoints:
    """Test stress calculation endpoints."""
    
    def test_accumulated_stress_default(self):
        """Test accumulated stress with default parameters."""
        response = client.get("/api/stress/accumulated")
        assert response.status_code == 200
        data = response.json()
        
        assert data["from_hour"] == 0
        assert data["to_hour"] == 23
        assert "arteries_load" in data
        assert "lungs_load" in data
        assert "neural_load" in data
        assert "immune_load" in data
        assert "peak_hour" in data
        assert "peak_stress" in data
        assert "recovery_capacity" in data
    
    def test_accumulated_stress_custom_range(self):
        """Test accumulated stress with custom hour range."""
        response = client.get("/api/stress/accumulated?from_hour=6&to_hour=18")
        assert response.status_code == 200
        data = response.json()
        
        assert data["from_hour"] == 6
        assert data["to_hour"] == 18
    
    def test_current_stress(self):
        """Test current stress endpoint."""
        response = client.get("/api/stress/current")
        assert response.status_code == 200
        data = response.json()
        
        assert data["from_hour"] == 0
        assert "recovery_capacity" in data


class TestSystemEndpoints:
    """Test individual system endpoints."""
    
    def test_valid_system(self):
        """Test getting timeline for a valid system."""
        for system in ["arteries", "lungs", "neural", "immune"]:
            response = client.get(f"/api/systems/{system}")
            assert response.status_code == 200
            data = response.json()
            
            assert data["system"] == system
            assert len(data["data"]) == 24
            assert "summary" in data
    
    def test_invalid_system(self):
        """Test getting timeline for an invalid system."""
        response = client.get("/api/systems/heart")
        assert response.status_code == 400


class TestDataIntegrity:
    """Test data integrity and consistency."""
    
    def test_stress_values_in_range(self):
        """All stress values should be between 0 and 1."""
        response = client.get("/api/vitals")
        data = response.json()
        
        for hour_data in data:
            assert 0 <= hour_data["arteries"]["value"] <= 1
            assert 0 <= hour_data["lungs"]["value"] <= 1
            assert 0 <= hour_data["neural"]["value"] <= 1
            assert 0 <= hour_data["immune"]["value"] <= 1
            assert 0 <= hour_data["overall_stress"] <= 1
    
    def test_rush_hour_higher_stress(self):
        """Rush hours should have higher traffic stress."""
        response = client.get("/api/vitals")
        data = response.json()
        
        # Morning rush (8 AM) should be higher than early morning (4 AM)
        morning_rush = data[8]["arteries"]["value"]
        early_morning = data[4]["arteries"]["value"]
        assert morning_rush > early_morning
        
        # Evening rush (18:00) should be higher than midday
        evening_rush = data[18]["arteries"]["value"]
        midday = data[13]["arteries"]["value"]
        assert evening_rush > midday
