A simple HTML interact file # 🌸 Oubaitori Collective Blossom Trail
Interactive, real-time GPS map for tracking an April blossom trail across 12 local authorities in North East England.

## 🚐 Key Features
- **Live GPS Vehicle Tracking:** A custom van icon moves across the map as you drive, using high-accuracy geolocation [66, 84].
- **20 Interactive Markers:** Features 12 blossom hotspots and 8 iconic landmarks with clickable popups [5, 24].
- **"Follow Me" Navigation:** The map automatically centers on your vehicle to keep your journey in view [3, 14].
- **Visual Color Coding:** Pink markers identify blossom sites, while blue markers identify permanent landmarks.

## 🛠️ Technical Stack
- **Mapping Library:** [Leaflet.js](https://leafletjs.com/) (Open-source interactive maps) [1, 76].
- **Geospatial Data:** [OpenStreetMap](https://www.openstreetmap.org/) tiles [48, 85].
- **GPS Integration:** HTML5 Geolocation API with `watchPosition` for real-time updates [79, 86].
- **Hosting:** [GitHub Pages](https://pages.github.com/) (Free SSL/HTTPS deployment) [25, 66].

## 🚀 Setup & Usage
1. **Prepare Assets:** Take a photo of your vehicle, remove the background, and upload it to GitHub as `van.png`.
2. **Deploy Code:** Paste the provided `index.html` into your repository, replacing the image URL with your "Raw" GitHub file link.
3. **Enable Hosting:** Go to `Settings > Pages` and set the source to the `main` branch.
4. **Go Live:** Open your live URL on a smartphone browser and click **Allow** when prompted for location access.

## 📋 Changelog
- **v1.0 (April 1, 2026):** Initial release. Fixed coordinate syntax errors and implemented "Follow Me" map logic.
- **v1.1:** Integrated 8 regional landmarks to assist with long-distance navigation between towns.
- **v1.2:** Optimized marker filtering to ensure high-accuracy GPS doesn't drain battery excessively [84].

## 🔮 Future Enhancements
- **Distance Tracker:** Implement a digital log to track total miles traveled between the 12 sites [55, 57].
- **Weather Alerts:** Integrate real-time wind and rain data to suggest the best time for photography at each site [52].
- **AR Landmark Facts:** Use Augmented Reality to display historical facts when the camera is pointed at landmarks [52, 53].

---
*Created for the Oubaitori Collective. Data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.*
