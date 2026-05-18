const fs = require('fs');
let html = fs.readFileSync('map.html', 'utf8');

// 1. Rename Emergency tab + add aria-label
html = html.replace(
    '>Emergency</button>',
    ' aria-label="Request Assistance - opens a help menu">🆘 Request Assistance</button>'
);

// 2. Add role/aria to tab list
html = html.replace(
    '<div class="a11y-tabs">',
    '<div class="a11y-tabs" role="tablist" aria-label="Accessibility categories">'
);

// 3. Add aria-label to Display tab
html = html.replace(
    '>Display</button>',
    ' aria-label="Display - font size, reading aids and colour theme">Display</button>'
);

// 4. Add aria-label to Amenities tab
html = html.replace(
    '>♿ 🔑 Amenities</button>',
    ' aria-label="Amenities - find accessible toilets and radar key facilities">♿ 🔑 Amenities</button>'
);

// 5. Add Request Assistance section content — richer content to pane-em
html = html.replace(
    '<div id="pane-em" class="a11y-pane">',
    '<div id="pane-em" class="a11y-pane" aria-label="Request Assistance help menu">'
);

// 6. Language switcher — inject before access-forecast div
const langSwitcher = `
            <!-- Language Switcher -->
            <div class="lang-switcher" style="margin-bottom:16px;">
                <label for="map-lang-select">🌐 Language</label>
                <select id="map-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                </select>
            </div>
`;
html = html.replace('<div class="access-forecast">', langSwitcher + '            <div class="access-forecast">');

fs.writeFileSync('map.html', html, 'utf8');
console.log('Done');
console.log('Request Assistance present:', html.includes('Request Assistance'));
console.log('Language switcher present:', html.includes('map-lang-select'));
