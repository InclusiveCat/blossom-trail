const fs = require('fs');
let map = fs.readFileSync('map.html', 'utf8');

// Ensure the rate label display div has the right class (not just text)
// and add data-i18n to a11y theme select label
map = map.replace(
    '<label class="font-size-label" for="map-tts-rate">Reading Speed</label>',
    '<label class="font-size-label" for="map-tts-rate" data-i18n="accessibility.readingSpeed">Reading Speed</label>'
);

// Make the tts-rate-label display element have correct initial class
map = map.replace(
    '<div class="font-size-value tts-rate-label">Normal</div>',
    '<div class="font-size-value tts-rate-label" aria-live="polite" aria-label="Current reading speed">Normal</div>'
);

// Add aria-label to theme select
map = map.replace(
    'aria-label="Select colour theme" style="font-size:0.85em;"',
    'aria-label="Select colour theme" data-i18n-aria="accessibility.colourTheme" style="font-size:0.85em;"'
);

fs.writeFileSync('map.html', map, 'utf8');
console.log('map.html rate label aria-live:', map.includes('aria-live="polite"'));

// Final syntax check of all JS files
['js/accessibility.js', 'js/i18n.js', 'js/map.js'].forEach(function(f) {
    try {
        new Function(fs.readFileSync(f, 'utf8'));
        console.log(f + ': OK');
    } catch(e) {
        console.error(f + ': SYNTAX ERROR - ' + e.message);
    }
});
