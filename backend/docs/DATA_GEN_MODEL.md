## Pulse of Nairobi - Data Generation Model

### Core Concepts

- city vitals
- system loads
- stress deltas

Example: Canonical Hour Object:

```json
{
  "hour": 8,
  "timestamp": "2026-01-16T08:00:00Z",
  "vitals": {
    "mobility": 0.78,
    "energy": 0.65,
    "social": 0.42,
    "economic": 0.71,
    "environmental": 0.33
  },
  "systems": {
    "transport": 0.82,
    "healthcare": 0.46,
    "internet": 0.74,
    "power": 0.69
  },
  "stress_delta": 0.06
}
```

Note: this object is the atomic unit of data in the system. It represents the state of the city at a specific hour.

### Synthetic Data Strategy

- DO NOT:
  - hardcode JSON files randomly
  - use uniform random numbers
  - generate data per endpoint independently

- DO:
  - generate one daily timeline
  - derive every endpoint from it

### Data Generation (Believable City Data)

#### Step 1: Define Circadian Curves

- urban system follow predictable daily rhythms

| System       | Pattern                        |
| :----------- | :----------------------------- |
| **Mobility** | Morning + evening peaks        |
| **Energy**   | High daytime, low night        |
| **Social**   | Evening-heavy                  |
| **Economic** | Business hours                 |
| **Stress**   | Accumulative, decays overnight |

#### Step 2: Add Controlled Noise

To avoid “too perfect” visuals:

- Add small bounded randomness
- Seed it (important)

```python
random.seed(42)
noise = random.uniform(-0.05, 0.05)
```

This ensures:

- same refresh -> same story
- D3 animations remain stable

#### Step 3: Stress Accumulation Model

This is key the key narrative

```text
stress(t) = stress(t-1)
           + stress_delta(t)
           - recovery(t)
```

Where:

- stress_delta depends on:
- mobility
- system overload
- recovery occurs:
- late night (22–5)
- weekends (later)

This directly powers:

- `/api/stress/current`
- `/api/stress/accumulated`

### How each endpoint should be backed

`/api/vitals/{hour}`

Derived from:

```python
timeline.[hour].vitals
```

`api/vitals`

- map over timeline -> vitals array

`/api/timeline`

Return:

- Full 24-hour array
- Precomputed daily summary

```json
{
  "peak_stress_hour": 17,
  "lowest_social_hour": 3,
  "avg_mobility": 0.61
}
```

`/api/systems/{system}`

Extract that system's value across hours -> perfect for line charts

`/api/stress/*`

Derived, never stored independently

This model is peferct for Scrollama + D3:

Scroll-Driven Transitions

- Hour-by-hour morphing
- System isolation (“Now focus on transport…”)
- Stress accumulation reveals

SVG Animation Stability

- Deterministic values
- Smooth interpolation
- No visual “jumping”

Narrative Control

You can intentionally exaggerate:

- Rush hour stress
- Nighttime social collapse
- Infrastructure strain
