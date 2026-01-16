"""
Additional tests for canonical hour data endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


class TestCanonicalEndpoints:
    """Test the new canonical hour and timeline endpoints."""
    
    def test_canonical_hour_structure(self):
        """Test that canonical hour has correct structure."""
        response = client.get("/api/city/12")
        assert response.status_code == 200
        data = response.json()
        
        # Check main fields
        assert data['hour'] == 12
        assert 'timestamp' in data
        assert 'vitals' in data
        assert 'systems' in data
        assert 'stress_delta' in data
        
        # Check vitals structure
        vitals = data['vitals']
        assert 'mobility' in vitals
        assert 'energy' in vitals
        assert 'social' in vitals
        assert 'economic' in vitals
        assert 'environmental' in vitals
        
        # Check systems structure
        systems = data['systems']
        assert 'transport' in systems
        assert 'healthcare' in systems
        assert 'internet' in systems
        assert 'power' in systems
        
        # Validate value ranges
        for key, value in vitals.items():
            assert 0 <= value <= 1, f"Vital {key} out of range: {value}"
        
        for key, value in systems.items():
            assert 0 <= value <= 1, f"System {key} out of range: {value}"
    
    def test_canonical_hour_invalid(self):
        """Test invalid hour for canonical endpoint."""
        response = client.get("/api/city/25")
        assert response.status_code == 400
    
    def test_full_timeline_structure(self):
        """Test full timeline endpoint."""
        response = client.get("/api/city-timeline")
        assert response.status_code == 200
        data = response.json()
        
        # Check top-level structure
        assert 'timeline' in data
        assert 'summary' in data
        assert 'generated_at' in data
        
        # Check timeline is complete
        timeline = data['timeline']
        assert len(timeline) == 24
        
        # Check first and last hours
        assert timeline[0]['hour'] == 0
        assert timeline[23]['hour'] == 23
        
        # Check summary structure
        summary = data['summary']
        assert 'peak_stress_hour' in summary
        assert 'lowest_social_hour' in summary
        assert 'avg_mobility' in summary
        assert 'total_stress_delta' in summary
        
        # Validate summary values
        assert 0 <= summary['peak_stress_hour'] <= 23
        assert 0 <= summary['lowest_social_hour'] <= 23
        assert 0 <= summary['avg_mobility'] <= 1
    
    def test_timeline_deterministic(self):
        """Test that timeline is deterministic (same on multiple calls)."""
        response1 = client.get("/api/city-timeline")
        response2 = client.get("/api/city-timeline")
        
        data1 = response1.json()
        data2 = response2.json()
        
        # Timeline should be identical (cached)
        assert data1['timeline'] == data2['timeline']
        assert data1['summary'] == data2['summary']
    
    def test_circadian_patterns(self):
        """Test that data follows expected circadian patterns."""
        response = client.get("/api/city-timeline")
        timeline = response.json()['timeline']
        
        # Mobility should be higher at rush hours than late night
        rush_hour_mobility = timeline[8]['vitals']['mobility']  # 8 AM
        late_night_mobility = timeline[3]['vitals']['mobility']  # 3 AM
        assert rush_hour_mobility > late_night_mobility
        
        # Energy should be higher during day than night
        daytime_energy = timeline[14]['vitals']['energy']  # 2 PM
        nighttime_energy = timeline[2]['vitals']['energy']  # 2 AM
        assert daytime_energy > nighttime_energy
        
        # Social should peak in evening
        evening_social = timeline[20]['vitals']['social']  # 8 PM
        morning_social = timeline[8]['vitals']['social']  # 8 AM
        assert evening_social > morning_social


class TestStressDelta:
    """Test stress delta calculations."""
    
    def test_stress_delta_present(self):
        """Test that stress_delta is calculated for all hours."""
        response = client.get("/api/city-timeline")
        timeline = response.json()['timeline']
        
        for hour_data in timeline:
            assert 'stress_delta' in hour_data
            assert hour_data['stress_delta'] >= 0
    
    def test_stress_delta_correlation(self):
        """Test that stress delta correlates with system load."""
        response = client.get("/api/city-timeline")
        timeline = response.json()['timeline']
        
        # Find hour with highest mobility
        max_mobility_hour = max(timeline, key=lambda h: h['vitals']['mobility'])
        min_mobility_hour = min(timeline, key=lambda h: h['vitals']['mobility'])
        
        # High mobility hour should generally have higher stress delta
        # (unless it's during recovery hours)
        if not (22 <= max_mobility_hour['hour'] or max_mobility_hour['hour'] <= 5):
            assert max_mobility_hour['stress_delta'] >= min_mobility_hour['stress_delta']


class TestBackwardCompatibility:
    """Ensure old endpoints still work with new data generation."""
    
    def test_old_vitals_endpoint_works(self):
        """Old vitals endpoint should still return expected structure."""
        response = client.get("/api/vitals/12")
        assert response.status_code == 200
        data = response.json()
        
        # Old structure should still exist
        assert 'hour' in data
        assert 'arteries' in data
        assert 'lungs' in data
        assert 'neural' in data
        assert 'immune' in data
    
    def test_mapping_consistency(self):
        """Test that old endpoints map correctly to new data."""
        # Get data from both endpoints
        canonical = client.get("/api/city/12").json()
        vitals = client.get("/api/vitals/12").json()
        
        # Verify mapping:
        # traffic (arteries) should equal mobility
        assert vitals['arteries']['value'] == canonical['vitals']['mobility']
        
        # airQuality (lungs) should equal environmental
        assert vitals['lungs']['value'] == canonical['vitals']['environmental']
        
        # power (neural) should equal power system
        assert vitals['neural']['value'] == canonical['systems']['power']
        
        # emergency (immune) should equal healthcare system
        assert vitals['immune']['value'] == canonical['systems']['healthcare']
