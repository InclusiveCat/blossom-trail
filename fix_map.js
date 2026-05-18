const fs = require('fs');
let js = fs.readFileSync('js/map.js', 'utf8');

// Fix 1: recenterOnVan — fall back to NE trail centre if van not yet live
js = js.replace(
    `// Recenter: Always pan the map back to the van's current coordinates
            function recenterOnVan() {
                if (!vanMarker || !map) return;
                
                const vanLatLng = vanMarker.getLatLng();
                map.setView(vanLatLng, 15, { animate: true }); // using 15 as desired zoom level for van
            }`,
    `// Recenter: pan to van if live, otherwise pan to NE trail centre
            var TRAIL_CENTRE = [54.843, -1.470]; // North East England fallback
            function recenterOnVan() {
                if (!map) return;
                if (vanMarker) {
                    map.setView(vanMarker.getLatLng(), 15, { animate: true });
                } else {
                    // Van not yet live — recentre on NE trail overview
                    map.setView(TRAIL_CENTRE, 9, { animate: true });
                }
            }`
);

// Fix 2: Add title (tooltip) to site markers
js = js.replace(
    `var marker = L.marker([s.lat, s.lon], { icon: icon }).addTo(markerLayer);`,
    `var marker = L.marker([s.lat, s.lon], {
                        icon: icon,
                        title: s.name + ' — ' + (s.type === 'blossom' ? 'Blossom Trail Site' : 'Landmark'),
                        alt: s.name
                    }).addTo(markerLayer);`
);

// Fix 3: Add alt to popup image
js = js.replace(
    `marker.bindPopup('<div style="color:#000;"><strong style="color:var(--primary);">' + s.name + '</strong><div class="wc-status-box">Surface: ' + s.access + ' &#9855;</div>' + advice + '<img src="' + s.img + '" class="popup-img"></div>', { autoPan: false });`,
    `marker.bindPopup('<div style="color:#000;"><strong style="color:var(--primary);">' + s.name + '</strong><div class="wc-status-box">Surface: ' + s.access + ' &#9855;</div>' + advice + (s.img ? '<img src="' + s.img + '" class="popup-img" alt="Photo of ' + s.name + '">' : '') + '</div>', { autoPan: false });`
);

// Fix 4: Add title to community/hub markers
js = js.replace(
    `}).addTo(communityLayer).bindPopup('<b>Verified WC: ' + hub.name + '</b><br>' + hub.type);`,
    `title: hub.name + ' — ' + hub.type\n                        }).addTo(communityLayer).bindPopup('<b>Verified WC: ' + hub.name + '</b><br>' + hub.type);`
);

fs.writeFileSync('js/map.js', js, 'utf8');

// Syntax check
try {
    new Function(fs.readFileSync('js/map.js','utf8'));
    console.log('map.js: OK');
} catch(e) {
    console.error('SYNTAX ERROR:', e.message);
}

// Verify fixes
const check = fs.readFileSync('js/map.js','utf8');
console.log('recenterOnVan fallback:', check.includes('TRAIL_CENTRE'));
console.log('marker title:', check.includes('Blossom Trail Site'));
console.log('popup img alt:', check.includes('Photo of'));
