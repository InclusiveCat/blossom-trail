const fs = require('fs');

// Fix map.html language select
let map = fs.readFileSync('map.html', 'utf8');
map = map.replace(
    'id="map-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}"',
    'id="map-lang-select" class="blossom-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}"'
);
fs.writeFileSync('map.html', map, 'utf8');

// Fix survey.html language select
let survey = fs.readFileSync('survey.html', 'utf8');
survey = survey.replace(
    'id="survey-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}"',
    'id="survey-lang-select" class="blossom-lang-select" aria-label="Select display language" onchange="if(window.i18n){window.i18n.setLanguage(this.value)}"'
);
fs.writeFileSync('survey.html', survey, 'utf8');

console.log('map blossom-lang-select:', map.includes('blossom-lang-select'));
console.log('survey blossom-lang-select:', survey.includes('blossom-lang-select'));
