const fs = require('fs');

// ════════════════════════════════════════════════════════════════
// Fix map.html: add data-i18n to all static UI text
// ════════════════════════════════════════════════════════════════
let map = fs.readFileSync('map.html', 'utf8');

// h1 title
map = map.replace(
    '<h1>Oubaitori Collective Blossom Trail</h1>',
    '<h1 data-i18n="app.title">Oubaitori Collective Blossom Trail</h1>'
);

// subtitle
map = map.replace(
    '<span class="sub-header">It is Okay to be Here.</span>',
    '<span class="sub-header" data-i18n="app.subtitle">It is Okay to be Here.</span>'
);

// Install App button text — keep SVG, just wrap text node
map = map.replace(
    '> Install App to Home Screen</button>',
    '><span data-i18n="nav.installApp"> Install App to Home Screen</span></button>'
);

// Welcome message — wrap in a translatable span
map = map.replace(
    `<div class="welcome-msg">`,
    `<div class="welcome-msg" data-i18n="app.welcomeMsg">`
);

// Start Survey button
map = map.replace(
    '>\n                Start the Blossom Trail Survey\n            </button>',
    '><span data-i18n="nav.startSurvey">Start the Blossom Trail Survey</span></button>'
);

// Live Trail Conditions heading
map = map.replace(
    '>Live Trail\n                    Conditions ',
    '><span data-i18n="weather.heading">Live Trail Conditions</span> '
);

// Weather labels
map = map.replace('>Weather</span>', ' data-i18n="weather.weather">Weather</span>');
map = map.replace('>Temperature</span>', ' data-i18n="weather.temperature">Temperature</span>');
map = map.replace('>Wind</span>', ' data-i18n="weather.wind">Wind</span>');
map = map.replace('>Rain</span>', ' data-i18n="weather.rain">Rain</span>');
map = map.replace('>Pollen</span>', ' data-i18n="weather.pollen">Pollen</span>');
map = map.replace('>Moon</span>', ' data-i18n="weather.moon">Moon</span>');

// Language label
map = map.replace(
    '>🌐 Language</label>',
    '><span data-i18n="language.label">🌐 Language</span></label>'
);

// Skip link
map = map.replace(
    '>Skip to main content</a>',
    ' data-i18n="app.skipToMain">Skip to main content</a>'
);

// Amenities pane legend text
map = map.replace(
    '♿ Blue</span> = Accessible Toilet',
    '♿ Blue</span> = <span data-i18n="accessibility.accessibleToilet">Accessible Toilet</span>'
);
map = map.replace(
    '🔑 Purple</span> = Radar Key Required',
    '🔑 Purple</span> = <span data-i18n="accessibility.radarKey">Radar Key Required</span>'
);

fs.writeFileSync('map.html', map, 'utf8');
const mapCount = (map.match(/data-i18n=/g) || []).length;
console.log('map.html data-i18n count:', mapCount);

// Also add title to popup images in map.js for hover tooltip
let js = fs.readFileSync('js/map.js', 'utf8');
// The popup image already has alt — add title as well (shown on hover)
js = js.replace(
    `(s.img ? '<img src="' + s.img + '" class="popup-img" alt="' + (s.imgAlt || (s.type === "blossom" ? "Blossom trees in bloom at " + s.name : s.name + " — landmark on the Blossom Trail")) + '">' : '')`,
    `(s.img ? '<img src="' + s.img + '" class="popup-img" alt="' + (s.imgAlt || (s.type === "blossom" ? "Blossom trees in bloom at " + s.name : s.name + " — landmark on the Blossom Trail")) + '" title="' + (s.imgAlt || s.name) + '">' : '')`
);
fs.writeFileSync('js/map.js', js, 'utf8');
try { new Function(js); console.log('map.js: OK'); } catch(e) { console.error('map.js SYNTAX ERROR:', e.message); }
