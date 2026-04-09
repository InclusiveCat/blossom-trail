# 🌸 Oubaitori Blossom Trail — Interactive Map

The **Oubaitori Blossom Trail** is a mobile‑optimised, high-accessibility interactive map experience designed for neurodivergent adults across the UK.

The trail gathers anonymous evidence for the design of new neurodivergent support services. It blends geographic navigation with the Japanese philosophical principle **Oubaitori (桜梅桃李)** — the idea that Cherry, Plum, Peach, and Apricot blossoms each bloom in their own time, reminding us that every journey unfolds uniquely.

---

## 🌿 Project Overview

The Blossom Trail guides participants through a curated 5‑stage wellness and research experience. Depending on their location, participants enter either **Full Mode** (North East, high-fidelity trail) or **Light Mode** (all other UK regions, place-aware national experience).

### 5‑Stage Narrative Framework

| Stage | Title | Domain |
|-------|-------|--------|
| 1 | Reset | Environment |
| 2 | Expansion | Sustainability |
| 3 | Flow | Support Model |
| 4 | Connection | Technology |
| 5 | Breathe | Local Awareness |

---

## ✨ Feature List

### Core Experience
- **Dual-Mode Delivery:** Full Mode for North East participants (rich landmark trail), Light Mode for all other UK regions (place-aware generic journey with national landmark cards).
- **5‑Stage Survey:** Likert-scale responses, somatic regulation techniques, and service gap analysis — all captured locally and ready for MS Forms integration.
- **Pulse Check:** Real-time energy accounting (Thriving / Masking / Burnout) logged with each submission.
- **Professional Status:** Step-by-step progressive disclosure for locating oneself on a work/life spectrum.
- **Test Mode:** On-screen payload viewer displays all captured data before MS Forms is connected.

### Map & Location
- **Region-Aware Map Rendering:** The map opens at a neutral UK-wide view (zoom 6). It pans dynamically to the user's selected region — never defaults to North East for non-NE users.
- **Full Mode (North East):** Loads the existing 19-site blossom trail, pink dashed route polyline, blossom and landmark markers, van GPS tracking, and NE community hub layer.
- **Light Mode (all other UK regions):** Uses CartoDB Light tile layer, pans to the selected region centroid, and populates stages with regional landmark cards from the `UK_LANDMARKS` table.
- **Landmark Fallback:** If no landmarks exist for a region, stages display a generic blossom placeholder card.
- **REGION_MODES table:** Promotes any region from Light to Full by changing a single flag — no code refactoring required.
- **Stage Centroid Panning:** Map pans to NE stage centroids only in Full Mode — Light Mode never triggers NE-specific coordinates.

### Accessibility
- **Font-Size Slider:** A range slider (80%–140%) in the Display tab scales all sidebar text using `--font-scale` on `:root`. Fully keyboard-operable via arrow keys. Step buttons (A− / A+) increment by 5%. Resets on page reload.
- **Dyslexia-Friendly Font:** One-click toggle in the Display tab.
- **Manual Rain Mode:** Overrides live weather data to test accessibility warnings on non-paved trail surfaces.
- **Dynamic Radar Search:** Live query to the public Overpass API fetching accessible toilets (♿ blue) and Radar Key facilities (🔑 purple) within the current map viewport. Works nationally. Updates automatically as the user pans.
- **Emergency Suite:** Quick-access to 999 BSL and Relay UK in the Emergency tab.
- **Smooth Map Transitions:** All pans use `{ animate: true }` to prevent vestibular distress.
- **Progressive Disclosure (Location):** 3-level drill-down (Nation → Region → Local Authority) with a live breadcrumb progress indicator to reduce navigational anxiety.
- **Neuroinclusive London Zones:** London split into 5 intuitive, public-facing geographic zones aligned to ONS data sets (Central, East, North, South, West).

### Live Conditions
- **Weather:** Current conditions from Open-Meteo API (temperature, wind speed, weather code) used to trigger slip warnings for non-paved surfaces.
- **Bloom Prediction:** 7-day temperature trend from Open-Meteo used to predict blossom status (❄️ Pre-Season / 🌱 Approaching Bloom / 🌸 Peak Blossom) — updates based on selected region coordinates.
- **Weather Coordinates:** Dynamically set to the selected region's centroid — no longer hardcoded to the North East.

### PWA Support
- **Web App Manifest** (`manifest.json`): Enables install-to-homescreen on iOS and Android. Theme colour matches the Blossom Trail palette.
- **Service Worker** (`sw.js`): Implements offline-first caching for all static assets and map tiles.

---

## 📡 Offline Behaviour (PWA / Service Worker)

The service worker uses a **multi-strategy cache** designed for trail safety in rural and low-signal areas:

| Resource Type | Strategy | Behaviour When Offline |
|---------------|----------|------------------------|
| Static shell (`index.html`, SVGs, manifest) | Cache-first + background update | Served from cache immediately |
| Map tiles (OSM, CartoDB) | Cache-first, cached on-the-fly | Served from tile cache; blank tile shown if never cached |
| Weather / Bloom APIs (Open-Meteo) | Network-first | Returns `{ error: 'offline' }` JSON; UI degrades gracefully |
| Everything else | Stale-while-revalidate | Cache served instantly, updated in background |

> **Rural Safety Note:** Once a user has visited the trail and panned through the NE route, those map tiles are cached. The trail can then function fully offline, including the sidebar, survey, and weather display (with last-known values).

---

## 🗺️ Delivery Mode Behaviour

| User Selection | Mode | Map Tile | Map Behaviour | Stage Content |
|----------------|------|----------|----------------|----------------|
| North East LA | **Full** | OpenStreetMap (coloured) | Pans to NE, shows 19-site trail + polyline | NE site links per stage |
| Any other UK region | **Light** | CartoDB Light (clean grey) | Pans to selected region centroid | Regional landmark cards or blossom fallback |
| Online / Not in UK | **Light** | CartoDB Light | Stays at UK-wide view | Blossom fallback |

**Promoting a region to Full Mode:**
1. Set `REGION_MODES['region-key'] = 'full'` in the JS config object.
2. Add `sites[]` entries with `stage`, `lat`, `lon`, `type`, `img`, and `access` fields.
3. No other code changes required.

---

## 🏗️ Architecture

All logic is contained in a single **monolithic IIFE** (`index.html`). Key data structures:

| Object | Location | Purpose |
|--------|----------|---------|
| `REGION_MODES` | Outer script | Flags which regions use Full vs Light Mode |
| `REGION_CENTROIDS` | Outer script | Lat/lon for all UK regions — used for map pan and weather |
| `UK_LANDMARKS` | Outer script | Regional landmark data for Light Mode stage cards |
| `UK_LOCATIONS` | Outer script | 3-level Country → Region → LA hierarchy (all UK) |
| `backupHubs` | Map IIFE | NE-specific community hub WC markers (Full Mode only) |
| `sites` | Map IIFE | 19-site NE blossom trail definitions |
| `stages` | Map IIFE | 5-stage narrative framework (shared, both modes) |

### Removed in this version
- Orphaned duplicate IIFE (previously caused NE-defaulting behaviour)
- Hardcoded North East lat/lon in map initialisation, weather fetch, and recenter fallback
- Hardcoded NE map tile and zoom level on initial load

---

## 🚀 Setup Instructions

### Local Development

```bash
# Install a static file server (one-time)
npm install -g serve

# Serve from the project root
npx serve c:\path\to\blossom-trail --listen 3000
```

Then open: `http://localhost:3000`

### Required Files in Root Directory

```
index.html        — All UI, CSS, and JS logic (single-file)
manifest.json     — PWA web app manifest
sw.js             — Service worker (offline support)
blossom1.svg      — Blossom icon for trail markers
test-van.svg      — Van GPS marker icon
*.jpg             — 19 NE trail site images (Full Mode popups)
```

### GitHub Pages Deployment

1. Create a public GitHub repository and push all root files.
2. Go to **Settings → Pages → Source: main branch → Save**.
3. The site will be live at `https://<username>.github.io/<repo>/`.

> **Important:** GitHub Pages requires `https://` for Geolocation (GPS van tracking) and Service Workers to function.

---

## 📲 PWA Installation

### Android (Chrome)
1. Open the trail in Chrome.
2. Tap the **three-dot menu → "Add to Home Screen"**.
3. The trail launches as a standalone app with no browser chrome.

### iOS (Safari)
1. Open the trail in Safari.
2. Tap the **Share icon → "Add to Home Screen"**.
3. The trail icon appears on the home screen.

### Desktop (Chrome / Edge)
1. Click the **install icon** in the address bar (or menu).
2. The trail runs as a standalone desktop app.

---

## ♿ Accessibility Notes

- **Font-Size Slider:** Uses `--font-scale` CSS variable on `:root`. Range input is natively keyboard-operable (focus + arrow keys). Step buttons use `aria-label`. The percentage display is live-updated.
- **Radar Search:** Uses the public [Overpass API](https://overpass-api.de) via OSM data. Quality of results depends on local OSM mapping coverage. Urban areas have fuller data.
- **Weather Warnings:** Surface-type advice only appears when `isRaining = true` (live or manual). Warnings are not shown on paved, concrete, tarmac, or lift-accessible surfaces.
- **Map Motion:** All `setView()` calls use `{ animate: true }` with smooth panning. Jarring teleport-style jumps are avoided throughout.
- **Neuroinclusive Copy:** All labels use plain language. Progressive disclosure reduces cognitive load on the location selection journey.

---

## 🛠️ Technical Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Mapping Engine | Leaflet.js 1.9.4 | Markers, layers, polylines, tile switching |
| Map Tiles (Full) | OpenStreetMap | Coloured, detailed — NE trail |
| Map Tiles (Light) | CartoDB Light | Clean grey — national mode |
| Accessible Toilet Search | Overpass API (OSM) | Live viewport query, national coverage |
| Weather & Bloom | Open-Meteo API | Current weather + 7-day temperature forecast |
| Live GPS | Geolocation API | Van marker tracking (Full Mode) |
| Offline Support | Service Worker + Cache API | Multi-strategy caching |
| PWA | Web App Manifest | Install-to-homescreen |
| Survey Data | Console log (placeholder) | Ready for MS Forms URL |

---

## 🌸 Roadmap

- **MS Forms Integration:** Replace `fetch()` stub in `submitSurvey()` with the final form URL. Remove `#test-payload-panel` from the HTML.
- **Horticultural Density API:** Full integration for regional peak bloom predictions (Open-Meteo phenology endpoints or UKRI datasets).
- **Expand Full Mode:** Populate `sites[]` and set `REGION_MODES` to `'full'` for additional regions as the Collective grows.
- **Expand `UK_LANDMARKS`:** Add more regional entries to enrich the Light Mode experience.
- **User Contribution Layer:** Anonymous evidence-gathering and community mapping portal.

---

## 📜 License

MIT License — *The Oubaitori Collective.*
