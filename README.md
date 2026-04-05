Here is the updated documentation for your project. I have revised it to reflect all the major technical enhancements we have implemented, including the **Accessibility Suite**, **Live Weather Logic**, **Somatic Techniques**, and the **Community Backup Layer**.

---

# 🌸 Oubaitori Blossom Trail — Interactive Map

The **Oubaitori Blossom Trail** is a mobile‑optimised, high-accessibility interactive map experience designed for the North East of England. 

The purpose of the trail is to raise awareness of the **Oubaitori Collective**, a social enterprise committed to empowering neurodivergent adults to thrive through job and enterprise coaching, holistic wellbeing practices, and advocacy.

The trail blends geographic navigation with the Japanese philosophical principle **Oubaitori (桜梅桃李)** — the idea that Cherry, Plum, Peach, and Apricot blossoms each bloom in their own time, reminding us that every journey unfolds uniquely.

---

## 🌿 Project Overview

The Blossom Trail guides users through a curated **19‑site route** of historic landmarks and seasonal blossom locations across 12 Local Authorities in the North East.

### **Core Experience Features**
- **Live GPS Tracking:** Real-time vehicle tracking via a custom "Van" marker.
- **Weather-Aware Accessibility:** Map pop-ups dynamically advise wheelchair users on terrain safety (e.g., mud/slip warnings for gravel or grass) based on live local rain data.
- **Energy Accounting:** A integrated "Pulse Check" system allowing users to log their energy status (Thriving, Masking, Burnout).
- **Community Backup Layer:** A focus-triggered system that displays verified accessible toilets, NHS hubs, and libraries when a user zooms in on a trail site.
- **Somatic Regulation:** Each of the 5 narrative stages includes a step-by-step somatic grounding technique to manage sensory overwhelm.

**Our Vision** > “Supporting neurodivergent adults to recover, regulate, and thrive.”

**5‑Stage Narrative Framework**
1. **Reset:** Wellness system check-in and grounding.
2. **Expansion:** Moving toward expansive views and growth.
3. **Flow:** Allowing movement and reflection in the current moment.
4. **Connection:** Belonging without blending; where urban meets nature.
5. **Breath:** Reaching the coast for wide skies and freedom.

---

## 🗺️ Technical Stack

| Component | Technology | Purpose |
|----------|------------|---------|
| **Mapping Engine** | Leaflet.js | Renders map, markers, and dotted trail path |
| **Data Source** | Open-Meteo API | Provides live weather data for accessibility logic |
| **Location Tracking** | Geolocation API | Drives the live van icon via GPS |
| **Dynamic Search** | Overpass API | Powers the live "Radar Key" toilet search logic |
| **UI/UX** | HTML5 / CSS3 | Mobile-responsive sidebar with dyslexia-friendly font toggles |

---

## 🧱 Project Architecture

To maintain full functionality, the following assets must remain in the **root directory**:

- `index.html` — The master file containing all UI, CSS, and JavaScript logic.
- `blossom1.svg` — Icon for blossom‑focused locations.
- `test-van.svg` — Dynamic icon for live vehicle position tracking.
- **19 Image Assets** (`.jpg`) — High-quality visuals for site pop‑ups.
- **CSS Variables** — Used for global scaling (Font Size Slider) and High Contrast mode.

---

## 🚀 Accessibility Standards

The map is built specifically to support neurodivergent and disabled users:
- **Dyslexia Font Toggle:** Instantly switches the UI to a high-readability typeface.
- **Weather Logic:** Automatically triggers cautionary warnings for non-paved surfaces during rain.
- **Emergency Suite:** Quick-access links for **999 BSL** and **Relay UK** (Text Relay) directly in the sidebar.
- **Manual Overrides:** A manual "Rain Mode" toggle in the Tools tab for when API data is delayed.
- **Visual Calm:** Smooth panning transitions (replacing jarring zoom movements) to prevent vestibular distress.

---

## 🛠️ Deployment Guide

### **1. Prepare Local Files**
Place `index.html`, SVGs, and all 19 JPG assets together in a single folder.

### **2. Upload to GitHub**
Create a public repository and upload the folder contents.

### **3. Enable GitHub Pages**
- Go to **Settings → Pages**
- Set **Source: main branch**
- Click **Save** (Ensure the URL begins with `https://` for GPS tracking to function).

---

## 🌸 Future Roadmap

- **Horticultural Density API:** Predicting peak bloom times across the North East.
- **PWA Integration:** Full offline support to ensure safety in low-signal rural trail sections.
- **User Contribution:** Anonymous evidence-gathering portal for neuro-inclusion feedback.

---

## 📜 License
MIT License — *The Oubaitori Collective.*
