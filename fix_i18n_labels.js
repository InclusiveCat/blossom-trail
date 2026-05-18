const fs = require('fs');

// ── Fix 1: Remove turtle/rocket emojis from map.html and survey.html ─────
let map = fs.readFileSync('map.html', 'utf8');
map = map.replace(/aria-hidden="true">🐢<\/span>/g, '>Slower</span>');
map = map.replace(/aria-hidden="true">🚀<\/span>/g, '>Faster</span>');
map = map.replace(/>🐢<\/span>/g, '>Slower</span>');
map = map.replace(/>🚀<\/span>/g, '>Faster</span>');
map = map.replace(/🚶 Normal/g, 'Normal');
map = map.replace(/🐢 Slow/g, 'Slow');
map = map.replace(/🚀 Fast/g, 'Fast');
map = map.replace(/⚡ Very Fast/g, 'Very Fast');
fs.writeFileSync('map.html', map, 'utf8');
console.log('map.html emoji cleaned:', !map.includes('🐢'));

let survey = fs.readFileSync('survey.html', 'utf8');
survey = survey.replace(/aria-hidden="true">🐢<\/span>/g, '>Slower</span>');
survey = survey.replace(/aria-hidden="true">🚀<\/span>/g, '>Faster</span>');
survey = survey.replace(/aria-hidden='true'>🐢<\/span>/g, '>Slower</span>');
survey = survey.replace(/aria-hidden='true'>🚀<\/span>/g, '>Faster</span>');
survey = survey.replace(/>🐢<\/span>/g, '>Slower</span>');
survey = survey.replace(/>🚀<\/span>/g, '>Faster</span>');
survey = survey.replace(/🚶 Normal/g, 'Normal');
survey = survey.replace(/🐢 Slow/g, 'Slow');
survey = survey.replace(/🚀 Fast/g, 'Fast');
fs.writeFileSync('survey.html', survey, 'utf8');
console.log('survey.html emoji cleaned:', !survey.includes('🐢'));

// ── Fix 2: Add data-i18n to key map.html UI elements ─────────────────────
// We need to re-read since we wrote above
map = fs.readFileSync('map.html', 'utf8');

// Accessibility bucket header
map = map.replace(
    '<strong>Accessibility</strong>',
    '<strong data-i18n="accessibility.title">Accessibility</strong>'
);
// Tab buttons
map = map.replace(
    '>Display</button>',
    ' data-i18n="accessibility.display">Display</button>'
);
map = map.replace(
    '>♿ 🔑 Amenities</button>',
    ' data-i18n="accessibility.amenities">♿ 🔑 Amenities</button>'
);
map = map.replace(
    '>🆘 Request Assistance</button>',
    ' data-i18n="accessibility.requestAssistance">🆘 Request Assistance</button>'
);
// A11y panel buttons
map = map.replace(
    '>Dyslexia Friendly Font</button>',
    ' data-i18n="accessibility.dyslexiaFont">Dyslexia Friendly Font</button>'
);
map = map.replace(
    '>📏 Reading Ruler</button>',
    ' data-i18n="accessibility.readingRuler">📏 Reading Ruler</button>'
);
map = map.replace(
    '>🔊 Read Aloud</button>',
    ' data-i18n="accessibility.readAloud">🔊 Read Aloud</button>'
);
// Install app button
map = map.replace(
    '>Install App</button>',
    ' data-i18n="nav.installApp">Install App</button>'
);
map = map.replace(
    '>Start the Blossom Trail Survey</a>',
    ' data-i18n="nav.startSurvey">Start the Blossom Trail Survey</a>'
);

fs.writeFileSync('map.html', map, 'utf8');
const i18nCount = (map.match(/data-i18n="/g) || []).length;
console.log('data-i18n attrs added to map.html:', i18nCount);
