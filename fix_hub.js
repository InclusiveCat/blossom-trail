const fs = require('fs');
let lines = fs.readFileSync('js/map.js', 'utf8').split('\n');

// Find and fix lines 561-563 (0-indexed: 560-562)
// The structure should be:
//   L.marker([hub.lat, hub.lon], {
//       icon: L.divIcon({ ... }),
//       title: hub.name + ' - ' + hub.type
//   }).addTo(...)

lines.forEach((line, i) => {
    if (line.includes('title: hub.name') && !line.includes('icon:')) {
        // This is the orphaned title line — it needs to be inside the L.marker options
        // Fix: the previous closing }) belongs to divIcon, not L.marker
        // Line i-1 should end with }) - change to }),
        if (lines[i-1].trim() === '})') {
            lines[i-1] = lines[i-1].replace('})', '}),');
            // Move title inside and close the L.marker options
            lines[i] = lines[i].replace(/^\s*title:/, '                                title:');
        }
        // Line i+1 has }).addTo - fix indentation
        if (lines[i+1] && lines[i+1].includes('}).addTo')) {
            lines[i+1] = '                            }).addTo' + lines[i+1].split('}).addTo')[1];
        }
        console.log('Fixed at line', i+1);
    }
});

const result = lines.join('\n');
fs.writeFileSync('js/map.js', result, 'utf8');
try {
    new Function(result);
    console.log('map.js: OK');
} catch(e) {
    console.error('ERROR:', e.message);
}
