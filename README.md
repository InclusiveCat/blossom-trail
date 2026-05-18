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
- **5‑Stage Survey:** Likert-scale responses, somatic regulation techniques, and service gap analysis — captured via Google Apps Script / Google Sheets backend.
- **Pulse Check:** Real-time energy accounting (Thriving / Masking / Burnout) logged with each submission.
- **Progressive Disclosure (Location):** 3-level drill-down (Nation → Region → Local Authority) with a live breadcrumb progress indicator to reduce navigational anxiety.

### Map & Location
- **Region-Aware Map Rendering:** The map opens at a neutral UK-wide view. Pans dynamically to the user's selected region.
- **Full Mode (North East):** 19-site blossom trail, pink dashed route polyline, blossom and landmark markers, van GPS tracking, and NE community hub layer.
- **Light Mode (all other UK regions):** CartoDB Light tile layer, regional landmark cards, or blossom fallback.
- **ARIA marker tooltips:** Each map marker has a `title` and `alt` attribute for screen reader and hover support.
- **Popup images:** All popup photos include descriptive `alt` text (auto-generated from site name and type; supports optional custom `imgAlt` field in `locations.json`).
- **Map Filter Themes:** CSS filter applied to Leaflet tile pane per accessibility theme (see below).

### Accessibility (v2 — May 2026)
- **Sidebar Control Centre:** All accessibility controls consolidated into a collapsible accordion within the map sidebar — no persistent toolbar that blocks UI elements.
- **Font-Size Slider:** Range slider (80%–150%) scales all text via `--font-scale` on `:root`. Step buttons (A− / A+) increment by 5%.
- **Dyslexia-Friendly Font:** Toggle applies OpenDyslexic (falling back to Verdana/Arial) with increased letter-spacing, word-spacing, and line-height.
- **Reading Ruler:** A semi-transparent yellow highlight bar tracks mouse/touch position. Helps users with visual tracking difficulties.
- **Text-to-Speech (Read Aloud):** Click any paragraph, heading, label, or narrative block to hear it read aloud. Uses the Web Speech API with smart voice selection (tries locale-matched voices in priority order; falls back to English if needed). Visual pink outline highlights the element currently being read.
- **Reading Speed Slider:** Adjustable speech rate from Very Slow to Very Fast (0.3× – 1.5×). Setting is persisted to localStorage.
- **Colour Themes:** 5 accessibility overlay themes — all standard clinical tools:
  - **High Contrast** (black/yellow) — maximum legibility for low vision
  - **Dark Mode** — reduces glare for photosensitivity and migraine
  - **Sepia** (warm amber) — reduces blue light; helps eye strain and reading fatigue
  - **Cyan** (blue tint) — clinical overlay for Irlen Syndrome / visual stress
  - **Sage** (green tint) — alternative overlay for visual stress
- **Map CSS Filters:** Each colour theme applies a matching `filter` to the Leaflet map tile layer (invert, sepia, hue-rotate, brightness), making the map visually consistent with the chosen theme.
- **Request Assistance tab:** Quick-access links to 999 BSL Video Relay and Relay UK text calls. Present in both the map sidebar and the survey accessibility panel.
- **Survey Accessibility Panel:** Collapsible ⚙ panel at the top of the survey page — users set all preferences before beginning. Includes theme, font size, dyslexia font, reading ruler, read aloud, and reading speed controls.
- **All preferences persisted:** All settings are saved to `localStorage` under `blossom_a11y_prefs` and restored on every page load.
- **ARIA compliance:** `aria-pressed`, `aria-expanded`, `aria-label`, `aria-live`, and `role` attributes applied throughout. `data-i18n-aria` supports translated aria-labels.

### Internationalisation (i18n)
- **9 Languages supported:** English, Welsh (Cymraeg), French, German, Polish, Romanian, Spanish, Arabic, Urdu.
- **RTL support:** Arabic and Urdu switch the page to `dir="rtl"` automatically.
- **Language switcher:** Available in both the map sidebar and the survey accessibility panel.
- **Translated content:** App title, subtitle, welcome message, navigation buttons, weather labels, accessibility panel labels, and all static UI chrome translate fully.
- **Survey questions and stage narratives:** Remain in English pending human-reviewed translation (see Roadmap).

### GPS Van Tracking
- **Data-driven:** Van marker only appears when the Google Apps Script endpoint returns valid `{lat, lon}` data — no hardcoded fallback position.
- **Race condition fixed:** GPS polling starts after `renderFullTrail()` completes.
- **Driver Mode:** `?driver=true` query parameter enables broadcast mode for the driver's device (private use only; not exposed to public survey users).
- **Recentre button:** If the van is not yet live, the Recentre button pans to the NE trail overview (zoom 9) rather than doing nothing.

### Live Conditions
- **Weather:** Open-Meteo API (temperature, wind, weather code) — triggers slip warnings on non-paved trail surfaces.
- **Bloom Prediction:** 7-day temperature trend predicts blossom status (❄️ Pre-Season / 🌱 Approaching Bloom / 🌸 Peak Blossom).

### PWA Support
- **Web App Manifest** (`manifest.json`): Install-to-homescreen on iOS and Android.
- **Service Worker** (`sw.js`): Offline-first caching for static assets and map tiles.
- **Custom install modal:** Branded install prompt hides GitHub repository details.

---

## 📡 Offline Behaviour (PWA / Service Worker)

| Resource Type | Strategy | Behaviour When Offline |
|---------------|----------|------------------------|
| Static shell (`index.html`, SVGs, manifest) | Cache-first + background update | Served from cache immediately |
| Map tiles (OSM, CartoDB) | Cache-first, cached on-the-fly | Served from tile cache; blank tile shown if never cached |
| Weather / Bloom APIs (Open-Meteo) | Network-first | Returns `{ error: 'offline' }` JSON; UI degrades gracefully |
| Everything else | Stale-while-revalidate | Cache served instantly, updated in background |

> **Rural Safety Note:** Once a user has visited the trail and panned through the NE route, those map tiles are cached. The trail can then function fully offline.

---

## 🗺️ Delivery Mode Behaviour

| User Selection | Mode | Map Tile | Map Behaviour | Stage Content |
|----------------|------|----------|----------------|----------------|
| North East LA | **Full** | OpenStreetMap (coloured) | Pans to NE, shows 19-site trail + polyline | NE site links per stage |
| Any other UK region | **Light** | CartoDB Light (clean grey) | Pans to selected region centroid | Regional landmark cards or blossom fallback |
| Online / Not in UK | **Light** | CartoDB Light | Stays at UK-wide view | Blossom fallback |

---

## 🏗️ Architecture

| Component | File | Purpose |
|-----------|------|---------|
| Map logic & GPS | `js/map.js` | Leaflet, trail rendering, van tracking, weather, radar |
| Accessibility controls | `js/accessibility.js` | All a11y preferences, TTS, ruler, theme, font |
| Internationalisation | `js/i18n.js` | Language loading, DOM translation, RTL switching |
| Survey logic | `survey.html` | 13-step survey, GAS submission, navigation |
| Trail data | `data/locations.json` | Sites, stages, backup hubs (supports `imgAlt` field) |
| Translations | `lang/*.json` | 9 language files (en, es, fr, de, pl, cy, ro, ar, ur) |
| Accessibility styles | `css/accessibility.css` | Themes, reading ruler, TTS highlight, survey panel |
| Map styles | `css/map.css` | Leaflet overrides, sidebar, markers |

---

## 🚀 Setup Instructions

### Local Development

```bash
# Install a static file server (one-time)
npm install -g serve

# Serve from the project root
npx serve c:\path\to\blossom-trailV2 --listen 8080
```

Then open: `http://localhost:8080/map.html`

### GitHub Pages Deployment

1. Push all files to a public GitHub repository.
2. Go to **Settings → Pages → Source: main branch → Save**.
3. Enter `www.oubaitoricollective.co.uk` as custom domain and click **Save**.
4. Ensure **Enforce HTTPS** is checked.

> **Important:** GitHub Pages requires `https://` for Geolocation (GPS van tracking) and Service Workers.

---

## 📲 PWA Installation

### Android (Chrome)
1. Open the trail in Chrome.
2. Tap **three-dot menu → "Add to Home Screen"**.

### iOS (Safari)
1. Open the trail in Safari.
2. Tap **Share icon → "Add to Home Screen"**.

### Desktop (Chrome / Edge)
1. Click the **install icon** in the address bar.

---

## ♿ Accessibility Compliance

This project targets **WCAG 2.2 AA**. Key provisions:

| Criterion | Implementation |
|-----------|---------------|
| 1.1.1 Non-text content | All images have descriptive `alt` text; popup photos use site name + type |
| 1.3.1 Info and relationships | Semantic HTML: `<main>`, `<aside>`, `<fieldset>`, `<legend>`, `<label>` |
| 1.4.3 Contrast | High Contrast theme meets 7:1 ratio |
| 1.4.4 Resize text | Font scale slider 80%–150%, no loss of content |
| 2.1.1 Keyboard | All controls keyboard-operable; reading ruler works without mouse |
| 2.4.1 Bypass blocks | Skip-to-content link present |
| 2.4.6 Headings and labels | Descriptive labels and `aria-label` throughout |
| 3.1.1 Language of page | `lang` attribute updated on language switch; RTL set for Arabic/Urdu |

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|------------|
| Mapping Engine | Leaflet.js 1.9.4 |
| Map Tiles (Full) | OpenStreetMap |
| Map Tiles (Light) | CartoDB Light |
| Accessible Toilet Search | Overpass API (OSM) |
| Weather & Bloom | Open-Meteo API |
| Live GPS | Geolocation API + Google Apps Script / Sheets |
| Text-to-Speech | Web Speech API (browser-native) |
| Offline Support | Service Worker + Cache API |
| PWA | Web App Manifest |
| Survey Data | Google Apps Script endpoint → Google Sheets |

---

## 🌸 Roadmap

- **Survey question translation:** Translate the 13-question survey bank into all 9 supported languages.
- **Stage narrative translation:** Translate stage titles, domains, narrative text, and somatic regulation techniques.
- **VanTracker backend:** Connect the Google Apps Script `getVanLocation` endpoint to the live VanTracker Sheet — the map will automatically begin showing the van marker once this is live.
- **Human review of AI translations:** Especially accessibility-critical content (Welsh, Arabic, Urdu).
- **Expand Full Mode regions:** Populate `sites[]` and update `REGION_MODES` for additional UK regions.
- **Read Aloud & Speed verification:** Confirm cross-browser TTS behaviour on iOS Safari and Android Chrome (see Testing Notes below).

---

## 📜 License

MIT License — *The Oubaitori Collective.*

---

## 🗒️ UPDATE Logs

### 7 May 2026 — Accessibility & UI Refactor (V2)

A comprehensive accessibility refactor was completed, resolving all critical UI regressions and adding new inclusive features.

#### Accessibility Toolbar → Sidebar Control Centre
- **Removed** the persistent bottom `a11y-toolbar` which was obstructing the Recentre button on mobile and covering the Back/Next survey navigation buttons.
- **Added** a collapsible Accessibility accordion to the map sidebar with three tabs: Display, Amenities, Request Assistance.
- **Added** a collapsible ⚙ Accessibility Options panel at the top of `survey.html` — users set all preferences before beginning the survey.

#### New Accessibility Features
- **Reading Ruler:** Horizontal semi-transparent highlight bar tracks cursor/touch. Helps users with visual tracking difficulties.
- **Text-to-Speech (Read Aloud):** Click any text element to hear it read. Smart voice selection logic (locale match → partial match → English fallback). Visual pink outline shows what is being read. 50ms Chrome stability delay applied. `resume()` called before `cancel()` to fix Chrome paused-synthesis bug.
- **Reading Speed slider:** 0.3× – 1.5× rate control. Labels: Very slow / Slow / Normal / Fast / Very fast. Persisted to localStorage.
- **Colour Themes:** 5 clinically-grounded overlays. CSS filters applied to both sidebar and Leaflet tile pane (map visually matches the selected theme).

#### Bug Fixes
- **Recentre button:** Now falls back to NE trail overview (zoom 9) if van is not yet live.
- **Van GPS race condition:** Polling deferred until after `renderFullTrail()`. Van marker only created when valid `{lat, lon}` returned from GAS.
- **TTS not working for English:** Fixed voice selection — tries `en-GB → en-AU → en-US → any en` before falling back.
- **Font scale conflict:** Removed duplicate `applyFontScale()` and `stepFontSize()` from `map.js` (they were overriding the `accessibility.js` versions and losing localStorage persistence).
- **Theme cascade:** Added `body.theme-name .cream-panel` and `#sidebar` overrides in `accessibility.css` so themes apply inside the survey panel and map sidebar, not just the body element.

#### Internationalisation
- **9 languages added:** English, Welsh, French, German, Polish, Romanian, Spanish, Arabic, Urdu.
- **RTL:** Arabic and Urdu switch `dir="rtl"` on the `<html>` element.
- **Language switcher:** Added to map sidebar and survey accessibility panel.
- **24 translated elements** in `map.html`: h1, subtitle, welcome message, Install App, Start Survey, weather labels (×6), accessibility panel labels, language label.
- **14 translated elements** in `survey.html`: heading, back/next/submit buttons, accessibility panel labels.

#### Popup images
- All popup images have auto-generated `alt` text: *"Blossom trees in bloom at [name]"* or *"[name] — landmark on the Blossom Trail"*.
- Optional `imgAlt` field supported in `locations.json` for custom descriptions.
- `title` attribute added so alt text is also shown on hover.

#### ARIA Improvements
- `role="tablist"` and `aria-label` on accessibility tab group.
- `aria-pressed` dynamically updated on all toggle buttons.
- `aria-expanded` on survey a11y panel toggle button.
- `aria-live="polite"` on reading speed display.
- All map markers have `title` and `alt` options set.
- Emergency tab renamed to **Request Assistance** with `aria-label="Request Assistance - opens a help menu"`.

---

### 21 April 2026 — Live Van Tracking & PWA Upgrades
- True broadcast architecture via Google Apps Script / Google Sheets backend.
- Driver Broadcast Mode (`?driver=true`).
- PWA install button improvements.

### 16 April 2026 — 7Rs Architectural Overhaul
- Sidebar restructured to Oubaitori 8-accordion layout.
- Legacy regional gating removed.
- `zoomToLocation()` refactored to use animated `flyTo`.

### 14 April 2026
- README formatting review and accessibility verification.

---

## 🧪 Testing Notes (Next Session)

### Read Aloud & Speed — To Verify Tomorrow

| Test | Expected behaviour | Browser |
|------|--------------------|---------|
| Enable Read Aloud → click welcome text | Pink outline appears, voice reads text | Chrome |
| Enable Read Aloud → click survey question | Pink outline appears, voice reads question | Chrome |
| Adjust speed to Slow → click text | Noticeably slower speech | Chrome |
| Adjust speed to Fast → click text | Noticeably faster speech | Chrome |
| Enable Read Aloud → switch to French → click text | French voice used if available | Chrome |
| Test on iOS Safari | TTS may require different user gesture | Safari |

**Known Chrome behaviour:** `speechSynthesis.getVoices()` is async — the first call may return an empty array. The `voiceschanged` event fires when voices are ready. The code handles this, but if voice is silent on first use, toggling TTS off and back on should resolve it.

### Language Switching — Outstanding Work

| Area | Status | Action needed |
|------|--------|---------------|
| Map sidebar chrome (h1, subtitle, buttons, weather labels) | ✅ Translates | None |
| Survey accessibility panel labels | ✅ Translates | None |
| Survey Back / Next / Submit buttons | ✅ Translates | None |
| **Sidebar accordion content** (stage titles, domain labels, narrative text, technique boxes, Oubaitori statements) | ❌ English only | Accordion content is rendered by JS from `locations.json` `stages[]` array — needs `data-i18n` on rendered elements OR per-language `stages` blocks in language JSON files |
| **Survey questions (all 13)** | ❌ English only | Requires translation of question text + all answer options into 8 languages |
| **Stage narrative text** (loaded from `locations.json`) | ❌ English only | Same root cause as accordion content — all comes from `stages[]` |
| **Stage technique boxes** | ❌ English only | Part of stage narrative work |
| Accessibility theme options (Default, High Contrast etc.) | ⚠️ Keys exist | Add `data-i18n` to `<option>` elements in theme selects |
| Van status messages (console only) | Low priority | — |
---

## Session Update — 19 May 2026: Full Multilingual i18n Implementation

### What was completed this session

#### Language Files — 9 Languages Now Fully Populated
All 9 language JSON files (en, r, es, de, pl, o, cy, r, ur) have been expanded to full coverage including:
- All 8 accordion stage titles, narratives, technique names and instructions
- All 13 survey question titles and descriptions
- All answer option labels (gender, feelings, circumstances, agree/disagree, help options)
- Accessibility panel labels (Colour Theme, Text Size, Dyslexia Font, Read Aloud, etc.)
- Theme option labels (Default, High Contrast, Dark Mode, Sepia, Cyan, Sage)
- Navigation buttons (Next, Back, Submit, Continue to Map)
- Weather panel headings
- Success page text including data protection notice
- "Please select…" and "Other Area / Online Only" in Q4 dropdown

#### i18n Engine Fix (js/i18n.js)
- **Root bug fixed**: The "child element text node iteration" logic was incorrectly setting each text node to the full translation value, causing duplication wherever an element had child HTML (e.g. <strong> tags inside welcome message, <br> inside h1). Now uses el.textContent = value always — clean and reliable.
- Extended placeholder support to <textarea> elements.

#### map.html — All 8 Accordion Stages Wired to i18n
All stage titles, narratives, technique titles and technique texts now have data-i18n attributes.
Language switching updates all sidebar content in real time.

#### survey.html — Full Translation Coverage
- All 13 question titles and descriptions wired
- All answer options translated: Gender (Q1), Q3 Feelings (Blooming → Burnout), Circumstances (Q5), Agree/Disagree scale (Q6, Q7, Q10), Help options (Q12)
- "Other/self-describe" input placeholders translated (Q1, Q5, Q12)
- Free-text textarea placeholders translated (Q8, Q9, Q11, Q13)
- Q4 "Please select…" and "Other Area / Online Only" options translated
- Accessibility panel toggle button, theme options and progress label translated
- Survey h1 title duplication fixed (removed <br> child element, added white-space: pre-line)

#### Q12 Checkbox Validation Fixed (js/survey.js)
Checkbox groups were not validated — the alidateStep() function only handled radio buttons. Now checks that at least one checkbox is selected in any checkbox group before allowing progression.

#### success.html — Data Protection Notice
Data notice restructured to be translatable via data-i18n="survey.dataNotice". "Thank You!" heading and "Continue to Map" link also translatable.

#### Bug Fixes
- Welcome message triplication on map.html fixed (removed <strong> child elements from welcome-msg div)
- Q3 feelings options restructured — <strong>Word</strong> label was outside the data-i18n span so it stayed in English; moved data-i18n to outer option-text span

#### Local Development Server

px serve . -p 5500 — run from project root. Required because etch() for language JSON files is blocked by ile:// CORS policy.

---

## 🔧 Outstanding Work — Next Session

### HIGH PRIORITY

| Item | Detail |
|------|--------|
| **Full survey validation audit** | Q12 checkbox validation is now fixed. All other questions need systematic testing in each language to confirm validation messages display and translate correctly |
| **"Accessibility Options" toggle text** (map.html) | The toggle button text on the map sidebar may still be hardcoded — needs checking and data-i18n if so |
| **map.html theme option labels** | <option> elements in map sidebar theme select need data-i18n attributes (done in survey.html, may be missing from map.html) |
| **Q4 "Please select…" in map.html** | If map.html has any selects without data-i18n, add them |

### MEDIUM PRIORITY

| Item | Detail |
|------|--------|
| **Data Protection notice review** | Success.html now has a translatable data notice. Content should be reviewed by the project lead for accuracy and completeness before go-live |
| **Age range labels (Q2)** | Currently in English (Under 18 years, 19–24 years etc.) — consider whether these should translate |
| **Reading Speed labels** ("Slower", "Faster", "Normal") | Hardcoded in both survey.html and map.html — need data-i18n |
| **"Step X of 13" progress text** | Currently built in JS (Step  of ) — needs i18n to use survey.step key |
| **Error message on submission failure** | Hardcoded in survey.js: 'An error occurred while submitting...' — should use a translation key |
| **map.html accessibility toggle button** | Check if "⚙ Accessibility Options ▼" in map sidebar is translated |

### LOW PRIORITY / FUTURE

| Item | Detail |
|------|--------|
| **TTS (Read Aloud) voice language** | When language is switched, TTS should use the correct lang attribute for speech synthesis voice selection |
| **RTL layout testing** | Arabic and Urdu set dir="rtl" on <html> — full layout testing on mobile required |
| **GitHub Pages deployment** | v2 branch is pushed. When ready to replace v1, update the GitHub Pages source branch |
| **Remove original blossom-trail** | User intends to keep both until v2 is fully verified |

