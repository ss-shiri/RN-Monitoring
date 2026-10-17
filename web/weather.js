/*
 * weather.js — fetches real meteorology for a point/date/time from Open-Meteo.
 *
 * Open-Meteo is a free, no-key API backed by national weather services and ECMWF/GFS.
 *  - Forecast endpoint covers roughly now to +16 days.
 *  - Archive (ERA5 reanalysis) endpoint covers the past (a few days ago and older).
 * The code picks the right endpoint from the requested date and labels the data
 * provenance (forecast vs reanalysis) so the user never mistakes one for the other.
 *
 * Provenance labels returned in result.provenance:
 *   "observation_reanalysis" — ERA5 archive (past)
 *   "forecast"               — numerical forecast (near future, within horizon)
 *   "climatology_fallback"   — requested time outside supported window; NOT real data
 */

const OM_FORECAST = "https://api.open-meteo.com/v1/forecast";
const OM_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";

function isoDate(d) { return d.toISOString().slice(0, 10); }

async function fetchWeather(lat, lon, whenISO) {
  const when = new Date(whenISO);
  const now = new Date();
  const daysAhead = (when - now) / 86400000;

  let provenance, url, usingArchive = false;
  if (daysAhead < -5) {
    usingArchive = true;
    provenance = "observation_reanalysis";
    const d = isoDate(when);
    url = `${OM_ARCHIVE}?latitude=${lat}&longitude=${lon}&start_date=${d}&end_date=${d}` +
          `&hourly=wind_speed_10m,wind_direction_10m,temperature_2m,precipitation,cloud_cover,relative_humidity_2m,surface_pressure` +
          `&wind_speed_unit=ms&timezone=auto`;
  } else if (daysAhead <= 16) {
    provenance = daysAhead < 0 ? "observation_reanalysis" : "forecast";
    url = `${OM_FORECAST}?latitude=${lat}&longitude=${lon}` +
          `&hourly=wind_speed_10m,wind_direction_10m,temperature_2m,precipitation,cloud_cover,relative_humidity_2m,surface_pressure,boundary_layer_height` +
          `&wind_speed_unit=ms&forecast_days=16&past_days=7&timezone=auto`;
  } else {
    return {
      provenance: "climatology_fallback",
      error: "Requested time is beyond the forecast horizon (~16 days). No real weather available; use a labeled climatological assumption instead.",
      error_fa: "زمان درخواستی فراتر از افق پیش‌بینی (حدود ۱۶ روز) است. داده‌ی واقعی موجود نیست؛ از فرض اقلیمی برچسب‌دار استفاده کنید."
    };
  }

  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Weather API HTTP " + resp.status);
  const j = await resp.json();
  const H = j.hourly;
  if (!H || !H.time) throw new Error("Weather API returned no hourly data");

  // Find the hour closest to the requested time.
  const targetMs = when.getTime();
  let best = 0, bestDiff = Infinity;
  for (let i = 0; i < H.time.length; i++) {
    const t = new Date(H.time[i]).getTime();
    const diff = Math.abs(t - targetMs);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  }

  const windSpeed = H.wind_speed_10m[best];
  const windDir = H.wind_direction_10m[best];
  const temp = H.temperature_2m ? H.temperature_2m[best] : null;
  const precip = H.precipitation ? H.precipitation[best] : 0;
  const cloud = H.cloud_cover ? H.cloud_cover[best] / 100 : 0.3;
  const rh = H.relative_humidity_2m ? H.relative_humidity_2m[best] : null;
  const pressure = H.surface_pressure ? H.surface_pressure[best] : null;
  const blh = H.boundary_layer_height ? H.boundary_layer_height[best] : null;

  const matchedTime = H.time[best];
  const hour = new Date(matchedTime).getHours();
  const isDay = hour >= 7 && hour < 19;

  return {
    provenance,
    usingArchive,
    matchedTime,
    requestedTime: whenISO,
    windSpeed, windDir, temp, precip, cloud, rh, pressure, blh, isDay,
    timeOffsetMinutes: Math.round(bestDiff / 60000),
    source: usingArchive ? "Open-Meteo / ERA5 reanalysis (ECMWF)" : "Open-Meteo / numerical forecast (ECMWF-IFS, GFS)",
    retrieved: new Date().toISOString()
  };
}

if (typeof module !== "undefined") module.exports = { fetchWeather };
