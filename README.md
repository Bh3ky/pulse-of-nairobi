# Nairobi Urban Stress Model

A physiological model of Nairobi's urban stress. This project visualizes the city as a living organism, translating urban data into physiological responses.

## Project Structure

```
/backend          - FastAPI backend serving city vitals data
/frontend         - Next.js frontend with D3.js visualization
```

## Quick Start

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Concept

The project models Nairobi as a living organism:

- **Arteries** (Traffic) - Pulsating network that constricts during rush hours
- **Lungs** (Air Quality) - Expanding/contracting shapes that struggle with pollution
- **Neural System** (Power Grid) - Flickering network that dims under stress
- **Immune System** (Emergency Response) - Particles that slow when overwhelmed

As you scroll through a 24-hour cycle, the city's "body" reacts to accumulated stress, making invisible urban pressure tangible and felt.

## Technology Stack

- **Frontend**: Next.js, TypeScript, D3.js, Scrollama, CSS Modules
- **Backend**: FastAPI, Python
- **Data**: Simulated 24-hour urban stress patterns based on realistic proxies

## Goal

This is not a monitoring dashboard. The goal is to raise awareness by making invisible urban stress tangible and felt through interactive storytelling.
