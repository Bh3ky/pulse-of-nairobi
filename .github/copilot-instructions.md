# Copilot Instructions for Pulse of Nairobi

## Architecture Overview
- **Backend (FastAPI)**: Serves simulated urban stress data as physiological states (`/backend`)
- **Frontend (Next.js)**: Scrollytelling visualization mapping city data to organism metaphors (`/frontend`)
- **Data Flow**: Backend generates deterministic 24-hour timeline; frontend fetches via REST API for interactive storytelling

## Key Patterns
- **Physiological Mapping**: Traffic→arteries, air quality→lungs, power→neural system, emergency→immune system
- **Data Generation**: Circadian rhythms + controlled noise (seeded random for consistency) in `data_proxies.py`
- **Visualization**: D3.js + Scrollama for scroll-triggered animations; CSS Modules for component styling
- **Stress Model**: Accumulative stress with partial recovery; see `stress_calculator.py` for calculations

## Development Workflow
- **Backend**: `cd backend && python main.py` (or `uvicorn main:app --reload --port 8000`)
- **Frontend**: `cd frontend && npm run dev` (runs on localhost:3000)
- **Testing**: `pytest` in backend; no frontend tests yet
- **Data Updates**: Modify circadian curves in `data_proxies.py`; restart backend to regenerate timeline

## Code Conventions
- **API Responses**: Always include physiological system objects with `name`, `urban_source`, `value`, `status`, `description`
- **Frontend Components**: Use CSS Modules (`.module.css`); hooks in `/hooks/`; types in `/lib/types/`
- **Imports**: Relative paths with `@/` alias for src directory
- **Error Handling**: HTTPException for invalid hours; frontend assumes API availability

## Integration Points
- **CORS**: Configured for localhost:3000/3001 in `main.py`
- **Data Fetching**: Frontend calls `/api/vitals` for preloading, `/api/vitals/{hour}` for per-section data
- **No External APIs**: All data is simulated internally

## Common Pitfalls
- **Data Consistency**: Timeline cached in memory; changes require restart
- **Scrollama Setup**: Requires proper container refs and step elements
- **TypeScript**: Strict typing for vitals data; see `scrollystory.ts` for interfaces</content>
<parameter name="filePath">/Users/telasi/Developer/CA/.github/copilot-instructions.md