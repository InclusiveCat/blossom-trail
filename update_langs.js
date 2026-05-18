const fs = require('fs');

const langOptions = `<option value="en">English</option>
                    <option value="cy">Cymraeg (Welsh)</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pl">Polski</option>
                    <option value="ro">Română</option>
                    <option value="es">Español</option>
                    <option value="ar">العربية</option>
                    <option value="ur">اردو</option>`;

// Update map.html
let map = fs.readFileSync('map.html', 'utf8');
map = map.replace(
    `<option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>`,
    langOptions
);
fs.writeFileSync('map.html', map, 'utf8');
console.log('map languages updated:', map.includes('Cymraeg'));

// Update survey.html
let survey = fs.readFileSync('survey.html', 'utf8');
survey = survey.replace(
    `<option value='en'>English</option>
                        <option value='es'>Español</option>
                        <option value='fr'>Français</option>`,
    langOptions.replace(/"/g, "'")
);
fs.writeFileSync('survey.html', survey, 'utf8');
console.log('survey languages updated:', survey.includes('Cymraeg'));

// Also update i18n.js to handle RTL languages (Arabic, Urdu) by setting dir attribute
let i18n = fs.readFileSync('js/i18n.js', 'utf8');
i18n = i18n.replace(
    `// Update html lang attribute\n        document.documentElement.lang = lang;`,
    `// Update html lang attribute and text direction\n        document.documentElement.lang = lang;\n        var rtlLangs = ['ar', 'ur', 'fa', 'he'];\n        document.documentElement.dir = rtlLangs.indexOf(lang) !== -1 ? 'rtl' : 'ltr';`
);
fs.writeFileSync('js/i18n.js', i18n, 'utf8');
console.log('i18n RTL support added:', i18n.includes('rtlLangs'));
