/*
 * dispersion.js — Gaussian plume screening model for civilian emergency planning.
 *
 * SCOPE AND LIMITS (read before trusting any output):
 *  - This is a SCREENING model (Gaussian plume, Pasquill-Gifford sigmas). It shows
 *    the SHAPE and RELATIVE intensity of a downwind footprint. It is NOT a validated
 *    dose prediction and NOT an operational warning tool.
 *  - Output is a normalized relative concentration (chi/Q, units s/m^3), i.e. concentration
 *    per unit release rate. Absolute dose requires a real source term, nuclide-specific
 *    dose coefficients, exposure pathway and integration time — none assumed here.
 *  - The plume is non-circular by design: it extends downwind and widens with distance,
 *    the "candle-flame" shape the user asked for. In the real atmosphere the footprint
 *    also bends and meanders; this model applies a single mean wind direction per run.
 *  - Flat-terrain assumption. Iran's terrain (Zagros, urban Tehran) will alter real plumes.
 *  - Release height strongly changes the footprint: elevated releases keep the peak aloft,
 *    moving the ground maximum downwind. Always run several heights (the UI does this).
 *
 * References for the method (not facility-specific):
 *  - Pasquill (1961), Gifford (1961) dispersion coefficients.
 *  - US EPA screening dispersion guidance; Hanna, Briggs & Hosker (1982) "Handbook on
 *    Atmospheric Diffusion", DOE/TIC-11223.
 */

const STABILITY = {
  A: { name_en: "Very unstable", name_fa: "بسیار ناپایدار" },
  B: { name_en: "Unstable", name_fa: "ناپایدار" },
  C: { name_en: "Slightly unstable", name_fa: "کمی ناپایدار" },
  D: { name_en: "Neutral", name_fa: "خنثی" },
  E: { name_en: "Slightly stable", name_fa: "کمی پایدار" },
  F: { name_en: "Stable", name_fa: "پایدار" }
};

// Pasquill-Gifford sigma_y, sigma_z (Briggs, open-country), x in metres.
function sigmaY(cls, x) {
  const a = { A: 0.22, B: 0.16, C: 0.11, D: 0.08, E: 0.06, F: 0.04 }[cls];
  return a * x / Math.sqrt(1 + 0.0001 * x);
}
function sigmaZ(cls, x) {
  const p = {
    A: [0.20, 0, 0], B: [0.12, 0, 0], C: [0.08, 0.0002, -0.5],
    D: [0.06, 0.0015, -0.5], E: [0.03, 0.0003, -1], F: [0.016, 0.0003, -1]
  }[cls];
  if (cls === "A" || cls === "B") return p[0] * x;
  return p[0] * x / Math.pow(1 + p[1] * x, -p[2]);
}

/* Estimate Pasquill class from wind speed, time-of-day and cloud.
 * Conservative, screening-grade. */
function estimateStability(windSpeed, isDay, cloudFraction) {
  const u = windSpeed;
  if (isDay) {
    const strong = cloudFraction < 0.5;
    if (u < 2) return strong ? "A" : "B";
    if (u < 3) return strong ? "B" : "C";
    if (u < 5) return "C";
    if (u < 6) return "C";
    return "D";
  } else {
    if (cloudFraction > 0.5) {
      if (u < 2) return "E";
      if (u < 3) return "E";
      return "D";
    } else {
      if (u < 2) return "F";
      if (u < 3) return "F";
      if (u < 5) return "E";
      return "D";
    }
  }
}

/* Ground-level relative concentration chi/Q (s/m^3) at downwind x, crosswind y.
 * windDirFrom = meteorological direction the wind blows FROM (degrees). */
function groundChiOverQ(x, y, H, cls, u) {
  if (x <= 0) return 0;
  const sy = sigmaY(cls, x), sz = sigmaZ(cls, x);
  if (sy <= 0 || sz <= 0) return 0;
  const uu = Math.max(u, 0.5);
  const horiz = Math.exp(-(y * y) / (2 * sy * sy));
  const vert = Math.exp(-(H * H) / (2 * sz * sz)); // ground reflection, receptor at z=0
  return horiz * vert / (Math.PI * uu * sy * sz);
}

/* Build a footprint as a grid of {lat,lon,value}. Returns points above a floor,
 * plus the peak value for normalization. windDirFrom in degrees (0=N,90=E). */
function computeFootprint(opts) {
  const {
    lat0, lon0, windDirFrom, windSpeed, stability, releaseHeight,
    maxRangeKm = 60, grid = 90
  } = opts;

  // Direction the plume travels TO (radians, math convention from +x=east).
  const toDeg = (windDirFrom + 180) % 360;
  const bearingRad = toDeg * Math.PI / 180; // compass bearing of travel

  const cls = stability;
  const u = windSpeed;
  const H = releaseHeight;
  const stepM = (maxRangeKm * 1000) / grid;

  const pts = [];
  let peak = 0;
  // Sample along-plume (x) and cross-plume (y) then rotate into geographic space.
  for (let i = 1; i <= grid; i++) {
    const x = i * stepM; // downwind distance
    const sy = sigmaY(cls, x);
    const halfWidth = 2.5 * sy; // sample out to 2.5 sigma either side
    const ySteps = 24;
    for (let j = -ySteps; j <= ySteps; j++) {
      const y = (j / ySteps) * halfWidth;
      const v = groundChiOverQ(x, y, H, cls, u);
      if (v <= 0) continue;
      if (v > peak) peak = v;
      // Rotate (x along travel, y crosswind) to geographic offset.
      // Travel bearing measured clockwise from north.
      const dN = x * Math.cos(bearingRad) - y * Math.sin(bearingRad);
      const dE = x * Math.sin(bearingRad) + y * Math.cos(bearingRad);
      const dLat = dN / 111320;
      const dLon = dE / (111320 * Math.cos(lat0 * Math.PI / 180));
      pts.push({ lat: lat0 + dLat, lon: lon0 + dLon, value: v, x: x });
    }
  }
  return { points: pts, peak: peak, stability: cls, travelBearing: toDeg };
}

/* Classify a normalized value (0..1 of peak) into RED/ORANGE/YELLOW/GREEN.
 * Thresholds are ILLUSTRATIVE planning bands on relative concentration, NOT
 * regulatory dose limits. They exist to communicate shape, not safety. */
function zoneColor(normalized) {
  if (normalized >= 0.3) return "red";
  if (normalized >= 0.05) return "orange";
  if (normalized >= 0.005) return "yellow";
  if (normalized > 0) return "green";
  return null;
}

const ZONE_META = {
  red:    { en: "Highest modeled relative concentration", fa: "بیشترین غلظت نسبی مدل‌شده", hex: "#d7263d" },
  orange: { en: "Elevated, urgent assessment",            fa: "بالا، نیازمند ارزیابی فوری", hex: "#f46036" },
  yellow: { en: "Monitoring and precaution",              fa: "پایش و احتیاط",               hex: "#f4c20d" },
  green:  { en: "Low modeled relative concentration",     fa: "غلظت نسبی پایین مدل‌شده",     hex: "#3fa34d" }
};

if (typeof module !== "undefined") {
  module.exports = { computeFootprint, zoneColor, estimateStability, ZONE_META, STABILITY, sigmaY, sigmaZ };
}
