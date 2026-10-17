# Facility Evidence & Data-Availability Matrix

Generated from `data/facilities.json`. Grades: A verified · B corroborated · C secondary · D unconfirmed · E inference · F hypothesis · G speculation.

| Facility | Category | Hazard | Grade | Coords | Status date | Key gap |
|---|---|---|---|---|---|---|
| Bushehr Nuclear Power Plant (BNPP) | Nuclear power plant (operating) | radiological_long | A | 28.830, 50.892 (±1km) | 2026-06 | Current core state, exact fuel burnup, and real damage state are not p... |
| Tehran Research Reactor (Amirabad) | Research reactor | radiological_local | B | 35.739, 51.389 (±1km) | 2026 | Current fuel loading and inventory not public. Note small inventory bo... |
| Natanz Fuel Enrichment Plant | Uranium enrichment | chemical_local | A | 33.724, 51.727 (±2km) | 2026-03 | Quantity of UF6 on site at any time is not public. Underground hall in... |
| Fordow Fuel Enrichment Plant | Uranium enrichment (underground) | chemical_local | A | 34.885, 50.996 (±2km) | 2026-06 | Post-strike internal state and residual UF6 inventory not public.... |
| Isfahan Nuclear Technology Center (UCF) | Uranium conversion and research | chemical_local | A | 32.573, 51.806 (±2km) | 2026 | Current chemical inventories not public.... |
| Arak / Khondab Heavy Water Reactor (IR-40) | Heavy water research reactor (not operational) | low_unknown | B | 34.374, 49.241 (±2km) | 2026 | Current construction and fueling status not fully public.... |
| Pickaxe Mountain tunnel complex (near Natanz) | Undisclosed underground construction | low_unknown | D | 33.749, 51.791 (±3km) | 2026 | Function, contents, and any nuclear-material inventory are UNVERIFIED.... |

## Source-term scenario confidence per facility

### Bushehr Nuclear Power Plant (BNPP)

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | Minor leak, filtered | higher | E | 0.0001 | 30m |
| S2 | Moderate venting | moderate | E | 0.001 | 30m |
| S3 | Significant release | moderate | F | 0.01 | 50m |
| S4 | Severe, partial containment loss | lower | F | 0.05 | 60m |
| S5 | Major, loss of containment | lowest | G | 0.1 | 80m |

### Tehran Research Reactor (Amirabad)

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | Contained incident | higher | E | 1e-05 | 10m |
| S2 | Fuel handling release | moderate | E | 0.0001 | 10m |
| S3 | Pool loss event | moderate | F | 0.001 | 10m |
| S4 | Partial fuel damage | lower | F | 0.01 | 15m |
| S5 | Major fuel damage | lowest | G | 0.05 | 20m |

### Natanz Fuel Enrichment Plant

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | Small UF6 leak | higher | E | 0.001 | 5m |
| S2 | Cylinder breach | moderate | E | 0.01 | 5m |
| S3 | Multiple cylinder release | moderate | F | 0.05 | 10m |
| S4 | Fire-driven dispersal | lower | F | 0.1 | 20m |
| S5 | Large chemical release | lowest | G | 0.3 | 30m |

### Fordow Fuel Enrichment Plant

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | Small UF6 leak | higher | E | 0.001 | 5m |
| S2 | Cylinder breach | moderate | E | 0.01 | 5m |
| S3 | Multiple cylinder release | moderate | F | 0.05 | 10m |
| S4 | Fire-driven dispersal | lower | F | 0.1 | 15m |
| S5 | Large chemical release | lowest | G | 0.2 | 25m |

### Isfahan Nuclear Technology Center (UCF)

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | Small chemical leak | higher | E | 0.001 | 5m |
| S2 | Process release | moderate | E | 0.01 | 10m |
| S3 | Storage breach | moderate | F | 0.05 | 10m |
| S4 | Fire-driven dispersal | lower | F | 0.1 | 20m |
| S5 | Large chemical release | lowest | G | 0.25 | 30m |

### Arak / Khondab Heavy Water Reactor (IR-40)

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | No active inventory | higher | B | 0.0 | 10m |
| S2 | Minor contamination handling | moderate | E | 1e-05 | 10m |
| S3 | Localized dispersal | lower | F | 0.0001 | 10m |
| S4 | Hypothetical if fueled | lowest | G | 0.001 | 15m |
| S5 | Bounding hypothetical | lowest | G | 0.01 | 20m |

### Pickaxe Mountain tunnel complex (near Natanz)

| ID | Scenario | Confidence | Grade | Release fraction | Height |
|---|---|---|---|---|---|
| S1 | No confirmed inventory | higher | D | 0.0 | 10m |
| S2 | If enrichment: small UF6 | lower | F | 0.001 | 5m |
| S3 | If enrichment: cylinder breach | lower | F | 0.01 | 10m |
| S4 | Hypothetical chemical dispersal | lowest | G | 0.05 | 15m |
| S5 | Bounding hypothetical | lowest | G | 0.1 | 20m |
