# Methodology / روش‌شناسی

## 1. Dispersion model

A **Gaussian plume screening model** is used. It is appropriate for a rapid, reproducible, order-of-magnitude picture of footprint shape and relative intensity at the regional scale. It is deliberately simple so the whole chain is auditable.

### Governing equation

Ground-level relative concentration (receptor at z = 0) for a release at height H:

```
χ/Q (x, y) = exp(−y²/2σ_y²) · exp(−H²/2σ_z²) / (π · u · σ_y · σ_z)
```

- `χ/Q` — relative concentration, units s/m³ (concentration per unit release rate)
- `x` — downwind distance (m), `y` — crosswind distance (m)
- `H` — effective release height (m)
- `u` — mean wind speed (m/s), floored at 0.5 to avoid singularity
- `σ_y, σ_z` — Pasquill-Gifford dispersion coefficients (Briggs open-country forms)

The downwind-only `exp` in x produces the asymmetric, elongated **"candle-flame"** footprint: it grows along the wind and widens with distance as σ_y increases. The field is then rotated from plume coordinates into geographic lat/lon using the travel bearing (wind-from direction + 180°).

### Dispersion coefficients (Briggs, open country)

σ_y and σ_z are stability-dependent. Implemented per standard screening forms (Hanna, Briggs & Hosker 1982, *Handbook on Atmospheric Diffusion*, DOE/TIC-11223).

### Stability classification

Pasquill class A–F estimated from wind speed, day/night, and cloud fraction (the standard insolation table, conservative screening version). This is derived from the live weather, so stability changes with the real conditions at the chosen time.

## 2. What the model does NOT do

| Not modeled | Consequence |
|---|---|
| Plume rise (buoyancy/momentum) | Hot fire plumes rise higher; ground peak would move further downwind |
| Terrain | Zagros, valleys, urban Tehran channel and block real plumes |
| Wind meander / directional shear | Real footprints bend and fan; this uses one mean direction |
| Wet/dry deposition | Rain would scavenge and concentrate deposition locally |
| Decay/ingrowth | Not applied to the relative field |
| Dose conversion | No Sv output; no nuclide-specific coefficients |

These are the dominant uncertainties. **Source term and release height dominate everything else** — which is why the UI forces an explicit scenario choice and the data file gives five per facility.

## 3. Source terms

Source terms are **normalized release fractions**, not measured or predicted releases. They are generic screening values spanning minor leak to bounding loss-of-containment, ordered by confidence and evidence-graded. They answer "how does the footprint change if the release is larger/smaller?" — a sensitivity question — not "how much will be released?"

Presenting any of these as an actual prediction would be a misuse.

## 4. Weather provenance

| Requested time | Endpoint | Label |
|---|---|---|
| Older than ~5 days | Open-Meteo archive (ERA5 reanalysis) | `observation_reanalysis` |
| ~ −7 to +16 days | Open-Meteo forecast | `forecast` / `observation_reanalysis` |
| Beyond +16 days | none | `climatology_fallback` (no data returned) |

Forecast is never shown as observation; beyond-horizon requests return no fabricated weather.

## 5. Zone thresholds

RED / ORANGE / YELLOW / GREEN are bands on **normalized** relative concentration (fraction of the run's peak): 0.3 / 0.05 / 0.005 / >0. They communicate footprint shape and gradient. They are **not** regulatory dose limits. Real emergency thresholds (e.g. IAEA GSG-2 operational intervention levels, national OILs) must come from the competent authority and depend on pathway, nuclide and emergency phase.

## 6. Validation note

This class of Gaussian screening model is validated for *footprint shape and relative gradient* at local-to-regional scale, not for absolute far-field dose. For absolute source-term reconstruction and long-range transport, Lagrangian models (FLEXPART, HYSPLIT) driven by full 3-D meteorology are required — e.g. the FLEXPART Fukushima source-term reconstruction (Stohl et al. 2012, *Atmos. Chem. Phys.* 12, 2313–2343, doi:10.5194/acp-12-2313-2012). Before any operational use, outputs here should be benchmarked against such a model and against a documented historical case. This requires verification against the original sources.

## 7. Confidence statement

- **Footprint direction and relative shape given correct wind/stability:** Moderate confidence.
- **Absolute concentration or dose:** Very low confidence by design (no real source term, no dose model).
- **Hazard-type classification per facility (radiological vs chemical vs unknown):** the most robust output, resting on facility category which is grade A–B for all sites except Pickaxe Mountain (D).

Principal single-source dependency: live weather is from one provider (Open-Meteo). For critical use, cross-check against ECMWF or a national met service directly.
