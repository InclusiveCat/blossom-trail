# 🌸 Oubaitori Blossom Trail — Interactive Map

The **Oubaitori Blossom Trail** is a mobile‑first, interactive map experience designed for the North East of England. 

The purpose of the trail is to raise awareness of the **Oubaitori Collective** a social enterprise that is committed to empowering neurodivergent adults to thrive through job and enterprise coaching, holistic wellbeing practices and advocacy.

The trail map blends geographic navigation with the Japanese philosophical principle **Oubaitori (桜梅桃李)** — the idea that Cherry, Plum, Peach, and Apricot blossoms each bloom in their own time, reminding us that every journey unfolds uniquely.

This documentation provides a technical and narrative overview of the project, including architecture, implementation, and future roadmap.

---

## 🌿 Project Overview

The Blossom Trail guides users through a curated **17‑site route** of historic landmarks and seasonal blossom locations across the North East.

The experience is built around:

- Live GPS tracking of a moving vehicle  
- A narrative arc inspired by Oubaitori  
- A calm, mobile‑first interface  
- Custom blossom and landmark iconography  
- Visual storytelling through site imagery  

**Signature Message**  
> “Based on the Japanese principle 桜梅桃李 (Oubaitori): Just as the Cherry, Plum, Peach, and Apricot bloom in their own time, each journey is unique.”

**5‑Stage Narrative Framework**
1. Reset  
2. Expansion  
3. Flow  
4. Connection  
5. Breath  

**Closing Vision**  
The trail concludes at **Houghton‑le‑Spring**, anchoring the message:  
> “Growth doesn’t require pressure.”

---

## 🗺️ Technical Stack

| Component | Technology | Purpose |
|----------|------------|---------|
| **Mapping Engine** | Leaflet.js | Renders map, markers, and path lines |
| **Base Maps** | OpenStreetMap | Light, high‑detail geographic tiles |
| **Location Tracking** | Geolocation API | Drives the live van icon via `navigator.geolocation` |
| **UI/UX** | HTML5 & CSS3 | Responsive, high‑contrast sidebar and layout |
| **Iconography** | SVG Vectors | Custom blossom and landmark markers |

The application is intentionally built as a **lightweight SPA** for zero‑cost, high‑performance deployment.

---

## 🧱 Project Architecture

To maintain full functionality, the following files must remain in the **root directory**:

- `index.html` — contains all HTML, CSS, and JavaScript logic  
- `blossom1.svg` — icon for blossom‑focused locations  
- `test-van.svg` — dynamic icon representing the live vehicle position  
- **17 image assets** (`.jpg`) used for pop‑ups and sidebar visuals  
  - e.g., `houghton.jpg`, `alnwick.jpg`, etc.

All logic is embedded directly into `index.html` to ensure compatibility with GitHub Pages.

---

## 🚀 Deployment Guide

The Geolocation API requires **HTTPS**, which GitHub Pages provides automatically.

### **1. Prepare Local Files**
Place `index.html`, SVGs, and JPG assets together in a single folder.

### **2. Upload to GitHub**
Create a **public repository** and upload the folder contents.

### **3. Enable GitHub Pages**
- Go to **Settings → Pages**  
- Set **Source: main branch**  
- Click **Save**

### **4. Launch the Trail**
Open the generated URL on a mobile device and grant **Location Permissions** when prompted.

---

## 🌸 Future Enhancements

### **Geofencing Audio**
Trigger Oubaitori‑themed narrations automatically when entering a site radius.

### **Progress Persistence**
Use `localStorage` to track visited sites across multiple days.

### **Bloom Density API**
Integrate horticultural data to show real‑time blossom conditions.

### **Offline Support**
Add a PWA manifest to enable offline map access in rural areas.

---

## 📜 License
MIT License (or specify your preferred license).

