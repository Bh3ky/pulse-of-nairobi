# Nairobi Urban Stress Model - Backend

FastAPI backend serving city vitals data.

## Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Run

```bash
# Development server
uvicorn main:app --reload --port 8000

# Or
python main.py
```

## API Endpoints

- `GET /` - Health check
- `GET /vitals/{hour}` - Get vitals for specific hour (0-23)
- `GET /vitals` - Get vitals for all 24 hours
- `GET /health` - Detailed health check

## Data Structure

Each vitals response contains:

- `hour`: Hour of day (0-23)
- `traffic`: Traffic stress (0-1) - represents arterial system
- `airQuality`: Air quality stress (0-1) - represents lungs
- `power`: Power reliability stress (0-1) - represents neural system
- `emergency`: Emergency response stress (0-1) - represents immune system
- `overall`: Average stress across all systems
